import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

// 🔹 Configuración global de estilo para los Toasts
const toastConfig = {
  // ✅ Toast de éxito
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#0B7077",
        borderRadius: 10,
        backgroundColor: "#E9F6F5",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#0B7077",
      }}
      text2Style={{
        fontSize: 14,
        color: "#333",
      }}
    />
  ),

  // ✅ Toast de error
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#FF7A00",
        borderRadius: 10,
        backgroundColor: "#FFF4EC",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#FF7A00",
      }}
      text2Style={{
        fontSize: 14,
        color: "#333",
      }}
    />
  ),

  // ✅ Toast personalizado con botones [Sí] / [No]
  info: ({ text1, text2, props }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderLeftColor: "#0B7077",
        borderLeftWidth: 6,
        padding: 14,
        borderRadius: 10,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text style={{ fontWeight: "bold", color: "#0B7077", marginBottom: 5 }}>
        ⚠️ {text1}
      </Text>
      {text2 ? (
        <Text style={{ color: "#333", marginBottom: 12 }}>{text2}</Text>
      ) : null}

      {props.showConfirm && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          {/* Primero el botón SÍ */}
          <TouchableOpacity
            onPress={props.onConfirm}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 6,
              backgroundColor: "#E63946",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Sí</Text>
          </TouchableOpacity>

          {/* Después el botón NO */}
          <TouchableOpacity
            onPress={props.onCancel}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              backgroundColor: "#E9F6F5",
            }}
          >
            <Text style={{ color: "#0B7077", fontWeight: "600" }}>No</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ),
};

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <RootNavigator />
        {/* 🔹 Toast global con la nueva config */}
        <Toast config={toastConfig} />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});