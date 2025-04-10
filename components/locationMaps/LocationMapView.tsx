import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLastLocations } from '@/lib/locationService';

export default function LocationMapView() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsList = await getLastLocations();
        setLocations(locationsList);
        
        // Centrar el mapa en la ubicación más reciente
        if (locationsList.length > 0) {
          setRegion({
            latitude: locationsList[0].latitude,
            longitude: locationsList[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} initialRegion={region}>
          {locations.map((loc, index) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              pinColor={getMarkerColor(index)} // Función para asignar colores diferentes
              title={`Ubicación ${index + 1}`}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

// Función para asignar colores diferentes a los marcadores
const getMarkerColor = (index: number) => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#800000'];
  return colors[index % colors.length];
};

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
}); 