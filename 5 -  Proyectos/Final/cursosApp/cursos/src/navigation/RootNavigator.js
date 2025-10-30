import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CoursesScreen from "../screens/CoursesScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import AllCoursesScreen from "../screens/AllCoursesScreen";
import CreateCourseScreen from "../screens/CreateCourseScreen";
import MyCoursesScreen from "../screens/MyCoursesScreen";
import CoursePlayerScreen from "../screens/CoursePlayerScreen";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import EditModuleScreen from "../screens/EditModuleScreen"; // ✅ tu nombre exacto
import { AuthContext } from "../context/AuthContext";
import EditPortadaScreen from "../screens/EditPortadaScreen";



const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { session, loading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
        <Stack.Screen name="AllCourses" component={AllCoursesScreen} />
        <Stack.Screen name="CreateCourse" component={CreateCourseScreen} />
        <Stack.Screen name="MyCourses" component={MyCoursesScreen} />
        <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        <Stack.Screen name="EditPortada" component={EditPortadaScreen} />

        {/* ✅ Nueva pantalla: Editar módulos */}
        <Stack.Screen
          name="EditModules"
          component={EditModuleScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
