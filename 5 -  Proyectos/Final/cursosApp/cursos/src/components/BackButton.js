import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({ label = "Volver", onPress, style }) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) return onPress();
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={22} color="#0B7077" />
        <Text style={styles.backText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 50 : 25,
    marginLeft: 15,
    marginTop: 55,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#0B7077",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 4,
  },
});
