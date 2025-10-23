
import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';

import { AuthContext } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
// (asegúrate de tener configurado el .env y el plugin para cargarlo)

export default function LoginScreen() {
  const { signInWithProvider } = useContext(AuthContext);

  // Configuración de request para Google
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: googleClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        useProxy: true,
      }),
      responseType: ResponseType.IdToken,
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
      revocationEndpoint:
        'https://oauth2.googleapis.com/revoke',
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      // Llamar a tu contexto / servicio para “loguear” con Google
      signInWithProvider('google', { id_token, access_token });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido</Text>
      <Button
        disabled={!request}
        title="Ingresar con Google"
        onPress={() => {
          promptAsync();
        }}
      />
      {/* análogamente puedes agregar botones para Facebook, Apple */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
});
