// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { HomeIcon, PitchIcon, ChatIcon, ProfileIcon } from "@/components/Icons";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const TRANSLATIONS: Record<string, { Home: string; Scout: string; AIChat: string; Profile: string }> = {
  English: { Home: "Home", Scout: "Scout", AIChat: "AI Chat", Profile: "Profile" },
  Español: { Home: "Inicio", Scout: "Scout", AIChat: "IA Chat", Profile: "Perfil" },
  Français: { Home: "Accueil", Scout: "Scout", AIChat: "Chat IA", Profile: "Profil" },
  Deutsch: { Home: "Start", Scout: "Scout", AIChat: "KI-Chat", Profile: "Profil" },
  Italiano: { Home: "Home", Scout: "Scout", AIChat: "Chat IA", Profile: "Profilo" },
  Português: { Home: "Início", Scout: "Scout", AIChat: "Chat IA", Profile: "Perfil" },
  Nederlands: { Home: "Start", Scout: "Scout", AIChat: "AI-Chat", Profile: "Profiel" },
  Русский: { Home: "Главная", Scout: "Скаут", AIChat: "ИИ-Чат", Profile: "Профиль" },
  日本語: { Home: "ホーム", Scout: "スカウト", AIChat: "AIチャット", Profile: "プロフィール" },
  한국어: { Home: "홈", Scout: "스카우트", AIChat: "AI 채팅", Profile: "프로필" },
  "简体中文": { Home: "首页", Scout: "球探", AIChat: "AI聊天", Profile: "个人资料" },
  "العربية": { Home: "الرئيسية", Scout: "كشاف", AIChat: "دردشة الذكاء الاصطناعي", Profile: "الملف الشخصي" },
  Türkçe: { Home: "Anasayfa", Scout: "Gözlemci", AIChat: "Yapay Zeka Sohbet", Profile: "Profil" }
};

const TABS = [
  { name: "index", labelKey: "Home" },
  { name: "scout", labelKey: "Scout" }, // Changed from pitch to scout
  { name: "ai-chat", labelKey: "AIChat" },
  { name: "profile", labelKey: "Profile" },
] as const;

export default function TabLayout() {
  const navigation = useNavigation();
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const loadLang = async () => {
      const cachedLang = await AsyncStorage.getItem("@language");
      if (cachedLang) setLanguage(cachedLang);
    };
    loadLang();
    const unsubscribe = navigation.addListener("state", () => {
      loadLang();
    });
    return unsubscribe;
  }, [navigation]);

  const t = (key: "Home" | "Scout" | "AIChat" | "Profile") => {
    const lang = TRANSLATIONS[language] ? language : "English";
    return TRANSLATIONS[lang][key] || TRANSLATIONS.English[key];
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 36, 43, 0.94)',
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
      {TABS.map(({ name, labelKey }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(labelKey),
            tabBarIcon: ({ focused }) => {
              const activeColor = '#CCFF00';
              const inactiveColor = '#8E9BAE';
              const color = focused ? activeColor : inactiveColor;

              let iconEl = null;
              if (name === "index") iconEl = <HomeIcon size={21} color={color} />;
              else if (name === "scout") iconEl = <PitchIcon size={21} color={color} />;
              else if (name === "ai-chat") iconEl = <ChatIcon size={21} color={color} />;
              else if (name === "profile") iconEl = <ProfileIcon size={21} color={color} />;

              return (
                <View style={{
                  flex: 1,
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3,
                  height: 48,
                }}>
                  <View style={{ width: 21, height: 21, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {iconEl}
                  </View>
                  <View style={{ width: 80, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color,
                        fontSize: 10,
                        fontFamily: "DMSans-Medium",
                        fontWeight: "600",
                        letterSpacing: 0.20,
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      {t(labelKey)}
                    </Text>
                  </View>
                  {/* Active dot indicator */}
                  <View style={{
                    width: 4,
                    height: 5,
                    paddingTop: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                    {focused ? (
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#CCFF00',
                        shadowColor: '#CCFF00',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        elevation: 2,
                      }} />
                    ) : (
                      <View style={{ width: 4, height: 4, backgroundColor: 'transparent' }} />
                    )}
                  </View>
                </View>
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}