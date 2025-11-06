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
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import BackButton from "../components/BackButton";

const HOME_ROUTE = "Home";

export default function RegisterScreen() {
  const { signUpEmail, session } = useContext(AuthContext);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    BricolageGrotesque_700Bold,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [pendingRedirect, setPendingRedirect] = useState(false);
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

  const onRegister = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Por favor completá todos los campos.",
      });
      return;
    }

    try {
      const result = await signUpEmail(email, password, name, role);
      const possibleError = result?.error || result?.data?.error;

      if (possibleError) {
        Toast.show({
          type: "error",
          text1: "Error al crear la cuenta",
          text2: possibleError.message || "Intentá nuevamente.",
        });
        return;
      }

      if (role === "pending_instructor") {
        Toast.show({
          type: "info",
          text1: "Solicitud enviada 🧭",
          text2: "Tu solicitud será revisada por un administrador.",
          visibilityTime: 3000,
        });

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: HOME_ROUTE }],
          });
        }, 3000);
      } else {
        setPendingRedirect(true);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error al crear la cuenta",
        text2: e?.message || "Intentá nuevamente.",
      });
    }
  };

  useEffect(() => {
    if (!pendingRedirect) return;
    if (session) {
      Toast.show({
        type: "success",
        text1: "Cuenta creada 🎉",
        text2: "Te estamos redirigiendo a Onlearn...",
        visibilityTime: 1600,
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

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: "#D2E6E4" }}
    >
      <BackButton />

      <View style={styles.container}>
        {!fontsLoaded ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>Unite a Onlearn</Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#888"
              />
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

              {/* Selector de rol */}
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.roleButton, role === "client" && styles.roleButtonActive]}
                  onPress={() => setRole("client")}
                >
                  <Text
                    style={[styles.roleText, role === "client" && styles.roleTextActive]}
                  >
                    Estudiante
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === "pending_instructor" && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole("pending_instructor")}
                >
                  <Text
                    style={[
                      styles.roleText,
                      role === "pending_instructor" && styles.roleTextActive,
                    ]}
                  >
                    Profesor
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={onRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.loginText}>Crear cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>
                  ¿Ya tenés cuenta? <Text style={styles.highlight}>Iniciá sesión</Text>
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
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1.4,
    borderColor: "#D2E6E4",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F8FAFB",
  },
  roleButtonActive: {
    backgroundColor: "#0B7077",
    borderColor: "#0B7077",
  },
  roleText: {
    color: "#555",
    fontFamily: "Montserrat_700Bold",
    fontWeight: "600",
  },
  roleTextActive: { color: "#fff" },
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
