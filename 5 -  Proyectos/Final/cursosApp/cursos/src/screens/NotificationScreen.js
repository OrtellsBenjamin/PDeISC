// NotificationsScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function NotificationsScreen() {
  const { session, profile } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`http://192.168.100.71:4000/api/users/${profile.id}/notifications`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {notifications.length === 0 && (
        <Text style={styles.empty}>No tenés notificaciones.</Text>
      )}
      {notifications.map((n) => (
        <View key={n.id} style={[styles.card, n.read && styles.read]}>
          <Text style={styles.message}>{n.message}</Text>
          <Text style={styles.date}>
            {new Date(n.created_at).toLocaleString('es-AR')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0B7077', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#0B7077',
  },
  read: { opacity: 0.6 },
  message: { fontSize: 15, color: '#333' },
  date: { fontSize: 12, color: '#666', marginTop: 4 },
  empty: { color: '#777', textAlign: 'center', marginTop: 40 },
});
