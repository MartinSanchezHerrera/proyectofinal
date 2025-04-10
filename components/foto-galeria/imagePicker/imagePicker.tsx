/**
 * Componente ImagePicker
 * 
 * Este componente proporciona una interfaz para seleccionar imágenes,
 * ya sea tomando una foto con la cámara o seleccionando una imagen de la galería.
 * Incluye:
 * - Botón de cámara que abre un modal con opciones
 * - Modal con opciones de cámara y galería
 * - Manejo de permisos para acceder a la galería
 * - Integración con expo-image-picker para la galería
 */

import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Modal, TouchableOpacity, View, StyleSheet, Text, Alert } from "react-native";
import { CameraComponent } from "./cameraView";
import { PhotoPreview } from "./photoPreview";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';

// Paleta de colores
const COLORS = {
    primary: '#2E7D32',      // Verde oscuro
    secondary: '#81C784',    // Verde claro
    background: '#F5F5F5',   // Gris muy claro
    surface: '#FFFFFF',      // Blanco
    text: '#1B5E20',        // Verde oscuro para texto
    textLight: '#4CAF50',   // Verde medio para texto secundario
    border: '#E8F5E9',      // Verde muy claro para bordes
    shadow: 'rgba(46, 125, 50, 0.1)', // Verde con transparencia para sombras
};

interface ImagePickerProps {
    onImageSelected: (uri: string) => void;
}

export default function ImagePickerComponent({ onImageSelected }: ImagePickerProps) {
    const [open, setOpen] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso requerido',
                    'Se necesita acceso a la galería para seleccionar imágenes.',
                    [{ text: 'OK' }]
                );
                return;
            }
        })();
    }, []);

    const onTakePicture = (uri: string) => {
        setPreviewUri(uri);
        setCameraOpen(false);
    };

    const onSavePreview = (uri: string) => {
        onImageSelected(uri);
        setPreviewUri(null);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPreviewUri(result.assets[0].uri);
        }
        setOpen(false);
    };

    return (
        <>
            {/* Botón principal de cámara */}
            <TouchableOpacity 
                style={styles.cameraButton}
                onPress={() => setOpen(true)}
            >
                <Ionicons name="camera" size={28} color={COLORS.surface} />
            </TouchableOpacity>

            {/* Modal de opciones */}
            <Modal
                visible={open}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity 
                            style={styles.modalOption}
                            onPress={() => {
                                setOpen(false);
                                setCameraOpen(true);
                            }}
                        >
                            <Ionicons name="camera" size={32} color={COLORS.primary} />
                            <Text style={styles.modalOptionText}>Tomar foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.modalOption}
                            onPress={pickImage}
                        >
                            <Ionicons name="images" size={32} color={COLORS.primary} />
                            <Text style={styles.modalOptionText}>Galería</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setOpen(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Vista de cámara */}
            <Modal
                visible={cameraOpen}
                animationType="slide"
                onRequestClose={() => setCameraOpen(false)}
            >
                <CameraComponent 
                    onTakePicture={onTakePicture} 
                    onCancel={() => setCameraOpen(false)}
                />
            </Modal>

            {/* Vista previa de la foto */}
            <Modal
                visible={!!previewUri}
                animationType="slide"
                onRequestClose={() => setPreviewUri(null)}
            >
                {previewUri && (
                    <PhotoPreview
                        uri={previewUri}
                        onSave={onSavePreview}
                        onCancel={() => setPreviewUri(null)}
                        newPhoto={() => {
                            setPreviewUri(null);
                            setCameraOpen(true);
                        }}
                    />
                )}
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    cameraButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalOptionText: {
        marginLeft: 15,
        fontSize: 18,
        color: COLORS.text,
        fontWeight: '500',
    },
    closeButton: {
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: '600',
    },
});
