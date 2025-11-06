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

export default function CoursesScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  //Cargar cursos reales del backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://onlearn-api.onrender.com/api/courses/popular");
        const data = await res.json();
        console.log("Cursos obtenidos:", data);

        if (Array.isArray(data)) setCourses(data);
        else setCourses([]);
      } catch (err) {
        console.error("Error cargando cursos populares:", err);
        setCourses([]);
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

  return (
    <ScrollView style={styles.container}>
      {/*Título */}
      <Text style={styles.title}>Cursos Populares</Text>

      {/*Botón "Ver todos" */}
      <TouchableOpacity
        style={styles.viewAllBtn}
        onPress={() => navigation.navigate("AllCourses")}
      >
        <Text style={styles.viewAllText}>Ver todos los cursos ➜</Text>
      </TouchableOpacity>

      {/*Tarjetas */}
      <View
        style={[
          styles.cardsContainer,
          { flexDirection: isMobile ? "column" : "row", flexWrap: "wrap" },
        ]}
      >
        {courses.length === 0 ? (
          <Text style={styles.emptyText}>No hay cursos publicados todavía</Text>
        ) : (
          courses
            .slice(0, 4)
            .map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[styles.card, { backgroundColor: "#fff" }]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("CourseDetail", { course })}
              >
                <Image
                  source={{
                    uri:
                      course.image_url ||
                      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
                  }}
                  style={styles.courseImage}
                />

                <View style={styles.cardBody}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.students}>
                  {course.students || 0} estudiantes
                  </Text>
                  <Text
                    style={styles.description}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {course.description || "Sin descripción."}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${course.price}</Text>
                  </View>

                  <TouchableOpacity style={styles.enrollButton}>
                    <Text style={styles.enrollText}>Ver curso</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E86A33",
    marginBottom: 10,
    textAlign: "center",
  },
  viewAllBtn: {
    alignSelf: "center",
    backgroundColor: "#0B7077",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 15,
  },
  viewAllText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  cardsContainer: {
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    flexBasis: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10,
  },
  cardBody: {
    flexDirection: "column",
  },
  courseTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0B7077",
    marginBottom: 4,
  },
  students: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    color: "#33e8caff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  enrollButton: {
    backgroundColor: "#0B7077",
    borderRadius: 6,
    paddingVertical: 10,
  },
  enrollText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F6F5",
  },
  loaderText: {
    marginTop: 10,
    color: "#0B7077",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 20,
  },
});
