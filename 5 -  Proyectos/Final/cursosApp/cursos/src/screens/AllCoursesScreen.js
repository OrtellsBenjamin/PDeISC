import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";

export default function AllCoursesScreen({ navigation, route }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const { width } = useWindowDimensions();

const API_URL = process.env.EXPO_PUBLIC_API_URL;


  //Obtener categorías
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/categories`);
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    } finally {
      setLoadingCats(false);
    }
  };

  //Obtener cursos publicados
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/published`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  //Autoselección si viene desde CategoriesSection
  useEffect(() => {
    if (route?.params?.selectedCategory && categories.length > 0) {
      const found = categories.find(
        (c) =>
          c.name.toLowerCase() === route.params.selectedCategory.toLowerCase()
      );
      if (found) setSelectedCategory(found.id);
    }
  }, [route?.params, categories]);

  const numColumns = width < 700 ? 1 : width < 1024 ? 2 : 3;

  //Filtrado dinámico
  const filteredCourses = selectedCategory
    ? courses.filter((c) => c.category_id === selectedCategory)
    : courses;

  if (loading || loadingCats) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando cursos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <Text style={styles.title}>Explorá nuestros Cursos</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                isActive && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(isActive ? null : cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredCourses.length === 0 ? (
        <Text style={styles.emptyText}>
          No hay cursos disponibles en esta categoría.
        </Text>
      ) : (
        <View style={[styles.grid, { justifyContent: "flex-start" }]}>
          {filteredCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              activeOpacity={0.9}
              style={[
                styles.card,
                {
                  width:
                    numColumns === 1
                      ? "95%"
                      : numColumns === 2
                      ? "47%"
                      : "31.5%",
                },
              ]}
              onPress={() => navigation.navigate("CourseDetail", { course })}
            >
              <Image
                source={{
                  uri: course.image_url
                    ? `${course.image_url}?v=${Date.now()}`
                    : "https://placehold.co/600x400?text=Sin+imagen",
                }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {course.description || "Sin descripción."}
              </Text>
              <Text style={styles.price}>${course.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#0B7077",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  backText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0B7077",
    textAlign: "center",
    marginBottom: 20,
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#E9F6F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#0B7077",
  },
  categoryText: {
    color: "#0B7077",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    rowGap: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: "100%", height: 160, borderRadius: 10, marginBottom: 10 },
  courseTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0B7077",
    marginBottom: 4,
  },
  description: { fontSize: 14, color: "#555", marginBottom: 8 },
  price: { color: "#E86A33", fontWeight: "bold", fontSize: 16 },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D2E6E4",
  },
  loaderText: { marginTop: 10, color: "#0B7077", fontWeight: "600" },
});
