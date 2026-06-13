import { useState, type ReactElement } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { LeagueSelectionListSection } from "./LeagueSelectionListSection";
import { SelectionHeaderSection } from "./SelectionHeaderSection";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export const FavouriteTeam = (): ReactElement => {
  const { from } = useLocalSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleContinue = async () => {
    await AsyncStorage.setItem("@favorite_team", selectedTeam);
    if (from === "profile") {
      router.back();
    } else {
      router.push("/onboarding/loading");
    }
  };

  const progressItems = [
    { active: true },
    { active: true },
    { active: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {from === "profile" && (
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
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

        <LeagueSelectionListSection
          searchQuery={searchValue}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
        />

        {/* Continue Button */}
        <TouchableOpacity 
          style={[styles.continueButton, !selectedTeam && { opacity: 0.6 }]} 
          activeOpacity={0.8} 
          disabled={!selectedTeam}
          onPress={handleContinue}
        >
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
    fontFamily: "DMSans-Regular",
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
    fontFamily: "DMSans-Bold",
    fontWeight: "700",
  },
  backBtn: {
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
});
