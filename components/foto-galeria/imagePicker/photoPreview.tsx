/**
 * Componente PhotoPreview
 * 
 * Este componente muestra una vista previa de la foto tomada
 * y permite guardarla, cancelar o tomar una nueva foto.
 * Incluye:
 * - Vista previa de la imagen capturada
 * - Botones para guardar, cancelar y tomar nueva foto
 * - Diseño minimalista y moderno
 */

import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

interface PhotoPreviewProps {
    uri: string;
    onSave: (uri: string) => void;
    onCancel: () => void;
    newPhoto: () => void;
}

export function PhotoPreview({ uri, onSave, onCancel, newPhoto }: PhotoPreviewProps) {
    return (
        <View style={styles.container}>
            <Image 
                source={{ uri }} 
                style={styles.image}
                resizeMode="contain"
            />
            
            <View style={styles.controls}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={onCancel}
                >
                    <Ionicons name="close-circle" size={32} color={COLORS.textLight} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => onSave(uri)}
                >
                    <Ionicons name="checkmark-circle" size={32} color={COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={newPhoto}
                >
                    <Ionicons name="camera" size={32} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '80%',
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        margin: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
});