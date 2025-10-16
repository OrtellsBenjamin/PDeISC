import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type WelcomeScreenRouteProp = RouteProp<RootStackParamList, "Welcome">;
type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

type Props = { route: WelcomeScreenRouteProp };

export default function WelcomeScreen({ route }: Props) {
  const { user } = route.params;
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { width } = useWindowDimensions();


  const containerWidth = width > 450 ? 550 : "90%";

  const handleLogout = () => {
    navigation.replace("Login");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View
        style={{
          position: "relative",
          width: containerWidth,
          alignSelf: "center",
        }}
      >

        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            right: -6,
            bottom: -6,
            backgroundColor: "black",
            borderRadius: 8,
            zIndex: -1,
          }}
        />

        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginBottom: 10,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Bienvenido, {user.username}!
          </Text>

          <Text
            style={{
              fontSize: 16,
              marginBottom: 30,
              textAlign: "center",
              color: "#333",
            }}
          >
            ¡Has ingresado correctamente al sistema!
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#FD5D5E", 
              paddingVertical: 12,
              paddingHorizontal: 25,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
