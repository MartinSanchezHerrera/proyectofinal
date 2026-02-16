module.exports = {
  name: 'Accses',
  slug: 'accses',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.accses.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.accses.app'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
    // Configuración para manejar módulos nativos en web
    build: {
      babel: {
        include: ['react-native-maps']
      }
    }
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.'
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  // Configuración adicional para manejar módulos nativos en web
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  },
  // Configuración para Metro
  metro: {
    resolver: {
      // Excluir módulos nativos en web
      blockList: process.env.EXPO_TARGET === 'web' ? [
        /react-native-maps\/lib\/MapMarkerNativeComponent\.js$/,
        /react-native\/Libraries\/Utilities\/codegenNativeCommands/,
      ] : []
    }
  }

}; 
// prueba sonar
