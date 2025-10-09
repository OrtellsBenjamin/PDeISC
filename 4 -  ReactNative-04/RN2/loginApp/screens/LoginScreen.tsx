import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from "react-native";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;
type Props = { navigation: LoginScreenNavigationProp };

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { width, height } = Dimensions.get("window");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });


  const validateUsername = (text: string) => /^[A-Za-z]+$/.test(text);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Completa todos los campos");
      return;
    }

    if (!validateUsername(username)) {
      setError("Usuario solo puede contener letras");
      return;
    }

    try {
      const response = await fetch("http://10.0.13.211:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Error de conexión al servidor");
        return;
      }

      const data = await response.json();
      if (data.success) {
        navigation.replace("Welcome", { user: data.user });
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("No se pudo conectar al servidor");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { width: width * 0.85 }]}>
          <Text style={styles.title}>Acceso al Sistema</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={(text) => {
              // solo letras, elimina números y caracteres especiales
              const cleanText = text.replace(/[^A-Za-z]/g, "");
              setUsername(cleanText);
            }}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", justifyContent: "center" },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: { 
    backgroundColor: "#1e1e1e", 
    borderRadius: 16, 
    padding: 25, 
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: { fontSize: 24, fontFamily: "Montserrat_700Bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  input: { fontFamily: "Montserrat_400Regular", borderWidth: 1, borderColor: "#555", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#121212", color: "#fff" },
  button: { backgroundColor: "#6200ee", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { fontFamily: "Montserrat_700Bold", color: "#fff", fontSize: 16 },
  error: { color: "#ff5555", textAlign: "center", marginBottom: 10, fontFamily: "Montserrat_400Regular" },
});
