import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Este es mi perro!</Text>
      <Image
        style={styles.image}
        source={require('../../assets/images/perro1.png')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: '#121212', 
  },
  text: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f5f5f5',
    fontFamily: 'Montserrat_700Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 30,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 20,
    resizeMode: 'cover',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});
