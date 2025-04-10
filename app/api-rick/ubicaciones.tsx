import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import SafeMap from '@/components/SafeMap';

// Definimos la interfaz para las ubicaciones
interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

// Componente para mostrar una ubicación
const LocationCard = ({ location, onPress }: { location: Location; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  
  return (
    <TouchableOpacity 
      style={[styles.card, { 
        backgroundColor: Colors[colorScheme ?? 'light'].background,
        borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.locationHeader}>
          <ThemedText style={styles.locationName}>{location.name}</ThemedText>
          <View style={[styles.typeBadge, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
          }]}>
            <ThemedText style={styles.typeText}>{location.type}</ThemedText>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <IconSymbol size={16} name="globe" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.locationInfo}>{location.dimension}</ThemedText>
        </View>
        
        <View style={styles.infoRow}>
          <IconSymbol size={16} name="person.2.fill" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.locationInfo}>{location.residents.length} residentes</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function UbicacionesScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const colorScheme = useColorScheme();

  // Función para cargar ubicaciones
  const fetchLocations = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://rickandmortyapi.com/api/location/?page=${pageNum}`);
      const data = await response.json();
      
      if (pageNum === 1) {
        setLocations(data.results);
      } else {
        setLocations(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.info.next !== null);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    fetchLocations(page);
  }, [page]);

  // Función para cargar más ubicaciones
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Función para ver detalles de una ubicación
  const viewLocationDetails = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Ubicaciones</ThemedText>
        <View style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.searchText}>Buscar ubicación...</ThemedText>
        </View>
      </View>
      
      {selectedLocation ? (
        <View style={styles.mapContainer}>
          <SafeMap
            style={styles.map}
            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => setSelectedLocation(null)}
          >
            <IconSymbol size={20} name="arrow.left" color="white" />
            <ThemedText style={styles.backButtonText}>Volver</ThemedText>
          </TouchableOpacity>
        </View>
      ) : loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Cargando ubicaciones...</ThemedText>
        </View>
      ) : locations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol size={60} name="map.fill" color={Colors[colorScheme ?? 'light'].text + '40'} />
          <ThemedText style={styles.emptyText}>No se encontraron ubicaciones</ThemedText>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LocationCard 
              location={item} 
              onPress={() => viewLocationDetails(item)} 
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            loading && page > 1 ? (
              <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} style={styles.loader} />
            ) : null
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
  },
  cardContent: {
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.8,
  },
  loader: {
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
}); 