import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


type Props = {
    onCancel: () => void;      
    onTakePicture: (uri: string) => void;  
};

export function CameraComponent(
    { onCancel, onTakePicture }: Props
) {
  
  const [facing, setFacing] = useState<CameraType>('back');
  
  const ref = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();

  
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  /**
   */
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  /**
   * Toma una foto y la envía a través del callback onTakePicture
   */
  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    onTakePicture(photo?.uri ?? '');
  }

  return (
    <View style={styles.container}>
      {/* Vista de la cámara */}
      <CameraView style={styles.camera} facing={facing} ref={ref}>
        {/* Contenedor de botones */}
        <View style={styles.buttonContainer}>
            {/* Botón de cancelar */}
            <TouchableOpacity style={styles.button} onPress={() => onCancel()}>
                <Ionicons name="close" size={28} color="white" />
                <Text style={styles.text}>Cancelar</Text>
            </TouchableOpacity>
            {/* Botón de captura */}
            <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Ionicons name="camera" size={28} color="white" />
                <Text style={styles.text}>Capturar</Text> 
            </TouchableOpacity>
            {/* Botón para cambiar de cámara */}
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={28} color="white" />
                <Text style={styles.text}>Girar</Text>
            </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
