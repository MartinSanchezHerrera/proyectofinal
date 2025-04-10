import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, Auth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAD2aQ4w4GEOptnfXANNTLmtfeERdqVY7c",
  authDomain: "ubicacion-8e84d.firebaseapp.com",
  projectId: "ubicacion-8e84d",
  storageBucket: "ubicacion-8e84d.firebasestorage.app",
  messagingSenderId: "226293772662",
  appId: "1:226293772662:web:afde63f425db3f5ae0ca57",
  measurementId: "G-16KQQNEHDT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar autenticación
let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: ReactNativeAsyncStorage ? 
      require('firebase/auth').getReactNativePersistence(ReactNativeAsyncStorage) : 
      require('firebase/auth').inMemoryPersistence
  });
}

const db = getFirestore(app);

// Manejar sesión en SecureStore para móviles
auth.onAuthStateChanged(async (user: any) => {
  if (Platform.OS !== "web") {
    if (user) {
      await SecureStore.setItemAsync("userToken", JSON.stringify(user));
    } else {
      await SecureStore.deleteItemAsync("userToken");
    }
  }
});

export { auth, db };
