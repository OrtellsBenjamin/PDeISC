import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View, Platform } from "react-native";
import HeroSection from "../components/HeroSection";
import CoursesSection from "../components/CoursesSection";
import CategoriesSection from "../components/CategoriesSection";
import InfoSection from "../components/InfoSection";
import FooterSection from "../components/FooterSection";
import Header from "../components/Header";

export default function HomeScreen() {
  const scrollViewRef = useRef(null);
  const [positions, setPositions] = useState({
    cursos: 0,
    categorias: 0,
    contacto: 0,
  });

  // Guarda las posiciones Y de cada sección
  const handleLayout = (section) => (event) => {
    const { y } = event.nativeEvent.layout;
    setPositions((prev) => ({ ...prev, [section]: y }));
  };

  const scrollToSection = (section) => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    //Web (usa scrollIntoView con suavidad nativa del navegador)
    if (Platform.OS === "web") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    //Nativo (usa scrollTo nativo fluido sin lag)
    let targetY = 0;
    if (section === "cursos") targetY = positions.cursos;
    else if (section === "categorias") targetY = positions.categorias;
    else if (section === "contacto") targetY = positions.contacto;

    scrollView.scrollTo({ y: targetY, animated: true });
  };

  return (
    <>
      <Header onNavigateSection={scrollToSection} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />

     
        <View onLayout={handleLayout("cursos")} id="cursos">
          <CoursesSection />
        </View>

     
        <View onLayout={handleLayout("categorias")} id="categorias">
          <CategoriesSection />
        </View>

        <InfoSection />

        <View onLayout={handleLayout("contacto")} id="contacto">
          <FooterSection />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2E6E4",
  },
  scrollContent: {
    paddingBottom: 0,
    marginBottom: 0,
    backgroundColor: "#D2E6E4",
  },
});
