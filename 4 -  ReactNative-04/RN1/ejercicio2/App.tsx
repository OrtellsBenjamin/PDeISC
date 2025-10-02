// App.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Switch,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  SectionList,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from 'react-native';
import Slider from '@react-native-community/slider';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const sampleList = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  const sections = [
    { title: 'Sección 1', data: ['A', 'B'] },
    { title: 'Sección 2', data: ['C', 'D'] },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setTimeout(() => setRefreshing(false), 1000);
              }}
            />
          }
        >
          <Text style={styles.title}>Componentes Nativos de React Native</Text>

          {/* View */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>View</Text>
            <Text>Contenedor básico para otros componentes.</Text>
          </View>

          {/* Text */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Text</Text>
            <Text>Se usa para mostrar texto.</Text>
          </View>

          {/* Button */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Button</Text>
            <Button
              title="Presióname"
              onPress={() => Alert.alert('Botón presionado')}
            />
          </View>

          {/* TextInput */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>TextInput</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe algo..."
              value={text}
              onChangeText={setText}
            />
          </View>

          {/* Switch */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Switch</Text>
            <Switch value={isEnabled} onValueChange={setIsEnabled} />
          </View>

          {/* Slider */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Slider</Text>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={100}
              value={sliderValue}
              onValueChange={setSliderValue}
            />
            <Text>Valor: {Math.round(sliderValue)}</Text>
          </View>

          {/* Image */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Image</Text>
            <Image
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={{ width: 50, height: 50 }}
            />
          </View>

          {/* TouchableOpacity */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>TouchableOpacity</Text>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => Alert.alert('Touchable presionado')}
            >
              <Text style={{ color: 'white' }}>Tócame</Text>
            </TouchableOpacity>
          </View>

          {/* ActivityIndicator */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>ActivityIndicator</Text>
            <ActivityIndicator size="large" color="#007bff" />
          </View>

          {/* FlatList */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>FlatList</Text>
            <FlatList
              data={sampleList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => <Text>- {item}</Text>}
            />
          </View>

          {/* SectionList */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>SectionList</Text>
            <SectionList
              sections={sections}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => <Text>• {item}</Text>}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
              )}
            />
          </View>

          {/* Modal */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Modal</Text>
            <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />
            <Modal visible={modalVisible} animationType="slide" transparent>
              <View style={styles.modal}>
                <Text>Este es un modal</Text>
                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
              </View>
            </Modal>
          </View>

          {/* Pressable */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>Pressable</Text>
            <Pressable
              style={({ pressed }) => [
                { backgroundColor: pressed ? '#aaa' : '#007bff' },
                styles.touchable,
              ]}
              onPress={() => Alert.alert('Pressable presionado')}
            >
              <Text style={{ color: 'white' }}>Presióname</Text>
            </Pressable>
          </View>

          {/* SafeAreaView */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>SafeAreaView</Text>
            <Text>Protege el contenido de los bordes de la pantalla en iOS.</Text>
          </View>

          {/* StatusBar */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>StatusBar</Text>
            <Text>Permite configurar la barra de estado del sistema.</Text>
          </View>

          {/* KeyboardAvoidingView */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>KeyboardAvoidingView</Text>
            <Text>Evita que el teclado tape los inputs en iOS/Android.</Text>
          </View>

          {/* RefreshControl */}
          <View style={styles.box}>
            <Text style={styles.subtitle}>RefreshControl</Text>
            <Text>Puedes usarlo en ScrollView para pull-to-refresh.</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  content: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  box: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  touchable: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 40,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
