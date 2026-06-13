import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SyncIcon } from '@/components/Icons';
import { getRecentScans, getEngineStats, updateLiveMatchesCount, Scan } from '@/lib/scans';
import { api } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const TRANSLATIONS: Record<string, {
  goodMorning: string;
  matchdayCenter: string;
  syncLiveMatchData: string;
  pullingFromLeagues: string;
  syncNow: string;
  syncing: string;
  recentScans: string;
  seeAll: string;
  noRecentScans: string;
  engineStats: string;
  teamsScanned: string;
  liveMatches: string;
  formationsStored: string;
  syncCompleted: string;
  syncSuccessMsg: (count: number) => string;
  syncError: string;
  syncErrorMsg: string;
  live: string;
}> = {
  English: {
    goodMorning: "GOOD MORNING",
    matchdayCenter: "Matchday\nCenter",
    syncLiveMatchData: "Sync Live Match Data",
    pullingFromLeagues: "Pulling from Top 5 European Leagues",
    syncNow: "Sync Now",
    syncing: "Syncing...",
    recentScans: "Recent Scans",
    seeAll: "See All",
    noRecentScans: "No recent scans.\nUse the Pitch or Sandbox tab to analyze your first match.",
    engineStats: "Engine Stats",
    teamsScanned: "Teams\nScanned",
    liveMatches: "Live\nMatches",
    formationsStored: "Formations\nStored",
    syncCompleted: "Sync Completed",
    syncSuccessMsg: (count: number) => `Successfully pulled current live match data. Found ${count} live matches in Top 5 European Leagues!`,
    syncError: "Sync Error",
    syncErrorMsg: "Unable to pull live match data. Please try again.",
    live: "LIVE"
  },
  Español: {
    goodMorning: "BUENOS DÍAS",
    matchdayCenter: "Centro de\nJornada",
    syncLiveMatchData: "Sincronizar Partidos",
    pullingFromLeagues: "Extrayendo de las 5 mejores ligas europeas",
    syncNow: "Sincronizar Ahora",
    syncing: "Sincronizando...",
    recentScans: "Análisis Recientes",
    seeAll: "Ver Todo",
    noRecentScans: "Sin análisis recientes.\nUsa la pestaña Pitch o Sandbox para analizar tu primer partido.",
    engineStats: "Estadísticas del Motor",
    teamsScanned: "Equipos\nAnalizados",
    liveMatches: "Partidos\nen Vivo",
    formationsStored: "Formaciones\nGuardadas",
    syncCompleted: "Sincronización Completada",
    syncSuccessMsg: (count: number) => `Datos obtenidos con éxito. ¡Se encontraron ${count} partidos en vivo en las mejores ligas!`,
    syncError: "Error de Sincronización",
    syncErrorMsg: "No se pudieron obtener los partidos en vivo. Inténtalo de nuevo.",
    live: "EN VIVO"
  },
  Français: {
    goodMorning: "BONJOUR",
    matchdayCenter: "Centre du\nMatch",
    syncLiveMatchData: "Synchroniser Matchs en Direct",
    pullingFromLeagues: "Données des 5 ligues majeures européennes",
    syncNow: "Sync Maintenant",
    syncing: "Synchronisation...",
    recentScans: "Analyses Récentes",
    seeAll: "Voir Tout",
    noRecentScans: "Aucune analyse récente.\nUtilisez l'onglet Terrain pour commencer.",
    engineStats: "Statistiques du Moteur",
    teamsScanned: "Équipes\nAnalysées",
    liveMatches: "Matchs en\nDirect",
    formationsStored: "Formations\nStockées",
    syncCompleted: "Synchronisation Réussie",
    syncSuccessMsg: (count: number) => `Données importées avec succès. ${count} matchs en direct trouvés dans les 5 ligues majeures!`,
    syncError: "Erreur de Synchronisation",
    syncErrorMsg: "Impossible d'importer les données en direct. Veuillez réessayer.",
    live: "DIRECT"
  },
  Deutsch: {
    goodMorning: "GUTEN MORGEN",
    matchdayCenter: "Spieltag-\nZentrale",
    syncLiveMatchData: "Live-Spieldaten Eig.",
    pullingFromLeagues: "Aus den Top-5-Ligen Europas laden",
    syncNow: "Jetzt Synchronisieren",
    syncing: "Synchronisiere...",
    recentScans: "Letzte Analysen",
    seeAll: "Alle sehen",
    noRecentScans: "Keine aktuellen Analysen.\nNutzen Sie das Spielfeld, um zu starten.",
    engineStats: "Statistiken",
    teamsScanned: "Teams\nGescannt",
    liveMatches: "Live-\nSpiele",
    formationsStored: "Gespeicherte\nFormationen",
    syncCompleted: "Synchronisierung abgeschlossen",
    syncSuccessMsg: (count: number) => `Daten erfolgreich abgerufen. ${count} Live-Spiele in Europa gefunden!`,
    syncError: "Fehler beim Synchronisieren",
    syncErrorMsg: "Fehler beim Laden der Live-Daten. Bitte erneut versuchen.",
    live: "LIVE"
  },
  Italiano: {
    goodMorning: "BUONGIORNO",
    matchdayCenter: "Centro\nPartite",
    syncLiveMatchData: "Sincronizza Dati Live",
    pullingFromLeagues: "Estrazione dai 5 principali campionati europei",
    syncNow: "Sincronizza Ora",
    syncing: "Sincronizzazione...",
    recentScans: "Analisi Recenti",
    seeAll: "Vedi Tutto",
    noRecentScans: "Nessuna analisi recente.\nUsa la lavagna tattica per iniziare.",
    engineStats: "Statistiche del Motore",
    teamsScanned: "Squadre\nAnalizzate",
    liveMatches: "Partite in\nDiretta",
    formationsStored: "Formazioni\nSalvate",
    syncCompleted: "Sincronizzazione Completata",
    syncSuccessMsg: (count: number) => `Dati caricati. Trovate ${count} partite in diretta nei 5 campionati!`,
    syncError: "Errore Sincronizzazione",
    syncErrorMsg: "Impossibile caricare i dati in diretta. Riprova.",
    live: "DIRETTA"
  },
  Português: {
    goodMorning: "BOM DIA",
    matchdayCenter: "Centro de\nJogos",
    syncLiveMatchData: "Sincronizar Dados Live",
    pullingFromLeagues: "Extraindo das 5 principais ligas europeias",
    syncNow: "Sincronizar Agora",
    syncing: "Sincronizando...",
    recentScans: "Análises Recentes",
    seeAll: "Ver Tudo",
    noRecentScans: "Nenhuma análise recente.\nUse a prancheta táctica para começar.",
    engineStats: "Estatísticas",
    teamsScanned: "Equipas\nAnalisadas",
    liveMatches: "Jogos em\nDireto",
    formationsStored: "Formações\nGuardadas",
    syncCompleted: "Sincronização Concluída",
    syncSuccessMsg: (count: number) => `Dados obtidos com sucesso. Encontrados ${count} jogos em direto!`,
    syncError: "Erro de Sincronização",
    syncErrorMsg: "Não foi possível obter dados dos jogos. Tente de novo.",
    live: "DIRETO"
  },
  Nederlands: {
    goodMorning: "GOEDEMORGEN",
    matchdayCenter: "Wedstrijd-\nCentrum",
    syncLiveMatchData: "Live Matchdata Synchroniseren",
    pullingFromLeagues: "Gegevens laden uit de top 5 Europese competities",
    syncNow: "Nu Synchroniseren",
    syncing: "Synchroniseren...",
    recentScans: "Recente Scans",
    seeAll: "Bekijk Alles",
    noRecentScans: "Geen recente scans.\nGebruik het tactisch bord om te beginnen.",
    engineStats: "Statistieken",
    teamsScanned: "Teams\nGescand",
    liveMatches: "Live\nWedstrijden",
    formationsStored: "Formaties\nOpgeslagen",
    syncCompleted: "Synchronisatie Voltooid",
    syncSuccessMsg: (count: number) => `Gegevens geladen. ${count} live wedstrijden gevonden!`,
    syncError: "Synchronisatiefout",
    syncErrorMsg: "Kan live data niet laden. Probeer het opnieuw.",
    live: "LIVE"
  },
  Русский: {
    goodMorning: "ДОБРОЕ УТРО",
    matchdayCenter: "Матч-\nЦентр",
    syncLiveMatchData: "Синхронизация Матчей",
    pullingFromLeagues: "Загрузка из Топ-5 европейских лиг",
    syncNow: "Синхронизировать",
    syncing: "Синхронизация...",
    recentScans: "Последние Анализы",
    seeAll: "Все",
    noRecentScans: "Нет последних анализов.\nИспользуйте тактическую доску для начала.",
    engineStats: "Статистика",
    teamsScanned: "Команд\nИзучено",
    liveMatches: "Живых\nМатчей",
    formationsStored: "Сохранено\nСхем",
    syncCompleted: "Синхронизация Завершена",
    syncSuccessMsg: (count: number) => `Данные успешно обновлены. Найдено ${count} живых матчей!`,
    syncError: "Ошибка Синхр.",
    syncErrorMsg: "Не удалось загрузить данные. Попробуйте еще раз.",
    live: "ЭФИР"
  },
  日本語: {
    goodMorning: "おはようございます",
    matchdayCenter: "マッチ\nセンター",
    syncLiveMatchData: "ライブデータを同期",
    pullingFromLeagues: "欧州5大リーグから取得中",
    syncNow: "今すぐ同期",
    syncing: "同期中...",
    recentScans: "最近の分析",
    seeAll: "すべて表示",
    noRecentScans: "最近の分析はありません。\n戦術ボードを使って分析を開始しましょう。",
    engineStats: "エンジンデータ",
    teamsScanned: "分析済み\nチーム",
    liveMatches: "ライブ\nマッチ",
    formationsStored: "保存済み\nフォーメーション",
    syncCompleted: "同期完了",
    syncSuccessMsg: (count: number) => `データの取得に成功しました。欧州5大リーグで${count}件 of 試合が開催中です！`,
    syncError: "同期エラー",
    syncErrorMsg: "ライブデータの取得に失敗しました。もう一度お試しください。",
    live: "ライブ"
  },
  한국어: {
    goodMorning: "좋은 아침입니다",
    matchdayCenter: "매치\n센터",
    syncLiveMatchData: "라이브 데이터 동기화",
    pullingFromLeagues: "유럽 5대 리그에서 가져오기",
    syncNow: "지금 동기화",
    syncing: "동기화 중...",
    recentScans: "최근 분석",
    seeAll: "모두 보기",
    noRecentScans: "최근 분석 데이터가 없습니다.\n전술 보드를 사용해 분석을 시작해 보세요.",
    engineStats: "엔진 통계",
    teamsScanned: "분석된\n팀 수",
    liveMatches: "라이브\n경기 수",
    formationsStored: "저장된\n포메이션",
    syncCompleted: "동기화 완료",
    syncSuccessMsg: (count: number) => `라이브 데이터를 성공적으로 가져왔습니다. 진행 중인 경기 ${count}개 발견!`,
    syncError: "동기화 오류",
    syncErrorMsg: "라이브 데이터를 가져올 수 없습니다. 다시 시도해 주세요.",
    live: "라이브"
  },
  "简体中文": {
    goodMorning: "早上好",
    matchdayCenter: "比赛\n中心",
    syncLiveMatchData: "同步实时比赛数据",
    pullingFromLeagues: "正从欧洲五大联赛获取",
    syncNow: "立即同步",
    syncing: "正在同步...",
    recentScans: "最近分析",
    seeAll: "查看全部",
    noRecentScans: "暂无最近分析。\n请使用球场或战术沙盘开始您的首次分析。",
    engineStats: "引擎数据",
    teamsScanned: "已分析\n球队",
    liveMatches: "进行中\n比赛",
    formationsStored: "已存储\n阵型",
    syncCompleted: "同步完成",
    syncSuccessMsg: (count: number) => `成功获取实时比赛数据。在欧洲五大联赛中找到 ${count} 场正在进行的比赛！`,
    syncError: "同步错误",
    syncErrorMsg: "无法获取实时数据。请稍后重试。",
    live: "进行中"
  },
  "العربية": {
    goodMorning: "صباح الخير",
    matchdayCenter: "مركز\nالمباريات",
    syncLiveMatchData: "مزامنة البيانات الحية",
    pullingFromLeagues: "جلب من أفضل 5 دوريات أوروبية",
    syncNow: "مزامنة الآن",
    syncing: "جاري المزامنة...",
    recentScans: "التحليلات الأخيرة",
    seeAll: "عرض الكل",
    noRecentScans: "لا توجد تحليلات حديثة.\nاستخدم سبورة التكتيك لبدء تحليلك الأول.",
    engineStats: "إحصاءات المحرك",
    teamsScanned: "الفرق\nالمحللة",
    liveMatches: "المباريات\nالحية",
    formationsStored: "التشكيلات\nالمخزنة",
    syncCompleted: "اكتملت المزامنة",
    syncSuccessMsg: (count: number) => `تم جلب البيانات الحية بنجاح. تم العثور على ${count} مباراة حية في الدوريات الأوروبية!`,
    syncError: "خطأ في المزامنة",
    syncErrorMsg: "تعذر جلب بيانات المباريات الحية. يرجى المحاولة مرة أخرى.",
    live: "مباشر"
  },
  Türkçe: {
    goodMorning: "GÜNAYDIN",
    matchdayCenter: "Maç Günü\nMerkezi",
    syncLiveMatchData: "Canlı Maç Verilerini Eşitle",
    pullingFromLeagues: "Avrupa'nın En Büyük 5 Liginden Alınıyor",
    syncNow: "Şimdi Eşitle",
    syncing: "Eşitleniyor...",
    recentScans: "Son Analizler",
    seeAll: "Tümünü Gör",
    noRecentScans: "Son analiz bulunmuyor.\nİlk analiziniz için Saha veya Taktik Tahtası sekmesini kullanın.",
    engineStats: "Motor İstatistikleri",
    teamsScanned: "Taranan\nTakımlar",
    liveMatches: "Canlı\nMaçlar",
    formationsStored: "Kaydedilen\nDizilişler",
    syncCompleted: "Eşitleme Tamamlandı",
    syncSuccessMsg: (count: number) => `Canlı maç verileri başarıyla alındı. 5 büyük Avrupa liginde ${count} canlı maç bulundu!`,
    syncError: "Eşitleme Hatası",
    syncErrorMsg: "Canlı maç verileri alınamadı. Lütfen tekrar deneyin.",
    live: "CANLI"
  }
};

export default function MatchdayCenter() {
  const [initials, setInitials] = useState("TJ");
  const [scans, setScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({ teamsScanned: 0, formationsStored: 0, liveMatches: 0 });
  const [syncing, setSyncing] = useState(false);
  const [language, setLanguage] = useState("English");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const loadUserData = () => {
    const user = auth.currentUser;
    if (user) {
      user.reload().then(() => {
        const updatedUser = auth.currentUser;
        if (updatedUser) {
          const displayName = updatedUser.displayName || "";
          if (displayName) {
            const parts = displayName.trim().split(/\s+/);
            const firstInit = parts[0] ? parts[0].charAt(0) : "";
            const lastInit = parts[1] ? parts[1].charAt(0) : "";
            setInitials((firstInit + lastInit).toUpperCase() || "TJ");
          } else if (updatedUser.email) {
            setInitials(updatedUser.email.substring(0, 2).toUpperCase() || "TJ");
          }
        }
      }).catch(() => {
        const displayName = user.displayName || "";
        if (displayName) {
          const parts = displayName.trim().split(/\s+/);
          const firstInit = parts[0] ? parts[0].charAt(0) : "";
          const lastInit = parts[1] ? parts[1].charAt(0) : "";
          setInitials((firstInit + lastInit).toUpperCase() || "TJ");
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData();
      }
    });

    return unsubscribeAuth;
  }, []);

  const t = (key: Exclude<keyof typeof TRANSLATIONS.English, "syncSuccessMsg">): string => {
    const lang = (language === "Español" ? "Español" : "English") as "English" | "Español";
    return (TRANSLATIONS[lang][key] || TRANSLATIONS.English[key]) as string;
  };

  const loadData = async () => {
    try {
      const s = await getRecentScans();
      setScans(s);
      const st = await getEngineStats();
      setStats(st);

      const cachedLang = await AsyncStorage.getItem("@language");
      if (cachedLang) setLanguage(cachedLang);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUserData();
    loadData();
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadUserData();
      loadData();
    });
    return unsubscribeFocus;
  }, [navigation]);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const response = await api.live("Manchester Utd", "Arsenal");
      const dynamicLiveCount = response.live_count || 0;
      await updateLiveMatchesCount(dynamicLiveCount);
      await loadData();

      const lang = (language === "Español" ? "Español" : "English") as "English" | "Español";
      const successMsgFn = TRANSLATIONS[lang].syncSuccessMsg || TRANSLATIONS.English.syncSuccessMsg;
      const successMsg = successMsgFn(dynamicLiveCount);

      Alert.alert(
        t("syncCompleted"),
        successMsg
      );
    } catch (err) {
      console.error(err);
      Alert.alert(t("syncError"), t("syncErrorMsg"));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(16, insets.top + 12) }]} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>{t("goodMorning")}</Text>
            <Text style={styles.title}>{t("matchdayCenter")}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(tabs)/profile")} activeOpacity={0.8}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Sync Live Match Data Card */}
        <View style={styles.syncCard}>
          <View style={styles.syncCardGradient} />

          <View style={styles.liveBadgeContainer}>
            <View style={styles.liveDotWrapper}>
              <View style={styles.liveDotInner} />
            </View>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>{t("live")}</Text>
            </View>
          </View>

          <Text style={styles.syncCardTitle}>{t("syncLiveMatchData")}</Text>
          <Text style={styles.syncCardSubtitle}>{t("pullingFromLeagues")}</Text>

          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSync}
            activeOpacity={0.8}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <SyncIcon size={15} color="#000000" />
            )}
            <Text style={styles.syncButtonText}>
              {syncing ? t("syncing") : t("syncNow")}
            </Text>
          </TouchableOpacity>

          {/* League Tags */}
          <View style={styles.tagsContainer}>
            {['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', language === "Español" ? "y otros." : "and others."].map((league, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{league}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Scans Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("recentScans")}</Text>
          <Text style={styles.seeAllText}>{t("seeAll")}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {scans.length > 0 ? (
            scans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                activeOpacity={0.85}
                onPress={() => router.push(`/match-details/${scan.id}`)}
              >
                <View style={styles.matchCard}>
                  <Text style={styles.matchLeague} numberOfLines={1}>{scan.league}</Text>
                  <Text style={styles.matchTeams} numberOfLines={3}>
                    {scan.homeTeam}{'\n'}vs{'\n'}{scan.awayTeam}
                  </Text>
                  <Text style={styles.matchDay}>{scan.matchday}</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{scan.score}</Text>
                  </View>
                  <View style={styles.cardBottomLine} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {t("noRecentScans")}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Engine Stats Section */}
        <View style={[styles.sectionHeader, { paddingTop: 18 }]}>
          <Text style={styles.sectionTitle}>{t("engineStats")}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.teamsScanned}</Text>
            <Text style={styles.statLabel}>{t("teamsScanned")}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.liveMatches}</Text>
            <Text style={styles.statLabel}>{t("liveMatches")}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.formationsStored}</Text>
            <Text style={styles.statLabel}>{t("formationsStored")}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1317',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  headerTextContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  greeting: {
    color: '#8E9BAE',
    fontSize: 11,
    fontFamily: 'DMSans-Medium',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.76,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'PlayfairDisplay-Bold',
    fontWeight: '700',
    lineHeight: 28.60,
    paddingRight: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    backgroundColor: '#1A242B',
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#CCFF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#CCFF00',
    fontSize: 14,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  syncCard: {
    marginTop: 22,
    padding: 18,
    backgroundColor: '#1A242B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.18)',
    overflow: 'hidden',
    position: 'relative',
  },
  syncCardGradient: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    right: -30,
    top: -39,
  },
  liveBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDotWrapper: {
    width: 10,
    height: 10,
    backgroundColor: '#CCFF00',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  liveDotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(204, 255, 0, 0.30)',
    position: 'absolute',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
    borderRadius: 20,
  },
  liveBadgeText: {
    color: '#CCFF00',
    fontSize: 10,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  syncCardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    marginTop: 12,
  },
  syncCardSubtitle: {
    color: '#8E9BAE',
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    marginTop: 4,
    marginBottom: 16,
  },
  syncButton: {
    height: 46,
    backgroundColor: '#CCFF00',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    gap: 8,
  },
  syncButtonText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A3B47',
  },
  tagText: {
    color: '#8E9BAE',
    fontSize: 10,
    fontFamily: 'DMSans-Medium',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    paddingRight: 12,
  },
  seeAllText: {
    color: '#CCFF00',
    fontSize: 12,
    fontFamily: 'DMSans-Bold',
    fontWeight: '600',
  },
  horizontalScroll: {
    gap: 12,
    paddingBottom: 10,
  },
  matchCard: {
    width: 144,
    height: 119,
    padding: 14,
    backgroundColor: '#1A242B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A3B47',
    marginRight: 12,
    position: 'relative',
  },
  matchLeague: {
    color: '#8E9BAE',
    fontSize: 9,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.26,
    marginBottom: 6,
  },
  matchTeams: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  matchDay: {
    color: '#8E9BAE',
    fontSize: 10,
    fontFamily: 'DMSans-Regular',
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(204, 255, 0, 0.10)',
    borderRadius: 5,
  },
  scoreText: {
    color: '#CCFF00',
    fontSize: 11,
    fontFamily: 'PlayfairDisplay-Bold',
    fontWeight: '700',
  },
  cardBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 1,
    width: 142,
    height: 2,
    backgroundColor: '#CCFF00',
    opacity: 0.40,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#1A242B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A3B47',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: '#CCFF00',
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    fontWeight: '900',
  },
  statLabel: {
    color: '#8E9BAE',
    fontSize: 10,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  emptyCard: {
    width: 320,
    height: 119,
    padding: 16,
    backgroundColor: '#1A242B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A3B47',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E9BAE',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    lineHeight: 18,
  },
});