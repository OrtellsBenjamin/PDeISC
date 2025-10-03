import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  SectionList,
  TouchableOpacity,
  Pressable,
  Switch,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";

export default function NativeComponents() {
  const [text, setText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [slideValue, setSlideValue] = useState(0);

  const data = [
    { id: "1", name: "Manzana" },
    { id: "2", name: "Banana" },
    { id: "3", name: "Naranja" },
  ];

  const sections = [
    { title: "Frutas", data: ["Manzana", "Banana", "Naranja"] },
    { title: "Verduras", data: ["Lechuga", "Tomate", "Zanahoria"] },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.title}>Text</Text>
          <Text>Se usa para mostrar texto en pantalla.</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>View</Text>
          <View style={styles.colorBox} />
          <Text>Contenedor para otros elementos.</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>Button</Text>
          <Button title="Presióname" onPress={() => Alert.alert("Botón", "Click")} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.title}>Pressable</Text>
          <Pressable style={styles.pressable} onPress={() => Alert.alert("Pressable", "Presionado")}>
            <Text style={styles.touchText}>Tócame</Text>
          </Pressable>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>TouchableOpacity</Text>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => Alert.alert("TouchableOpacity", "Tocado")}
          >
            <Text style={styles.touchText}>Tócame</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>Image</Text>
          <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={{ width: 50, height: 50 }}
          />
          <Text>Muestra imágenes desde URL o assets locales.</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.title}>TextInput</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe algo..."
            value={text}
            onChangeText={setText}
          />
          <Text>Texto ingresado: {text}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>Switch</Text>
          <Switch value={isEnabled} onValueChange={setIsEnabled} />
          <Text>{isEnabled ? "Encendido" : "Apagado"}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>ActivityIndicator</Text>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Button title="Mostrar Cargando" onPress={() => setLoading(true)} />
          )}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.title}>FlatList</Text>
          <FlatList
            data={data}
            renderItem={({ item }) => <Text>- {item.name}</Text>}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>SectionList</Text>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Text>- {item}</Text>}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>Modal</Text>
          <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text>Este es un Modal</Text>
                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>Slider</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={slideValue}
            onValueChange={(value) => setSlideValue(value)}
            minimumTrackTintColor="blue"
            maximumTrackTintColor="gray"
            thumbTintColor="blue"
          />
          <Text>Valor: {slideValue}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f2f5",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    flexBasis: "30%",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  colorBox: {
    width: 60,
    height: 60,
    backgroundColor: "#4a90e2",
    marginBottom: 12,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#fafafa",
  },
  touch: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  pressable: {
    backgroundColor: "#50e3c2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  touchText: { color: "#fff", fontWeight: "bold" },
  sectionHeader: { fontWeight: "700", fontSize: 16, marginTop: 12, color: "#555" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
});
