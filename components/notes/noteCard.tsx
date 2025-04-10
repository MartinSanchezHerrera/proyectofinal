import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Interfaz para las propiedades que recibe el componente
interface NoteCardProps {
  title: string;
  text: string;
  date: string;
  // Propiedad opcional para la eliminación de la nota
  onDelete?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, text, date, onDelete }) => {
  const colorScheme = useColorScheme();
  
  // Formatear la fecha para mostrarla de manera más amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ThemedView style={[styles.card, { 
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
    }]}>
      {/* Título de la nota */}
      <ThemedText style={styles.title}>{title}</ThemedText>
      
      {/* Contenido de la nota */}
      <ThemedText style={styles.text} numberOfLines={3}>
        {text}
      </ThemedText>
      
      {/* Fecha de la nota en formato legible */}
      <View style={styles.dateContainer}>
        <IconSymbol size={14} name="calendar" color={Colors[colorScheme ?? 'light'].text} />
        <ThemedText style={styles.date}>{formatDate(date)}</ThemedText>
      </View>
      
      {/* Botón para eliminar la nota (se muestra solo si se pasa la función onDelete) */}
      {onDelete && (
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]} 
          onPress={onDelete}
        >
          <IconSymbol size={16} name="trash" color="white" />
          <ThemedText style={styles.deleteButtonText}>Eliminar</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
    opacity: 0.9,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  date: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.7,
  },
  deleteButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 14,
  },
});

export default NoteCard;