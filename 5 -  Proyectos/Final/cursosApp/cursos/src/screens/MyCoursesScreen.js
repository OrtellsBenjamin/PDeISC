import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditModuleScreen from "./EditModuleScreen";
import { Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");
import { Modal } from "react-native";



export default function MyCoursesScreen() {
  const { session, profile } = useContext(AuthContext);
  const navigation = useNavigation();
  const [enrollments, setEnrollments] = useState([]);
  const [myCreated, setMyCreated] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);


  const API_BASE = "https://onlearn-api.onrender.com/api";
  const ENROLL_URL = `${API_BASE}/enrollments/me`;
  const COURSES_URL = `${API_BASE}/courses`;

  useFocusEffect(
    React.useCallback(() => {
      if (session && profile) fetchData();
    }, [session, profile])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!session) return;

      const fetchEnrollments = fetch(ENROLL_URL, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      let fetchCreated = Promise.resolve({ ok: true, json: async () => [] });
      if (profile?.role === "instructor" || profile?.role === "admin") {
        fetchCreated = fetch(`${COURSES_URL}?instructor_id=${profile.id}`);
      }

      let fetchAll = Promise.resolve({ ok: true, json: async () => [] });
      if (profile?.role === "admin") {
        fetchAll = fetch(COURSES_URL);
      }

      const [resEnroll, resCreated, resAll] = await Promise.allSettled([
        fetchEnrollments,
        fetchCreated,
        fetchAll,
      ]);

      if (resEnroll.status === "fulfilled") {
        const enrollResp = resEnroll.value;
        const dataEnroll = await enrollResp.json();
        if (!enrollResp.ok)
          throw new Error(dataEnroll.error || "Error cargando inscripciones");
        setEnrollments(Array.isArray(dataEnroll) ? dataEnroll : []);
      } else setEnrollments([]);

      if (resCreated.status === "fulfilled") {
        const createdResp = resCreated.value;
        const dataCreated = await createdResp.json();
        setMyCreated(Array.isArray(dataCreated) ? dataCreated : []);
      } else setMyCreated([]);

      if (resAll.status === "fulfilled") {
        const allResp = resAll.value;
        const dataAll = await allResp.json();
        setAllCourses(Array.isArray(dataAll) ? dataAll : []);
      } else setAllCourses([]);
    } catch (err) {
      console.error("❌ Error cargando cursos:", err);
      Toast.show({
        type: "error",
        text1: "Error al cargar cursos",
        text2: "Intentá nuevamente más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetProgress = async (courseId) => {
    try {
      const res = await fetch(`${API_BASE}/enrollments/${courseId}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ progress: 0 }),
      });
      if (!res.ok) throw new Error("No se pudo resetear el progreso.");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "No se pudo reiniciar el curso",
        text2: e.message,
      });
    }
  };

  const handleDeleteCourse = (id, title) => {
    setSelectedCourse({ id, title });
    setConfirmVisible(true);
  };

  // 🔧 FUNCIÓN AGREGADA: Eliminar curso
  const deleteCourseNow = async () => {
    if (!selectedCourse?.id) return;
    
    try {
      const res = await fetch(`${API_BASE}/courses/${selectedCourse.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo eliminar el curso");
      }

      Toast.show({
        type: "success",
        text1: "Curso eliminado",
        text2: `"${selectedCourse.title}" fue eliminado exitosamente.`,
      });

      // Cerrar modal y recargar datos
      setConfirmVisible(false);
      setSelectedCourse(null);
      await fetchData();

    } catch (error) {
      console.error("❌ Error eliminando curso:", error);
      Toast.show({
        type: "error",
        text1: "Error al eliminar",
        text2: error.message || "Intentá nuevamente más tarde.",
      });
    }
  };
 
  const enterCourse = (item) => {
    const finished = (item.progress || 0) >= 100;
    if (!finished) {
      navigation.navigate("CoursePlayer", { course: item.course });
      return;
    }

    Toast.show({
      type: "info",
      text1: "Curso completado",
      text2: "Ya finalizaste este curso. ¿Querés hacerlo de nuevo?",
      visibilityTime: 6000,
      autoHide: false,
      props: {
        showConfirm: true,
        onConfirm: async () => {
          try {
            Toast.hide();
            await resetProgress(item.course_id);
            navigation.navigate("CoursePlayer", { course: item.course });
          } catch {}
        },
        onCancel: () => Toast.hide(),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando tus cursos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backAbsolute} />
        <Text style={styles.headerTitle}>Mis Cursos</Text>
      </View>

      <Text style={styles.sectionTitle}>Cursos en los que estás inscripto</Text>
      {enrollments.length === 0 ? (
        <Text style={styles.noCoursesText}>
          Todavía no estás inscripto en ningún curso.
        </Text>
      ) : (
        enrollments.map((item) => (
          <TouchableOpacity
            key={`${item.user_id}-${item.course_id}`}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => enterCourse(item)}
          >
            <Image
              source={{
                uri:
                  item.course.image_url ||
                  "https://placehold.co/600x400?text=Sin+imagen",
              }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.courseTitle}>{item.course.title}</Text>
              <Text numberOfLines={2} style={styles.desc}>
                {item.course.description || "Sin descripción."}
              </Text>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${item.progress || 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                Progreso: {item.progress || 0}%
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Cursos creados */}
      {(profile?.role === "instructor" || profile?.role === "admin") && (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Cursos que creaste
          </Text>

          {myCreated.length === 0 ? (
            <Text style={styles.noCoursesText}>
              No creaste ningún curso todavía.
            </Text>
          ) : (
            myCreated.map((course) => (
              <View key={course.id} style={styles.card}>
                <Image
                  source={{
                    uri:
                      course.image_url ||
                      "https://placehold.co/600x400?text=Sin+imagen",
                  }}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text numberOfLines={2} style={styles.desc}>
                    {course.description || "Sin descripción."}
                  </Text>

                  <View style={styles.actionRow}>
                    {/* Editar curso */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#0B7077" },
                      ]}
                      onPress={() =>
                        navigation.navigate("EditPortada", { course })
                      }
                    >
                      <Ionicons name="create-outline" size={18} color="#fff" />
                      <Text style={styles.actionText}>Editar curso</Text>
                    </TouchableOpacity>

                    {/* Editar módulos */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#E86A33" },
                      ]}
                      onPress={() =>
                        navigation.navigate("EditModule", { course })
                      }
                    >
                      <Ionicons name="albums-outline" size={18} color="#fff" />
                      <Text style={styles.actionText}>Editar módulos</Text>
                    </TouchableOpacity>

                    {/* Eliminar curso */}
                    {(profile?.role === "admin" ||
                      (profile?.role === "instructor" &&
                        course.owner === session?.user?.id)) && (
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#E63946" },
                        ]}
                        onPress={() =>
                          handleDeleteCourse(course.id, course.title)
                        }
                      >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                        <Text style={styles.actionText}>Eliminar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </>
      )}

      {/* Todos los cursos (vista admin) */}
      {profile?.role === "admin" && (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Todos los cursos (vista admin)
          </Text>

          {allCourses.length === 0 ? (
            <Text style={styles.noCoursesText}>
              No hay cursos cargados en la plataforma.
            </Text>
          ) : (
            allCourses
              .filter((c) => c.status !== "draft")
              .map((course) => (
                <View key={course.id} style={styles.card}>
                  <Image
                    source={{
                      uri:
                        course.image_url ||
                        "https://placehold.co/600x400?text=Sin+imagen",
                    }}
                    style={styles.image}
                  />
                  <View style={styles.info}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text numberOfLines={2} style={styles.desc}>
                      {course.description || "Sin descripción."}
                    </Text>
                    <Text style={{ color: "#555", fontSize: 12 }}>
                      Creador: {course.owner}
                    </Text>
                    <Text style={{ color: "#0B7077", fontWeight: "600" }}>
                      Estado: {course.status}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: "#E63946",
                          alignSelf: "flex-start",
                          marginTop: 8,
                        },
                      ]}
                      onPress={() =>
                        handleDeleteCourse(course.id, course.title)
                      }
                    >
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                      <Text style={styles.actionText}>Eliminar curso</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
          )}
        </>
      )}

      {/* Modal de confirmación */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={styles.modalText}>
              ¿Seguro que querés eliminar{"\n"}"
              {selectedCourse?.title || "este curso"}"?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E63946" }]}
                onPress={deleteCourseNow}
              >
                <Text style={styles.modalButtonText}>Sí, eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#0B7077" }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },  
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  backAbsolute: {
    position: "absolute",
    left: 0,
    marginTop: Platform.select({ web:0, android:50, ios:50 }),
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B7077",
    marginLeft: Platform.select({ web:0, android:40, ios:40 }),
    marginTop: Platform.select({ ios: 55, android: 48 }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B7077",
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    backgroundColor: "#F2F6F5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loaderText: { marginTop: 10, color: "#0B7077", fontWeight: "600" },
  noCoursesText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: 110, height: 110, borderRadius: 10, marginRight: 12 },
  info: { flex: 1, justifyContent: "center" },
  courseTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0B7077",
    marginBottom: 4,
  },
  desc: { color: "#555", fontSize: 13, marginBottom: 8 },
  progressContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#D2E6E4",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: "#0B7077" },
  progressText: { fontSize: 13, color: "#555", marginTop: 4 },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 10,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#F2F6F5",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#E9F6F5",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B7077",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    textAlign: "center",
    color: "#0B7077",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

// Ajustes para pantallas pequeñas
if (screenWidth <= 360) {
  Object.assign(styles, {
    container: {
      ...styles.container,
      paddingHorizontal: 16,
    },
    headerTitle: {
      ...styles.headerTitle,
      fontSize: 20,
      marginTop: Platform.select({ ios: 40, android: 35 }),
    },
    sectionTitle: {
      ...styles.sectionTitle,
      fontSize: 17,
      textAlign: "center",
    },
    card: {
      ...styles.card,
      flexDirection: "column",
      alignItems: "center",
      padding: 10,
    },
    image: {
      ...styles.image,
      width: "100%",
      height: 160,
      marginRight: 0,
      marginBottom: 10,
    },
    info: {
      ...styles.info,
      alignItems: "center",
    },
    courseTitle: {
      ...styles.courseTitle,
      fontSize: 15,
      textAlign: "center",
    },
    desc: {
      ...styles.desc,
      fontSize: 12,
      textAlign: "center",
    },
    progressText: {
      ...styles.progressText,
      fontSize: 12,
    },
    backAbsolute: {
      ...styles.backAbsolute,
      top: 2, 
      left: 5,
    },
  });
}