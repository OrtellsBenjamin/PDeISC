import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

export default function InfoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  const infoItems = [
    {
      id: 1,
      icon: require('../assets/icon.png'),
      text: "Teachers don't get lost in the grid view and have a dedicated Podium space.",
    },
    {
      id: 2,
      icon: require('../assets/icon.png'),
      text: "TA’s and presenters can be moved to the front of the class.",
    },
    {
      id: 3,
      icon: require('../assets/icon.png'),
      text: "Teachers can easily see all students and class data at one time.",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}
    >
      {/* IMAGEN */}
      <View style={[styles.imageContainer, { width: isMobile ? '100%' : '45%' }]}>
        <Image
          source={require('../assets/teacher.svg')}
          style={styles.image}
        />
      </View>

      {/* TEXTO */}
      <View style={[styles.textContainer, { width: isMobile ? '100%' : '50%' }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Training</Text>
        </View>

        <Text style={styles.title}>Staff training</Text>

        {infoItems.map((item) => (
          <View key={item.id} style={styles.infoRow}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.infoText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F0FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeText: {
    color: '#0B7077',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E86A33',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 12,
    resizeMode: 'contain',
  },
  infoText: {
    flex: 1,
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
  },
});
