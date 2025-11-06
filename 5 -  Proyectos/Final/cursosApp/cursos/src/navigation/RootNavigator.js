import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Pantallas públicas (accesibles sin iniciar sesión)
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AuthCallbackScreen from "../screens/AuthCallbackScreen";

// Pantallas privadas (requieren sesión o validación interna)
import CourseDetailScreen from "../screens/CourseDetailScreen";
import MyCoursesScreen from "../screens/MyCoursesScreen";
import CreateCourseScreen from "../screens/CreateCourseScreen";
import CoursePlayerScreen from "../screens/CoursePlayerScreen";
import AllCoursesScreen from "../screens/AllCoursesScreen";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import EditPortadaScreen from "../screens/EditPortadaScreen";
import EditModuleScreen from "../screens/EditModuleScreen";

// Configuración del stack principal de navegación
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "fade" }}
      initialRouteName="Home" // Ruta inicial: Home
    >
      {/* Rutas públicas */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AuthCallback" component={AuthCallbackScreen} />

      {/* Rutas privadas */}
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="MyCourses" component={MyCoursesScreen} />
      <Stack.Screen name="CreateCourse" component={CreateCourseScreen} />
      <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} />
      <Stack.Screen name="AllCourses" component={AllCoursesScreen} />
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
      <Stack.Screen name="EditPortada" component={EditPortadaScreen} />
      <Stack.Screen name="EditModule" component={EditModuleScreen} />
    </Stack.Navigator>
  );
}
