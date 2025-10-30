import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import HeroSection from "../components/HeroSection";
import CoursesSection from "../components/CoursesSection";
import CategoriesSection from "../components/CategoriesSection";
import InfoSection from "../components/InfoSection";
import FooterSection from "../components/FooterSection";
import Header from "../components/Header";

export default function HomeScreen() {
  const scrollViewRef = useRef(null);
  const cursosRef = useRef(null);
  const categoriasRef = useRef(null);
  const contactoRef = useRef(null);

  // 🔹 Scroll suave hacia la sección indicada
  const scrollToSection = (section) => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    const scrollToRef = (ref) => {
      if (!ref?.current) return;

      const innerNode = scrollView.getInnerViewNode
        ? scrollView.getInnerViewNode()
        : scrollView;

      // 🟢 Medimos la posición y hacemos scroll
      ref.current.measureLayout(
        innerNode,
        (x, y) => scrollView.scrollTo({ y, animated: true }),
        (err) => console.warn("⚠️ Error al medir sección:", err)
      );
    };

    switch (section) {
      case "cursos":
        scrollToRef(cursosRef);
        break;
      case "categorias":
        scrollToRef(categoriasRef);
        break;
      case "contacto":
        scrollToRef(contactoRef);
        break;
      default:
        scrollView.scrollTo({ y: 0, animated: true });
        break;
    }
  };

  return (
    <>
      {/* 🔹 El Header recibe la función para navegar entre secciones */}
      <Header onNavigateSection={scrollToSection} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent} // 👈 agregado
      >
        <HeroSection />

        {/* Sección Cursos */}
        <View ref={cursosRef} collapsable={false}>
          <CoursesSection />
        </View>

        {/* Sección Categorías */}
        <View ref={categoriasRef} collapsable={false}>
          <CategoriesSection />
        </View>

        {/* Sección Info */}
        <InfoSection />

        {/* Sección Contacto (Footer) */}
        <View ref={contactoRef} collapsable={false}>
          <FooterSection />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2E6E4", // 👈 mismo color que el footer
  },
  scrollContent: {
    paddingBottom: 0, // 👈 evita espacio extra al final
    marginBottom: 0,
    backgroundColor: "#D2E6E4", // 👈 asegura continuidad de color
  },
});
