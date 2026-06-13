import React, { ReactElement } from "react";
import { View, Text, StyleSheet } from "react-native";

export const SelectionHeaderSection = (): ReactElement => {
  return (
    <View style={styles.container}>
      <Text style={styles.step}>STEP 2 OF 3</Text>
      <Text style={styles.title}>Pick Your{"\n"}Favorite Team</Text>
      <Text style={styles.subtitle}>We will customize your updates and alerts for this team.</Text>
    </View>
  );
};

export default SelectionHeaderSection;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start",
    gap: 6,
    marginVertical: 12,
  },
  step: {
    color: "#ccff00",
    fontSize: 11,
    fontFamily: "DMSans-Bold",
    fontWeight: "700",
    letterSpacing: 2.2,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontFamily: "PlayfairDisplay-Bold",
    fontWeight: "700",
    lineHeight: 38,
  },
  subtitle: {
    color: "#8e9bae",
    fontSize: 13,
    fontFamily: "DMSans-Regular",
    lineHeight: 19.5,
  },
});
