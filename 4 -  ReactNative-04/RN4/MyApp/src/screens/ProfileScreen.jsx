
import React, { useContext } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholderAvatar}>
          <Text style={styles.placeholderText}>No foto</Text>
        </View>
      )}
      <Text style={styles.fieldLabel}>Nombre:</Text>
      <Text style={styles.fieldValue}>{user.name || '-'}</Text>

      <Text style={styles.fieldLabel}>Email:</Text>
      <Text style={styles.fieldValue}>{user.email || '-'}</Text>

      <Text style={styles.fieldLabel}>Teléfono:</Text>
      <Text style={styles.fieldValue}>{user.phone || '-'}</Text>

      <Text style={styles.fieldLabel}>Dirección:</Text>
      <Text style={styles.fieldValue}>{user.address || '-'}</Text>

      <Button
        title="Editar perfil"
        onPress={() => navigation.navigate('EditProfile')}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={signOut} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },
  placeholderAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#666',
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  fieldValue: {
    fontSize: 16,
  },
});
