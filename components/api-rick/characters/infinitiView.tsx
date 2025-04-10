import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { Vista } from "./api/vista";
import { Character } from "./api/datos";

export function InfinitiView() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true); // Para verificar si hay más personajes
  const totalCharacters = useRef<number>(0);

  const fetchCharacters = async (pageToFetch: number) => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageToFetch}`);
      const data = await response.json();

      // Mapear los datos obtenidos
      const mappedCharacters: Character[] = data.results.map((char: any) => ({
        id: char.id,
        name: char.name,
        status: char.status,
        origin: char.origin.name,
        species: char.species,
        location: {
          name: char.location.name,
        },
        image: char.image,
      }));

      setCharacters((prev) => [...prev, ...mappedCharacters]); // Conservar los personajes actuales y añadir los nuevos
      totalCharacters.current += mappedCharacters.length; // Incrementar el total de personajes
      setHasNextPage(data.info.next !== null); // Actualizar si hay más páginas por cargar
    } catch (error) {
      console.error("Error al cargar personajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page);
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
      {/* Header con estado de carga */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rick & Morty</Text>
        <Text style={styles.headerSubtitle}>
          {loading ? "Cargando personajes..." : `Total personajes cargados: ${totalCharacters.current}`}
        </Text>
      </View>

      {/* FlatList para manejar desplazamiento y carga infinita */}
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Vista character={item} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5} // Cargar más personajes cuando se llega al 50% del final
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer */}
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
