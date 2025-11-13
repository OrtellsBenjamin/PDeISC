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
  Platform,
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import Header from "../components/Header";


const HOME_ROUTE = "Home";

export default function LoginScreen() {
  const { signInEmail, signInWithGoogle, session, signInWithGitHub } =
    useContext(AuthContext);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    BricolageGrotesque_700Bold,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailLoginOK, setEmailLoginOK] = useState(false);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width <= 900;

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

  const onLogin = async () => {
    if (isSubmitting) return;
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Por favor ingresá tu correo y contraseña.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signInEmail(email, password);
      const possibleError = result?.error || result?.data?.error;

      if (!result?.ok) {
        Toast.show({
          type: "error",
          text1: "Credenciales incorrectas",
          text2:
            result?.error?.message ||
            "El correo o la contraseña no son válidos.",
        });
        setIsSubmitting(false);
        return;
      }

      //Si el login fue exitoso, no esperamos al evento global
      setPendingRedirect(true);
      setEmailLoginOK(true);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: e?.message || "Intentá nuevamente.",
      });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!pendingRedirect) return;
    if (session || emailLoginOK) {
      Toast.show({
        type: "success",
        text1: "Bienvenido 👋",
        text2: "Redirigiendo a Onlearn...",
        visibilityTime: 1200,
      });

      const t = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: HOME_ROUTE }],
        });
        setIsSubmitting(false);
      }, 700); 

      return () => clearTimeout(t);
    }
  }, [pendingRedirect, session, emailLoginOK, navigation]);

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      //En web redirige; en móvil vuelve por deep link.
      // Si el usuario cancela, abajo se re-habilita con el Toast de cancel.
      setTimeout(() => setIsSubmitting(false), 1500);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error con Google",
        text2: e?.message || "Intentá nuevamente.",
      });
      setIsSubmitting(false);
    }
  };

  const handleGitHubLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signInWithGitHub();
      setTimeout(() => setIsSubmitting(false), 1500);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  return (
  <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    style={{ backgroundColor: "#D2E6E4" }}
  >
    
    <BackButton />

    <View style={styles.container}>
      {!fontsLoaded ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#0B7077", fontWeight: "700", fontSize: 16 }}>
            Cargando fuentes...
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.responsiveLayout,
            {
              flexDirection: isMobile ? "row" : "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
                width: isMobile ? "90%" : 400,
                marginBottom: isMobile ? 30 : 0,
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

            <TouchableOpacity
              style={[styles.loginButton, isSubmitting && { opacity: 0.6 }]}
              onPress={onLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.loginText}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>o</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.85}
              disabled={isSubmitting}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.googleText}>Iniciar sesión con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.googleButton,
                { backgroundColor: "#24292e", marginTop: 10 },
                isSubmitting && { opacity: 0.6 },
              ]}
              onPress={handleGitHubLogin}
              activeOpacity={0.85}
              disabled={isSubmitting}
            >
              <Ionicons
                name="logo-github"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.googleText}>Continuar con GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={styles.linkText}>
                ¿No tenés cuenta?{" "}
                <Text style={styles.highlight}>Creá una ahora</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../../assets/Teacher.png")}
              style={[
                styles.sideImage,
                {
                  width: isMobile ? 280 : 420,
                  height: isMobile ? 240 : 420,
                  marginTop: isMobile ? 0 : 0,
                  marginBottom: isMobile ? 40 : 0,
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      {/*Overlay centrado cuando se está logueando */}
      {isSubmitting && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(255,255,255,0.6)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            },
          ]}
        >
        </View>
      )}
      
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
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 50,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  sideImage: { opacity: 0.95 },
  title: {
    fontSize: Platform.select({ web: 28, default: 24 }),
    color: "#0B7077",
    marginBottom: 6,
    fontFamily: "BricolageGrotesque_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 25,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F2F6F5",
    borderWidth: 1.5,
    borderColor: "#D2E6E4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 15,
    color: "#333",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#0B7077",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "100%",
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: "#D2E6E4" },
  separatorText: {
    marginHorizontal: 10,
    color: "#888",
    fontFamily: "Montserrat_400Regular",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4437",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 40,
    width: "100%",
    marginBottom: 10,
  },
  googleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: Platform.select({ web: 14, android: 12, ios: 15 }),
    fontFamily: "Montserrat_400Regular",
  },
  linkText: {
    marginTop: 18,
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "BricolageGrotesque_700Bold",
  },
  highlight: {
    color: "#FF7A00",
    fontFamily: "Montserrat_700Bold",
  },
});
