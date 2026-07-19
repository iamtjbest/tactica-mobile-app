// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { HomeIcon, PitchIcon, ChatIcon, ProfileIcon, FplIcon } from "@/components/Icons";

const TABS = [
  { name: "index", label: "Home", Icon: HomeIcon, showLabel: true },
  { name: "scout", label: "Engine", Icon: PitchIcon, showLabel: true },
  { name: "ai-chat", label: "AIChat", Icon: ChatIcon, showLabel: true },
  { name: "fpl", label: "FPL", Icon: FplIcon, showLabel: false },  // Icon-only
  { name: "profile", label: "Profile", Icon: ProfileIcon, showLabel: true },
] as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 36, 43, 0.96)',
          borderTopColor: 'rgba(42, 59, 71, 0.70)',
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
          paddingBottom: 32,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      {TABS.map(({ name, label, Icon, showLabel }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ focused }) => {
              const color = focused ? '#CCFF00' : '#8E9BAE';
              return (
                <View style={{
                  flex: 1,
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: showLabel ? 4 : 2,
                  height: 48,
                }}>
                  <View style={{
                    width: 21,
                    height: 21,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // Slightly larger icon for FPL tab since no label
                    transform: name === "fpl" ? [{ scale: 1.1 }] : undefined,
                  }}>
                    <Icon size={name === "fpl" ? 23 : 21} color={color} />
                  </View>
                  {showLabel && (
                    <Text style={{
                      color,
                      fontSize: 10,
                      fontFamily: 'DMSans-Medium',
                      fontWeight: '600',
                      letterSpacing: 0.20,
                      textAlign: 'center',
                    }}>
                      {label}
                    </Text>
                  )}
                  {focused ? (
                    <View style={{
                      width: 4, height: 4, borderRadius: 2,
                      backgroundColor: '#CCFF00',
                      shadowColor: '#CCFF00',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 4,
                      elevation: 2,
                    }} />
                  ) : (
                    <View style={{ width: 4, height: 4 }} />
                  )}
                </View>
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}