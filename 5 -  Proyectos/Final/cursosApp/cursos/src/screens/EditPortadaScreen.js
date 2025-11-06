
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

export default function EditPortadaScreen({ route, navigation }) {
  const { session } = useContext(AuthContext);
  const { course } = route.params || {};
  const { width } = useWindowDimensions();

const API_BASE = "https://onlearn-api.onrender.com/api";
  const COURSES_URL = `${API_BASE}/courses`;
  const UPLOAD_FILE_URL = `${API_BASE}/upload`;

  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState(course?.price?.toString() || "");
  const [category_id, setCategoryId] = useState(course?.category_id || "");
  const [image_url, setImageUrl] = useState(course?.image_url || "");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  //Toast responsive
  const showToast = (type, text1, text2 = "") => {
    const isMobile = width < 700;
    Toast.show({
      type,
      text1,
      text2,
      visibilityTime: 2500,
      topOffset: isMobile ? 50 : 70,
      props: {
        style: {
          width: isMobile ? "90%" : "70%",
          alignSelf: "center",
          paddingHorizontal: isMobile ? 12 : 20,
        },
        text1Style: { fontSize: isMobile ? 14 : 16, fontWeight: "700" },
        text2Style: { fontSize: isMobile ? 13 : 15 },
      },
    });
  };

  //Helpers upload
  const guessMimeFromUri = (uri) => {
    const lower = (uri || "").toLowerCase();
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    if (lower.endsWith(".webp")) return "image/webp";
    return "image/jpeg";
  };

  const fileNameFromUri = (uri, fallback) => {
    try {
      const parts = uri.split("/");
      return parts[parts.length - 1] || fallback;
    } catch {
      return fallback;
    }
  };

  const uploadFile = async (uri) => {
    const form = new FormData();
    const name = fileNameFromUri(uri, "portada.jpg");
    const type = guessMimeFromUri(uri);

    form.append("file", { uri, name, type });
    form.append("folder", "images");

    const res = await fetch(UPLOAD_FILE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: form,
    });

    const data = await res.json();
    if (!res.ok || !data?.url) throw new Error(data?.error || "No se pudo subir la imagen.");
    return data.url;
  };

  //Cargar categorías

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${COURSES_URL}/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategories();
  }, []);

  // Seleccionar imagen

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) {
        setImageUrl(result.assets[0].uri);
      }
    } catch {
      showToast("error", "No se pudo abrir la galería");
    }
  };


  //Validaciones

  const handleTitleChange = (value) => {
    if (value.length > 80) {
      showToast("error", "Título demasiado largo", "Máximo 80 caracteres.");
      return;
    }
    setTitle(value);
  };

  const handleDescriptionChange = (value) => {
    if (value.length > 500) {
      showToast("error", "Descripción demasiado larga", "Máximo 500 caracteres.");
      return;
    }
    setDescription(value);
  };

  const handlePriceChange = (value) => {
    const validFormat = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || validFormat.test(value)) {
      const num = parseFloat(value);
      if (num < 0) {
        showToast("error", "Precio inválido", "No se permiten valores negativos.");
        return;
      }
      if (num > 600) {
        showToast("error", "Precio demasiado alto", "Máximo 600 USD.");
        return;
      }
      setPrice(value);
    } else {
      showToast("error", "Solo se permiten números y punto decimal.");
    }
  };

 
  //Guardar cambios (PATCH)
  const handleSaveChanges = async () => {
    try {
      if (!title || !description || !price || !category_id) {
        showToast("error", "Campos incompletos", "Completá todos los datos antes de continuar.");
        return;
      }
      if (!image_url) {
        showToast("error", "Portada obligatoria", "Seleccioná una imagen de portada.");
        return;
      }

      setLoading(true);

      let finalImageUrl = image_url;
      if (image_url.startsWith("file:")) {
        finalImageUrl = await uploadFile(image_url);
      }

      const payload = {
        title,
        description,
        price: parseFloat(price),
        image_url: finalImageUrl,
        category_id,
      };

      const res = await fetch(`${COURSES_URL}/${course.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al actualizar curso.");

      showToast("success", "Curso actualizado", "Los cambios se guardaron correctamente.");
      navigation.navigate("MyCourses");
    } catch (err) {
      console.error("Error al actualizar curso:", err);
      showToast("error", "Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  //Render principal
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Editar Portada</Text>

      <Text style={styles.label}>Título del curso</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Curso de React Native"
        value={title}
        onChangeText={handleTitleChange}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Describí brevemente el curso..."
        value={description}
        onChangeText={handleDescriptionChange}
      />

      <Text style={styles.label}>Precio (USD)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 49.99"
        keyboardType="numeric"
        value={price}
        onChangeText={handlePriceChange}
      />

      <Text style={styles.label}>Categoría</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              category_id === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setCategoryId(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                category_id === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
        {image_url ? (
          <Image source={{ uri: image_url }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imageText}>Seleccionar imagen</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Guardar cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

//Estilos

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B7077",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    color: "#0B7077",
    marginTop: 10,
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C8E2E0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  imagePicker: {
    marginTop: 15,
    backgroundColor: "#E8F5F4",
    borderRadius: 10,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 10 },
  imageText: { color: "#0B7077", fontSize: 15, fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#0B7077",
    borderRadius: 10,
    padding: 14,
    marginTop: 25,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#0B7077",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: "#0B7077" },
  categoryText: { color: "#0B7077", fontWeight: "600" },
  categoryTextActive: { color: "#fff" },
});
