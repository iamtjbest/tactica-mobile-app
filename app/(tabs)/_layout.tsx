// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; title: string; icon: IoniconsName; activeIcon: IoniconsName }[] = [
  { name:"index",     title:"Tactics",   icon:"football-outline",      activeIcon:"football" },
  { name:"pitch",     title:"Sandbox",   icon:"construct-outline",     activeIcon:"construct" },
  { name:"ai-chat",   title:"AI Chat",   icon:"chatbubble-outline",    activeIcon:"chatbubble" },
  { name:"profile",   title:"Profile",   icon:"person-outline",        activeIcon:"person" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor:   C.green500,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", letterSpacing: 0.5 },
      }}
    >
      {TABS.map(({ name, title, icon, activeIcon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? activeIcon : icon} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}