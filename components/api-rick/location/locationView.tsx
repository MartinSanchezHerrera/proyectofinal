import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { VistaL } from "./apiL/vistaL";
import{ Location} from "./apiL/datosL";

export function LocationView() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${page}`);
        const data = await response.json();

        const mappedLocations: Location[] = data.results.map((loc: any) => ({
          id: loc.id,
          name: loc.name,
          type: loc.type,
          dimension: loc.dimension,
          residents: loc.residents,
        }));

        setLocations(mappedLocations);
        setPages(data.info.pages);
      } catch (err) {
        setError("Error al cargar las ubicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [page]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.title}>Cargando ubicaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ubicaciones</Text>

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

      <ScrollView contentContainerStyle={styles.listContainer}>
        {locations.map((location) => (
          <VistaL key={location.id} location={location} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { fontSize: 24, fontWeight: "bold", color: "#FFF", textAlign: "center", marginVertical: 10 },
  paginator: { flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#1E1E1E" },
  button: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 8 },
  disabledButton: { backgroundColor: "#999" },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  pageInfo: { color: "#FFF", fontSize: 16 },
  listContainer: { padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  errorText: { color: "#FF5252", fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF" },
});
