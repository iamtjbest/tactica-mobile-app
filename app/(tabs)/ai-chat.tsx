// app/(tabs)/chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { api } from '@/lib/api';
import { SendIcon, ChatIcon } from '@/components/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { C, FONT, CARD_SHADOW } from '@/constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const TRANSLATIONS: Record<string, { tacticalAI: string; onlineReady: string; askEngine: string; today: string; errorMsg: string; }> = {
  English: { tacticalAI: "Tactical AI", onlineReady: "Online · Ready", askEngine: "Ask the engine…", today: "Today", errorMsg: "Sorry, I had trouble parsing the engine. Please check your connection or try again." },
  Español: { tacticalAI: "IA Táctica", onlineReady: "En línea · Listo", askEngine: "Pregunta al motor…", today: "Hoy", errorMsg: "Lo siento, tuve problemas para conectar. Intente de nuevo." }
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ query?: string }>();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");

  const t = (key: keyof typeof TRANSLATIONS.English): string => {
    const lang = TRANSLATIONS[language] ? language : "English";
    return TRANSLATIONS[lang][key] || TRANSLATIONS.English[key];
  };

  useEffect(() => {
    const loadSettings = async () => {
      const cachedLang = await AsyncStorage.getItem("@language");
      if (cachedLang) setLanguage(cachedLang);
    };
    loadSettings();
    const unsubscribeFocus = navigation.addListener('focus', () => loadSettings());
    return unsubscribeFocus;
  }, [navigation]);

  // Handle auto-send from Scout screen
  // Inside app/(tabs)/chat.tsx
  useEffect(() => {
    if (params.query) {
      // Decode the string from the Scout screen
      const decodedBriefingText = decodeURIComponent(params.query);

      const initialBriefingId = Math.random().toString();
      const compiledBriefingMessage: Message = {
        id: initialBriefingId,
        role: 'user',
        content: decodedBriefingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([compiledBriefingMessage]);
      triggerScoutResponse(decodedBriefingText, compiledBriefingMessage);

      // Reset param
      router.setParams({ query: undefined });
    }
  }, [params.query]);

  const triggerScoutResponse = async (textPrompt: string, originalMsg: Message) => {
    try {
      setLoading(true);
      const res = await api.chat({
        my_team: "Home Side",
        opp_team: "Away Side",
        message: textPrompt,
        history: []
      });

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: res.reply || "Match simulation parameters established. Where shall we begin, Coach?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Math.random().toString(), role: 'assistant', content: t("errorMsg"),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;
    const userText = inputText.trim();
    setInputText('');

    const newUserMessage: Message = {
      id: Math.random().toString(), role: 'user', content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);

    try {
      setLoading(true);
      const chatPayloadHistory = updatedHistory.map(m => ({ role: m.role, content: m.content }));
      const response = await api.chat({ my_team: "Home", opp_team: "Away", message: userText, history: chatPayloadHistory });

      setMessages([...updatedHistory, {
        id: Math.random().toString(), role: 'assistant', content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages([...updatedHistory, {
        id: Math.random().toString(), role: 'assistant', content: t("errorMsg"),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIXED: The outer view now forces a paddingBottom of 88 to avoid the absolute tab bar
    <View style={[styles.container, { paddingBottom: 88 }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.headerIconBox} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerLeftBlock}>
            <View style={styles.aiLogoSquare}><Ionicons name="sparkles" size={15} color={C.volt} /></View>
            <View style={{ alignItems: "flex-start" }}>
              <Text style={styles.headerTitle}>{t("tacticalAI")}</Text>
              <View style={styles.statusIndicatorRow}>
                <View style={styles.statusGreenDot} />
                <Text style={styles.statusSubtext}>{t("onlineReady")}</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollBody}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.dateLabelMarker}>{t("today")}</Text>

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <View key={msg.id} style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAssistant]}>
                <View style={[styles.chatBubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                  <Text style={[styles.bubbleText, isUser ? { color: "#000000" } : { color: C.tx }]}>{msg.content}</Text>
                  <Text style={[styles.timestampLabel, isUser ? { color: "rgba(0,0,0,0.4)" } : { color: C.mt }]}>{msg.timestamp}</Text>
                </View>
              </View>
            );
          })}
          {loading && (
            <View style={[styles.msgRow, styles.msgRowAssistant]}>
              <View style={[styles.chatBubble, styles.bubbleAssistant, { paddingVertical: 12 }]}>
                <ActivityIndicator size="small" color={C.volt} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputTrayBar, { paddingBottom: Math.max(12, insets.bottom) }]}>
          <View style={styles.inputBox}>
            <ChatIcon size={16} color="#8E9BAE" />
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t("askEngine")}
              placeholderTextColor="rgba(142, 155, 174, 0.4)"
              editable={!loading}
              onSubmitEditing={handleSendMessage}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={loading || !inputText.trim()} activeOpacity={0.85}>
            <SendIcon size={18} color="#000000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  header: { height: 84, backgroundColor: '#1A242B', borderBottomWidth: 1, borderBottomColor: 'rgba(42, 59, 71, 0.50)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  headerIconBox: { width: 34, height: 34, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  headerLeftBlock: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiLogoSquare: { width: 36, height: 36, backgroundColor: 'rgba(204, 255, 0, 0.08)', borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(204,255,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, color: '#FFFFFF', fontFamily: FONT.bold, fontWeight: '700' },
  statusIndicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  statusGreenDot: { width: 6, height: 6, backgroundColor: C.grn, borderRadius: 3 },
  statusSubtext: { fontSize: 11, color: C.mt, fontFamily: FONT.regular },
  scrollBody: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 },
  dateLabelMarker: { textAlign: 'center', fontSize: 11, color: 'rgba(142, 155, 174, 0.4)', fontFamily: FONT.medium, marginVertical: 14, textTransform: 'uppercase', letterSpacing: 1 },
  msgRow: { flexDirection: 'row', width: '100%', marginBottom: 12 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAssistant: { justifyContent: 'flex-start' },
  chatBubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 11, alignItems: 'flex-start' },
  bubbleUser: { backgroundColor: C.cyan, borderBottomRightRadius: 4 },
  bubbleAssistant: { backgroundColor: C.sur, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.bd },
  bubbleText: { fontSize: 14, fontFamily: FONT.medium, lineHeight: 20, textAlign: 'left' },
  timestampLabel: { fontSize: 9, fontFamily: FONT.regular, alignSelf: 'flex-end', marginTop: 4 },
  inputTrayBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#0D1317', borderTopWidth: 1, borderTopColor: 'rgba(42, 59, 71, 0.50)', gap: 10 },
  inputBox: { flex: 1, height: 48, backgroundColor: '#1A242B', borderRadius: 24, borderWidth: 1, borderColor: '#2A3B47', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  textInput: { flex: 1, color: '#FFFFFF', fontSize: 14, fontFamily: FONT.medium, height: '100%' },
  sendButton: { width: 48, height: 48, backgroundColor: C.volt, borderRadius: 24, justifyContent: 'center', alignItems: 'center', ...CARD_SHADOW }
});