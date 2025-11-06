import React, { useEffect, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/SupaBase";

export default function AuthCallbackScreen() {
  const navigation = useNavigation();
  const { session, loading } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("[CALLBACK] Procesando callback OAuth...");
        console.log("[CALLBACK] Plataforma:", Platform.OS);

        // En entorno web: procesar los parámetros desde la URL
        if (Platform.OS === "web") {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const queryParams = new URLSearchParams(window.location.search);

          const access_token =
            hashParams.get("access_token") ||
            queryParams.get("access_token");
          const refresh_token =
            hashParams.get("refresh_token") ||
            queryParams.get("refresh_token");
          const error = hashParams.get("error") || queryParams.get("error");
          const error_description =
            hashParams.get("error_description") ||
            queryParams.get("error_description");

          console.log("[CALLBACK] Parámetros web:", {
            hasAccessToken: !!access_token,
            hasRefreshToken: !!refresh_token,
            error,
          });

          // Manejo de errores en la autenticación
          if (error) {
            console.error("[CALLBACK] Error OAuth:", error_description);
            navigation.navigate("Login" as never);
            return;
          }

          // Si hay tokens, establecer la sesión manualmente en Supabase
          if (access_token) {
            console.log("[CALLBACK] Estableciendo sesión web...");

            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token || "",
            });

            if (sessionError) {
              console.error("[CALLBACK] Error al establecer sesión:", sessionError);
              navigation.navigate("Login" as never);
              return;
            }

            console.log("[CALLBACK] Sesión establecida (web)");

            // Esperar a que AuthContext sincronice la sesión
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" as never }],
              });
            }, 1000);
            return;
          }
        }

        // En móvil: los tokens ya se procesaron en AuthContext
        console.log("[CALLBACK] Esperando sesión en móvil...");

        // Si después de 3 segundos no hay sesión, volver al login
        setTimeout(() => {
          if (!session) {
            console.warn("[CALLBACK] Timeout esperando sesión");
            navigation.navigate("Login" as never);
          }
        }, 3000);

      } catch (err) {
        console.error("[CALLBACK] Error procesando callback:", err);
        navigation.navigate("Login" as never);
      }
    };

    handleOAuthCallback();
  }, [navigation]);

  // Redirigir al Home cuando la sesión esté disponible
  useEffect(() => {
    if (session && !loading) {
      console.log("[CALLBACK] Sesión detectada, redirigiendo a Home...");

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" as never }],
        });
      }, 500);
    }
  }, [session, loading, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0B7077" />
      <Text style={styles.text}>Completando inicio de sesión...</Text>
      <Text style={styles.subtext}>
        {loading ? "Cargando perfil..." : "Redirigiendo..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2E6E4",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#0B7077",
    fontFamily: "Montserrat, sans-serif",
  },
  subtext: {
    marginTop: 10,
    fontSize: 14,
    color: "#0B7077",
    opacity: 0.7,
  },
});
