import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import AuthCallbackScreen from "../screens/AuthCallbackScreen";

export type RootStackParamList = {
  Login: undefined;
  Welcome: { user: { username: string } };
  AuthCallback: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Inicio de sesión", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Bienvenida", headerLeft: () => null }}
        />
        <Stack.Screen
          name="AuthCallback"
          component={AuthCallbackScreen}
          options={{ title: "Autenticando..." }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
