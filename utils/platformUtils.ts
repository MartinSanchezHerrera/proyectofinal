import { Platform } from 'react-native';

/**
 * Verifica si la aplicación se está ejecutando en la web
 */
export const isWeb = Platform.OS === 'web';

/**
 * Verifica si la aplicación se está ejecutando en iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Verifica si la aplicación se está ejecutando en Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Verifica si la aplicación se está ejecutando en una plataforma nativa (iOS o Android)
 */
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Obtiene un componente específico según la plataforma
 * @param options Objeto con opciones para cada plataforma
 * @returns El componente correspondiente a la plataforma actual
 */
export function getPlatformComponent<T>(options: {
  web?: T;
  ios?: T;
  android?: T;
  default: T;
}): T {
  if (isWeb && options.web !== undefined) {
    return options.web;
  }
  
  if (isIOS && options.ios !== undefined) {
    return options.ios;
  }
  
  if (isAndroid && options.android !== undefined) {
    return options.android;
  }
  
  return options.default;
} 