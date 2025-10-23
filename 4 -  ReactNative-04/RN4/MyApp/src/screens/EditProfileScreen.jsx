// src/screens/EditProfileScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const [photoUri, setPhotoUri] = useState(user?.photoURL || null);

  useEffect(() => {
    if (user?.address) {
      setValue('address', user.address);
    }
  }, [user, setValue]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a las fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setPhotoUri(result.uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    // Aquí podrías pasar loc.coords (lat, lng) a un servicio de geocoding inverso
    const addressString = `Lat ${loc.coords.latitude}, Lon ${loc.coords.longitude}`;
    setValue('address', addressString);
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
        photoURL: photoUri,
      });
      Alert.alert('Éxito', 'Perfil actualizado');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar perfil: ', error);
      Alert.alert('Error', 'No se pudo actualizar perfil');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.photoContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text>No hay foto</Text>
          </View>
        )}
        <Button title="Cambiar foto" onPress={pickImage} />
      </View>

      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Nombre:</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && <Text style={styles.error}>Requerido.</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="phone"
        rules={{ required: false }}
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Teléfono:</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
            />
          </>
        )}
      />

      <Controller
        control={control}
        name="address"
        rules={{ required: false }}
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Dirección:</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          </>
        )}
      />

      <Button title="Obtener mi ubicación" onPress={getLocation} />

      <View style={{ marginTop: 20 }}>
        <Button title="Guardar cambios" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  error: {
    color: 'red',
  },
});
