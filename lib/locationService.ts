import { db } from './firebaseConfig';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';

// Interfaz para el tipo de datos de ubicación
export interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

// Función para guardar una nueva ubicación
export const saveLocation = async (latitude: number, longitude: number) => {
  try {
    const locationData = {
      latitude,
      longitude,
      timestamp: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'datos'), locationData);
    console.log('Ubicación guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la ubicación:', error);
    throw error;
  }
};

// Función para obtener las últimas 
export const getLastLocations = async (): Promise<LocationData[]> => {
  try {
    const locationsQuery = query(
      collection(db, 'datos'),
      orderBy('timestamp', 'desc'),
      limit(15)
    );

    const querySnapshot = await getDocs(locationsQuery);
    const locations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as LocationData[];

    return locations;
  } catch (error) {
    console.error('Error al obtener las ubicaciones:', error);
    throw error;
  }
}; 