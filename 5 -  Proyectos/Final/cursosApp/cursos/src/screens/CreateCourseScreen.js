
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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Pantalla para crear o editar cursos con soporte para módulos
export default function CreateCourseScreen({ route, navigation }) {
  // Obtener sesión y perfil del contexto de autenticación
  const { session, profile } = useContext(AuthContext);
  
  const { mode, course } = route.params || {};

  const { width } = useWindowDimensions();

  // URLs base de la API
  const API_BASE = process.env.EXPO_PUBLIC_API_URL;
  const COURSES_URL = `${API_BASE}/courses`;
  const UPLOAD_FILE_URL = `${API_BASE}/upload`;

  // Estados del formulario
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState(course?.price?.toString() || "");
  const [priceKey, setPriceKey] = useState(0);
  const [category_id, setCategoryId] = useState(course?.category_id || "");
  const [image_url, setImageUrl] = useState(course?.image_url || "");
  const [imageFile, setImageFile] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Función para mostrar Toast adaptado al tamaño de pantalla
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

  // Determinar tipo MIME según extensión del archivo
  const guessMimeFromUri = (uri, kind) => {
    const lower = (uri || "").toLowerCase();
    if (kind === "image") {
      if (lower.endsWith(".png")) return "image/png";
      if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))
        return "image/jpeg";
      if (lower.endsWith(".webp")) return "image/webp";
      return "image/jpeg";
    }
    if (lower.endsWith(".mov")) return "video/quicktime";
    if (lower.endsWith(".mkv")) return "video/x-matroska";
    if (lower.endsWith(".webm")) return "video/webm";
    return "video/mp4";
  };

  // Extraer nombre del archivo desde su URI
  const fileNameFromUri = (uri, fallback) => {
    try {
      const parts = uri.split("/");
      const name = parts[parts.length - 1] || fallback;
      return name;
    } catch {
      return fallback;
    }
  };

  // Verificar si un archivo necesita ser subido al servidor
  const needsUpload = (uri) => {
    if (!uri) return false;
    return (
      uri.startsWith("file://") ||
      uri.startsWith("blob:") ||
      uri.startsWith("data:") ||
      (!uri.startsWith("http://") && !uri.startsWith("https://"))
    );
  };

  // Convertir URI blob o data a objeto File para web
  const uriToFile = async (uri, fileName, mimeType) => {
    try {
      if (uri.startsWith("blob:") || uri.startsWith("data:")) {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new File([blob], fileName, { type: mimeType });
      }
      return null;
    } catch (error) {
      throw new Error("No se pudo procesar el archivo seleccionado");
    }
  };

  // Subir archivo al servidor y retornar URL pública
  const uploadFile = async (uri, kind) => {
    if (!uri || !needsUpload(uri)) {
      return uri;
    }

    const form = new FormData();
    const name = fileNameFromUri(
      uri,
      kind === "image" ? "portada.jpg" : "video.mp4"
    );
    const type = guessMimeFromUri(uri, kind);

    try {
      // En web convertir blob a File
      if (Platform.OS === "web") {
        const file = await uriToFile(uri, name, type);
        if (!file) {
          throw new Error("No se pudo convertir el archivo para subirlo");
        }
        form.append("file", file);
      } else {
        // En móvil usar URI directamente
        form.append("file", {
          uri,
          name,
          type,
        });
      }

      form.append("folder", kind === "image" ? "images" : "videos");

      const res = await fetch(UPLOAD_FILE_URL, {
        method: "POST",
        headers: {
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: form,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al subir: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      if (!data?.url) {
        throw new Error(data?.error || `No se recibió URL del ${kind} subido`);
      }

      if (needsUpload(data.url)) {
        throw new Error(`La URL recibida no es pública: ${data.url}`);
      }

      return data.url;
    } catch (error) {
      throw new Error(`No se pudo subir el ${kind}: ${error.message}`);
    }
  };

  // Cargar categorías disponibles al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${COURSES_URL}/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        showToast("error", "Error al cargar categorías");
      }
    };
    fetchCategories();
  }, []);

  // Abrir selector de imágenes del dispositivo
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const localUri = result.assets[0].uri;
        setImageFile(localUri);
        setImageUrl(localUri);
      }
    } catch {
      showToast("error", "No se pudo abrir la galería");
    }
  };

  // Validar y actualizar título con límite de 80 caracteres
  const handleTitleChange = (value) => {
    if (value.length > 80) {
      showToast("error", "Título demasiado largo", "Máximo 80 caracteres.");
      return;
    }
    setTitle(value);
  };

  // Validar y actualizar descripción con límite de 500 caracteres
  const handleDescriptionChange = (value) => {
    if (value.length > 500) {
      showToast(
        "error",
        "Descripción demasiado larga",
        "Máximo 500 caracteres."
      );
      return;
    }
    setDescription(value);
  };

  // Validar y actualizar precio con restricciones numéricas
  const handlePriceChange = (value) => {
    if (value === "") {
      setPrice("");
      return;
    }

    const validFormat = /^[0-9]*\.?[0-9]*$/;
    if (!validFormat.test(value)) {
      showToast(
        "error",
        "Entrada inválida",
        "Solo se permiten números y punto decimal."
      );
      setPriceKey(prev => prev + 1);
      return;
    }

    if (value === "." || value.endsWith(".")) {
      setPrice(value);
      return;
    }

    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      setPriceKey(prev => prev + 1);
      return;
    }

    if (numericValue < 0) {
      showToast(
        "error",
        "Precio inválido",
        "No se permiten valores negativos."
      );
      setPriceKey(prev => prev + 1);
      return;
    }

    if (numericValue > 600) {
      showToast(
        "error",
        "Precio demasiado alto",
        "Máximo permitido: 600 USD."
      );
      setPriceKey(prev => prev + 1);
      return;
    }

    setPrice(value);
  };

  // Validar datos del paso 1 y avanzar al paso 2
  const handleNextStep = () => {
    if (!title || !description || !price || !category_id) {
      showToast(
        "error",
        "Campos incompletos",
        "Completá los datos del curso antes de continuar."
      );
      return;
    }
    if (!imageFile && !image_url) {
      showToast(
        "error",
        "Portada obligatoria",
        "Debés seleccionar una imagen de portada."
      );
      return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      showToast("error", "Precio inválido", "Debe ser mayor a 0.");
      return;
    }
    if (parseFloat(price) > 600) {
      showToast("error", "Precio excedido", "Máximo 600 USD.");
      return;
    }
    setStep(2);
  };

  // Agregar módulo vacío a la lista
  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        video_url: "",
        video_file: null,
        order_index: prev.length + 1,
      },
    ]);
  };

  // Abrir selector de video para un módulo específico
  const pickModuleVideo = async (index) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        const updated = [...modules];
        updated[index].video_file = videoUri;
        updated[index].video_url = videoUri;
        setModules(updated);
      }
    } catch {
      showToast("error", "No se pudo abrir el selector de video");
    }
  };

  // Actualizar campo de un módulo con validaciones
  const updateModule = (index, field, value) => {
    const updated = [...modules];
    if (field === "title" && value.length > 80) {
      showToast(
        "error",
        "Título de módulo demasiado largo",
        "Máximo 80 caracteres."
      );
      return;
    }
    if (field === "description" && value.length > 300) {
      showToast(
        "error",
        "Descripción de módulo demasiado larga",
        "Máximo 300 caracteres."
      );
      return;
    }
    updated[index][field] = value;
    setModules(updated);
  };

  // Enviar curso al servidor con validaciones completas
  const handleSubmitCourse = async () => {
    try {
      // Validar campos básicos
      if (!title || !description || !price || !category_id) {
        showToast(
          "error",
          "Campos incompletos",
          "Completá todos los datos antes de continuar."
        );
        return;
      }
      if (!imageFile && !image_url) {
        showToast(
          "error",
          "Portada obligatoria",
          "Debés seleccionar una imagen de portada."
        );
        return;
      }
      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        showToast("error", "Precio inválido", "Debe ser un número mayor a 0.");
        return;
      }
      if (parseFloat(price) > 600) {
        showToast("error", "Precio excedido", "Máximo 600 USD.");
        return;
      }

      // Validar módulos solo en modo creación
      if (mode !== "edit") {
        if (modules.length < 1) {
          showToast(
            "error",
            "Mínimo un módulo",
            "El curso debe tener al menos un módulo."
          );
          return;
        }

        const invalidModule =
          modules.some((m) => !m.title || m.title.trim().length < 3) ||
          modules.some(
            (m) => !m.description || m.description.trim().length < 3
          ) ||
          modules.some((m) => !m.video_file && !m.video_url);

        if (invalidModule) {
          showToast(
            "error",
            "Módulos incompletos",
            "Cada módulo debe tener título, descripción y video."
          );
          return;
        }
      }

      setLoading(true);

      // Subir imagen de portada si es necesario
      let finalImageUrl = image_url;
      const imageToUpload = imageFile || image_url;

      if (needsUpload(imageToUpload)) {
        finalImageUrl = await uploadFile(imageToUpload, "image");
        setImageUrl(finalImageUrl);
        setImageFile(null);
      }

      if (!finalImageUrl || needsUpload(finalImageUrl)) {
        throw new Error(
          "No se pudo obtener una URL pública para la portada del curso."
        );
      }

      // Preparar payload del curso
      const payload = {
        title,
        description,
        price: parseFloat(price),
        image_url: finalImageUrl,
        category_id,
        owner: profile?.id,
      };

      // Crear o actualizar curso según el modo
      const method = mode === "edit" ? "PATCH" : "POST";
      const url =
        mode === "edit" ? `${COURSES_URL}/${course?.id}` : COURSES_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error || data?.message || "Error al guardar el curso"
        );
      }

      const savedCourse = data.data || data;

      // Crear módulos solo en modo creación
      if (mode !== "edit" && modules.length > 0) {
        for (let i = 0; i < modules.length; i++) {
          const mod = modules[i];
          let videoUrlFinal = mod.video_file || mod.video_url;

          // Subir video del módulo
          if (needsUpload(videoUrlFinal)) {
            videoUrlFinal = await uploadFile(videoUrlFinal, "video");
          }

          if (!videoUrlFinal || needsUpload(videoUrlFinal)) {
            throw new Error(
              `No se pudo obtener una URL pública para el video del módulo ${
                i + 1
              }.`
            );
          }

          // Crear lección en el backend
          const lessonPayload = {
            title: mod.title,
            description: mod.description,
            video_url: videoUrlFinal,
            order_index: mod.order_index,
          };

          const lessonRes = await fetch(
            `${COURSES_URL}/${savedCourse.id}/lessons`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
              },
              body: JSON.stringify(lessonPayload),
            }
          );

          if (!lessonRes.ok) {
            const errData = await lessonRes.json();
            throw new Error(
              `Error al crear módulo ${i + 1}: ${
                errData?.error || "Error desconocido"
              }`
            );
          }
        }
      }

      showToast(
        "success",
        mode === "edit" ? "Curso actualizado" : "Curso creado",
        mode === "edit"
          ? "Los cambios fueron guardados con éxito."
          : "El curso fue creado y está pendiente de revisión."
      );

      navigation.navigate("MyCourses");
    } catch (err) {
      showToast(
        "error",
        "Error al guardar",
        err.message || "Ocurrió un error inesperado"
      );
    } finally {
      setLoading(false);
    }
  };

  // Manejar navegación hacia atrás
  const handleBackPress = () => {
    if (step === 2) {
      setStep(1);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("MyCourses");
      }
    }
  };

  // Renderizar formulario del paso 1: datos básicos
  const renderStep1 = () => (
    <ScrollView style={styles.form}>
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
        placeholder="Describí brevemente el contenido del curso..."
        value={description}
        onChangeText={handleDescriptionChange}
      />

      <Text style={styles.label}>Precio (USD)</Text>
      <TextInput
        key={priceKey}
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

      {mode === "edit" ? (
        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmitCourse}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNextStep}>
          <Text style={styles.nextText}>Continuar con módulos</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  // Renderizar formulario del paso 2: módulos
  const renderStep2 = () => (
    <ScrollView style={styles.form}>
      <Text style={styles.sectionTitle}>Agregar módulos al curso</Text>

      {modules.map((mod, index) => (
        <View key={index} style={styles.moduleCard}>
          <Text style={styles.moduleLabel}>Título del módulo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Introducción"
            value={mod.title}
            onChangeText={(text) => updateModule(index, "title", text)}
          />

          <Text style={styles.moduleLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            placeholder="Describe brevemente el contenido..."
            value={mod.description}
            onChangeText={(text) => updateModule(index, "description", text)}
          />

          <Text style={styles.moduleLabel}>Video del módulo</Text>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => pickModuleVideo(index)}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#0B7077" />
            <Text style={styles.uploadBtnText}>Seleccionar video</Text>
          </TouchableOpacity>
          {mod.video_file || mod.video_url ? (
            <Text style={styles.fileBadge}>
              {fileNameFromUri(
                mod.video_file || mod.video_url,
                `modulo-${index + 1}.mp4`
              )}
            </Text>
          ) : (
            <Text style={{ color: "#666", marginTop: 6 }}>
              Ningún video seleccionado.
            </Text>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addModule}>
        <Ionicons name="add-circle-outline" size={22} color="#0B7077" />
        <Text style={styles.addText}>Agregar módulo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.7 }]}
        onPress={handleSubmitCourse}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Publicar curso</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
        <View style={styles.container}>
          {/* Botón de navegación hacia atrás */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#0B7077" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {mode === "edit" ? "Editar Curso" : "Crear Curso"}
          </Text>

          {step === 1 ? renderStep1() : renderStep2()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },
  container: { flex: 1, backgroundColor: "#F8FAFB", padding: 20 },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.select({ web: 20, android: 45, ios: 45 }),
    zIndex: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B7077",
    textAlign: "center",
    marginBottom: 16,
    marginTop: Platform.select({ web: 0, android: 10, ios: 10 }),
  },
  form: { flex: 1 },
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
  nextBtn: {
    backgroundColor: "#0B7077",
    marginTop: 25,
    borderRadius: 10,
    padding: 14,
  },
  nextText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B7077",
    marginBottom: 12,
  },
  moduleCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  moduleLabel: {
    fontWeight: "600",
    color: "#0B7077",
    marginBottom: 4,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    gap: 5,
  },
  addText: { color: "#0B7077", fontSize: 15, fontWeight: "600" },
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
  uploadBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#0B7077",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E9F6F5",
  },
  uploadBtnText: { color: "#0B7077", fontWeight: "600" },
  fileBadge: {
    marginTop: 8,
    backgroundColor: "#F2F6F5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    color: "#0B7077",
    fontSize: 13,
  },
});
