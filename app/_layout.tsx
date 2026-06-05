import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// This prevents the native splash screen from auto-hiding before your fonts finish loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "DMSans-Regular": require("../assets/fonts/DMSans-Regular.ttf"),
    "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    "PlayfairDisplay-Black": require("../assets/fonts/PlayfairDisplay-Black.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      // Once fonts are fully loaded into the phone, hide the splash screen safely
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Render a blank screen while the system is initializing fonts
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {/* Expo Router automatically creates your navigation stack from your files! */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* The first screen the app hits (your login/first screen) */}
        <Stack.Screen name="index" /> 
        
        {/* Keeps our groups hidden from the header title bar */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}