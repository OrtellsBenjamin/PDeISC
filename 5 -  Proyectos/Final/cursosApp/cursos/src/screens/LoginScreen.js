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
import { Ionicons } from "@expo/vector-icons";


const HOME_ROUTE = "Home";

export default function LoginScreen() {
  const { signInEmail, signInWithGoogle, session } = useContext(AuthContext);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    BricolageGrotesque_700Bold,
  });

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

  // 👇 Cambio aquí: se muestra el loader sin cortar el orden de hooks
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: "#D2E6E4" }}>
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
              { flexDirection: isWide ? "row" : "column" },
            ]}
          >
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

              <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>o</Text>
                <View style={styles.separatorLine} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.googleText}>Iniciar sesión con Google</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Register")} activeOpacity={0.7}>
                <Text style={styles.linkText}>
                  ¿No tenés cuenta?{" "}
                  <Text style={styles.highlight}>Creá una ahora</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Image
              source={require("../../assets/Teacher.png")}
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
    paddingHorizontal: 60,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    maxWidth:Platform.select({
      web: 400,
      android:350,
    }),
    marginTop:Platform.select({
      web:0,
      android:60,
    }),
    width: "70%",
    marginBottom:Platform.select({
      web:0,
      android:-60,
    }),
  },
  sideImage: {
    opacity: 0.95,
  },
  title: {
    fontSize: 28,
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
    width:Platform.select({
      web: "100%",
      android:300,
    }),
    backgroundColor: "#F2F6F5",
    borderWidth: 1.5,
    borderColor: "#D2E6E4",
    paddingVertical: 12,
    paddingHorizontal: Platform.select({
      web:20,
      android:15,
    }),
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 15,
    color: "#333",
  },
  loginButton: {
    width:Platform.select({
      web: "100%",
      android:300,
    }),
    backgroundColor: "#0B7077",
    paddingVertical: 14,
    borderRadius: 10,
    padding:30,
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
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D2E6E4",
  },
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
    paddingHorizontal: 12,
    width: "100%",
    marginBottom: 10,
  },
  googleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
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
