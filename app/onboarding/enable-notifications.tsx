import React, { useState, type ReactElement } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  iconBgColor: string;
  iconText: string;
};

const initialNotificationItems: NotificationItem[] = [
  {
    id: "live-match-alerts",
    title: "Live Match Alerts",
    description: "Goals, red cards & key events",
    enabled: true,
    iconBgColor: "rgba(204, 255, 0, 0.1)",
    iconText: "⚽",
  },
  {
    id: "tactical-insights",
    title: "Tactical Insights",
    description: "AI recommendations before kick-off",
    enabled: true,
    iconBgColor: "rgba(0, 229, 255, 0.1)",
    iconText: "🧠",
  },
  {
    id: "formation-updates",
    title: "Formation Updates",
    description: "When tracked team changes lineup",
    enabled: true,
    iconBgColor: "rgba(204, 255, 0, 0.1)",
    iconText: "📋",
  },
  {
    id: "league-results",
    title: "League Results",
    description: "Final scores from followed leagues",
    enabled: false,
    iconBgColor: "rgba(255, 255, 255, 0.06)",
    iconText: "🏆",
  },
  {
    id: "weekly-digest",
    title: "Weekly Digest",
    description: "Top tactical trends every Monday",
    enabled: false,
    iconBgColor: "rgba(255, 255, 255, 0.06)",
    iconText: "📅",
  },
];

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onChange}
      style={[
        toggleStyles.track,
        checked ? toggleStyles.trackActive : toggleStyles.trackInactive
      ]}
    >
      <View style={[
        toggleStyles.thumb,
        checked ? toggleStyles.thumbActive : toggleStyles.thumbInactive
      ]} />
    </TouchableOpacity>
  );
};

export const EnableNotifications = (): ReactElement => {
  const [notificationItems, setNotificationItems] = useState(initialNotificationItems);

  const handleToggle = (id: string) => {
    setNotificationItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const handleFinish = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Subtle top background glow */}
      <View style={styles.glow} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Progress step bar (Step 3 of 3) */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarActive} />
        </View>

        {/* Central Bell Badge Icon */}
        <View style={styles.bellBadgeContainer}>
          <View style={styles.bellBadge}>
            <Text style={styles.bellEmoji}>🔔</Text>
            <View style={styles.badgePulseDot} />
          </View>
        </View>

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.stepText}>STEP 3 OF 3</Text>
          <Text style={styles.title}>Stay in the Game.{"\n"}Enable Alerts.</Text>
          <Text style={styles.subtitle}>Choose which updates to receive. Change anytime.</Text>
        </View>

        {/* Option Cards */}
        <View style={styles.listContainer}>
          {notificationItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.iconWrapper, { backgroundColor: item.iconBgColor }]}>
                <Text style={styles.iconContent}>{item.iconText}</Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <Toggle
                checked={item.enabled}
                onChange={() => handleToggle(item.id)}
              />
            </View>
          ))}
        </View>

        {/* Mock Notification Preview */}
        <Text style={styles.previewHeader}>NOTIFICATION PREVIEW</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewIconContainer}>
            <Text style={{ fontSize: 16 }}>⚡</Text>
          </View>
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewTitle}>Tactica · Live Alert</Text>
            <Text style={styles.previewDesc}>
              Arsenal score! Saka 67' — AI analysing tactical shift…
            </Text>
            <Text style={styles.previewTime}>now</Text>
          </View>
        </View>

        {/* Actions Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.enableButton} 
            activeOpacity={0.8}
            onPress={handleFinish}
          >
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.laterButton}
            activeOpacity={0.7}
            onPress={handleFinish}
          >
            <Text style={styles.laterButtonText}>Maybe later</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EnableNotifications;

const toggleStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  trackActive: {
    backgroundColor: "#ccff00",
  },
  trackInactive: {
    backgroundColor: "#2a3b47",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
  thumbInactive: {
    alignSelf: "flex-start",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1317",
  },
  glow: {
    position: "absolute",
    top: -46,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(204, 255, 0, 0.05)",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  progressBarActive: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccff00",
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  progressBarInactive: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2a3b47",
  },
  bellBadgeContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  bellBadge: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "rgba(204, 255, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(204, 255, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellEmoji: {
    fontSize: 32,
  },
  badgePulseDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ccff00",
    borderWidth: 2,
    borderColor: "#0d1317",
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  headingContainer: {
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  stepText: {
    fontFamily: "DMSans-Bold",
    fontSize: 11,
    color: "#ccff00",
    letterSpacing: 2,
    fontWeight: "700",
  },
  title: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 32,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    color: "#8e9bae",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 4,
  },
  listContainer: {
    width: "100%",
    gap: 10,
    marginBottom: 24,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a242b",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a3b47",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContent: {
    fontSize: 18,
  },
  textWrapper: {
    flex: 1,
    gap: 1,
  },
  itemTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
  },
  itemDesc: {
    fontFamily: "DMSans-Regular",
    fontSize: 11,
    color: "#8e9bae",
  },
  previewHeader: {
    alignSelf: "flex-start",
    fontFamily: "DMSans-Bold",
    fontSize: 11,
    color: "#8e9bae",
    letterSpacing: 1.5,
    marginBottom: 8,
    fontWeight: "700",
  },
  previewCard: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#1a242b",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a3b47",
    padding: 12,
    gap: 10,
    marginBottom: 32,
  },
  previewIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewTextContainer: {
    flex: 1,
    gap: 1,
  },
  previewTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "700",
  },
  previewDesc: {
    fontFamily: "DMSans-Regular",
    fontSize: 11,
    color: "#8e9bae",
    lineHeight: 15.4,
  },
  previewTime: {
    fontFamily: "DMSans-Regular",
    fontSize: 10,
    color: "rgba(142, 155, 174, 0.5)",
    marginTop: 2,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  enableButton: {
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
  enableButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
  },
  laterButton: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  laterButtonText: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    color: "#8e9bae",
  },
});
