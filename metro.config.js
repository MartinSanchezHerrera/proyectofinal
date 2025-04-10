// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configuración para excluir módulos nativos en web
if (process.env.EXPO_TARGET === 'web') {
  config.resolver.blockList = [
    /react-native-maps\/lib\/MapMarkerNativeComponent\.js$/,
    /react-native\/Libraries\/Utilities\/codegenNativeCommands/,
  ];
  
  // Alternativa: proporcionar un módulo vacío para estos imports
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native/Libraries/Utilities/codegenNativeCommands': path.resolve(__dirname, 'utils/emptyModule.js'),
  };
}

module.exports = config; 