// screens/LocationHistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLastLocations, LocationData } from '@/lib/locationService';

export default function LocationHistoryScreen() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsList = await getLastLocations();
        setLocations(locationsList);
        
        // Define la región inicial del mapa basada en la ubicación más reciente
        if (locationsList.length > 0) {
          setRegion({
            latitude: locationsList[0].latitude,
            longitude: locationsList[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (error) {
        console.error("Error al obtener el historial: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando historial de ubicaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Ubicaciones (Últimas 15)</Text>
      {region && (
        <MapView style={styles.map} initialRegion={region}>
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              title="Ubicación registrada"
              description={loc.timestamp.toLocaleString()}
            />
          ))}
        </MapView>
      )}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              {item.timestamp.toLocaleString()} - Lat: {item.latitude.toFixed(6)}, Lng: {item.longitude.toFixed(6)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay ubicaciones registradas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
    marginVertical: 10,
  },
  map: {
    height: '50%',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
