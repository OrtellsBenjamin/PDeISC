import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AdminPanelScreen() {
  const { session } = useContext(AuthContext);
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const API_URL = "https://onlearn-api.onrender.com/api";

  //Obtener cursos
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
      Toast.show({
        type: "error",
        text1: "Error al cargar cursos",
        text2: err.message,
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  //Obtener profesores pendientes
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_URL}/users/pending-teachers`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar profesores pendientes:", err);
      Toast.show({
        type: "error",
        text1: "Error al cargar profesores",
        text2: err.message,
      });
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  //Aprobar/Rechazar profesores
  const handleApproveTeacher = async (id) => {
    try {
      const res = await fetch(`${API_URL}/users/approve-teacher/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error("No se pudo aprobar la solicitud");

      Toast.show({
        type: "success",
        text1: "Profesor aprobado",
        text2: "El usuario ahora puede crear cursos.",
      });
      fetchTeachers();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  const handleRejectTeacher = async (id) => {
    try {
      const res = await fetch(`${API_URL}/users/reject-teacher/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error("No se pudo rechazar la solicitud");

      Toast.show({
        type: "info",
        text1: "Solicitud rechazada",
        text2: "El usuario fue notificado.",
      });
      fetchTeachers();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  //Aprobar/Rechazar cursos
  const handleApproveCourse = async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo aprobar el curso");

      Toast.show({
        type: "success",
        text1: "Curso publicado 🚀",
        text2: "El curso ya está visible en la plataforma.",
      });

      fetchCourses();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  const handleRejectCourse = async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo rechazar el curso");

      Toast.show({
        type: "info",
        text1: "Curso rechazado ❌",
        text2: "El curso fue marcado como rechazado.",
      });

      fetchCourses();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  // Loader
  if (loadingCourses || loadingTeachers) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando datos...</Text>
      </View>
    );
  }

  //Interfaz principal
  return (
    <ScrollView style={styles.container}>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color="#fff"
          style={{ marginRight: 5 }}
        />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Panel de Administración</Text>

      {/*Solicitudes de profesor */}
      <Text style={styles.sectionTitle}>Solicitudes de profesor</Text>
      {teachers.length === 0 ? (
        <Text style={styles.empty}>No hay solicitudes pendientes.</Text>
      ) : (
        teachers.map((t) => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.name}>{t.full_name}</Text>
            <Text style={styles.desc}>Rol actual: {t.role}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#1B998B" }]}
                onPress={() => handleApproveTeacher(t.id)}
              >
                <Text style={styles.buttonText}>Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#E63946" }]}
                onPress={() => handleRejectTeacher(t.id)}
              >
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/*Cursos pendientes */}
      <Text style={styles.sectionTitle}>Cursos pendientes</Text>
      {courses.filter((c) => c.status === "pending").length === 0 ? (
        <Text style={styles.empty}>No hay cursos pendientes.</Text>
      ) : (
        courses
          .filter((c) => c.status === "pending")
          .map((course) => (
            <View key={course.id} style={styles.card}>
              <Text style={styles.name}>{course.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {course.description || "Sin descripción"}
              </Text>
              <Text style={styles.desc}>Precio: ${course.price}</Text>
              <Text style={styles.status}>Estado: {course.status}</Text>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#0B7077" }]}
                  onPress={() => handleApproveCourse(course.id)}
                >
                  <Text style={styles.buttonText}>Publicar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#E63946" }]}
                  onPress={() => handleRejectCourse(course.id)}
                >
                  <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
      )}
    </ScrollView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F6F5", padding: 20 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#0B7077",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  backText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0B7077",
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E86A33",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#0B7077", marginBottom: 5 },
  desc: { fontSize: 14, color: "#555", marginBottom: 8 },
  status: { fontWeight: "600", marginBottom: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  empty: { color: "#777", fontStyle: "italic", marginBottom: 10 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D2E6E4",
  },
  loaderText: { marginTop: 10, color: "#0B7077", fontWeight: "600" },
});
