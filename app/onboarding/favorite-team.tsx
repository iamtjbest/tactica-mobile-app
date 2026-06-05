import { useId, useState, type ReactElement } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { LeagueSelectionListSection } from "./LeagueSelectionListSection";
import { SelectionHeaderSection } from "./SelectionHeaderSection";
import { router } from "expo-router";

export const FavouriteTeam = (): ReactElement => {
  const [searchValue, setSearchValue] = useState("");

  const progressItems = [
    { active: true },
    { active: false },
    { active: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background radial glow */}
      <View style={styles.glow} pointerEvents="none" />

      <View style={styles.content}>
        {/* Progress Navigation */}
        <View style={styles.progressContainer}>
          {progressItems.map((item, index) => (
            <View
              key={`progress-${index}`}
              style={[
                styles.progressBar,
                item.active ? styles.progressBarActive : styles.progressBarInactive,
              ]}
            />
          ))}
        </View>

        <SelectionHeaderSection />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search team or league…"
            placeholderTextColor="rgba(142, 155, 174, 0.5)"
            style={styles.searchInput}
          />
        </View>

        <LeagueSelectionListSection />

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.8} onPress={() => router.push("/onboarding/loading")}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FavouriteTeam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1317",
  },
  glow: {
    position: "absolute",
    top: -46,
    left: -57,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(204, 255, 0, 0.07)",
  },
  content: {
    flex: 1,
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
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressBarActive: {
    width: 24,
    backgroundColor: "#ccff00",
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  progressBarInactive: {
    width: 8,
    backgroundColor: "#2a3b47",
  },
  searchContainer: {
    width: "100%",
    height: 48,
    backgroundColor: "#1a242b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a3b47",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginVertical: 16,
  },
  searchInput: {
    color: "#ffffff",
    fontSize: 14,
    height: "100%",
  },
  continueButton: {
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
    marginTop: 20,
  },
  continueText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
});
