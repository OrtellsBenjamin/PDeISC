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

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


//Se obtiene el curso desde la pantalla anterior
export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const { session } = useContext(AuthContext);
  const { width } = useWindowDimensions();
  const isMobile = width <= 800;

  //Estados locales, indice de sección abierta, carga del boton de inscripción y temario
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState([]);

  const toggleSection = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  //Cargar temario real desde la API
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch(`http://192.168.204.1:4000/api/courses/${course.id}/lessons`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {

          //Creo un arreglo de secciones con las lecciones obtenidas
          const sections = [
            {
              title: "Contenido del curso",
              lessons: data.map((lesson) => lesson.title),
            },
          ];
          setSyllabus(sections);
        } else setSyllabus([]);
      } catch (err) {
        console.error("❌ Error al cargar temario:", err);
        setSyllabus([]);
      }
    };
    fetchSyllabus();
  }, [course.id]);

  const handleEnroll = async () => {
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
      const res = await fetch("https://onlearn-api.onrender.com/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ course_id: course.id }),
      });

      const data = await res.json();

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
        Toast.show({
          type: "error",
          text1: "Error al inscribirse",
          text2: data.error || "No se pudo procesar la inscripción.",
        });
      }
    } catch (e) {
      console.error("❌ Error inscribiendo:", e);
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
  
      <Header />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#0B7077" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {isMobile ? (
          <>

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

            <View style={[styles.infoContainer, { width: "90%", alignSelf: "center" }]}>
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

            {/* Temario */}
            <View style={[styles.syllabusContainer, { width: "90%", alignSelf: "center" }]}>
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
          </>
        ) : (
          <View
            style={[
              styles.topSection,
              { flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" },
            ]}
          >

            <View
              style={[
                styles.mediaContainer,
                { width: "48%", alignSelf: "flex-start" },
              ]}
            >
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

     
        <FooterSection />
      </ScrollView>
    </View>
  );
}


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
