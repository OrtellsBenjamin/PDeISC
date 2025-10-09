import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type WelcomeScreenRouteProp = RouteProp<RootStackParamList, "Welcome">;
type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

type Props = { route: WelcomeScreenRouteProp };

export default function WelcomeScreen({ route }: Props) {
  const { user } = route.params;
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  

  const handleLogout = () => {
    navigation.replace("Login"); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido, {user.username}!</Text>
      <Text style={styles.subtitle}>¡Has ingresado correctamente al sistema!</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111", padding: 20 },
  title: { fontSize: 24, fontFamily: "Montserrat_700Bold", color: "#fff", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, fontFamily: "Montserrat_400Regular", color: "#ccc", textAlign: "center", marginBottom: 30 },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
});
