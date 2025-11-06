import React, { useEffect, useContext, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/SupaBase";

export default function AuthCallbackScreen() {
  const navigation = useNavigation();
  const { session } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("Procesando callback OAuth");

        //En movil, dejamos que el listener maneje el login y redirigimos rápido
        if (Platform.OS !== "web") {
          console.log("[CALLBACK] 📱 Detectado móvil, esperando sesión...");
          setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          }, 300);
          return;
        }

        //En web, procesar tokens del hash/query
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);

        const access_token =
          hashParams.get("access_token") || queryParams.get("access_token");
        const refresh_token =
          hashParams.get("refresh_token") || queryParams.get("refresh_token");
        const error =
          hashParams.get("error") || queryParams.get("error_description");

        if (error) {
          console.error("Error en OAuth:", error);
          setLoading(false);
          navigation.replace("Login");
          return;
        }

        if (access_token) {
          console.log("recibidos, estableciendo sesión...");

          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || "",
          });

          if (sessionError) {
            console.error("Error al establecer sesión:", sessionError);
            setLoading(false);
            navigation.replace("Login");
            return;
          }

          console.log("Sesión establecida correctamente");

          // Limpia el hash de la URL para evitar reentradas
          if (typeof window !== "undefined") {
            window.history.replaceState({}, document.title, window.location.pathname);
          }

          //Espera mínima antes de redirigir
          setTimeout(() => {
            setLoading(false);
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          }, 120); 
        } else {
          console.warn("No se recibieron tokens, volviendo al login");
          setLoading(false);
          navigation.replace("Login");
        }
      } catch (err) {
        console.error("Error procesando callback:", err);
        setLoading(false);
        navigation.replace("Login");
      }
    };

    handleOAuthCallback();
  }, [navigation]);

  //Si ya hay sesión activa, redirigir inmediata
  useEffect(() => {
    if (session) {
      console.log("Sesión ya activa, redirigiendo...");
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  }, [session, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0B7077" />
      <Text style={styles.text}>
        {loading
          ? "Completando inicio de sesión..."
          : "Redirigiendo a tu cuenta..."}
      </Text>
      <Text style={styles.subtext}>Por favor espera unos segundos</Text>
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
