import React, { useEffect, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/SupaBase";

export default function AuthCallbackScreen() {
  const navigation = useNavigation();
  const { session } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("[CALLBACK] 🔄 Procesando callback OAuth...");

        // Solo procesar en web (donde tenemos window.location)
        if (Platform.OS !== 'web') {
          console.log("[CALLBACK] ℹ️ No es web, redirigiendo...");
          navigation.navigate("Home");
          return;
        }

        // Obtener los parámetros del hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const error = hashParams.get("error");
        const error_description = hashParams.get("error_description");

        // También revisar query params (por si vienen ahí)
        const queryParams = new URLSearchParams(window.location.search);
        const queryError = queryParams.get("error");
        const queryErrorCode = queryParams.get("error_code");
        const queryErrorDesc = queryParams.get("error_description");

        console.log("[CALLBACK] 📦 Hash params:", {
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          error,
          error_description,
        });

        console.log("[CALLBACK] 📦 Query params:", {
          error: queryError,
          error_code: queryErrorCode,
          error_description: queryErrorDesc,
        });

        // Si hay error en query params pero tenemos tokens, ignorar el error
        if (access_token && (queryError || error)) {
          console.log("[CALLBACK] ⚠️ Hay error pero también tokens, procesando tokens...");
        } else if (queryError || error) {
          console.error("[CALLBACK] ❌ Error en OAuth:", error_description || queryErrorDesc);
          navigation.navigate("Login");
          return;
        }

        if (access_token) {
          console.log("[CALLBACK] ✅ Tokens recibidos, estableciendo sesión...");

          // Establecer la sesión con los tokens
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || "",
          });

          if (sessionError) {
            console.error("[CALLBACK] ❌ Error al establecer sesión:", sessionError);
            navigation.navigate("Login");
            return;
          }

          console.log("[CALLBACK] 🎉 Sesión establecida exitosamente");
          console.log("[CALLBACK] 👤 Usuario:", data.user?.email);

          // Limpiar la URL (quitar los tokens del hash)
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          // Esperar un momento para que el contexto se actualice
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }, 500);
        } else {
          console.error("[CALLBACK] ⚠️ No se recibieron tokens en el hash");
          console.log("[CALLBACK] 🔍 URL completa:", window.location.href);
          navigation.navigate("Login");
        }
      } catch (err) {
        console.error("[CALLBACK] 💥 Error procesando callback:", err);
        navigation.navigate("Login");
      }
    };

    handleOAuthCallback();
  }, [navigation]);

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (session) {
      console.log("[CALLBACK] ✅ Sesión ya activa, redirigiendo...");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [session, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0B7077" />
      <Text style={styles.text}>Completando inicio de sesión...</Text>
      <Text style={styles.subtext}>Por favor espera un momento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2E6E4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#0B7077",
    fontWeight: "600",
    textAlign: "center",
  },
  subtext: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});