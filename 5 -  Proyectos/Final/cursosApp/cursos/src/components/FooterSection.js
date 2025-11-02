import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FooterSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1024;

  return (
    <View style={styles.footer}>
      <View
        style={[
          styles.footerContent,
          {
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isTablet ? "space-around" : "space-between",
          },
        ]}
      >
      
        <View style={[styles.column, { width: isMobile ? "100%" : "30%" }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>onlearn</Text>
          </View>

          <Text style={styles.aboutText}>
            Onlearn es una plataforma educativa en línea creada para impulsar el
            aprendizaje moderno. Conectando estudiantes y profesionales.
          </Text>

          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>
              Av. Innovación 123, Buenos Aires, Argentina
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>+54 9 11 5555-1234</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>info@onlearn.com</Text>
          </View>
        </View>

      
        {/*Categorías y los enlaces útiles */}
       
        <View
          style={[
            styles.column,
            {
              width: isMobile ? "100%" : "45%",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
            },
          ]}
        >
     
          <View style={{ width: isMobile ? "100%" : "45%" }}>
            <Text style={styles.columnTitle}>Categorías</Text>
            <Text style={styles.linkText}>Diseño</Text>
            <Text style={styles.linkText}>Negocios</Text>
            <Text style={styles.linkText}>Programación</Text>
            <Text style={styles.linkText}>Tecnología</Text>
          </View>


          <View style={{ width: isMobile ? "100%" : "45%", marginTop: isMobile ? 20 : 0 }}>
            <Text style={styles.columnTitle}>Enlaces útiles</Text>
            <Text style={styles.linkText}>Inicio</Text>
            <Text style={styles.linkText}>Sobre nosotros</Text>
            <Text style={styles.linkText}>Cursos</Text>
            <Text style={styles.linkText}>Contacto</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomLine} />
      <Text style={styles.copyText}>
        © {new Date().getFullYear()} Onlearn — Todos los derechos reservados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  footer: {
    backgroundColor: "#D2E6E4",
    paddingVertical: 40,
    paddingHorizontal: 20,
    height: "45%",
  },
  footerContent: {
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  column: {
    marginBottom: 25,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginRight: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B7077",
  },
  aboutText: {
    color: "#0B7077",
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    color: "#0B7077",
    fontSize: 13,
    flexShrink: 1,
  },
  columnTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#0B7077",
    marginBottom: 10,
  },
  linkText: {
    color: "#0B7077",
    fontSize: 13,
    marginBottom: 6,
  },
  bottomLine: {
    borderBottomColor: "#0B7077",
    borderBottomWidth: 0.8,
    opacity: 0.2,
    marginTop: 20,
    marginBottom: 10,
  },
  copyText: {
    textAlign: "center",
    color: "#0B7077",
    fontSize: 12,
    opacity: 0.8,
  },
});
