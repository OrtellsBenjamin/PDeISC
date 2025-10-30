import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CategoriesSection() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1024;
  const cardsPerRow = isMobile ? 1 : isTablet ? 2 : 4;

  const categories = [
    {
      id: 1,
      name: "Diseño",
      description:
        "Aprendé sobre diseño gráfico, UX/UI y herramientas creativas para destacar visualmente.",
      image: require("../../assets/diseño.png"),
    },
    {
      id: 2,
      name: "Negocios",
      description:
        "Cursos de liderazgo, marketing digital, finanzas y gestión para impulsar tu carrera.",
      image: require("../../assets/negocios.png"),
    },
    {
      id: 3,
      name: "Programación",
      description:
        "Desde los fundamentos hasta frameworks modernos. Convertite en un desarrollador completo.",
      image: require("../../assets/programacion.png"),
    },
    {
      id: 4,
      name: "Tecnología",
      description:
        "Explorá innovación digital, IA, ciberseguridad y las tendencias tecnológicas del futuro.",
      image: require("../../assets/Tecnologia.png"),
    },
  ];

  const handleCategoryPress = (categoryName) => {
    
    // Navega al AllCoursesScreen y pasa la categoría
    navigation.navigate("AllCourses", { selectedCategory: categoryName });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Explora por <Text style={styles.titleHighlight}>Categoría</Text>
      </Text>
      <Text style={styles.subtitle}>
        Descubrí los cursos más destacados según tu área de interés.
      </Text>

      <View
        style={[
          styles.grid,
          { justifyContent: isMobile ? "center" : "space-between" },
        ]}
      >
        {categories.map((cat) => {
          const scaleAnim = useRef(new Animated.Value(1)).current;
          const hoverAnim = useRef(new Animated.Value(0)).current;

          const handleHoverIn = () => {
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(hoverAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
              }),
            ]).start();
          };

          const handleHoverOut = () => {
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(hoverAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
              }),
            ]).start();
          };

          const buttonBackground = hoverAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#EAF3F2", "#FF7A00"],
          });

          const buttonTextColor = hoverAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#0B7077", "#fff"],
          });

          return (
            <Animated.View
              key={cat.id}
              onMouseEnter={Platform.OS === "web" ? handleHoverIn : undefined}
              onMouseLeave={Platform.OS === "web" ? handleHoverOut : undefined}
              style={[
                styles.card,
                {
                  width: `${100 / cardsPerRow - 2}%`,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Image source={cat.image} style={styles.icon} />
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.description}>{cat.description}</Text>

              <TouchableOpacity
                onPress={() => handleCategoryPress(cat.name)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[styles.button, { backgroundColor: buttonBackground }]}
                >
                  <Animated.Text
                    style={[styles.buttonText, { color: buttonTextColor }]}
                  >
                    Ver cursos
                  </Animated.Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8FAFB",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0B7077",
  },
  titleHighlight: {
    textDecorationLine: "underline",
    textDecorationColor: "#FF7A00",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 16,
    resizeMode: "contain",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B7077",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
});
