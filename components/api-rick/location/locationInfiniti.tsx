import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { VistaL } from "./apiL/vistaL";
import{ Location} from "./apiL/datosL";

export function LocationInfiniti() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const totalLocations = useRef<number>(0);

  const fetchLocations = async (pageToFetch: number) => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location?page=${pageToFetch}`);
      const data = await response.json();

      const mappedLocations: Location[] = data.results.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
        type: loc.type,
        dimension: loc.dimension,
        residents: loc.residents,
      }));

      setLocations((prev) => [...prev, ...mappedLocations]);
      totalLocations.current += mappedLocations.length;
      setHasNextPage(data.info.next !== null);
    } catch (error) {
      console.error("Error al cargar ubicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations(page);
  }, [page]);

  const handleEndReached = () => {
    if (!loading && hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ubicaciones</Text>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <VistaL location={item} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#4CAF50" /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
container: { flex: 1,
backgroundColor: "#121212",
padding: 10 },
header: { fontSize: 24,
fontWeight: "bold",
color: "#FFF",
textAlign: "center",
marginVertical: 10 },
});
