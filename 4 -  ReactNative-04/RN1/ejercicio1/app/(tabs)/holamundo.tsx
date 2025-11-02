import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Pressable } from 'react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({ Montserrat_700Bold });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // 🔹 Función para animar zoom en hover (o press)
  const handleHoverIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.08,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Este es mi perro!</Text>

      {/* Tarjeta contenedora */}
      <Pressable
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPressIn={handleHoverIn}
        onPressOut={handleHoverOut}
        style={styles.card}
      >
        <Animated.Image
          style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
          source={require('../../assets/images/perro1.png')}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  text: {
    fontSize: 36,
    color: '#f5f5f5',
    fontFamily: 'Montserrat_700Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    transitionDuration: '0.3s',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});
