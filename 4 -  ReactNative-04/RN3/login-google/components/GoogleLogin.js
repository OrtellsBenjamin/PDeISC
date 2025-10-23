import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({ setUserInfo }) {
  const expoClientId = String(Constants?.expoConfig?.extra?.expoClientId ?? "");
  const androidClientId = String(Constants?.expoConfig?.extra?.androidClientId ?? "");
  const webClientId = String(Constants?.expoConfig?.extra?.webClientId ?? "");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId,
    androidClientId,
    webClientId,
    scopes: ["profile", "email"],
    extraParams: { prompt: "select_account" },
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === "success" && response.authentication?.accessToken) {
      const { accessToken } = response.authentication;

      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Usuario obtenido:", data);
          setUserInfo(data);
        })
        .catch((err) => console.error("❌ Error al obtener usuario:", err));
    } else if (response.type === "error") {
      console.error("Error en la autenticación:", response.error);
    }
  }, [response]);


  const anim = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 150,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 100,
      bounciness: 6,
    }).start();
  };

  const translate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <View style={styles.container}>
      <View style={styles.shadowBox} />

      <TouchableWithoutFeedback
        disabled={!request}
        onPressIn={pressIn}
        onPressOut={() => {
          pressOut();
          promptAsync();
        }}
      >
        <Animated.View
          style={[
            styles.button,
            { transform: [{ translateX: translate }, { translateY: translate }] },
          ]}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
            }}
            style={styles.googleIcon}
          />
          <Text style={styles.btnText}>Iniciar sesión con Google</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  shadowBox: {
    position: "absolute",
    width: 270,
    height: 48,
    backgroundColor: "black",
    borderRadius: 8,
    transform: [{ translateX: 5 }, { translateY: 5 }],
    zIndex: -1,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#5c5c5cff",
    gap: 10,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  btnText: {
    color: "#5c5c5cff",
    fontWeight: "700",
    fontSize: 16,
  },
});
