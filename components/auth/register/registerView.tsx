import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from "../../../lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        displayName: displayName,
        role: "user",
        createdAt: new Date(),
      });

      await sendEmailVerification(userCredential.user);

      Alert.alert(
        "Cuenta creada", 
        "Se ha enviado un correo de verificación. Ahora registra tu vehículo."
      );

      router.push("/");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}></Text>
            <Text style={styles.subtitle}>Registro de Usuario</Text>
          </View>

          <TextInput
            style={[styles.input, focusedInput === "displayName" && styles.inputFocused]}
            placeholder="Nombre completo"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            placeholderTextColor="#999"
            onFocus={() => setFocusedInput("displayName")}
            onBlur={() => setFocusedInput(null)}
          />

          <TextInput
            style={[styles.input, focusedInput === "email" && styles.inputFocused]}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
              onFocus={() => setFocusedInput("confirmPassword")}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => router.push("/")}
          >
            <Text style={styles.registerButtonText}>
              Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 51, 09, 0.7)'
  },
  formContainer: {
    width: "85%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#003366",
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderColor: "#003366",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    color: "#333",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  inputFocused: {
    borderColor: "#0055AA",
    borderWidth: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#003366",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  passwordInput: {
    flex: 1,
    height: 45,
    paddingLeft: 15,
    color: "#333",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#003366",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default RegisterScreen;