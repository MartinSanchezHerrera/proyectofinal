import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Text, Dimensions } from "react-native";
import ImagePicker from "../imagePicker/imagePicker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Obtener el ancho de la pantalla para calcular el tamaño de las imágenes
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

// Paleta de colores
const COLORS = {
    primary: '#2E7D32',      
    secondary: '#81C784',    
    background: '#F5F5F5',   
    surface: '#FFFFFF',      
    text: '#1B5E20',        
    textLight: '#4CAF50',   
    border: '#E8F5E9',      
    shadow: 'rgba(46, 125, 50, 0.1)', 
};

export default function ImageGallery() {
    const [images, setImages] = useState<string[]>([]);

    /**
     
     * @param uri 
     */
    const handleNewImage = (uri: string) => {
        setImages(prevImages => [...prevImages, uri]);
    };

    /**
     * Elimina una imagen del array de imágenes
     * @param index - Índice de la imagen a eliminar
     */
    const deleteImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return(
        <View style={styles.container}>
            {/* Encabezado con el botón de cámara */}
            <View style={styles.header}>
                <ImagePicker onImageSelected={handleNewImage} />
            </View>
            
            {/* Contenedor principal de la galería */}
            <View style={styles.galleryContainer}>
                {images.length === 0 ? (
                    // Estado vacío con mensaje y diseño minimalista
                    <View style={styles.emptyState}>
                        <Ionicons name="images-outline" size={60} color={COLORS.primary} />
                        <Text style={styles.emptyStateTitle}>Tu galería está vacía</Text>
                        <Text style={styles.emptyStateText}>
                            Toma fotos o selecciona imágenes para comenzar
                        </Text>
                    </View>
                ) : (
                    // Grid de imágenes
                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.imageGrid}>
                            {images.map((imageUri, index) => (
                                <View key={index} style={styles.imageContainer}>
                                    <Image 
                                        source={{ uri: imageUri }} 
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.imageOverlay}>
                                        <Ionicons name="image" size={24} color={COLORS.surface} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

// Estilos del componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 15,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
    galleryContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: SPACING,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageContainer: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        marginBottom: SPACING,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: COLORS.surface,
        margin: 20,
        borderRadius: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 20,
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
});