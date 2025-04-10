import React, { useState } from "react";
import { View, TextInput, Button, Modal, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Note } from "./note";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Interfaz para las props del modal
interface NoteModalProps {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onSaved: (note: Note) => void;
  saving?: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({ open, note, onClose, onSaved, saving = false }) => {
  // Estados locales para manejar los cambios en la nota
  const [title, setTitle] = useState(note?.title || "");
  const [text, setText] = useState(note?.text || "");
  const colorScheme = useColorScheme();

  // Función para manejar el guardado de la nota
  const handleSave = () => {
    if (!note) return;
    // Se llama a la función onSaved pasando la nota actualizada (se mantienen id y fecha originales)
    onSaved({
      ...note,
      title,
      text,
    });
    onClose(); // Cerrar el modal después de guardar
  };

  return (
    <Modal visible={open} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <ThemedView style={[styles.modalContent, { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
        }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              {note?.id === 0 ? "Nueva Nota" : "Editar Nota"}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol size={24} name="xmark" color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.input, { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }]}
            placeholder="Título"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea, { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }]}
            placeholder="Contenido"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
          />
          <View style={styles.buttonContainer}>
            {saving ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
                <ThemedText style={styles.loadingText}>Guardando...</ThemedText>
              </View>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                  onPress={handleSave}
                >
                  <IconSymbol size={18} name="checkmark" color="white" />
                  <ThemedText style={styles.buttonText}>Guardar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <IconSymbol size={18} name="xmark" color={Colors[colorScheme ?? 'light'].text} />
                  <ThemedText style={[styles.buttonText, { color: Colors[colorScheme ?? 'light'].text }]}>Cancelar</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  saveButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default NoteModal;