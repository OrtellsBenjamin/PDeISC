import React, { useContext, useMemo, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Camera } from "expo-camera";  // <-- IMPORTANTE PARA DEV CLIENT

// 🎨 Estilo global unificado para Toasts
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#0B7077",
        backgroundColor: "#E9F6F5",
        borderRadius: 10,
        borderLeftWidth: 6,
        minHeight: 70
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#0B7077"
      }}
      text2Style={{
        fontSize: 14,
        color: "#0B7077",
        opacity: 0.8,
        marginTop: 4
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#E63946",
        backgroundColor: "#FFECEA",
        borderRadius: 10,
        borderLeftWidth: 6,
        minHeight: 70
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#E63946"
      }}
      text2Style={{
        fontSize: 14,
        color: "#A00",
        opacity: 0.8,
        marginTop: 4
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#E86A33",
        backgroundColor: "#FFF7F1",
        borderRadius: 10,
        borderLeftWidth: 6,
        minHeight: 70
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#E86A33"
      }}
      text2Style={{
        fontSize: 14,
        color: "#E86A33",
        opacity: 0.8,
        marginTop: 4
      }}
    />
  )
};

// 🔗 Deep linking
const linking = {
  prefixes: ["onlearn://", "https://onlearn.com", "http://localhost"],
  config: {
    screens: {
      Home: "home",
      Login: "login",
      Register: "register",
      AuthCallback: "auth/callback",
      CourseDetail: "course/:id",
      MyCourses: "mycourses"
    }
  }
};

function AppContent() {
  const { loading } = useContext(AuthContext);

  // 👉 SOLICITAR PERMISO DE CÁMARA PARA QUE FUNCIONE EL QR
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log("Camera permission:", status);
      } catch (e) {
        console.log("Error al pedir permiso de cámara:", e);
      }
    })();
  }, []);

  const showOverlay = useMemo(() => loading, [loading]);

  return (
    <NavigationContainer linking={linking}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <RootNavigator />

        {showOverlay && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#0B7077" />
              <Text style={styles.loadingText}>Cargando plataforma…</Text>
            </View>
          </View>
        )}

        <Toast config={toastConfig} />
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
 loadingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,255,255,0.65)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
},

  loadingCard: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  loadingText: { marginTop: 10, color: "#0B7077", fontWeight: "600" }
});
