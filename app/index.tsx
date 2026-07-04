import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export const FirstScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/sign-in");
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Left Corner guide */}
      <View style={styles.topLeftCorner}>
        <View style={styles.cornerHorizontal} />
        <View style={styles.cornerVertical} />
      </View>

      {/* Bottom Right Corner guide */}
      <View style={styles.bottomRightCorner}>
        <View style={styles.cornerHorizontal} />
        <View style={styles.cornerVertical} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Brand Logo - glowing green diamond inside a thin circular guide */}
        <View style={styles.logoContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.diamondGlow} />
            <View style={styles.diamond} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Tactica</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>FOOTBALL INTELLIGENCE ENGINE</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>POWERED BY AI · BUILT FOR THE GAME</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1317",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  topLeftCorner: {
    position: "absolute",
    top: 50,
    left: 24,
    width: 32,
    height: 32,
  },
  bottomRightCorner: {
    position: "absolute",
    bottom: 50,
    right: 24,
    width: 32,
    height: 32,
    transform: [{ rotate: "180deg" }],
  },
  cornerHorizontal: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 2,
    backgroundColor: "rgba(204, 255, 0, 0.18)",
    borderRadius: 1,
  },
  cornerVertical: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 2,
    height: 32,
    backgroundColor: "rgba(204, 255, 0, 0.18)",
    borderRadius: 1,
  },
  content: {
    alignItems: "center",
    gap: 8,
    marginTop: -40,
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(204, 255, 0, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  diamondGlow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(204, 255, 0, 0.15)",
  },
  diamond: {
    width: 52,
    height: 52,
    borderWidth: 8,
    borderColor: "#ccff00",
    backgroundColor: "transparent",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 48,
    fontFamily: "PlayfairDisplay-Bold",
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitle: {
    color: "#8e9bae",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1.5,
    marginTop: 4,
    fontFamily: "DMSans-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  footerText: {
    color: "#8e9bae",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 1.2,
    textAlign: "center",
    fontFamily: "DMSans-Medium",
  },
  versionText: {
    color: "rgba(142, 155, 174, 0.5)",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "DMSans-Regular",
  },
});
