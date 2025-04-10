// locationMaps/locationView.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { saveLocation } from '@/lib/locationService';

export default function LocationView() {
  // Estado para almacenar la ubicación del dispositivo
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  // Estado para mensajes de error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Estado para la región del mapa (centrado en la ubicación)
  const [region, setRegion] = useState<any>(null);
  
  // Hook de navegación para poder ir a la pantalla de historial
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Solicita permisos para acceder a la ubicación en primer plano
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado.');
        return;
      }
      // Obtiene la ubicación actual del dispositivo
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      // Define la región del mapa centrada en la ubicación actual
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      // Guarda automáticamente la ubicación cuando se obtiene
      try {
        await saveLocation(loc.coords.latitude, loc.coords.longitude);
      } catch (error) {
        console.error('Error al guardar la ubicación inicial:', error);
      }
    })();
  }, []);

  // Función para guardar la ubicación en Firestore
  const handleSaveLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'No se ha obtenido la ubicación.');
      return;
    }
    try {
      await saveLocation(location.coords.latitude, location.coords.longitude);
      Alert.alert('Éxito', 'Ubicación guardada en Firebase.');
    } catch (error) {
      console.error('Error al guardar la ubicación: ', error);
      Alert.alert('Error', 'No se pudo guardar la ubicación.');
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Muestra el mapa centrado en la ubicación actual */}
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Mi ubicación"
          description="Esta es la ubicación actual del dispositivo."
        />
      </MapView>
      {/* Contenedor superpuesto que muestra las coordenadas */}
      <View style={styles.coordsContainer}>
        <Text style={styles.coordsText}>
          Latitud: {location.coords.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordsText}>
          Longitud: {location.coords.longitude.toFixed(6)}
        </Text>
      </View>
      {/* Botones para guardar la ubicación y ver el historial */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveLocation}>
          <Text style={styles.buttonText}>Guardar Ubicación</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/(tabs)/main')}
        >
          <Text style={styles.buttonText}>Ver Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  coordsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
  },
  coordsText: {
    fontSize: 16,
    color: '#1B5E20',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
