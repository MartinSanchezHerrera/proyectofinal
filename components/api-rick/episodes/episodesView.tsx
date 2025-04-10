import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { VistaE } from "./apiE/vistaE";
import { Episode } from "./apiE/datosE";

export function EpisodesView() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
        const data = await response.json();

        const mappedEpisodes: Episode[] = data.results.map((ep: any) => ({
          id: ep.id,
          name: ep.name,
          air_date: ep.air_date,
          episode: ep.episode,
          characters: ep.characters,
        }));

        setEpisodes(mappedEpisodes);
        setPages(data.info.pages);
      } catch (err) {
        setError("Error al cargar los episodios.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [page]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.title}>Cargando episodios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.title}>Rick & Morty</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rick & Morty - Episodios</Text>
      </View>

      <View style={styles.paginator}>
        <TouchableOpacity
          style={[styles.button, page === 1 && styles.disabledButton]}
          disabled={page === 1}
          onPress={() => setPage((prev) => prev - 1)}
        >
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Página {page} de {pages}
        </Text>
        <TouchableOpacity
          style={[styles.button, page === pages && styles.disabledButton]}
          disabled={page === pages}
          onPress={() => setPage((prev) => prev + 1)}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        {episodes.map((episode) => (
          <VistaE key={episode.id} episode={episode} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    padding: 20,
    backgroundColor: "#00BCD4",
    alignItems: "center",
    borderBottomColor: "#4CAF50",
    borderBottomWidth: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "cursive",
    color: "#FFFFFF",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  paginator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1E1E1E",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  pageInfo: {
    color: "#FFF",
    fontSize: 16,
  },
  cardContainer: {
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
