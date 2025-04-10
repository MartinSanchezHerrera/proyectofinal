import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { ThemedText } from './ThemedText';

interface SafeMapProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const SafeMap: React.FC<SafeMapProps> = ({ style, initialRegion }) => {
  // Si estamos en web, mostramos un mensaje en lugar del mapa
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webContainer, style]}>
        <ThemedText style={styles.webText}>
          Los mapas no están disponibles en la versión web.
        </ThemedText>
      </View>
    );
  }

  // En plataformas nativas, mostramos el mapa real
  return (
    <MapView
      style={[styles.map, style]}
      initialRegion={initialRegion}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  webText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default SafeMap; 