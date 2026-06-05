import React, { ReactElement } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export const LeagueSelectionListSection = (): ReactElement => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.text}>Select from leagues...</Text>
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
  card: {
    backgroundColor: "#1a242b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a3b47",
    padding: 16,
  },
  text: {
    color: "#8e9bae",
    fontSize: 14,
  },
});
