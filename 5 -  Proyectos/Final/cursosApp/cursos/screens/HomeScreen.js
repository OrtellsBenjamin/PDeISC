
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import HeroSection from '../components/HeroSection';
import CoursesSection from '../components/CoursesSection';
import CategoriesSection from '../components/CategoriesSection';
import InfoSection from '../components/InfoSection';
import FooterSection from '../components/FooterSection';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <HeroSection />
      <CoursesSection />
      <CategoriesSection />
      <InfoSection />
      <FooterSection />    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2E6E4',
  },
});
