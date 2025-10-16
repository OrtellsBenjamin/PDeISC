import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AuthCallbackScreen() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          navigation.replace("Login");
          return;
        }

        const response = await fetch("http://localhost:8081/auth/google/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success && data.user) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Welcome", params: { user: data.user } }],
          });
        } else {
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error en login Google:", error);
        navigation.replace("Login");
      }
    };

    handleGoogleCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20 }}>Procesando login con Google...</Text>
    </View>
  );
}
