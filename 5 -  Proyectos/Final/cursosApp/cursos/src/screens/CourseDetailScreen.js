import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import Header from "../components/Header";
import FooterSection from "../components/FooterSection";

// Habilitar animaciones de layout en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Componente principal que muestra los detalles de un curso
export default function CourseDetailScreen({ route, navigation }) {
  
  const { course } = route.params;
  // Obtener la sesión del usuario desde el contexto de autenticación
  const { session } = useContext(AuthContext);

  const { width } = useWindowDimensions();

  const isMobile = width <= 800;

  // Estado para controlar qué sección del temario está abierta
  const [openIndex, setOpenIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  // Estado para almacenar el temario del curso
  const [syllabus, setSyllabus] = useState([]);


  // Función para expandir/contraer una sección del temario
  const toggleSection = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  // Cargar el temario del curso desde la API
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        // Hacer petición para obtener las lecciones del curso
        const res = await fetch(`https://onlearn-api.onrender.com/api/courses/${course.id}/lessons`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Estructurar las lecciones en formato de secciones
          const sections = [
            {
              title: "Contenido del curso",
              lessons: data.map((lesson) => lesson.title),
            },
          ];
          setSyllabus(sections);
        } else setSyllabus([]);
      } catch (err) {
        console.error("Error al cargar temario:", err);
        setSyllabus([]);
      }
    };
    fetchSyllabus();
  }, [course.id]);

  // Función para inscribirse al curso
  const handleEnroll = async () => {
    // Verificar si el usuario está autenticado
    if (!session) {
      Toast.show({
        type: "info",
        text1: "Iniciá sesión",
        text2: "Necesitás iniciar sesión para inscribirte.",
      });
      navigation.navigate("Login");
      return;
    }

    try {
      setLoading(true);
      // Hacer petición POST para inscribir al usuario
      const res = await fetch("https://onlearn-api.onrender.com/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ course_id: course.id }),
      });

      const data = await res.json();

      // Manejar respuesta exitosa
      if (res.ok) {
        Toast.show({
          type: "success",
          text1: data.message?.includes("Ya estás inscripto")
            ? "Ya estás inscripto"
            : "Inscripción correcta",
          text2: data.message?.includes("Ya estás inscripto")
            ? "No podés volver a anotarte en el mismo curso."
            : "Tu curso fue agregado exitosamente.",
        });
      } else {
        // Manejar errores del servidor
        Toast.show({
          type: "error",
          text1: "Error al inscribirse",
          text2: data.error || "No se pudo procesar la inscripción.",
        });
      }
    } catch (e) {
      // Manejar errores de conexión
      console.error("Error inscribiendo:", e);
      Toast.show({
        type: "error",
        text1: "Error de conexión",
        text2: "No se pudo conectar con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header de la aplicación */}
      <Header />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Botón para volver a la pantalla anterior */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#0B7077" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {/* Layout móvil: elementos apilados verticalmente */}
        {isMobile ? (
          <>
            {/* Contenedor del video o imagen del curso */}
            <View style={[styles.mediaContainer, { width: "90%", alignSelf: "center" }]}>
              {course.video_url ? (
                <Video
                  source={{ uri: course.video_url }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{
                    uri:
                      course.image_url ||
                      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
                  }}
                  style={styles.video}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Información del curso: título, instructor, descripción y precio */}
            <View style={[styles.infoContainer, { width: "90%", alignSelf: "center" }]}>
              <Text style={styles.title}>{course.title}</Text>
              <Text style={styles.instructor}>
                Por {course.instructor || "Instructor Onlearn"}
              </Text>

              <Text style={styles.desc}>{course.description}</Text>

              <Text style={styles.price}>${course.price} USD</Text>

              {/* Botón de inscripción */}
              <TouchableOpacity
                style={[styles.enrollButton, loading && { opacity: 0.6 }]}
                onPress={handleEnroll}
                disabled={loading}
              >
                <Text style={styles.enrollText}>
                  {loading ? "Procesando..." : "Inscribirse al curso"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sección del temario */}
            <View style={[styles.syllabusContainer, { width: "90%", alignSelf: "center" }]}>
              <Text style={styles.syllabusTitle}>Temario</Text>

              {/* Mostrar mensaje si no hay temario disponible */}
              {syllabus.length === 0 ? (
                <View style={{ marginTop: 15 }}>
                  <Text style={{ color: "#777", textAlign: "center" }}>
                    {loading
                      ? "Cargando temario..."
                      : "Este curso no tiene módulos cargados aún."}
                  </Text>
                </View>
              ) : (
                // Renderizar las secciones del temario
                syllabus.map((section, index) => (
                  <View key={index} style={styles.section}>
                    {/* Header de la sección con título y flecha */}
                    <TouchableOpacity
                      onPress={() => toggleSection(index)}
                      style={styles.sectionHeader}
                    >
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      <Ionicons
                        name={openIndex === index ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#0B7077"
                      />
                    </TouchableOpacity>

                    {/* Lista de lecciones (visible solo si la sección está abierta) */}
                    {openIndex === index && (
                      <View style={styles.lessonContainer}>
                        {section.lessons.map((lesson, i) => (
                          <Text key={i} style={styles.lessonText}>
                            • {lesson}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          // Layout desktop: dos columnas
          <View
            style={[
              styles.topSection,
              { flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" },
            ]}
          >
            {/* Columna izquierda: video/imagen y temario */}
            <View
              style={[
                styles.mediaContainer,
                { width: "48%", alignSelf: "flex-start" },
              ]}
            >
              {/* Video o imagen del curso */}
              {course.video_url ? (
                <Video
                  source={{ uri: course.video_url }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{
                    uri:
                      course.image_url ||
                      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
                  }}
                  style={styles.video}
                  resizeMode="cover"
                />
              )}

              {/* Temario en desktop */}
              <View style={styles.syllabusContainer}>
                <Text style={styles.syllabusTitle}>Temario</Text>

                {syllabus.length === 0 ? (
                  <View style={{ marginTop: 15 }}>
                    <Text style={{ color: "#777", textAlign: "center" }}>
                      {loading
                        ? "Cargando temario..."
                        : "Este curso no tiene módulos cargados aún."}
                    </Text>
                  </View>
                ) : (
                  syllabus.map((section, index) => (
                    <View key={index} style={styles.section}>
                      <TouchableOpacity
                        onPress={() => toggleSection(index)}
                        style={styles.sectionHeader}
                      >
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Ionicons
                          name={openIndex === index ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#0B7077"
                        />
                      </TouchableOpacity>

                      {openIndex === index && (
                        <View style={styles.lessonContainer}>
                          {section.lessons.map((lesson, i) => (
                            <Text key={i} style={styles.lessonText}>
                              • {lesson}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>

            {/* Columna derecha: información del curso y botón de inscripción */}
            <View style={[styles.infoContainer, { width: "45%" }]}>
              <Text style={styles.title}>{course.title}</Text>
              <Text style={styles.instructor}>
                Por {course.instructor || "Instructor Onlearn"}
              </Text>

              <Text style={styles.desc}>{course.description}</Text>

              <Text style={styles.price}>${course.price} USD</Text>

              <TouchableOpacity
                style={[styles.enrollButton, loading && { opacity: 0.6 }]}
                onPress={handleEnroll}
                disabled={loading}
              >
                <Text style={styles.enrollText}>
                  {loading ? "Procesando..." : "Inscribirse al curso"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Footer de la aplicación */}
        <FooterSection />
      </ScrollView>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 20,
  },
  backText: { color: "#0B7077", fontWeight: "600", fontSize: 16, marginLeft: 4 },
  topSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "flex-start",
    gap: 25,
  },
  mediaContainer: {
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  video: {
    marginTop: 20,
    width: "100%",
    height: 320,
    borderRadius: 40,
    marginBottom: 20,
    overflow: "hidden",
  },
  infoContainer: { paddingHorizontal: 30 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0B7077",
    marginBottom: 10,
    marginTop: 20,
  },
  instructor: { color: "#555", fontSize: 15, marginBottom: 6 },
  students: { color: "#666", fontSize: 14, marginBottom: 12 },
  desc: { color: "#333", fontSize: 15, marginBottom: 18, lineHeight: 22 },
  price: {
    color: "#E86A33",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 20,
  },
  enrollButton: {
    backgroundColor: "#0B7077",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  enrollText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  syllabusContainer: { width: "100%", marginTop: 5 },
  syllabusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B7077",
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#F2F6F5",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sectionTitle: { fontWeight: "600", fontSize: 15, color: "#0B7077" },
  lessonContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  lessonText: { fontSize: 14, color: "#333", marginBottom: 4 },
});