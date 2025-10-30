import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function EditModuleScreen({ route, navigation }) {
  const { course } = route.params;
  const { session } = useContext(AuthContext);

  const API_BASE = "http://192.168.74.1:4000/api";
  const UPLOAD_FILE_URL = `${API_BASE}/upload`;
  const COURSES_URL = `${API_BASE}/courses`;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ============ Helpers upload ============
  const guessMimeFromUri = (uri) => {
    const lower = (uri || "").toLowerCase();
    if (lower.endsWith(".mov")) return "video/quicktime";
    if (lower.endsWith(".mkv")) return "video/x-matroska";
    if (lower.endsWith(".webm")) return "video/webm";
    return "video/mp4";
  };

  const fileNameFromUri = (uri, fallback) => {
    try {
      const parts = uri.split("/");
      const name = parts[parts.length - 1] || fallback;
      return name;
    } catch {
      return fallback;
    }
  };

  // 🌐 Helper para convertir blob a File en Web
  const blobToFile = async (blobUri, fileName, mimeType) => {
    const response = await fetch(blobUri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  };

  const uploadFile = async (uri) => {
    console.log(`[EDIT-MODS] 📤 Subiendo video:`, uri);
    console.log(`[EDIT-MODS] 🌍 Platform:`, Platform.OS);
    
    const form = new FormData();
    const name = fileNameFromUri(uri, "video.mp4");
    const type = guessMimeFromUri(uri);

    // 🌐 Para WEB: convertir blob a File
    if (Platform.OS === 'web' && uri.startsWith('blob:')) {
      console.log(`[EDIT-MODS] 🌐 Detectado blob en web, convirtiendo a File...`);
      try {
        const file = await blobToFile(uri, name, type);
        form.append("file", file);
        console.log(`[EDIT-MODS] ✅ File creado:`, { name: file.name, size: file.size, type: file.type });
      } catch (err) {
        console.error(`[EDIT-MODS] ❌ Error convirtiendo blob:`, err);
        throw new Error(`No se pudo procesar el video: ${err.message}`);
      }
    } else {
      // 📱 Para mobile: usar uri directamente
      form.append("file", {
        uri,
        name,
        type,
      });
    }

    form.append("folder", "videos");

    console.log(`[EDIT-MODS] 📦 FormData preparado`);

    const res = await fetch(UPLOAD_FILE_URL, {
      method: "POST",
      headers: {
        // ⚠️ NO especificar Content-Type manualmente en web
        ...(Platform.OS !== 'web' ? { "Content-Type": "multipart/form-data" } : {}),
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: form,
    });

    console.log(`[EDIT-MODS] 📥 Status code: ${res.status}`);

    let data;
    try {
      data = await res.json();
      console.log(`[EDIT-MODS] 📥 Respuesta upload:`, { ok: res.ok, data });
    } catch (parseErr) {
      const text = await res.text();
      console.error(`[EDIT-MODS] ❌ Error parseando respuesta:`, text.substring(0, 500));
      throw new Error(`El servidor respondió con un error. Status: ${res.status}`);
    }
    
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || "No se pudo subir el video.");
    }

    console.log(`[EDIT-MODS] ✅ Video subido correctamente:`, data.url);
    return data.url;
  };

  // =====================================================
  // 🔹 Cargar lecciones existentes
  // =====================================================
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`${COURSES_URL}/${course.id}/lessons`);
        const data = await res.json();
        setLessons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[EDIT-MODS] Error cargando lecciones:", err);
        Toast.show({
          type: "error",
          text1: "Error al cargar módulos",
          text2: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [course.id]);

  // =====================================================
  // 🔹 Agregar nueva lección vacía
  // =====================================================
  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: null,
        title: "",
        description: "",
        video_url: "",
        video_file: null,
        order_index: prev.length + 1,
        isNew: true,
      },
    ]);
  };

  // =====================================================
  // 🔹 Actualizar campo de lección
  // =====================================================
  const updateLesson = (index, field, value) => {
    const updated = [...lessons];
    if (field === "title" && value.length > 80) {
      Toast.show({
        type: "error",
        text1: "Título demasiado largo",
        text2: "Máximo 80 caracteres.",
      });
      return;
    }
    if (field === "description" && value.length > 300) {
      Toast.show({
        type: "error",
        text1: "Descripción demasiado larga",
        text2: "Máximo 300 caracteres.",
      });
      return;
    }
    updated[index][field] = value;
    setLessons(updated);
  };

  // =====================================================
  // 🔹 Seleccionar video
  // =====================================================
  const pickVideo = async (index) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'], // ✅ Nuevo formato
        allowsEditing: false,
        quality: 1,
      });
      
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log(`[EDIT-MODS] 🎬 Video seleccionado:`, uri);
        
        const updated = [...lessons];
        updated[index].video_file = uri;
        updated[index].video_url = ""; // Limpiar URL anterior
        setLessons(updated);
      }
    } catch (err) {
      console.error("[EDIT-MODS] Error en video picker:", err);
      Toast.show({
        type: "error",
        text1: "Error al seleccionar video",
        text2: err.message,
      });
    }
  };

  // =====================================================
  // 🔹 Eliminar lección
  // =====================================================
  const deleteLesson = async (index) => {
    const lesson = lessons[index];

    // Si es nueva (no guardada), solo removerla del estado
    if (lesson.isNew) {
      setLessons((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // Si ya existe en DB, eliminarla
    try {
      const res = await fetch(`${COURSES_URL}/${course.id}/lessons/${lesson.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar módulo");

      Toast.show({
        type: "success",
        text1: "Módulo eliminado",
      });

      setLessons((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("[EDIT-MODS] Error eliminando lección:", err);
      Toast.show({
        type: "error",
        text1: "Error al eliminar",
        text2: err.message,
      });
    }
  };

  // =====================================================
  // 🔹 Guardar cambios
  // =====================================================
  const handleSave = async () => {
    try {
      // Validación básica
      const invalid = lessons.some(
        (l) =>
          !l.title ||
          l.title.trim().length < 3 ||
          !l.description ||
          l.description.trim().length < 3 ||
          (!l.video_url && !l.video_file)
      );

      if (invalid) {
        Toast.show({
          type: "error",
          text1: "Módulos incompletos",
          text2: "Cada módulo debe tener título, descripción y video.",
        });
        return;
      }

      setSaving(true);
      console.log(`[EDIT-MODS] Guardando ${lessons.length} lecciones…`);

      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        console.log(`[EDIT-MODS] Procesando lección ${i + 1}/${lessons.length}:`, lesson.title);

        // Subir video si es nuevo archivo local/blob
        let videoUrlFinal = lesson.video_url;
        
        const needsUpload = lesson.video_file && (
          lesson.video_file.startsWith("file:") || 
          lesson.video_file.startsWith("blob:")
        );

        if (needsUpload) {
          console.log(`[EDIT-MODS] 📤 Subiendo video de lección ${i + 1}...`);
          videoUrlFinal = await uploadFile(lesson.video_file);
          console.log(`[EDIT-MODS] ✅ Video ${i + 1} subido:`, videoUrlFinal);
        }

        const payload = {
          title: lesson.title,
          description: lesson.description,
          video_url: videoUrlFinal,
          order_index: i + 1,
        };

        console.log(`[EDIT-MODS] 📦 Payload lección ${i + 1}:`, payload);

        // Si es nueva, crearla
        if (lesson.isNew) {
          console.log(`[EDIT-MODS] ➕ Creando nueva lección...`);
          const res = await fetch(`${COURSES_URL}/${course.id}/lessons`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData?.error || "Error al crear módulo");
          }
          console.log(`[EDIT-MODS] ✅ Lección ${i + 1} creada`);
        } else {
          // Si existe, actualizarla
          console.log(`[EDIT-MODS] 🔄 Actualizando lección existente...`);
          const res = await fetch(`${COURSES_URL}/${course.id}/lessons/${lesson.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData?.error || "Error al actualizar módulo");
          }
          console.log(`[EDIT-MODS] ✅ Lección ${i + 1} actualizada`);
        }
      }

      Toast.show({
        type: "success",
        text1: "Módulos guardados",
        text2: "Los cambios fueron guardados correctamente.",
      });

      navigation.goBack();
    } catch (err) {
      console.error("[EDIT-MODS] ❌ Error guardando módulos:", err.message);
      Toast.show({
        type: "error",
        text1: "Error al guardar",
        text2: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // 🧭 Render
  // =====================================================
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando módulos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0B7077" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Módulos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {lessons.map((lesson, index) => (
          <View key={lesson.id || `new-${index}`} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Módulo {index + 1}</Text>
              <TouchableOpacity onPress={() => deleteLesson(index)}>
                <Ionicons name="trash-outline" size={20} color="#E63946" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Introducción"
              value={lesson.title}
              onChangeText={(text) => updateLesson(index, "title", text)}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              placeholder="Describe el contenido..."
              value={lesson.description}
              onChangeText={(text) => updateLesson(index, "description", text)}
            />

            <Text style={styles.label}>Video</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={() => pickVideo(index)}>
              <Ionicons name="cloud-upload-outline" size={20} color="#0B7077" />
              <Text style={styles.uploadBtnText}>
                {lesson.video_file || lesson.video_url ? "Cambiar video" : "Seleccionar video"}
              </Text>
            </TouchableOpacity>

            {lesson.video_file && (
              <Text style={styles.fileBadge}>
                📹 {fileNameFromUri(lesson.video_file, `modulo-${index + 1}.mp4`)}
              </Text>
            )}
            {!lesson.video_file && lesson.video_url && (
              <Text style={styles.fileBadge}>📹 Video actual guardado</Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addLesson}>
          <Ionicons name="add-circle-outline" size={22} color="#0B7077" />
          <Text style={styles.addText}>Agregar módulo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// =====================================================
// 🎨 ESTILOS
// =====================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#0B7077" },
  scrollView: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#0B7077" },
  label: {
    fontWeight: "600",
    color: "#0B7077",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C8E2E0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#F8FAFB",
  },
  uploadBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#0B7077",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFB",
  },
  loaderText: { marginTop: 10, color: "#0B7077", fontWeight: "600" },
});