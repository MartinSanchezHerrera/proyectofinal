import { Image, StyleSheet, View, Text } from "react-native";
import{Character} from "@/components/api-rick/characters/api/datos";

type Props = {character: Character;};

export function Vista({ character }: Props) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: character.image }} />
      <View style={styles.content}>
        <Text style={styles.title}>{character.name}</Text>
        <Text style={styles.text}>Status: {character.status}</Text>
        <Text style={styles.text}>Species: {character.species}</Text>
        <Text style={styles.text}>Origin: {character.origin}</Text>
        <Text style={styles.text}>Location: {character.location.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  content: {
    padding: 12,
    justifyContent: "space-evenly",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "cursive",
    fontWeight: "bold",
    color: "#4CAF50",
  },
  text: {
    fontSize: 14,
    color: "#333333",
  },
});