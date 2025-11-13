import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import Video from "react-native-video";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CoursePlayerScreen({ route, navigation }) {
  const { course } = route.params;
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const { session } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true); // se mantiene aunque no se use

  const playerRef = useRef(null);

  const API_BASE = "https://onlearn-api.onrender.com/api";
  const LESSONS_URL = `${API_BASE}/courses/${course.id}/lessons`;
  const PROGRESS_URL = `${API_BASE}/enrollments/${course.id}/progress`;

  //Cargar lecciones y progreso en paralelo
  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      setLoading(true);
      try {
        const [resLessons, resEnroll] = await Promise.all([
          fetch(LESSONS_URL),
          fetch(`${API_BASE}/enrollments/me`, {
            headers: { Authorization: `Bearer ${session?.access_token}` },
          }),
        ]);

        //Procesar lecciones
        const dataLessons = await resLessons.json();
        const arr = Array.isArray(dataLessons) ? dataLessons : [];
        setLessons(arr);

        //Procesar progreso guardado
        const enrollData = await resEnroll.json();
        const enrollment = Array.isArray(enrollData)
          ? enrollData.find((e) => e.course_id === course.id)
          : null;

        const savedProgress = enrollment?.progress || 0;
        setProgress(savedProgress);

        //Calcular índice inicial según progreso (%)
        if (arr.length > 0 && savedProgress > 0) {
          let lastIndex = Math.floor((savedProgress / 100) * arr.length);
          if (lastIndex > 0 && lastIndex < arr.length) lastIndex -= 1;
          lastIndex = Math.min(lastIndex, arr.length - 1);
          setCurrentIndex(lastIndex);
        } else {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error al cargar curso:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Actualizar progreso en DB
  const updateProgress = async (pct) => {
    try {
      await fetch(PROGRESS_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ progress: pct }),
      });
    } catch (e) {
      console.error("No se pudo actualizar el progreso:", e.message);
    }
  };

  const handleNext = async () => {
    if (!lessons.length) return;

    if (currentIndex < lessons.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const pct = Math.min(
        100,
        Math.round(((nextIndex + 1) / lessons.length) * 100)
      );
      setProgress(pct);
      await updateProgress(pct);
      return;
    }

    //Última lección → marcar 100 %
    setProgress(100);
    await updateProgress(100);
    Alert.alert("Curso finalizado", "Has completado todas las lecciones.");
  };

  // Loader global (espera ambos fetch)
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0B7077" />
        <Text style={styles.loaderText}>Cargando curso...</Text>
      </View>
    );
  }

  if (!lessons.length) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Este curso aún no tiene módulos.</Text>
      </View>
    );
  }

  const currentLesson = lessons[currentIndex];

  // Handlers de video (se dejan definidos para evitar errores)
  const handleProgress = () => {
    // Podés actualizar tiempo actual si lo necesitás más adelante
  };

  const handleSeek = () => {
    // Podés manejar el seek si lo necesitás más adelante
  };

  //componente sidebar móvil
  const MobileSidebar = () => (
    <View style={styles.mobileSidebar}>
      <Text style={styles.sidebarTitle}>Temario</Text>

      {lessons.map((lesson, index) => (
        <TouchableOpacity
          key={lesson.id || index}
          style={[
            styles.lessonItem,
            index === currentIndex && styles.lessonActive,
          ]}
          onPress={() => setCurrentIndex(index)}
        >
          <Text
            style={[
              styles.lessonText,
              index === currentIndex && styles.lessonTextActive,
            ]}
          >
            {index + 1}. {lesson.title}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Progreso visual */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>Progreso: {progress}%</Text>
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex < lessons.length - 1 ? "Avanzar ➜" : "Finalizar"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  //componente sidebar escritorio
  const DesktopSidebar = () => (
    <ScrollView
      style={styles.desktopSidebar}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.sidebarTitle}>Temario</Text>

      {lessons.map((lesson, index) => (
        <TouchableOpacity
          key={lesson.id || index}
          style={[
            styles.lessonItem,
            index === currentIndex && styles.lessonActive,
          ]}
          onPress={() => setCurrentIndex(index)}
        >
          <Text
            style={[
              styles.lessonText,
              index === currentIndex && styles.lessonTextActive,
            ]}
          >
            {index + 1}. {lesson.title}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Progreso visual */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>Progreso: {progress}%</Text>
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex < lessons.length - 1 ? "Avanzar ➜" : "Finalizar"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  //Layout movil
  const renderMobileLayout = () => (
    <View style={{ flex: 1 }}>
      {/* Video fuera del ScrollView */}
      <View
        pointerEvents="box-none"
        style={styles.mobileVideoContainer}
      >
        <Video
          key={currentLesson?.id || currentIndex}
          ref={playerRef}
          source={{ uri: currentLesson.video_url }}
          style={{
            width: width * 0.95,
            height: (width * 0.95 * 9) / 16,
            borderRadius: 12,
            backgroundColor: "#000",
          }}
          resizeMode="contain"
          controls={true}
          paused={false}
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          mixWithOthers="mix"
          volume={1.0}
          rate={1.0}
          pointerEvents="box-none"
          disableFocus={true}
          focusable={false}
          onProgress={handleProgress}
          onSeek={handleSeek}
          progressUpdateInterval={250}
          onError={(error) => console.log("Video error:", error)}
          onLoad={(data) => console.log("Video loaded:", data.duration)}
        />
      </View>

      {/* Sidebar móvil en ScrollView */}
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        scrollEnabled={true}
      >
        <MobileSidebar />
      </ScrollView>
    </View>
  );

  //Layout escritorio
  const renderDesktopLayout = () => (
    <View style={styles.desktopLayout}>
      {/* Video izquierda */}
      <View style={styles.desktopVideoContainer}>
        <Video
          key={currentLesson?.id || currentIndex}
          ref={playerRef}
          source={{ uri: currentLesson.video_url }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            borderRadius: 12,
          }}
          resizeMode="contain"
          controls={true}
          paused={false}
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          progressUpdateInterval={500}
        />
      </View>

      {/* Sidebar escritorio */}
      <DesktopSidebar />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons name="chevron-back" size={22} color="#0B7077" />
        <Text style={styles.backText}>{course.title}</Text>
      </TouchableOpacity>

      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </SafeAreaView>
  );
}

//Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 8 : 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B7077",
    marginLeft: 6,
  },

  mobileScroll: { flex: 1, backgroundColor: "#F8FAFB" },
  mobileVideoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 15,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  mobileSidebar: {
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: Platform.select({ ios: 24, android: 24, default: "40%" }),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  desktopLayout: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
  },
  desktopVideoContainer: {
    width: "70%",
    height: "50%",
    backgroundColor: "#000",
    borderRadius: 12,
    justifyContent: "center",
    marginLeft: 25,
  },
  desktopSidebar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: "30%",
    maxHeight: "90%",
  },

  sidebarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B7077",
    marginBottom: 12,
  },
  lessonItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  lessonActive: { backgroundColor: "#0B7077" },
  lessonText: { color: "#0B7077", fontSize: 14 },
  lessonTextActive: { color: "#fff", fontWeight: "600" },
  nextBtn: {
    backgroundColor: "#0B7077",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  nextText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  progressContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#D2E6E4",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: "#0B7077" },
  progressText: { fontSize: 13, color: "#555", marginTop: 6 },

  // Loader
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFB",
  },
  loaderText: { color: "#0B7077", marginTop: 10 },
});
