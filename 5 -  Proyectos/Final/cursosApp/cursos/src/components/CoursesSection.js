import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CoursesSection() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1024;
  const cardsPerRow = isMobile ? 1 : isTablet ? 2 : 3;

  const API_URL = "https://onlearn-api.onrender.com/api/courses/popular";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        //Tomamos solo los primeros 3 cursos
        setCourses(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (error) {
        console.error(" Error al cargar cursos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando cursos...</Text>
      </View>
    );
  }

  if (!courses.length) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>No hay cursos disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Nuestros cursos <Text style={styles.titleHighlight}>populares!</Text>
      </Text>

      <TouchableOpacity
        style={styles.viewAllBtn}
        onPress={() => navigation.navigate("AllCourses")}
      >
        <Text style={styles.viewAllText}>Ver todos nuestros cursos ➜</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.grid,
          {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "space-around",
          },
        ]}
      >
        {courses.map((course) => (
          <View
            key={course.id}
            style={[
              styles.card,
              {
                backgroundColor: "#fff",
                width: `${100 / cardsPerRow - 2}%`,
              },
            ]}
          >
            <Image
              source={{
                uri: course.image_url
                  ? `${course.image_url}?v=${Date.now()}`
                  : "https://placehold.co/600x400?text=Sin+imagen",
              }}
              style={styles.courseImage}
              resizeMode="cover"
            />

            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.description} numberOfLines={3}>
              {course.description || "Sin descripción."}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>${course.price}</Text>
            </View>

            <TouchableOpacity
              style={styles.enrollButton}
              onPress={() => navigation.navigate("CourseDetail", { course })}
            >
              <Text style={styles.enrollText}>Ver curso</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0B7077",
    textAlign: "center",
    marginBottom: 10,
  },
  titleHighlight: {
    textDecorationLine: "underline",
    textDecorationColor: "#FF7A00",
  },
  viewAllBtn: {
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "#0B7077",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  viewAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  grid: { flex: 1 },
  card: {
    borderRadius: 16,
    marginBottom: 25,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseImage: {
    width: "100%",
    height: 130,
    borderRadius: 12,
    marginBottom: 10,
  },
  courseTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0B7077",
    marginBottom: 6,
  },
  description: {
    color: "#555",
    fontSize: 13,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    color: "#E86A33",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  enrollButton: {
    backgroundColor: "#0B7077",
    borderRadius: 8,
    paddingVertical: 10,
  },
  enrollText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  loaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 60,
    alignItems: "center",
  },
  loaderText: {
    color: "#0B7077",
    marginTop: 10,
    fontWeight: "500",
  },
});
