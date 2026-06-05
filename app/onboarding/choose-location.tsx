import React, { useMemo, useState, type ReactElement } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";

type CountryOption = {
  id: string;
  flag: string;
  name: string;
  subtitle: string;
};

const countryOptions: CountryOption[] = [
  { id: "nigeria", flag: "🇳🇬", name: "Nigeria", subtitle: "NPFL · African Football" },
  { id: "united-kingdom", flag: "🇬🇧", name: "United Kingdom", subtitle: "Premier League · EFL" },
  { id: "spain", flag: "🇪🇸", name: "Spain", subtitle: "La Liga · Copa del Rey" },
  { id: "germany", flag: "🇩🇪", name: "Germany", subtitle: "Bundesliga · DFB-Pokal" },
];

export const ChooseLocation = (): ReactElement => {
  const [selectedCountry, setSelectedCountry] = useState<string>("nigeria");
  const [searchQuery, setSearchQuery] = useState<string>("").trim;
  const [queryVal, setQueryVal] = useState<string>("");

  const filteredCountries = useMemo(() => {
    const normalizedQuery = queryVal.trim().toLowerCase();
    if (!normalizedQuery) return countryOptions;
    return countryOptions.filter(
      (country) =>
        country.name.toLowerCase().includes(normalizedQuery) ||
        country.subtitle.toLowerCase().includes(normalizedQuery),
    );
  }, [queryVal]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glow} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarActive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.step}>STEP 1 OF 3</Text>
          <Text style={styles.title}>Choose Your{"\n"}Location</Text>
          <Text style={styles.subtitle}>We'll tailor match times and league data to your region.</Text>
        </View>

        {/* Use My Location Button */}
        <TouchableOpacity style={styles.locationButton} activeOpacity={0.8}>
          <View style={styles.locationIconBg}>
            <Text style={{ color: "#ccff00", fontSize: 18 }}>📍</Text>
          </View>
          <View style={styles.locationButtonTextContainer}>
            <Text style={styles.locationButtonTitle}>Use My Location</Text>
            <Text style={styles.locationButtonSub}>Automatically detect region</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or select manually</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            value={queryVal}
            onChangeText={setQueryVal}
            placeholder="Search country..."
            placeholderTextColor="rgba(142, 155, 174, 0.5)"
            style={styles.searchInput}
          />
        </View>

        {/* Country Options List */}
        <Text style={styles.popularHeader}>POPULAR</Text>
        <View style={styles.listContainer}>
          {filteredCountries.map((country) => {
            const isSelected = selectedCountry === country.id;
            return (
              <TouchableOpacity
                key={country.id}
                onPress={() => setSelectedCountry(country.id)}
                style={[
                  styles.countryCard,
                  isSelected ? styles.countryCardSelected : styles.countryCardUnselected,
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.countryCardLeft}>
                  <Text style={styles.flagText}>{country.flag}</Text>
                  <View style={styles.countryCardTextContainer}>
                    <Text style={styles.countryName}>{country.name}</Text>
                    <Text style={styles.countrySub}>{country.subtitle}</Text>
                  </View>
                </View>
                <View style={[
                  styles.radio,
                  isSelected ? styles.radioSelected : styles.radioUnselected,
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.8} onPress={() => router.push("/onboarding/favorite-team")}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseLocation;

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
    marginBottom: 24,
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
  header: {
    width: "100%",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 20,
  },
  step: {
    color: "#ccff00",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.2,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
  subtitle: {
    color: "#8e9bae",
    fontSize: 13,
    lineHeight: 19.5,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(204, 255, 0, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(204, 255, 0, 0.25)",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    marginBottom: 20,
  },
  locationIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(204, 255, 0, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationButtonTextContainer: {
    flex: 1,
  },
  locationButtonTitle: {
    color: "#ccff00",
    fontSize: 14,
    fontWeight: "700",
  },
  locationButtonSub: {
    color: "#8e9bae",
    fontSize: 11,
    marginTop: 2,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a3b47",
  },
  dividerText: {
    color: "#8e9bae",
    fontSize: 12,
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
    marginBottom: 20,
  },
  searchInput: {
    color: "#ffffff",
    fontSize: 14,
    height: "100%",
  },
  popularHeader: {
    color: "#8e9bae",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  listContainer: {
    gap: 8,
    width: "100%",
  },
  countryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  countryCardSelected: {
    backgroundColor: "rgba(204, 255, 0, 0.05)",
    borderColor: "#ccff00",
  },
  countryCardUnselected: {
    backgroundColor: "#1a242b",
    borderColor: "#2a3b47",
  },
  countryCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagText: {
    fontSize: 20,
  },
  countryCardTextContainer: {
    justifyContent: "center",
  },
  countryName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  countrySub: {
    color: "#8e9bae",
    fontSize: 11,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#ccff00",
    backgroundColor: "#ccff00",
  },
  radioUnselected: {
    borderColor: "#2a3b47",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0d1317",
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
    marginTop: 24,
  },
  continueText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
});
