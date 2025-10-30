import React, { useEffect, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/SupaBase";

export default function AuthCallbackScreen() {
  const navigation = useNavigation();
  const { session } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("[CALLBACK] Procesando callback OAuth...");

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const error = hashParams.get("error");
        const error_description = hashParams.get("error_description");

        console.log("[CALLBACK] Parámetros:", {
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          error,
          error_description,
        });

        if (error) {
          console.error("[CALLBACK] Error en OAuth:", error_description);

          navigation.navigate("Login" as never);
          return;
        }

        if (access_token) {
          console.log("[CALLBACK] Tokens recibidos, estableciendo sesión...");

          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || "",
          });

          if (sessionError) {
            console.error("[CALLBACK] Error al establecer sesión:", sessionError);
            navigation.navigate("Login" as never);
            return;
          }

          console.log("[CALLBACK] Sesión establecida exitosamente");

          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" as never }],
            });
          }, 500);
        } else {
          navigation.navigate("Login" as never);
        }
      } catch (err) {
        navigation.navigate("Login" as never);
      }
    };

    handleOAuthCallback();
  }, [navigation]);


  useEffect(() => {
    if (session) {
  
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" as never }],
      });
    }
  }, [session, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0B7077" />
      <Text style={styles.text}>Completando inicio de sesión...</Text>
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
});