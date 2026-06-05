import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loading" />
      <Stack.Screen name="choose-location" />
      <Stack.Screen name="favorite-team" />
      <Stack.Screen name="enable-notifications" />
    </Stack>
  );
}
