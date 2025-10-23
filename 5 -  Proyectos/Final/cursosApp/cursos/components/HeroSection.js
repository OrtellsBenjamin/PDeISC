// components/HeroSection.jsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';

export default function HeroSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  return (
    <View
      style={[
        styles.hero,
        {
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        },
      ]}
    >
      {/* IZQUIERDA */}
      <View
        style={[
          styles.heroLeft,
          { width: isMobile ? '100%' : '50%', alignItems: 'flex-start' },
        ]}
      >
        <Text style={styles.tagline}>Never stop learning</Text>
        <Text style={[styles.title, { fontSize: isMobile ? 32 : 50 }]}>
          Mejora tus habilidades con
        </Text>
        <Text style={[styles.subtitle, { fontSize: isMobile ? 32 : 50 }]}>
          cursos online en Olearn
        </Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreText}>EXPLORE PATH</Text>
        </TouchableOpacity>
        <View style={styles.stats}>
          <Text style={styles.statsText}>250k Assisted Students</Text>
        </View>
      </View>

      {/* DERECHA */}
      <View
        style={[
          styles.heroRight,
          {
            width: isMobile ? '100%' : '50%',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: isMobile ? 20 : 0,
          },
        ]}
      >
        <Image
          source={require('../assets/Estudiante.png')}
          style={[
            styles.heroImage,
            {
              width: isMobile ? 300 : 500,
              height: isMobile ? 300 : 500,
              alignSelf: 'flex-start',
              marginLeft: isMobile ? -95 : 20,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 20 },
  heroLeft: { minWidth: 300 },
  heroRight: { alignItems: 'center', justifyContent: 'center' },
  tagline: { fontSize: 14, color: '#555' },
  title: {
    marginTop: 80,
    fontWeight: 'bold',
    color: '#0B7077',
    marginVertical: 6,
  },
  subtitle: { color: '#0B7077', marginBottom: 4, fontWeight: 'bold' },
  exploreButton: {
    marginTop: 40,
    backgroundColor: '#ee6c4d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  exploreText: { color: '#fff', fontWeight: 'bold' },
  stats: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 20 },
  statsText: { color: '#0f4c5c' },
  heroImage: { resizeMode: 'contain', marginTop: 20 },
});
