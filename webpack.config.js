const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Configuración para manejar módulos nativos en web
  config.resolve.alias = {
    ...config.resolve.alias,
    // Proporcionar un módulo vacío para codegenNativeCommands
    'react-native/Libraries/Utilities/codegenNativeCommands': './utils/emptyModule.js',
  };
  
  // Excluir módulos problemáticos
  config.module.rules.push({
    test: /react-native-maps\/lib\/MapMarkerNativeComponent\.js$/,
    use: 'null-loader',
  });
  
  return config;
}; 