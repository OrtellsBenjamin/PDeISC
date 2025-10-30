import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons"; // 👈 agregado

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
`;

const HOME_ROUTE = "Home";

export default function LoginScreen() {
  const { signInEmail, signInWithGoogle, session } = useContext(AuthContext); // 👈 agregamos signInWithGoogle
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 🔹 Inicio de sesión con email
  const onLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Por favor ingresá tu correo y contraseña.",
      });
      return;
    }

    try {
      const result = await signInEmail(email, password);
      const possibleError = result?.error || result?.data?.error;

      if (possibleError) {
        Toast.show({
          type: "error",
          text1: "Error al iniciar sesión",
          text2: possibleError.message || "Intentá nuevamente.",
        });
        return;
      }

      setPendingRedirect(true);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: e?.message || "Intentá nuevamente.",
      });
    }
  };

  // 🔹 Cuando se detecta sesión activa, redirige
  useEffect(() => {
    if (!pendingRedirect) return;
    if (session) {
      Toast.show({
        type: "success",
        text1: "Bienvenido 👋",
        text2: "Redirigiendo a Onlearn...",
        visibilityTime: 1500,
      });

      const t = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: HOME_ROUTE }],
        });
      }, 1200);

      return () => clearTimeout(t);
    }
  }, [pendingRedirect, session, navigation]);

  const isWide = width > 900;

  // 🔹 Inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error con Google",
        text2: e?.message || "Intentá nuevamente.",
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: "#D2E6E4" }}
    >
      <View style={styles.container}>
        <style>{fontImport}</style>

        <View
          style={[
            styles.responsiveLayout,
            { flexDirection: isWide ? "row" : "column" },
          ]}
        >
          {/* 🟢 Tarjeta de login */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
                width: isWide ? 400 : "90%",
              },
            ]}
          >
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>Bienvenido a Onlearn</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
              <Text style={styles.loginText}>Ingresar</Text>
            </TouchableOpacity>

            {/* 🔸 Separador visual */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>o</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* 🔹 Botón de Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.85}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.googleText}>Iniciar sesión con Google</Text>
            </TouchableOpacity>

            {/* 🔹 Enlace a registro */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                ¿No tenés cuenta?{" "}
                <Text style={styles.highlight}>Creá una ahora</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 🟣 Imagen ilustrativa */}
          <Image
            source={require("../../assets/teacher.svg")}
            style={[
              styles.sideImage,
              {
                width: isWide ? 420 : 280,
                height: isWide ? 420 : 240,
                marginTop: isWide ? 0 : 40,
                marginBottom: isWide ? 0 : 40,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2E6E4",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  responsiveLayout: {
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    maxWidth: 420,
  },
  sideImage: {
    opacity: 0.95,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0B7077",
    marginBottom: 6,
    fontFamily: "Bricolage Grotesque, sans-serif",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 25,
    fontFamily: "Montserrat, sans-serif",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F2F6F5",
    borderWidth: 1.4,
    borderColor: "#D2E6E4",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 14,
    fontFamily: "Montserrat, sans-serif",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#0B7077",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Montserrat, sans-serif",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    width: "100%",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D2E6E4",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#888",
    fontFamily: "Montserrat, sans-serif",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4437",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 10,
    width: "100%",
  },
  googleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Montserrat, sans-serif",
  },
  linkText: {
    marginTop: 20,
    color: "#555",
    fontSize: 14,
    fontFamily: "Bricolage Grotesque, sans-serif",
  },
  highlight: {
    color: "#FF7A00",
    fontWeight: "700",
    fontFamily: "Montserrat, sans-serif",
  },
});
