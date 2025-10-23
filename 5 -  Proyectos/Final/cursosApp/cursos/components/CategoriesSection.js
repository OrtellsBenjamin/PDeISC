import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

export default function CategoriesSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1024;
  const cardsPerRow = isMobile ? 1 : isTablet ? 2 : 4;

  const categories = [
    {
      id: 1,
      name: 'Beauty',
      description:
        'One powerful online software suite that combines all the tools needed to run a successful school or office.',
      image: require('../assets/icon.png'),
      color: '#E8F6F3',
      buttonText: 'more',
      isHighlighted: false,
    },
    {
      id: 2,
      name: 'Medical',
      description:
        'One powerful online software suite that combines all the tools needed to run a successful school or office.',
      image: require('../assets/icon.png'),
      color: '#FFF7E8',
      buttonText: 'more',
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'Sports',
      description:
        'One powerful online software suite that combines all the tools needed to run a successful school or office.',
      image: require('../assets/icon.png'),
      color: '#E8F3FF',
      buttonText: 'Explore courses',
      isHighlighted: true,
    },
    {
      id: 4,
      name: 'Nutrition',
      description:
        'One powerful online software suite that combines all the tools needed to run a successful school or office.',
      image: require('../assets/icon.png'),
      color: '#E8FFF0',
      buttonText: 'more',
      isHighlighted: false,
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Courses <Text style={styles.titleHighlight}>Category</Text>
      </Text>
      <Text style={styles.subtitle}>
        Onlearning is one powerful online software suite that combines all the
        tools needed to run a successful school or office.
      </Text>

      <View
        style={[
          styles.grid,
          { justifyContent: isMobile ? 'center' : 'space-between' },
        ]}
      >
        {categories.map((cat) => (
          <View
            key={cat.id}
            style={[
              styles.card,
              {
                width: `${100 / cardsPerRow - 2}%`,
                backgroundColor: '#fff',
                shadowOpacity: cat.isHighlighted ? 0.2 : 0.05,
                transform: cat.isHighlighted ? [{ scale: 1.02 }] : [],
              },
            ]}
          >
            <Image source={cat.image} style={styles.icon} />
            <Text
              style={[
                styles.categoryName,
                cat.isHighlighted && { color: '#0B7077' },
              ]}
            >
              {cat.name}
            </Text>
            <Text style={styles.description}>{cat.description}</Text>

            <TouchableOpacity
              style={[
                styles.button,
                cat.isHighlighted ? styles.buttonActive : styles.buttonInactive,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  cat.isHighlighted
                    ? styles.buttonTextActive
                    : styles.buttonTextInactive,
                ]}
              >
                {cat.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8FAFB',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0B7077',
  },
  titleHighlight: {
    textDecorationLine: 'underline',
    textDecorationColor: '#FF7A00',
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonActive: {
    backgroundColor: '#FF7A00',
  },
  buttonInactive: {
    backgroundColor: '#EAF3F2',
  },
  buttonText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  buttonTextActive: {
    color: '#fff',
  },
  buttonTextInactive: {
    color: '#0B7077',
  },
});
