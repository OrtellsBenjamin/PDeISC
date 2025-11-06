import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; 

export default function HeroSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;
  const navigation = useNavigation(); 

  return (
    <View
      style={[
        styles.hero,
        {
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      <View style={styles.orangeShape} />
      <View
        style={[
          styles.left,
          {
            width: isMobile ? "100%" : "50%",
            alignItems: "flex-start",
          },
        ]}
      >
        <Text style={styles.tagline}>Nunca dejes de aprender</Text>
        <Text
          style={[
            styles.title,
            {
              fontSize: isMobile ? 32 : 48,
              textAlign: "left",
            },
          ]}
        >
          Desarrollá tus habilidades{"\n"}con cursos en línea en
        </Text>
        <Text
          style={[
            styles.brand,
            {
              fontSize: isMobile ? 36 : 52,
              textAlign: "left",
            },
          ]}
        >
          OnLearn
        </Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => navigation.navigate("AllCourses")} 
        >
          <Text style={styles.exploreText}>EXPLORAR CURSOS</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.right,
          {
            width: isMobile ? "100%" : "50%",
            alignItems: "flex-start",
            justifyContent: "center",
            marginTop: isMobile ? 40 : 0,
            marginLeft: isMobile ? 10 : 0,
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/Estudiante.png")}
            style={[
              styles.image,
              {
                width: isMobile ? 280 : 460,
                height: isMobile ? 280 : 460,
              },
            ]}
          />
          <View style={styles.floatingCard}>
            <Text style={styles.floatingText}>250k{"\n"}Estudiantes activos</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#F3F9FA",
    paddingVertical: 50,
    paddingHorizontal: 25,
    overflow: "hidden", 
    position: "relative",
  },

  orangeShape: {
    position: "absolute",
    top: -180, 
    right: -180, 
    width: 400, 
    height: 400, 
    backgroundColor: "#FF7A00", 
    borderTopLeftRadius: 500, 
    borderBottomLeftRadius: 500,
    transform: [{ rotate: "-15deg" }], 
    opacity: 0.95,
    zIndex: 0,
  },

  left: {
    gap: 10,
    zIndex: 2,
  },
  tagline: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },
  title: {
    color: "#0B7077",
    fontWeight: "700",
    lineHeight: 52,
  },
  brand: {
    color: "#0B7077",
    fontWeight: "800",
    marginBottom: 10,
  },
  exploreBtn: {
    backgroundColor: "#FF7A00",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 25,
    alignSelf: "flex-start",
  },
  exploreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statsIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    resizeMode: "contain",
  },
  statsText: {
    color: "#0B7077",
    fontWeight: "600",
    fontSize: 14,
  },
  right: {
    position: "relative",
    zIndex: 2,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    resizeMode: "contain",
    borderRadius: 20,
  },
  floatingCard: {
    position: "absolute",
    bottom: 20,
    right: 10,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingText: {
    color: "#0B7077",
    fontWeight: "700",
    textAlign: "center",
  },
});
