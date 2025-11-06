import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";

export default function AdminPanelScreen() {
  const { session } = useContext(AuthContext);
  const navigation = useNavigation();

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = "https://onlearn-api.onrender.com/api";

  // Obtener todos los cursos
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error al cargar cursos",
        text2: err.message,
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  // Obtener profesores pendientes de aprobación
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_URL}/users/pending-teachers`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error al cargar profesores",
        text2: err.message,
      });
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Obtener todos los usuarios registrados
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error al cargar usuarios",
        text2: err.message,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
    fetchUsers();
  }, []);

  // Aprobar profesor
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
        text2: "Ahora puede crear cursos.",
      });
      fetchTeachers();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  // Rechazar profesor
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

  // Aprobar curso
  const handleApproveCourse = async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "No se pudo aprobar el curso");
      Toast.show({
        type: "success",
        text1: "Curso publicado",
        text2: "Ya está visible en la plataforma.",
      });
      fetchCourses();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  // Rechazar curso
  const handleRejectCourse = async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "No se pudo rechazar el curso");
      Toast.show({
        type: "info",
        text1: "Curso rechazado",
        text2: "El curso fue marcado como rechazado.",
      });
      fetchCourses();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  // Mostrar modal de confirmación de eliminación de usuario
  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setConfirmVisible(true);
  };

  // Eliminar usuario confirmado
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el usuario");
      Toast.show({ type: "success", text1: "Usuario eliminado correctamente" });
      fetchUsers();
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    } finally {
      setConfirmVisible(false);
      setSelectedUser(null);
    }
  };

  // Mostrar loader mientras se cargan datos
  if (loadingCourses || loadingTeachers || loadingUsers) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton
        onPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("Home")
        }
      />

      <Text style={styles.title}>Panel de Administración</Text>

      {/* Sección de solicitudes de profesor */}
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

      {/* Sección de cursos pendientes */}
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

      {/* Sección de gestión de usuarios */}
      <Text style={styles.sectionTitle}>Gestión de usuarios</Text>
      {users.length === 0 ? (
        <Text style={styles.empty}>No hay usuarios registrados.</Text>
      ) : (
        users.map((u) => (
          <View key={u.id} style={styles.card}>
            <Text style={styles.name}>{u.full_name || "Sin nombre"}</Text>
            <Text style={styles.desc}>Rol: {u.role}</Text>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#E63946", marginTop: 10 },
              ]}
              onPress={() => confirmDeleteUser(u)}
            >
              <Text style={styles.buttonText}>Eliminar usuario</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={styles.modalText}>
              ¿Seguro que querés eliminar{"\n"}“
              {selectedUser?.full_name || "este usuario"}”?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E63946" }]}
                onPress={handleDeleteUser}
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
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F6F5", padding: 20 },
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
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
