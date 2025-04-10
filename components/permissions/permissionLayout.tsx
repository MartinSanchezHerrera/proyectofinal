import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: any;
  title: string; 
  granted: boolean;
  requestPermission: () => void;
};

export default function PermissionsLayout({ icon, title, granted, requestPermission }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={24} color="white" />
      <Text style={styles.title}>{title}</Text>

      {granted ? (
        <Ionicons name="checkmark-circle-sharp" size={24} color="green" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autorizar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center", // Asegura que todos los elementos estén alineados verticalmente
    paddingHorizontal: 16, // Añade un poco de padding horizontal
    paddingVertical: 10, // Añade un poco de padding vertical
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1, // Permite que el título ocupe el espacio disponible
    marginLeft: 30, // Espacio entre el ícono y el título
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 12, // Padding horizontal para el botón
    paddingVertical: 8, // Padding vertical para el botón
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});