import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

export default function InfoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  const infoItems = [
    {
      id: 1,
      icon: require("../../assets/icon.png"),
      text: "Nuestros instructores son profesionales con experiencia real en la industria, comprometidos con tu aprendizaje.",
    },
    {
      id: 2,
      icon: require("../../assets/icon.png"),
      text: "Ofrecemos cursos prácticos y actualizados, diseñados para que desarrolles habilidades aplicables desde el primer día.",
    },
    {
      id: 3,
      icon: require("../../assets/icon.png"),
      text: "Formá parte de una comunidad activa de estudiantes y docentes que comparten conocimiento y oportunidades.",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >

      <View style={[styles.imageContainer, { width: isMobile ? "100%" : "45%" }]}>
        <Image
          source={require("../../assets/Teacher.png")}
          style={styles.image}
        />
      </View>


      <View style={[styles.textContainer, { width: isMobile ? "100%" : "50%" }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Nuestro equipo</Text>
        </View>

        <Text style={styles.title}>Enseñamos con pasión y experiencia</Text>

        {infoItems.map((item) => (
          <View key={item.id} style={styles.infoRow}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.infoText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F0FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeText: {
    color: "#0B7077",
    fontWeight: "bold",
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E86A33",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 12,
    resizeMode: "contain",
  },
  infoText: {
    flex: 1,
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
  },
});
