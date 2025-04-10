import ImageGallery from "@/components/foto-galeria/ImageGallery/gallery";
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function FotoGaleriaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ImageGallery />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

