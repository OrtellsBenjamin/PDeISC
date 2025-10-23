import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";

function ButtonWithShadow({ children, onPress, style, half = false }) {
  const anim = useRef(new Animated.Value(0)).current;

  const pressIn = () =>
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 150,
      bounciness: 0,
    }).start();

  const pressOut = (cb) =>
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 100,
      bounciness: 6,
    }).start(({ finished }) => finished && typeof cb === "function" && cb());

  const translate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <View style={[styles.btnWrap, half && styles.halfButton]}>
      <View style={styles.btnShadow} />
      <TouchableWithoutFeedback
        onPressIn={pressIn}
        onPressOut={() => pressOut(onPress)}
      >
        <Animated.View
          style={[
            styles.buttonBase,
            { transform: [{ translateX: translate }, { translateY: translate }] },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function ProfileScreen({ userInfo, setUserInfo }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userInfo?.name || "");
  const [email] = useState(userInfo?.email || "");
  const [photo, setPhoto] = useState(userInfo?.picture || null);
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [location, setLocation] = useState(userInfo?.location || null);
  const [document, setDocument] = useState(userInfo?.document || null);

  const originalRef = useRef({ name, phone, photo, location, document });
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const { width } = useWindowDimensions();
  const { height: screenHeight } = Dimensions.get("window");
  const isTabletOrPc = width >= 768;

  const pickImage = async () => {
    if (Platform.OS === "web") {
      imageInputRef.current?.click();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleImageChangeWeb = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const pickDocument = async () => {
    if (Platform.OS === "web") {
      documentInputRef.current?.click();
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });
    if (result.type === "success") {
      setDocument(result);
      Toast.show({
        type: "info",
        text1: "Documento cargado",
        text2: result.name,
        position: "top",
        visibilityTime: 1500,
      });
    }
  };

  const handleDocumentChangeWeb = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocument(file);
    Toast.show({
      type: "info",
      text1: "Documento cargado",
      text2: file.name,
      position: "top",
      visibilityTime: 1500,
    });
  };

  const handleRemoveDocument = () => {
    setDocument(null);
    Toast.show({
      type: "info",
      text1: "Documento eliminado",
      position: "top",
      visibilityTime: 1500,
    });
  };

  const handleGetLocation = async () => {
    if (Platform.OS === "web") {
      if (!("geolocation" in navigator)) {
        Toast.show({
          type: "error",
          text1: "Tu navegador no soporta geolocalización",
          position: "top",
          visibilityTime: 1500,
        });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          Toast.show({
            type: "success",
            text1: "Ubicación actualizada",
            position: "top",
            visibilityTime: 1500,
          });
        },
        () =>
          Toast.show({
            type: "error",
            text1: "No se pudo obtener la ubicación",
            position: "top",
            visibilityTime: 1500,
          })
      );
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permiso denegado",
          text2: "Activa la ubicación en configuración.",
          position: "top",
          visibilityTime: 1500,
        });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });
      Toast.show({
        type: "success",
        text1: "Ubicación actualizada",
        position: "top",
        visibilityTime: 1500,
      });
    }
  };

  const handleSave = () => {
    const updatedProfile = { ...userInfo, name, email, phone, photo, location, document };
    setUserInfo(updatedProfile);
    originalRef.current = { name, phone, photo, location, document };
    setEditing(false);
    Toast.show({
      type: "success",
      text1: "Cambios guardados correctamente",
      position: "top",
      visibilityTime: 1500,
    });
  };

  const handleCancel = () => {
    const o = originalRef.current;
    setName(o.name);
    setPhone(o.phone);
    setPhoto(o.photo);
    setLocation(o.location);
    setDocument(o.document);
    setEditing(false);
    Toast.show({
      type: "info",
      text1: "Cambios descartados",
      position: "top",
      visibilityTime: 1500,
    });
  };

  const logout = () => setUserInfo(null);

  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={[styles.container, { minHeight: screenHeight }]}>
        <View style={styles.cardShadow} />
        <View style={styles.card}>
          <Text style={styles.title}>Mi Perfil</Text>

          {photo && <Image source={{ uri: photo }} style={styles.image} />}

          {Platform.OS === "web" && (
            <>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChangeWeb}
              />
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={handleDocumentChangeWeb}
              />
            </>
          )}

          {!editing ? (
            <>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.text}>{name}</Text>

              <Text style={styles.label}>Correo</Text>
              <Text style={styles.text}>{email}</Text>

              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.text}>{phone || "No especificado"}</Text>

              <Text style={styles.label}>Ubicación</Text>
              {location ? (
                <Text style={styles.text}>
                  Lat: {location.latitude?.toFixed(4)} | Lng: {location.longitude?.toFixed(4)}
                </Text>
              ) : (
                <Text style={styles.text}>Sin ubicación</Text>
              )}

              <Text style={styles.label}>Documento</Text>
              {document ? (
                <Text style={styles.text}>{document.name || "Documento cargado"}</Text>
              ) : (
                <Text style={styles.text}>Ningún documento cargado</Text>
              )}

              <ButtonWithShadow half={isTabletOrPc} onPress={() => setEditing(true)}>
                <Text style={styles.btnLabel}>Editar perfil</Text>
              </ButtonWithShadow>

              <ButtonWithShadow half={isTabletOrPc} onPress={logout}>
                <Text style={styles.btnLabel}>Cerrar sesión</Text>
              </ButtonWithShadow>
            </>
          ) : (
            <>
              <ButtonWithShadow half={isTabletOrPc} onPress={pickImage}>
                <Text style={styles.btnLabel}>Cambiar foto</Text>
              </ButtonWithShadow>

              <Text style={styles.label}>Nombre</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />

              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Ej: +54 9 11 1234 5678"
              />

              <Text style={styles.label}>Ubicación</Text>
              {location ? (
                <Text style={styles.text}>
                  Lat: {location.latitude?.toFixed(4)} | Lng: {location.longitude?.toFixed(4)}
                </Text>
              ) : (
                <Text style={styles.text}>Sin ubicación</Text>
              )}
              <ButtonWithShadow half={isTabletOrPc} onPress={handleGetLocation}>
                <Text style={styles.btnLabel}>Obtener ubicación</Text>
              </ButtonWithShadow>

              <Text style={styles.label}>Documento</Text>
              {document ? (
                <View style={styles.documentRow}>
                  <Text style={styles.text}>{document.name || "Documento cargado"}</Text>
                  <TouchableOpacity onPress={handleRemoveDocument} style={styles.removeBtn}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.text}>Ningún documento cargado</Text>
              )}

              <ButtonWithShadow half={isTabletOrPc} onPress={pickDocument}>
                <Text style={styles.btnLabel}>Subir documento</Text>
              </ButtonWithShadow>

              <ButtonWithShadow half={isTabletOrPc} onPress={handleSave}>
                <Text style={styles.btnLabel}>Guardar cambios</Text>
              </ButtonWithShadow>

              <ButtonWithShadow half={isTabletOrPc} onPress={handleCancel}>
                <Text style={styles.btnLabel}>Cancelar</Text>
              </ButtonWithShadow>
            </>
          )}
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, position: "relative" },
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    position: "relative",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000",
    width: "100%",
    maxWidth: 600,
    zIndex: 2,
  },
  cardShadow: {
    position: "absolute",
    width: "90%",
    maxWidth: 600,
    height: "85%",
    backgroundColor: "#000",
    borderRadius: 8,
    transform: [{ translateX: 8 }, { translateY: 8 }],
    zIndex: 1,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "600", alignSelf: "flex-start", marginTop: 14 },
  text: { alignSelf: "flex-start", color: "#333" },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#5c5c5cff",
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
    color: "#000",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    alignSelf: "center",
  },
  buttonBase: {
    backgroundColor: "#909eeeff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnLabel: { color: "#fff", fontWeight: "700", fontSize: 16 },
  btnWrap: { position: "relative", width: "100%", marginTop: 18, alignItems: "center" },
  btnShadow: {
    position: "absolute",
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  halfButton: { width: "50%", alignSelf: "center" },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: { color: "#fff", fontWeight: "bold" },
});
