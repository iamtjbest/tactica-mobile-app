import React, { ReactElement } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { EUROPEAN_TEAMS } from "@/lib/api";

type Props = {
  searchQuery: string;
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
};

export const LeagueSelectionListSection = ({ searchQuery, selectedTeam, onSelectTeam }: Props): ReactElement => {
  const filteredTeams = EUROPEAN_TEAMS.filter((team) =>
    team.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.listContainer}>
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => {
            const isSelected = selectedTeam === team;
            return (
              <TouchableOpacity
                key={team}
                onPress={() => onSelectTeam(team)}
                style={[
                  styles.teamCard,
                  isSelected ? styles.teamCardSelected : styles.teamCardUnselected,
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.teamCardLeft}>
                  <View style={styles.logoBadge}>
                    <Text style={styles.logoText}>⚽</Text>
                  </View>
                  <View style={styles.teamCardTextContainer}>
                    <Text style={styles.teamName}>{team}</Text>
                    <Text style={styles.teamSub}>European League Club</Text>
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
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No teams found matching "{searchQuery}"</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default LeagueSelectionListSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    gap: 8,
    width: "100%",
    paddingBottom: 20,
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  teamCardSelected: {
    backgroundColor: "rgba(204, 255, 0, 0.05)",
    borderColor: "#ccff00",
  },
  teamCardUnselected: {
    backgroundColor: "#1a242b",
    borderColor: "#2a3b47",
  },
  teamCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 16,
  },
  teamCardTextContainer: {
    justifyContent: "center",
  },
  teamName: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "DMSans-Bold",
    fontWeight: "600",
  },
  teamSub: {
    color: "#8e9bae",
    fontSize: 11,
    fontFamily: "DMSans-Regular",
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
  emptyCard: {
    backgroundColor: "#1a242b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a3b47",
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#8e9bae",
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    textAlign: "center",
  },
});
