import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const loadingSteps = [
  {
    title: "Connecting to data engine",
    description: "96 teams · 5 leagues",
    range: [0, 25],
  },
  {
    title: "Loading formation models",
    description: "ML engine initialised",
    range: [26, 50],
  },
  {
    title: "Calibrating Tactical AI",
    description: "Gemini assistant ready",
    range: [51, 75],
  },
  {
    title: "All systems go",
    description: "Ready to analyse",
    range: [76, 100],
  },
];

export const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // ~3 seconds total loading time

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        router.replace("/onboarding/enable-notifications");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background glow effect */}
      <View style={styles.glow} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tactica</Text>
        </View>

        {/* Circular Progress Visualizer */}
        <View style={styles.loaderContainer}>
          <View style={styles.circleTrack}>
            {/* Faux rotating indicator lines using nested absolute items */}
            <View style={[styles.circleProgressRing, { transform: [{ rotate: `${progress * 3.6}deg` }] }]} />
            <View style={styles.circleContent}>
              <Text style={styles.percentageText}>{progress}</Text>
              <Text style={styles.percentageSign}>%</Text>
            </View>
          </View>
        </View>

        {/* Main Status Heading */}
        <View style={styles.statusTextContainer}>
          <Text style={styles.title}>
            {progress < 100 ? "Almost done…" : "Ready to launch!"}
          </Text>
          <Text style={styles.subtitle}>
            Setting up your football{"\n"}intelligence engine
          </Text>
        </View>

        {/* Steps List */}
        <View style={styles.stepsList}>
          {loadingSteps.map((step, index) => {
            const isCompleted = progress > step.range[1];
            const isActive = progress >= step.range[0] && progress <= step.range[1];
            
            return (
              <View 
                key={step.title} 
                style={[
                  styles.stepCard,
                  isActive && styles.stepCardActive,
                  isCompleted && styles.stepCardCompleted
                ]}
              >
                {/* Checkbox Status Dot */}
                <View 
                  style={[
                    styles.statusDot,
                    isCompleted && styles.statusDotCompleted,
                    isActive && styles.statusDotActive,
                  ]}
                >
                  {isCompleted && <Text style={styles.checkText}>✓</Text>}
                  {isActive && <View style={styles.activePulse} />}
                </View>

                {/* Step Description details */}
                <View style={styles.stepTexts}>
                  <Text 
                    style={[
                      styles.stepTitle, 
                      isCompleted && styles.textCompleted, 
                      isActive && styles.textActive
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>
                    {step.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1317",
  },
  glow: {
    position: "absolute",
    top: 150,
    alignSelf: "center",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(204, 255, 0, 0.04)",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 36,
  },
  headerTitle: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 24,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  loaderContainer: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  circleTrack: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#1a242b",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circleProgressRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "#ccff00",
    borderRightColor: "#ccff00",
  },
  circleContent: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  percentageText: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 36,
    color: "#ffffff",
  },
  percentageSign: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 18,
    color: "#8e9bae",
    marginLeft: 1,
  },
  statusTextContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  title: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    color: "#8e9bae",
    textAlign: "center",
    lineHeight: 20,
  },
  stepsList: {
    width: "100%",
    gap: 12,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#11181c",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1a242b",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  stepCardActive: {
    borderColor: "rgba(204, 255, 0, 0.3)",
    backgroundColor: "#161e23",
  },
  stepCardCompleted: {
    borderColor: "#1a242b",
    opacity: 0.85,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2a3b47",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  statusDotActive: {
    borderColor: "#ccff00",
  },
  statusDotCompleted: {
    borderColor: "#ccff00",
    backgroundColor: "#ccff00",
  },
  activePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccff00",
  },
  checkText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "900",
  },
  stepTexts: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 13,
    color: "#8e9bae",
  },
  textActive: {
    color: "#ffffff",
  },
  textCompleted: {
    color: "#ccff00",
  },
  stepDesc: {
    fontFamily: "DMSans-Regular",
    fontSize: 11,
    color: "#8e9bae",
    opacity: 0.7,
  },
});
