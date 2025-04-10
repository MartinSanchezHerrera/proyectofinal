import { View, Text, StyleSheet, Image } from "react-native";
import { Episode } from "@/components/api-rick/episodes/apiE/datosE";

type Props = { 
  episode: Episode; 
};

export function VistaE({ episode }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{episode.name}</Text>
      <Text style={styles.text}>Fecha de emisión: {episode.air_date}</Text>
      <Text style={styles.text}>Episodio: {episode.episode}</Text>
      <Image 
        source={require('@/assets/images/rick-morty-breaking-bad.jpg')} 
        style={styles.image} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 10, 
    margin: 10, 
    backgroundColor: "#222", 
    borderRadius: 10 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  text: { 
    fontSize: 14, 
    color: "#ddd" 
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  }
});
