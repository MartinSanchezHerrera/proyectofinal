import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { VistaE } from "./apiE/vistaE";
import { Episode } from "./apiE/datosE";

export function EpisodesInfiniti() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const totalEpisodes = useRef<number>(0);

  const fetchEpisodes = async (pageToFetch: number) => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${pageToFetch}`);
      const data = await response.json();

      const mappedEpisodes: Episode[] = data.results.map((ep: any) => ({
        id: ep.id,
        name: ep.name,
        air_date: ep.air_date,
        episode: ep.episode,
      }));

      setEpisodes((prev) => [...prev, ...mappedEpisodes]);
      totalEpisodes.current += mappedEpisodes.length;
      setHasNextPage(data.info.next !== null);
    } catch (error) {
      console.error("Error al cargar episodios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes(page);
  }, [page]);

  const handleEndReached = () => {
    if (!loading && hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rick & Morty</Text>
        <Text style={styles.headerSubtitle}>
          {loading ? "Cargando episodios..." : `Total episodios cargados: ${totalEpisodes.current}`}
        </Text>
      </View>

      <FlatList
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <VistaE episode={item} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <Image
          source={{ uri: "https://rickandmortyapi.com/api/character/avatar/118.jpeg" }}
          style={styles.footerImage}
        />
        <Text style={styles.footerText}>Evil Forty</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerSubtitle: {
    fontSize: 16,
    color: "#E0E0E0",
  },
  listContainer: {
    padding: 10,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footer: {
    padding: 5,
    backgroundColor: "#333",
    alignItems: "center",
    borderTopColor: "#4CAF50",
    borderTopWidth: 4,
  },
  footerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "cyan",
    borderWidth: 2,
    marginBottom: 8,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
