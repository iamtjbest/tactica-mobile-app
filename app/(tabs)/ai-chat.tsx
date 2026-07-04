// app/(tabs)/ai-chat.tsx — AI Tactical Chat with automatic live match context
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  StatusBar, ActivityIndicator, Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, ChatMessage, LiveResponse, bsdName } from "@/lib/api";
import { SendIcon, ChatIcon } from "@/components/Icons";
import { C, FONT, CARD_SHADOW } from "@/constants/theme";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ── Translations ──────────────────────────────────────────────────────────────

const T: Record<string, Record<string, string>> = {
  English:   { tacticalAI:"Tactical AI", onlineReady:"Online · Ready", askEngine:"Ask the engine…", today:"Today", errorMsg:"Sorry, couldn't reach the engine. Check your connection and try again.", liveDetected:"Live match detected", noLive:"No live fixture found for this matchup", syncing:"Checking for live match…" },
  Español:   { tacticalAI:"IA Táctica", onlineReady:"En línea · Listo", askEngine:"Pregunta al motor…", today:"Hoy", errorMsg:"Lo siento, no pude conectar. Intenta de nuevo.", liveDetected:"Partido en vivo detectado", noLive:"No se encontró partido en vivo", syncing:"Buscando partido en vivo…" },
  Français:  { tacticalAI:"IA Tactique", onlineReady:"En ligne · Prêt", askEngine:"Posez une question…", today:"Aujourd'hui", errorMsg:"Désolé, connexion impossible. Réessayez.", liveDetected:"Match en direct détecté", noLive:"Aucun match en direct trouvé", syncing:"Recherche de match en direct…" },
  Deutsch:   { tacticalAI:"Taktik-KI", onlineReady:"Online · Bereit", askEngine:"Frag die Engine…", today:"Heute", errorMsg:"Verbindungsfehler. Bitte erneut versuchen.", liveDetected:"Live-Spiel erkannt", noLive:"Kein Live-Spiel gefunden", syncing:"Suche nach Live-Spiel…" },
  Italiano:  { tacticalAI:"IA Tattica", onlineReady:"Online · Pronto", askEngine:"Chiedi al motore…", today:"Oggi", errorMsg:"Impossibile raggiungere il motore. Riprova.", liveDetected:"Partita in diretta rilevata", noLive:"Nessuna partita in diretta trovata", syncing:"Ricerca partita in diretta…" },
  Português: { tacticalAI:"IA Tática", onlineReady:"Online · Pronto", askEngine:"Pergunta ao motor…", today:"Hoje", errorMsg:"Não foi possível ligar ao motor. Tente novamente.", liveDetected:"Jogo ao vivo detetado", noLive:"Nenhum jogo ao vivo encontrado", syncing:"A procurar jogo ao vivo…" },
  Nederlands:{ tacticalAI:"Tactische AI", onlineReady:"Online · Klaar", askEngine:"Vraag de engine…", today:"Vandaag", errorMsg:"Kan engine niet bereiken. Probeer opnieuw.", liveDetected:"Live wedstrijd gevonden", noLive:"Geen live wedstrijd gevonden", syncing:"Zoeken naar live wedstrijd…" },
  "Русский": { tacticalAI:"Тактический ИИ", onlineReady:"Онлайн · Готов", askEngine:"Спросите движок…", today:"Сегодня", errorMsg:"Не удалось подключиться. Попробуйте снова.", liveDetected:"Найден живой матч", noLive:"Живой матч не найден", syncing:"Поиск живого матча…" },
  "日本語":   { tacticalAI:"戦術AI", onlineReady:"オンライン · 準備完了", askEngine:"エンジンに質問…", today:"今日", errorMsg:"接続できません。再試行してください。", liveDetected:"ライブ試合を検出", noLive:"ライブ試合が見つかりません", syncing:"ライブ試合を検索中…" },
  "한국어":   { tacticalAI:"전술 AI", onlineReady:"온라인 · 준비됨", askEngine:"엔진에게 질문하세요…", today:"오늘", errorMsg:"엔진에 연결할 수 없습니다. 다시 시도하세요.", liveDetected:"라이브 경기 감지됨", noLive:"라이브 경기를 찾을 수 없음", syncing:"라이브 경기 검색 중…" },
  "简体中文": { tacticalAI:"战术AI", onlineReady:"在线 · 就绪", askEngine:"向引擎提问…", today:"今天", errorMsg:"无法连接到引擎。请重试。", liveDetected:"检测到直播比赛", noLive:"未找到直播比赛", syncing:"正在搜索直播比赛…" },
  "العربية": { tacticalAI:"الذكاء الاصطناعي التكتيكي", onlineReady:"متصل · جاهز", askEngine:"اسأل المحرك…", today:"اليوم", errorMsg:"تعذّر الوصول إلى المحرك. حاول مرة أخرى.", liveDetected:"تم اكتشاف مباراة مباشرة", noLive:"لم يُعثر على مباراة مباشرة", syncing:"جارٍ البحث عن مباراة مباشرة…" },
  "Türkçe":  { tacticalAI:"Taktik Yapay Zeka", onlineReady:"Çevrimiçi · Hazır", askEngine:"Motora sor…", today:"Bugün", errorMsg:"Motora ulaşılamıyor. Tekrar deneyin.", liveDetected:"Canlı maç tespit edildi", noLive:"Canlı maç bulunamadı", syncing:"Canlı maç aranıyor…" },
};

// ── Live badge ────────────────────────────────────────────────────────────────

function LiveBanner({ live }: { live: LiveResponse }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={lb.row}>
      <Animated.View style={[lb.dot, { opacity: pulse }]} />
      <Text style={lb.score}>
        {live.home_team} <Text style={lb.scoreNum}>{live.home_score}</Text>
        {" – "}
        <Text style={lb.scoreNum}>{live.away_score}</Text> {live.away_team}
      </Text>
      <View style={lb.pill}>
        <Text style={lb.pillText}>{live.minute ?? "?"}'</Text>
      </View>
    </View>
  );
}

const lb = StyleSheet.create({
  row:      { flexDirection:"row", alignItems:"center", gap:8, backgroundColor:"rgba(204,255,0,0.06)", borderRadius:10, borderWidth:1, borderColor:"rgba(204,255,0,0.2)", paddingHorizontal:12, paddingVertical:7 },
  dot:      { width:7, height:7, borderRadius:4, backgroundColor:C.volt },
  score:    { flex:1, fontSize:12, fontFamily:FONT.medium, color:C.tx },
  scoreNum: { fontFamily:FONT.bold, color:C.volt },
  pill:     { paddingHorizontal:7, paddingVertical:2, backgroundColor:"rgba(204,255,0,0.1)", borderRadius:6 },
  pillText: { fontSize:10, fontFamily:FONT.bold, color:C.volt },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const insets    = useSafeAreaInsets();
  const params    = useLocalSearchParams<{ query?:string; my_team?:string; opp_team?:string }>();
  const navigation = useNavigation();
  const scrollRef  = useRef<ScrollView>(null);

  // Teams — from router params (passed from Engine Hub) or defaults
  const [myTeam,  setMyTeam]  = useState(params.my_team  || "Arsenal");
  const [oppTeam, setOppTeam] = useState(params.opp_team || "Chelsea");

  const [messages, setMessages]   = useState<Message[]>([]);
  const [input,    setInput]      = useState("");
  const [loading,  setLoading]    = useState(false);
  const [live,     setLive]       = useState<LiveResponse | null>(null);
  const [liveMsg,  setLiveMsg]    = useState("");
  const [syncing,  setSyncing]    = useState(false);
  const [language, setLanguage]   = useState("English");
  const [squad,    setSquad]      = useState<any[]>([]);
  const [lastSync, setLastSync]   = useState(0);

  const t = (key: string): string => {
    const lang = T[language] ? language : "English";
    return T[lang]?.[key] ?? T.English[key] ?? key;
  };

  // Load language pref
  useEffect(() => {
    const load = async () => {
      const lang = await AsyncStorage.getItem("@language");
      if (lang) setLanguage(lang);
    };
    load();
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation]);

  // Update teams from params when navigating from Engine Hub
  useEffect(() => {
    if (params.my_team)  setMyTeam(params.my_team);
    if (params.opp_team) setOppTeam(params.opp_team);
  }, [params.my_team, params.opp_team]);

  // Auto-sync live data whenever teams change (or on mount)
  // Respects 30s cooldown so we don't hammer BSD
  useEffect(() => {
    const now = Date.now();
    if (now - lastSync < 30_000) return;
    autoSyncLive();
  }, [myTeam, oppTeam]);

  const autoSyncLive = async () => {
    setSyncing(true);
    setLiveMsg(t("syncing"));
    try {
      const data = await api.live(myTeam, oppTeam);
      setLive(data.match_found ? data : null);
      setLiveMsg(data.match_found ? t("liveDetected") : t("noLive"));
      setLastSync(Date.now());
      // Pre-warm squad cache silently
      api.squad(myTeam).then(r => setSquad(r.players)).catch(() => {});
    } catch {
      setLiveMsg("");
    } finally {
      setSyncing(false);
    }
  };

  // Build the live_context string the backend expects
  const buildLiveContext = (): string | undefined => {
    if (!live?.match_found) return undefined;
    return `LIVE (${live.competition}): ${live.home_team} ${live.home_score} – ${live.away_score} ${live.away_team}. Minute: ${live.minute}'. Status: ${live.status}.`;
  };

  const sendToApi = async (text: string, history: Message[]) => {
    setLoading(true);
    try {
      const chatHistory: ChatMessage[] = history.map(m => ({ role: m.role, content: m.content }));
      const res = await api.chat({
        my_team:      myTeam,
        opp_team:     oppTeam,
        message:      text,
        history:      chatHistory,
        live_context: buildLiveContext(),
        squad:        squad.length ? squad : undefined,
      });
      appendMessage("assistant", res.reply);
    } catch {
      appendMessage("assistant", t("errorMsg"));
    } finally {
      setLoading(false);
    }
  };

  const appendMessage = (role: "user" | "assistant", content: string) => {
    const msg: Message = {
      id: Math.random().toString(), role, content,
      timestamp: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    const userMsg = appendMessage("user", text);
    await sendToApi(text, [...messages, userMsg]);
  };

  // Auto-send from Engine Hub (query param)
  useEffect(() => {
    if (!params.query) return;
    const text = decodeURIComponent(params.query);
    setMessages([]);
    const userMsg = appendMessage("user", text);
    sendToApi(text, [userMsg]);
    router.setParams({ query: undefined });
  }, [params.query]);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      {/* keyboardVerticalOffset accounts for the absolute tab bar (88px).
          On iOS padding mode: shrinks content above keyboard correctly.
          On Android height mode: the whole view resizes — tab bar offset not needed. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        {/* Header */}
        <View style={[s.header, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color={C.tx} />
          </TouchableOpacity>
          <View style={s.headerInfo}>
            <View style={s.aiIcon}>
              <Ionicons name="sparkles" size={15} color={C.volt} />
            </View>
            <View>
              <Text style={s.headerTitle}>{t("tacticalAI")}</Text>
              <View style={s.statusRow}>
                {syncing
                  ? <ActivityIndicator size="small" color={C.volt} style={{ marginRight:4 }} />
                  : <View style={[s.statusDot, { backgroundColor: live?.match_found ? C.volt : C.grn }]} />
                }
                <Text style={s.statusText}>
                  {syncing ? t("syncing") : live?.match_found ? t("liveDetected") : t("onlineReady")}
                </Text>
              </View>
            </View>
          </View>

          {/* Manual re-sync button */}
          <TouchableOpacity
            style={s.syncBtn}
            onPress={autoSyncLive}
            disabled={syncing || Date.now() - lastSync < 30_000}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={14} color={syncing ? C.bd : C.mt} />
          </TouchableOpacity>
        </View>

        {/* Live banner */}
        {live?.match_found && (
          <View style={{ paddingHorizontal:16, paddingTop:10 }}>
            <LiveBanner live={live} />
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex:1 }}
          contentContainerStyle={s.scrollBody}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated:true })}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.dateLabel}>{t("today")}</Text>

          {messages.length === 0 && !loading && (
            <View style={s.emptyState}>
              <View style={s.emptyIcon}>
                <Ionicons name="chatbubble-ellipses" size={28} color={C.volt} />
              </View>
              <Text style={s.emptyTitle}>{myTeam} vs {oppTeam}</Text>
              <Text style={s.emptyBody}>
                {live?.match_found
                  ? `Live match in progress — ${live.home_score}–${live.away_score} at ${live.minute}'. The AI already knows the score. Ask for tactical advice now.`
                  : "No live fixture right now. Ask about tactics, formations, or pre-match strategy."}
              </Text>
            </View>
          )}

          {messages.map(msg => {
            const isUser = msg.role === "user";
            return (
              <View key={msg.id} style={[s.msgRow, isUser ? s.rowUser : s.rowAI]}>
                <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleAI]}>
                  {!isUser && (
                    <Text style={s.aiBubbleLabel}>ASSISTANT MANAGER</Text>
                  )}
                  <Text style={[s.bubbleText, { color: isUser ? "#000" : C.tx }]}>
                    {msg.content}
                  </Text>
                  <Text style={[s.timestamp, { color: isUser ? "rgba(0,0,0,0.4)" : C.mt }]}>
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {loading && (
            <View style={[s.msgRow, s.rowAI]}>
              <View style={[s.bubble, s.bubbleAI, { paddingVertical:14 }]}>
                <View style={{ flexDirection:"row", gap:4 }}>
                  {[0,1,2].map(i => (
                    <View key={i} style={[s.typingDot, { opacity: 0.4 + i*0.2 }]} />
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={[s.inputTray, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={s.inputBox}>
            <ChatIcon size={16} color={C.mt} />
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder={t("askEngine")}
              placeholderTextColor="rgba(142,155,174,0.4)"
              editable={!loading}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline={false}
            />
          </View>
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || loading) && { opacity:0.4 }]}
            onPress={handleSend}
            disabled={loading || !input.trim()}
            activeOpacity={0.85}
          >
            <SendIcon size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:C.bg, marginBottom:88 },
  header:       { backgroundColor:C.sur, borderBottomWidth:1, borderBottomColor:"rgba(42,59,71,0.5)", flexDirection:"row", alignItems:"center", paddingHorizontal:16, paddingBottom:14, gap:12 },
  backBtn:      { width:34, height:34, borderRadius:9, backgroundColor:"rgba(255,255,255,0.06)", justifyContent:"center", alignItems:"center" },
  headerInfo:   { flex:1, flexDirection:"row", alignItems:"center", gap:12 },
  aiIcon:       { width:36, height:36, borderRadius:10, backgroundColor:"rgba(204,255,0,0.08)", borderWidth:1.5, borderColor:"rgba(204,255,0,0.2)", justifyContent:"center", alignItems:"center" },
  headerTitle:  { fontSize:16, fontFamily:FONT.bold, color:C.tx },
  statusRow:    { flexDirection:"row", alignItems:"center", gap:5, marginTop:1 },
  statusDot:    { width:6, height:6, borderRadius:3 },
  statusText:   { fontSize:11, fontFamily:FONT.regular, color:C.mt },
  syncBtn:      { width:32, height:32, borderRadius:8, backgroundColor:"rgba(255,255,255,0.04)", borderWidth:1, borderColor:C.bd, justifyContent:"center", alignItems:"center" },

  scrollBody:   { paddingHorizontal:16, paddingTop:14, paddingBottom:24 },
  dateLabel:    { textAlign:"center", fontSize:11, fontFamily:FONT.medium, color:"rgba(142,155,174,0.4)", marginVertical:14, textTransform:"uppercase", letterSpacing:1 },

  emptyState:   { alignItems:"center", paddingTop:40, paddingHorizontal:24, gap:12 },
  emptyIcon:    { width:56, height:56, borderRadius:16, backgroundColor:"rgba(204,255,0,0.08)", borderWidth:1, borderColor:"rgba(204,255,0,0.15)", justifyContent:"center", alignItems:"center" },
  emptyTitle:   { fontSize:16, fontFamily:FONT.bold, color:C.tx, textAlign:"center" },
  emptyBody:    { fontSize:12, fontFamily:FONT.regular, color:C.mt, textAlign:"center", lineHeight:18 },

  msgRow:       { flexDirection:"row", marginBottom:12 },
  rowUser:      { justifyContent:"flex-end" },
  rowAI:        { justifyContent:"flex-start" },
  bubble:       { maxWidth:"82%", borderRadius:18, paddingHorizontal:15, paddingVertical:11 },
  bubbleUser:   { backgroundColor:C.cyan, borderBottomRightRadius:4 },
  bubbleAI:     { backgroundColor:C.sur, borderBottomLeftRadius:4, borderWidth:1, borderColor:C.bd },
  aiBubbleLabel:{ fontSize:9, fontFamily:FONT.bold, color:C.volt, letterSpacing:1.5, marginBottom:5 },
  bubbleText:   { fontSize:14, fontFamily:FONT.medium, lineHeight:20 },
  timestamp:    { fontSize:9, fontFamily:FONT.regular, alignSelf:"flex-end", marginTop:4 },
  typingDot:    { width:8, height:8, borderRadius:4, backgroundColor:C.volt },

  inputTray:    { flexDirection:"row", alignItems:"center", paddingHorizontal:14, paddingTop:10, backgroundColor:C.bg, borderTopWidth:1, borderTopColor:"rgba(42,59,71,0.5)", gap:10 },
  inputBox:     { flex:1, height:48, backgroundColor:C.sur, borderRadius:24, borderWidth:1, borderColor:C.bd, flexDirection:"row", alignItems:"center", paddingHorizontal:16, gap:10 },
  input:        { flex:1, color:C.tx, fontSize:14, fontFamily:FONT.medium, height:"100%" },
  sendBtn:      { width:48, height:48, backgroundColor:C.volt, borderRadius:24, justifyContent:"center", alignItems:"center", ...CARD_SHADOW },
});
