import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoogleLogin from "./components/GoogleLogin";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo ? (
          <Stack.Screen name="Profile" options={{ title: "Mi Perfil" }}>
            {(props) => (
              <ProfileScreen {...props} userInfo={userInfo} setUserInfo={setUserInfo} />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" options={{ title: "Iniciar sesión" }}>
            {(props) => <GoogleLogin {...props} setUserInfo={setUserInfo} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
