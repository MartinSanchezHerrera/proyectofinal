import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getLastLocations } from '@/lib/locationService';
import * as Location from 'expo-location';

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  address?: string;
}

export default function LocationListView() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsList = await getLastLocations();
        
        // Obtener la dirección para cada ubicación
        const locationsWithAddress = await Promise.all(
          locationsList.map(async (loc) => {
            try {
              const [address] = await Location.reverseGeocodeAsync({
                latitude: loc.latitude,
                longitude: loc.longitude,
              });
              
              const formattedAddress = address 
                ? `${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`
                : 'Dirección no disponible';
              
              return {
                ...loc,
                address: formattedAddress
              };
            } catch (error) {
              console.error('Error al obtener la dirección:', error);
              return {
                ...loc,
                address: 'Dirección no disponible'
              };
            }
          })
        );

        setLocations(locationsWithAddress);
      } catch (error) {
        console.error("Error al obtener las ubicaciones: ", error);
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
      <Text style={styles.title}>Historial de Ubicaciones</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.coordinates}>
              Lat: {item.latitude.toFixed(6)}
              {'\n'}
              Lng: {item.longitude.toFixed(6)}
            </Text>
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay ubicaciones registradas.</Text>
        }
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
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  address: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
}); 