import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { width } = useWindowDimensions();


  const containerWidth = width > 450 ? 550 : "90%";

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
      const response = await fetch("http://192.168.100.71:3000/login", {
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
      style={{ flex: 1, justifyContent: "center" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            position: "relative",
            width: containerWidth,
            alignSelf: "center",
          }}
        >
      
          <View
            style={{
              position: "absolute",
              top: 5, 
              left: 5, 
              right: -6,
              bottom: -6,
              backgroundColor: "black",
              borderRadius: 8,
              zIndex: -1,
            }}
          />
      
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
              Acceso al Sistema
            </Text>

            <Text style={{ marginBottom: 10 }}>Usuario</Text>
            <TextInput
              placeholder="Lucas"
              placeholderTextColor="#747474ff"
              value={username}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^A-Za-z]/g, "");
                setUsername(cleanText);
              }}
              autoCapitalize="none"
              style={{
                color: "#000000ff",
                borderWidth: 2,
                borderColor: "#575656ff",
                padding: 10,
                marginBottom: 10,
              }}
            />

            <Text style={{ marginBottom: 10 }}>Contraseña</Text>
            <TextInput
              placeholder="********"
              placeholderTextColor="#747474ff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                color: "#000000ff",
                borderWidth: 2,
                borderColor: "#575656ff",
                padding: 10,
                marginBottom: 10,
              }}
            />

            {error ? (
              <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
                {error}
              </Text>
            ) : null}

            <View style={{ alignItems: "center", marginTop: 10 }}>
              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  backgroundColor: "#FD5D5E",
                  padding: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60%",
                  maxWidth: 200,
                  borderColor: "#575656ff",
                  borderWidth:2
                }}
              >
                <Text style={{ color: "#fff" }}>Ingresar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
