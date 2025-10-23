import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';

export default function CoursesScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  const courses = [
    {
      id: 1,
      title: 'Product Management Basic - Course',
      students: 40,
      price: 380,
      oldPrice: 500,
      image: require('../assets/Portada-Curso.png'),
      color: '#E8F6F3',
    },
    {
      id: 2,
      title: 'BM Data Science Professional Certificate',
      students: 11,
      price: 678,
      oldPrice: 850,
      image: require('../assets/Portada-Curso.png'),
      color: '#FFF7E8',
    },
    {
      id: 3,
      title: 'The Science of Well-Being',
      students: 234,
      price: 123,
      oldPrice: 500,
      image: require('../assets/Portada-Curso.png'),
      color: '#E8F3FF',
    },
    {
      id: 4,
      title: 'Python for Everybody Specialization',
      students: 342,
      price: 567,
      oldPrice: 700,
      image: require('../assets/Portada-Curso.png'),
      color: '#E8FFF0',
    },
  ];

  const filters = [
    'All Programme',
    'UI/UX Design',
    'Data Science',
    'Program Design',
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Popular Courses</Text>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {filters.map((f, i) => (
          <TouchableOpacity key={i} style={[styles.filterButton, i === 0 && styles.activeFilter]}>
            <Text style={[styles.filterText, i === 0 && styles.activeFilterText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tarjetas */}
      <View
        style={[
          styles.cardsContainer,
          { flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' },
        ]}
      >
        {courses.map((course) => (
          <View key={course.id} style={[styles.card, { backgroundColor: course.color }]}>
            <Image source={course.image} style={styles.courseImage} />

            <View style={styles.cardBody}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.students}>{course.students} students</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>${course.price}</Text>
                <Text style={styles.oldPrice}>${course.oldPrice}</Text>
              </View>

              <TouchableOpacity style={styles.enrollButton}>
                <Text style={styles.enrollText}>Enroll Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E86A33',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#0B7077',
    borderColor: '#0B7077',
  },
  filterText: {
    color: '#0B7077',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardsContainer: {
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    flexBasis: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardBody: {
    flexDirection: 'column',
  },
  courseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0B7077',
    marginBottom: 4,
  },
  students: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    color: '#E86A33',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  oldPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  enrollButton: {
    backgroundColor: '#0B7077',
    borderRadius: 6,
    paddingVertical: 10,
  },
  enrollText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
