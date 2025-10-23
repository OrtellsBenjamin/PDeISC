import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FooterSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  return (
    <View style={styles.footer}>
      {/* Contenedor principal */}
      <View
        style={[
          styles.footerContent,
          { flexDirection: isMobile ? 'column' : 'row' },
        ]}
      >
        {/* Columna 1 - Logo y contacto */}
        <View style={styles.column}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>onlearn</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>
              Address: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>Tel: +92 323 941037</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="time-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>Response hours: 8 to 20</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={18} color="#0B7077" />
            <Text style={styles.contactText}>Email: info@onlearn.com</Text>
          </View>
        </View>

        {/* Columna 2 - Categorías */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Categories</Text>
          <Text style={styles.linkText}>Counseling</Text>
          <Text style={styles.linkText}>Health and fitness</Text>
          <Text style={styles.linkText}>Individual development</Text>
          <Text style={styles.linkText}>More</Text>
        </View>

        {/* Columna 3 - Links */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Links</Text>
          <Text style={styles.linkText}>About us</Text>
          <Text style={styles.linkText}>Blog</Text>
        </View>

        {/* Columna 4 - Newsletter */}
        <View style={[styles.column, { alignItems: 'flex-start' }]}>
          <Text style={styles.columnTitle}>
            Stay up to date with the latest courses
          </Text>

          <View style={styles.newsletterContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#D2E6E4',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerContent: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  column: {
    width: '45%',
    marginBottom: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B7077',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    color: '#0B7077',
    fontSize: 13,
    flexShrink: 1,
  },
  columnTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0B7077',
    marginBottom: 10,
  },
  linkText: {
    color: '#0B7077',
    fontSize: 13,
    marginBottom: 6,
  },
  newsletterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#0B7077',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
