import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import TacticaLogo from "@/components/TacticaLogo";


export const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/onboarding/choose-location");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glow} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Heading */}
        <View style={styles.heading}>
          <TacticaLogo size={64} />
          <Text style={styles.appName}>Tactica</Text>
          <Text style={styles.welcomeText}>Create your manager profile</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Alex Ferguson"
              placeholderTextColor="rgba(142, 155, 174, 0.4)"
              autoCapitalize="words"
            />
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="rgba(142, 155, 174, 0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••"
              placeholderTextColor="rgba(142, 155, 174, 0.4)"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Creating Profile..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signInRedirectContainer}>
            <Text style={styles.alreadyHaveText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1317",
  },
  glow: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(204, 255, 0, 0.05)",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  heading: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(204, 255, 0, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoDiamond: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: "#ccff00",
    transform: [{ rotate: "45deg" }],
  },
  appName: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 28,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    color: "#8e9bae",
    marginTop: 6,
  },
  form: {
    width: "100%",
    gap: 16,
    marginBottom: 32,
  },
  fieldContainer: {
    width: "100%",
    backgroundColor: "#1a242b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a3b47",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontFamily: "DMSans-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#8e9bae",
    marginBottom: 4,
    fontWeight: "700",
  },
  input: {
    fontFamily: "DMSans-Medium",
    fontSize: 14,
    color: "#ffffff",
    height: 28,
    padding: 0,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  registerButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#ccff00",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 6,
  },
  registerButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
  },
  signInRedirectContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  alreadyHaveText: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    color: "#8e9bae",
  },
  signInLink: {
    fontFamily: "DMSans-Bold",
    fontSize: 13,
    color: "#ccff00",
    fontWeight: "700",
  },
});
