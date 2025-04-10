import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Datos del desarrollador
const developerInfo = {
  name: 'Martin Sanchez Herrera',
  role: 'Desarrollador',
  bio: 'interesado por crear aplicaciones interesantes para la comodidad del usuario. Especializado en React Native y desarrollo multiplataforma.',
  skills: ['React Native', 'JavaScript', 'Expo', 'Firebase', 'Supabase'],
  social: [
    { name: 'GitHub', icon: 'link.circle.fill' as const, url: 'https://github.com/tuusuario' },
    { name: 'LinkedIn', icon: 'network' as const, url: 'https://linkedin.com/in/tuusuario' },
    { name: 'Twitter', icon: 'message.fill' as const, url: 'https://twitter.com/tuusuario' },
  ],
  contact: {
    email: 'martinsanher2511@gmail.com',
    phone: '+1 917 297 12 68 ',
  }
};

export default function DeveloperScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Función para abrir enlaces externos
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error al abrir el enlace:', err));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Encabezado con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => router.back()}
          >
            <IconSymbol size={20} name="arrow.left" color="white" />
            <ThemedText style={styles.backButtonText}>Volver</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Desarrollador</ThemedText>
          <View style={{ width: 80 }} />
        </View>

        {/* Perfil del desarrollador */}
        <View style={[styles.profileCard, { 
          backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
        }]}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../images/IMG_7356.jpeg')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
                
          <ThemedText style={styles.name}>{developerInfo.name}</ThemedText>
          <ThemedText style={styles.role}>{developerInfo.role}</ThemedText>
          
          <View style={styles.bioContainer}>
            <ThemedText style={styles.bio}>{developerInfo.bio}</ThemedText>
          </View>
        </View>

        {/* Habilidades */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Habilidades</ThemedText>
          <View style={styles.skillsContainer}>
            {developerInfo.skills.map((skill, index) => (
              <View 
                key={index} 
                style={[styles.skillBadge, { 
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }]}
              >
                <ThemedText style={styles.skillText}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Enlaces sociales */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Redes Sociales</ThemedText>
          <View style={styles.socialContainer}>
            {developerInfo.social.map((social, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.socialButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => openLink(social.url)}
              >
                <IconSymbol size={30} name={social.icon} color="#CD5C5C" />
                <ThemedText style={styles.socialButtonText}>{social.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información de contacto */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contacto</ThemedText>
          <View style={[styles.contactCard, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          }]}>
            <View style={styles.contactItem}>
              <IconSymbol size={20} name="envelope.fill" color={Colors[colorScheme ?? 'light'].tint} />
              <ThemedText style={styles.contactText}>{developerInfo.contact.email}</ThemedText>
            </View>
            <View style={styles.contactItem}>
              <IconSymbol size={20} name="phone.fill" color={Colors[colorScheme ?? 'light'].tint} />
              <ThemedText style={styles.contactText}>{developerInfo.contact.phone}</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5f5e3',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
  },
  bioContainer: {
    width: '100%',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#CD5C5C',
  },
  bio: {
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 50,
    width: '48%',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  socialButtonText: {
    color: '#CD5C5C',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  contactCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
  },
}); 