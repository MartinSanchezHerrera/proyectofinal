import React, { useEffect, useState } from "react";
import {ScrollView,StyleSheet,Text,View,TouchableOpacity,Image,ActivityIndicator,} from "react-native";
import { Vista } from "./api/vista";
import {Character} from "./api/datos";

export function PersonajesView() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        const data = await response.json();

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

        setCharacters(mappedCharacters);
        setPages(data.info.pages);
      } catch (err) {
        setError("Error al cargar los personajes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [page]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.title}>Cargando personajes...</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rick & Morty</Text>
      </View>

      {/* Paginador */}
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

      {/* Lista de personajes */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {characters.map((character) => (
          <Vista key={character.id} character={character} />
        ))}
      </ScrollView>

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
    backgroundColor: "black",
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
  title:{

  },
  errorContainer:
  {},
  errorText:{}
  

  
});
