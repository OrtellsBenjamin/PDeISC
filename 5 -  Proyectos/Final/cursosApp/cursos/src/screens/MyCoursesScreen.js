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

export default function MyCoursesScreen() {
  const { session, profile } = useContext(AuthContext);
  const navigation = useNavigation();
  const [enrollments, setEnrollments] = useState([]);
  const [myCreated, setMyCreated] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://onlearn-api.onrender.com/api";
  const ENROLL_URL = `${API_BASE}/enrollments/me`;
  const COURSES_URL = `${API_BASE}/courses`;

  // 🔁 Cargar datos solo cuando la sesión y el perfil estén listos
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

      const [resEnroll, resCreated] = await Promise.allSettled([
        fetchEnrollments,
        fetchCreated,
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
    } catch (err) {
      console.error("❌ Error cargando cursos:", err);
      Toast.show({
        type: "error",
        text1: "Error al cargar tus cursos",
        text2: "Intentá nuevamente más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resetear progreso
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

  // 🗑️ Eliminar curso
  const deleteCourseNow = async (id, title) => {
    try {
      const res = await fetch(`${COURSES_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Error ${res.status}: ${text}`);

      Toast.show({
        type: "success",
        text1: "Curso eliminado",
        text2: `"${title}" fue eliminado correctamente.`,
      });

      setMyCreated((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar curso:", err);
      Toast.show({
        type: "error",
        text1: "Error al eliminar curso",
        text2: err.message,
      });
    }
  };

  const handleDeleteCourse = (id, title) => {
    Toast.show({
      type: "info",
      text1: "Eliminar curso",
      text2: `¿Seguro que querés eliminar "${title}"? Esta acción no se puede deshacer.`,
      visibilityTime: 6000,
      autoHide: false,
      props: {
        showConfirm: true,
        onConfirm: () => {
          Toast.hide();
          deleteCourseNow(id, title);
        },
        onCancel: () => Toast.hide(),
      },
    });
  };

  // ▶️ Entrar a curso
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

  // Loader global
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando tus cursos...</Text>
      </View>
    );
  }

  // 🧭 UI
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#0B7077" />
          <Text style={styles.backText}>Volver al inicio</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Cursos</Text>
      </View>

      {/* Cursos inscriptos */}
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
                        navigation.navigate("EditPortada", { course 
                        })
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
                        navigation.navigate("EditModules", { course })
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
    </ScrollView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: {
    color: "#0B7077",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B7077",
    marginRight: 35,
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
});
