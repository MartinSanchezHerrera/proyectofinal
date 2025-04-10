import { View, Text, StyleSheet } from "react-native";
import { Location } from "./datosL";

type Props = { location: Location };

export function VistaL({ location }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{location.name}</Text>
      <Text style={styles.text}>Tipo: {location.type}</Text>
      <Text style={styles.text}>Dimensión: {location.dimension}</Text>
      <Text style={styles.text}>Residentes: {location.residents.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
card: { padding: 10,margin: 10,
backgroundColor: "#222", borderRadius: 10 },
title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
text: { fontSize: 14, color: "#ddd" },
});
