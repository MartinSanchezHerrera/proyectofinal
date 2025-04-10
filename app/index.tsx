import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  return (
    
      <View style={styles.overlay}>
        {/* Logo UTIM */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>    Bienvenido  "PROYECTOS"  </Text>
          <Text style={styles.subtitle}>  </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('./auth')}
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('./auth/register')}
          >
            <Text style={[styles.buttonText, { color: '#003366' }]}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 51, 09, 0.7)',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
  },
  buttonContainer: {
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  primaryButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
});

export default Index;