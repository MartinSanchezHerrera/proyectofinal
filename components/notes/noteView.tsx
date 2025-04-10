import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { getNotes, saveNote, deleteNote } from "./dataSource";
import { Note } from "./note";
import NoteCard from "./noteCard";
import NoteModal from "./noteModal";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";

const NotesView = () => {
  // Estado para almacenar la lista de notas
  const [notes, setNotes] = useState<Note[]>([]);
  // Estado para la nota seleccionada para edición o creación
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  // Estado para mostrar u ocultar el modal
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para indicar si se están cargando las notas
  const [loading, setLoading] = useState(true);
  // Estado para indicar si se está guardando una nota
  const [saving, setSaving] = useState(false);
  
  const colorScheme = useColorScheme();

  // Función para iniciar la creación de una nueva nota
  const handleAddNote = () => {
    // Se crea una nota con id 0 (nota nueva) y fecha actual en formato ISO
    setSelectedNote({ id: 0, title: "", text: "", date: new Date().toISOString() });
    setModalVisible(true);
  };

  // Función para guardar una nota (creación o actualización)
  const onSaveNote = async (note: Note) => {
    setSaving(true);
    try {
      const result = await saveNote(note);
      if (!result) {
        Alert.alert("Error", "No se pudo guardar la nota. Inténtalo de nuevo.");
        return;
      }
      // Se actualiza la nota con el id retornado por Supabase
      const updatedNote = { ...note, id: result.id };
      // Si es una nota nueva (id === 0) se agrega al inicio de la lista
      if (note.id === 0) {
        setNotes([updatedNote, ...notes]);
      } else {
        // Si es una nota existente, se actualiza en la lista
        setNotes(notes.map((item) => (item.id === note.id ? updatedNote : item)));
      }
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", `Error al guardar la nota: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Función para eliminar una nota
  const onDeleteNote = async (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteNote(id);
              if (success) {
                // Se filtra la nota eliminada de la lista
                setNotes(notes.filter((note) => note.id !== id));
              } else {
                Alert.alert("Error", "No se pudo eliminar la nota. Inténtalo de nuevo.");
              }
            } catch (error: any) {
              Alert.alert("Error", `Error al eliminar la nota: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  // Efecto para cargar las notas al iniciar el componente
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      try {
        const results = await getNotes();
        setNotes(results);
      } catch (error: any) {
        Alert.alert("Error", `Error al cargar las notas: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Notas</ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={handleAddNote}
        >
          <IconSymbol size={20} name="plus" color="white" />
          <ThemedText style={styles.addButtonText}>Nueva Nota</ThemedText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Cargando notas...</ThemedText>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol size={60} name="note.text" color={Colors[colorScheme ?? 'light'].text + '40'} />
          <ThemedText style={styles.emptyText}>No hay notas. ¡Agrega una nueva!</ThemedText>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // Al presionar la nota se abre el modal para editarla
            <TouchableOpacity 
              onPress={() => { setSelectedNote(item); setModalVisible(true); }}
              activeOpacity={0.7}
            >
              <NoteCard
                title={item.title}
                text={item.text}
                date={item.date}
                // Se pasa la función para eliminar la nota a través del botón en la tarjeta
                onDelete={() => onDeleteNote(item.id)}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {modalVisible && selectedNote && (
        <NoteModal
          open={modalVisible}
          note={selectedNote}
          onClose={() => setModalVisible(false)}
          onSaved={onSaveNote}
          saving={saving}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "tan"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default NotesView;