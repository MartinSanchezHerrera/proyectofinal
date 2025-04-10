import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Definimos la interfaz para los episodios
interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

// Componente para mostrar un episodio
const EpisodeCard = ({ episode, onPress }: { episode: Episode; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  
  // Extraer el número de temporada y episodio
  const getEpisodeInfo = (episodeCode: string) => {
    const match = episodeCode.match(/S(\d+)E(\d+)/);
    if (match) {
      return {
        season: match[1],
        episode: match[2]
      };
    }
    return { season: '?', episode: '?' };
  };
  
  const episodeInfo = getEpisodeInfo(episode.episode);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]} 
      onPress={onPress}
    >
      <View style={styles.episodeBadge}>
        <ThemedText style={styles.episodeNumber}>
          S{episodeInfo.season}E{episodeInfo.episode}
        </ThemedText>
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.episodeName}>{episode.name}</ThemedText>
        <View style={styles.infoRow}>
          <IconSymbol size={16} name="calendar" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.episodeInfo}>{episode.air_date}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol size={16} name="person.2.fill" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.episodeInfo}>{episode.characters.length} personajes</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function EpisodiosScreen() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const colorScheme = useColorScheme();

  // Función para cargar episodios
  const fetchEpisodes = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://rickandmortyapi.com/api/episode/?page=${pageNum}`);
      const data = await response.json();
      
      if (pageNum === 1) {
        setEpisodes(data.results);
      } else {
        setEpisodes(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.info.next !== null);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar episodios al montar el componente
  useEffect(() => {
    fetchEpisodes(page);
  }, [page]);

  // Función para cargar más episodios
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Función para ver detalles de un episodio
  const viewEpisodeDetails = (episode: Episode) => {
    // Aquí podrías navegar a una pantalla de detalles
    // Por ahora, solo mostraremos un mensaje
    alert(`Ver detalles de ${episode.name}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Episodios de Rick and Morty</ThemedText>
      
      <FlatList
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EpisodeCard 
            episode={item} 
            onPress={() => viewEpisodeDetails(item)} 
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
      />
      
      {loading && page === 1 && (
        <View style={styles.initialLoader}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'tan',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  episodeBadge: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  episodeNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  episodeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  episodeInfo: {
    fontSize: 14,
    marginLeft: 6,
  },
  loader: {
    marginVertical: 20,
  },
  initialLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
}); 