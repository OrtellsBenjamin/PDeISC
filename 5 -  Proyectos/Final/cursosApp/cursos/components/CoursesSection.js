import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

export default function CoursesSection() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1024;

  const cardsPerRow = isMobile ? 1 : isTablet ? 2 : 4;

  const courses = [
    {
      id: 1,
      title: 'Product Management Basic - Course',
      students: 40,
      price: 380,
      oldPrice: 500,
      date: '1 - 28 July 2022',
      description:
        'Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.',
      image: require('../assets/Portada-Curso.png'),
      color: '#E8F6F3',
    },
    {
      id: 2,
      title: 'BM Data Science Professional Certificate',
      students: 11,
      price: 678,
      oldPrice: 850,
      date: '10 - 30 May 2023',
      description:
        'Master data science foundations and get certified to boost your professional career.',
      image: require('../assets/Portada-Curso.png'),
      color: '#FFF7E8',
    },
    {
      id: 3,
      title: 'The Science of Well-Being',
      students: 234,
      price: 123,
      oldPrice: 500,
      date: '1 - 28 July 2022',
      description:
        'Learn practical skills for mental health and productivity through this science-backed course.',
      image: require('../assets/Portada-Curso.png'),
      color: '#E8F3FF',
    },
    {
      id: 4,
      title: 'Python for Everybody Specialization',
      students: 342,
      price: 567,
      oldPrice: 700,
      date: '15 - 30 August 2023',
      description:
        'Learn to code and analyze data using Python — essential for today’s data-driven world.',
      image: require('../assets/Portada-Curso.png'),
      color: '#E8FFF0',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Popular Courses</Text>

      <View
        style={[
          styles.grid,
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'space-between',
          },
        ]}
      >
        {courses.map((course) => (
          <View
            key={course.id}
            style={[
              styles.card,
              {
                backgroundColor: '#fff',
                width: `${100 / cardsPerRow - 2}%`, // 4 columnas con espacio
              },
            ]}
          >
            {/* Imagen */}
            <Image source={course.image} style={styles.courseImage} />

            {/* Encabezado con estudiantes */}
            <View style={styles.studentsBadge}>
              <Text style={styles.studentsText}>+ {course.students} students</Text>
            </View>

            {/* Fecha */}
            <Text style={styles.date}>{course.date}</Text>

            {/* Título */}
            <Text style={styles.courseTitle}>{course.title}</Text>

            {/* Descripción */}
            <Text style={styles.description}>{course.description}</Text>

            {/* Precio */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>${course.price}</Text>
              <Text style={styles.oldPrice}>${course.oldPrice}</Text>
            </View>

            {/* Botón */}
            <TouchableOpacity style={styles.enrollButton}>
              <Text style={styles.enrollText}>Enroll Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B7077',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    marginBottom: 25,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  courseImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  studentsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  studentsText: {
    fontSize: 13,
    color: '#444',
  },
  date: {
    color: '#777',
    fontSize: 12,
    marginBottom: 6,
  },
  courseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0B7077',
    marginBottom: 6,
  },
  description: {
    color: '#555',
    fontSize: 13,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    color: '#E86A33',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  oldPrice: {
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  enrollButton: {
    backgroundColor: '#0B7077',
    borderRadius: 8,
    paddingVertical: 10,
  },
  enrollText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
