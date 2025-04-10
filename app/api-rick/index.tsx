import { StyleSheet, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

// Definimos la interfaz para los personajes
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Componente para mostrar un personaje
const CharacterCard = ({ character }: { character: Character }) => {
  const colorScheme = useColorScheme();
  
  // Función para determinar el color del estado
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return '#4CAF50'; // Verde
      case 'dead':
        return '#F44336'; // Rojo
      default:
        return '#9E9E9E'; // Gris
    }
  };
  
  return (
    <ThemedView style={[styles.card, { 
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
    }]}>
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: character.image }} 
          style={styles.characterImage} 
        />
        <View style={styles.characterInfo}>
          <View style={styles.nameContainer}>
            <ThemedText style={styles.characterName}>{character.name}</ThemedText>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(character.status) }]} />
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol size={16} name="person.fill" color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.characterInfoText}>{character.species}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol size={16} name="mappin.and.ellipse" color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.characterInfoText}>{character.location.name}</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default function RickAndMortyScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const colorScheme = useColorScheme();

  // Función para cargar personajes
  const fetchCharacters = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${pageNum}`);
      const data = await response.json();
      
      if (pageNum === 1) {
        setCharacters(data.results);
      } else {
        setCharacters(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.info.next !== null);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar personajes al montar el componente
  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  // Función para cargar más personajes
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Función para ver detalles de un personaje
  const viewCharacterDetails = (character: Character) => {
    // Aquí podrías navegar a una pantalla de detalles
    // Por ahora, solo mostraremos un mensaje
    alert(`Ver detalles de ${character.name}`);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Personajes</ThemedText>
        <View style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.searchText}>Buscar personaje...</ThemedText>
        </View>
      </View>
      
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Cargando personajes...</ThemedText>
        </View>
      ) : characters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol size={60} name="person.3.fill" color={Colors[colorScheme ?? 'light'].text + '40'} />
          <ThemedText style={styles.emptyText}>No se encontraron personajes</ThemedText>
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CharacterCard 
              character={item} 
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
    backgroundColor:"tan",
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
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 12,
  },
  characterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  characterInfoText: {
    fontSize: 14,
    marginLeft: 6,
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
});
