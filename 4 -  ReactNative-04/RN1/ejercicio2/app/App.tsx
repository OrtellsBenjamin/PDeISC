import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import NativeComponents from "./componentes/NativeComponents";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NativeComponents />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
