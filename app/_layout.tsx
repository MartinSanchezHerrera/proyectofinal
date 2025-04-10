// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Colors } from '@/constants/Colors';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: Colors[colorScheme ?? 'light'].background,
//           },
//           headerTintColor: Colors[colorScheme ?? 'light'].text,
//         }}>
//         <Stack.Screen 
//           name="index" 
//           options={{ 
//             title: 'Inicio',
//             headerShown: false
//           }} 
//         />
//         <Stack.Screen 
//           name="api-rick" 
//           options={{ 
//             title: 'Rick and Morty',
//             headerShown: true
//           }} 
//         />
//         <Stack.Screen 
//           name="foto-galeria" 
//           options={{ 
//             title: 'Galería de Fotos',
//             headerShown: true
//           }} 
//         />
//         <Stack.Screen 
//           name="locationMaps" 
//           options={{ 
//             title: 'Mapas',
//             headerShown: true
//           }} 
//         />
//         <Stack.Screen 
//           name="notes" 
//           options={{ 
//             title: 'Notas',
//             headerShown: true
//           }} 
//         />
//         <Stack.Screen 
//           name="permissions" 
//           options={{ 
//             title: 'Permisos',
//             headerShown: true
//           }} 
//         />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }


import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons'; // Import AntDesign
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded] = useFonts({SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),});
  const auth = getAuth();
  const colorScheme = useColorScheme();
console.log(isLoggedIn);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    checkStoredSession();

    // Suscribirse a cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Guardar la sesión
        await AsyncStorage.setItem('userSession', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
        setIsLoggedIn(true);
      } else {
        // Eliminar la sesión guardada
        await AsyncStorage.removeItem('userSession');
        setIsLoggedIn(false);

        // mostrar login
      }
    });
    return () => unsubscribe();
  }, []);

  const checkStoredSession = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const userData = JSON.parse(session);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error al verificar la sesión guardada:', error);
    }
  };

  useEffect(() => {
  if (isLoggedIn && loaded) {
    router.replace('/api-rick'); // o la ruta que desees como pantalla inicial
  }
  }, [isLoggedIn, loaded]);


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    }, [loaded]
  );
  if (!loaded) {
    return null;}


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: 'Home',
              title: 'Credenciales',
              drawerIcon: ({ color, size }) => (
                <AntDesign name="home" size={24} color="black" />
              ),
              drawerItemStyle: isLoggedIn ? { display: "none" } : {},

            }}
          />
          <Drawer.Screen
            name="rickAndMorty" 
            options={{
              drawerLabel: 'Rick and Morty',
              title: 'Rick and Morty',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="code-slash" size={size} color={color} />
              ),
              drawerItemStyle: isLoggedIn ? {} : { display: "none" },
            }}
          />
          <Drawer.Screen
            name="gallery" 
            options={{
              drawerLabel: 'Galería',
              title: 'Galería',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="camera-outline" size={size} color={color} />
              ),
              drawerItemStyle: isLoggedIn ? {} : { display: "none" },
            }}
          />
          <Drawer.Screen
            name="location" 
            options={{
              drawerLabel: 'Ubicación',
              title: 'Ubicación',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="location" size={size} color={color} />
              ),
              drawerItemStyle: isLoggedIn ? {} : { display: "none" },
            }}
          />
          <Drawer.Screen
            name="permissions" 
            options={{
              drawerLabel: 'Permisos',
              title: 'Permisos en la aplicación',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="shield-checkmark-outline" size={size} color={color}/>
              ),
              drawerItemStyle: isLoggedIn ? {} : { display: "none" },
            }}
          />
          <Drawer.Screen
            name="notes" 
            options={{
              drawerLabel: 'Notas',
              title: 'Notas Supabase',
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="notes" size={24} color="black" />
              ),
              drawerItemStyle: isLoggedIn ? {} : { display: "none" },
            }}
          />
          <Drawer.Screen
            name="auth" 
            options={{
              title: 'Registro de usuario',
            }}
          />
          <Drawer.Screen
            name="about" 
            options={{
              drawerLabel: 'Acerca del programador',
              title: 'Acerca del programador',
              drawerIcon: ({ color, size }) => (
                <AntDesign name="user" size={size} color={color} />
              ),
              drawerItemStyle: isLoggedIn ? {} : { display: "none" },
            }}
          />
          <Drawer.Screen
            name="+not-found" 
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}