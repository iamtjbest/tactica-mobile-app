// app/(tabs)/profile.tsx — Coach's Profile Screen
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch, Alert, Image, TouchableWithoutFeedback } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Rect, Circle, Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { C } from "@/constants/theme";
import { TopToast } from "@/components/TopToast";

// Custom Inline SVG Icons
const EditPhotoIcon = ({ size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Rect x={1} y={2} width={9} height={9} stroke="black" strokeWidth={1.25} />
    <Rect x={4} y={1} width={7} height={7} stroke="black" strokeWidth={1.25} />
  </Svg>
);

const EditProfileIcon = ({ size = 18, color = C.volt }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Rect x={3} y={11.25} width={12} height={4.5} rx={1} stroke={color} strokeWidth={1.5} />
    <Circle cx={9} cy={5.25} r={3} stroke={color} strokeWidth={1.5} />
  </Svg>
);

const FavTeamIcon = ({ size = 18, color = C.cyan }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2 C11 2, 14 3, 14 6 C14 11, 9 15.5, 9 15.5 C9 15.5, 4 11, 4 6 C4 3, 7 2, 9 2 Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>
);

const LockIcon = ({ size = 18, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Rect x={2.25} y={8.25} width={13.5} height={8.25} rx={2} stroke={color} strokeWidth={1.5} />
    <Path d="M5.25 8.25 V5 A3.75 3.75 0 0 1 12.75 5 V8.25" stroke={color} strokeWidth={1.5} />
  </Svg>
);

const BellIcon = ({ size = 18, color = C.volt }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path d="M9 2.5 A4.5 4.5 0 0 1 13.5 7 V11.5 H4.5 V7 A4.5 4.5 0 0 1 9 2.5 Z" stroke={color} strokeWidth={1.5} />
    <Path d="M2 11.5 H16" stroke={color} strokeWidth={1.5} />
    <Path d="M7.7 11.5 A1.5 1.5 0 0 0 10.3 11.5" stroke={color} strokeWidth={1.5} />
  </Svg>
);

const GlobeIcon = ({ size = 18, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Circle cx={9} cy={9} r={7.5} stroke={color} strokeWidth={1.5} />
    <Path d="M9 1.5 V16.5" stroke={color} strokeWidth={1.5} />
    <Path d="M1.5 9 H16.5" stroke={color} strokeWidth={1.5} />
  </Svg>
);

const MapPinIcon = ({ size = 18, color = C.cyan }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Circle cx={9} cy={9} r={2.25} stroke={color} strokeWidth={1.5} />
    <Path d="M9 1.5 C5 1.5 2.5 5 2.5 9 C2.5 13.5 9 16.5 9 16.5 C9 16.5 15.5 13.5 15.5 9 C15.5 5 13 1.5 9 1.5 Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
  </Svg>
);

const HelpIcon = ({ size = 18, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Circle cx={9} cy={9} r={7.5} stroke={color} strokeWidth={1.5} />
    <Path d="M9 13 V12.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M7 6.5 C7 5.5 8 4.5 9 4.5 C10 4.5 11 5.5 11 6.5 C11 7.8 9.5 8.2 9.5 9.2 V9.7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const ChevronRightIcon = ({ size = 14, color = "#8E9BAE" }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <Path d="M5.25 3.5 L8.75 7 L5.25 10.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SignOutIcon = ({ size = 16, color = "#FF4757" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path d="M8 2 H3 A1 1 0 0 0 2 3 V13 A1 1 0 0 0 3 14 H8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M10.5 11 L13.5 8 L10.5 5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 8 H13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const ShieldIcon = ({ size = 18, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LANGUAGES = ["English", "Español", "Français", "Deutsch", "Italiano", "Português", "Nederlands", "Русский", "日本語", "한국어", "简体中文", "العربية", "Türkçe"];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    account: "Account", editProfile: "Edit Profile", namePhotoUsername: "Name, photo, username", favouriteTeam: "Favourite Team", premierLeague: "Premier League", changePassword: "Change Password", sendResetFlow: "Send reset password flow", preferences: "Preferences", notifications: "Notifications", language: "Language", location: "Location", support: "Support", helpFaq: "Help & FAQ", faqSubtitle: "Frequently Asked Questions", rateTactica: "Rate Tactica", rateSubtitle: "Love the app? Leave a review", rateButton: "⭐ Rate", signOut: "Sign Out", analyses: "Analyses", sessions: "Sessions", formations: "Formations", versionText: "Tactica v1.0.0 · Ethereum Football", selectLanguage: "Select Language", close: "Close"
  },
  Español: {
    account: "Cuenta", editProfile: "Editar Perfil", namePhotoUsername: "Nombre, foto, usuario", favouriteTeam: "Equipo Favorito", premierLeague: "Premier League", changePassword: "Cambiar Contraseña", sendResetFlow: "Enviar flujo de restablecimiento", preferences: "Preferencias", notifications: "Notificaciones", language: "Idioma", location: "Ubicación", support: "Soporte", helpFaq: "Ayuda y FAQ", faqSubtitle: "Preguntas frecuentes", rateTactica: "Calificar Tactica", rateSubtitle: "¿Te gusta la aplicación? Deja una reseña", rateButton: "⭐ Calificar", signOut: "Cerrar Sesión", analyses: "Análisis", sessions: "Sesiones", formations: "Formaciones", versionText: "Tactica v1.0.0 · Fútbol Ethereum", selectLanguage: "Seleccionar Idioma", close: "Cerrar"
  }
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Dynamic user data states
  const [name, setName] = useState("Tj Best");
  const [email, setEmail] = useState("your@email.com");
  const [username, setUsername] = useState("@tjbest");
  const [initials, setInitials] = useState("TJ");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [favoriteTeam, setFavoriteTeam] = useState("Arsenal FC");
  const [location, setLocation] = useState("Nigeria");
  const [language, setLanguage] = useState("English");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "info" | "error">("info");

  const [analysesCount, setAnalysesCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [formationsCount, setFormationsCount] = useState(0);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const t = (key: keyof typeof TRANSLATIONS.English): string => {
    const lang = TRANSLATIONS[language] ? language : "English";
    return (TRANSLATIONS[lang][key] || TRANSLATIONS.English[key]) as string;
  };

  const loadProfileData = async () => {
    if (auth.currentUser) {
      const user = auth.currentUser;
      setName(user.displayName || "Tj Best");
      setEmail(user.email || "your@email.com");

      const displayName = user.displayName || "";
      if (displayName) {
        const parts = displayName.trim().split(/\s+/);
        const firstInit = parts[0] ? parts[0].charAt(0) : "";
        const lastInit = parts[1] ? parts[1].charAt(0) : "";
        setInitials((firstInit + lastInit).toUpperCase() || "TJ");
      }
    }

    // Pull saved custom username token directly from AsyncStorage cache
    const cachedUserTag = await AsyncStorage.getItem("@custom_username");
    if (cachedUserTag) {
      setUsername(cachedUserTag);
    }

    const cachedPhoto = await AsyncStorage.getItem("@profile_photo_uri");
    if (cachedPhoto) {
      setProfilePhoto(cachedPhoto);
    } else if (auth.currentUser?.photoURL) {
      setProfilePhoto(auth.currentUser.photoURL);
    }

    const cachedTeam = await AsyncStorage.getItem("@favorite_team");
    if (cachedTeam) setFavoriteTeam(cachedTeam);

    const cachedLoc = await AsyncStorage.getItem("@location");
    if (cachedLoc) setLocation(cachedLoc);

    const cachedLang = await AsyncStorage.getItem("@language");
    if (cachedLang) setLanguage(cachedLang);

    const cachedNotif = await AsyncStorage.getItem("@notifications_enabled");
    if (cachedNotif !== null) {
      setNotificationsEnabled(cachedNotif === "true");
    }

    try {
      const scansStr = await AsyncStorage.getItem("@recent_scans");
      const scansList = scansStr ? JSON.parse(scansStr) : [];
      setAnalysesCount(scansList.length);

      const formsStr = await AsyncStorage.getItem("@stored_formations");
      const formsList = formsStr ? JSON.parse(formsStr) : [];
      setFormationsCount(formsList.length);

      const teamsStr = await AsyncStorage.getItem("@scanned_teams");
      const teamsList = teamsStr ? JSON.parse(teamsStr) : [];
      setSessionsCount(teamsList.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProfileData();
    const unsubscribeFocus = navigation.addListener("focus", () => {
      loadProfileData();
    });
    return unsubscribeFocus;
  }, [navigation]);

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Tactica requires camera roll access to upload custom photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setProfilePhoto(photoUri);
        await AsyncStorage.setItem("@profile_photo_uri", photoUri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not import image from device library.");
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    await AsyncStorage.setItem("@notifications_enabled", val ? "true" : "false");
    setToastType(val ? "success" : "info");
    setToastMessage(val ? "You'll receive live alerts & tactical insights" : "Alerts disabled globally.");
    setToastVisible(true);
  };

  const handleSelectLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem("@language", lang);
    setLangSearch("");
    setLanguageOpen(false);
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of Tactica?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/(auth)/sign-in");
          } catch (error) {
            Alert.alert("Error", "Unable to sign out.");
          }
        }
      }
    ]);
  };

  return (
    <View style={s.container}>
      <TopToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />

      <ScrollView contentContainerStyle={[s.scrollContent, { paddingTop: Math.max(16, insets.top) }]} showsVerticalScrollIndicator={false}>

        {/* HERO SECTION */}
        <LinearGradient colors={["rgba(204, 255, 0, 0.08)", "rgba(204, 255, 0, 0)"]} style={s.hero}>
          <View style={s.avatarContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={handlePickPhoto} style={s.avatarBorder}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={s.avatarImage} />
              ) : (
                <Text style={s.avatarInitials}>{initials}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={s.editPhotoBadge} activeOpacity={0.8} onPress={handlePickPhoto}>
              <EditPhotoIcon size={12} />
            </TouchableOpacity>
          </View>

          <Text style={s.userName}>{name}</Text>
          {/* Synchronized: Active user tag handle rendering dynamic layouts cleanly */}
          <Text style={s.userEmail}>{username} · {email}</Text>

          <View style={s.teamBadge}>
            <Text style={s.teamBadgeText}>🔴 {favoriteTeam}</Text>
          </View>
        </LinearGradient>

        {/* STATS ROW */}
        <View style={s.statsRow}>
          <View style={[s.statCol, s.statColBorder]}>
            <Text style={s.statNum}>{analysesCount}</Text>
            <Text style={s.statLabel}>{t("analyses")}</Text>
          </View>
          <View style={[s.statCol, s.statColBorder]}>
            <Text style={s.statNum}>{sessionsCount}</Text>
            <Text style={s.statLabel}>{t("sessions")}</Text>
          </View>
          <View style={s.statCol}>
            <Text style={s.statNum}>{formationsCount}</Text>
            <Text style={s.statLabel}>{t("formations")}</Text>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={s.sectionHeader}>{t("account")}</Text>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => router.push("/edit-profile")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(204, 255, 0, 0.10)" }]}>
              <EditProfileIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("editProfile")}</Text>
              <Text style={s.rowSubtitle}>{t("namePhotoUsername")}</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => Alert.alert("Favorite Team", "Team update menu screen opened.")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(0, 229, 255, 0.10)" }]}>
              <FavTeamIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("favouriteTeam")}</Text>
              <Text style={s.rowSubtitle}>{favoriteTeam} · {t("premierLeague")}</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => router.push("/(auth)/forgot-password")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(255, 255, 255, 0.06)" }]}>
              <LockIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("changePassword")}</Text>
              <Text style={s.rowSubtitle}>{t("sendResetFlow")}</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        {/* PREFERENCES SECTION */}
        <Text style={s.sectionHeader}>{t("preferences")}</Text>

        <View style={s.row}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(204, 255, 0, 0.10)" }]}>
              <BellIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("notifications")}</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: "#2a3b47", true: "#CCFF00" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#2a3b47"
          />
        </View>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => setLanguageOpen(true)}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(255, 255, 255, 0.06)" }]}>
              <GlobeIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("language")}</Text>
              <Text style={s.rowSubtitle}>{language}</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => Alert.alert("Location", "Location tracking settings synchronized.")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(0, 229, 255, 0.10)" }]}>
              <MapPinIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("location")}</Text>
              <Text style={s.rowSubtitle}>{location}</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        {/* SUPPORT SECTION */}
        <Text style={s.sectionHeader}>{t("support")}</Text>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => router.push("/help-faq")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(255, 255, 255, 0.06)" }]}>
              <HelpIcon />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("helpFaq")}</Text>
              <Text style={s.rowSubtitle}>{t("faqSubtitle")}</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => router.push("/privacy-policy")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(255, 255, 255, 0.06)" }]}>
              <ShieldIcon color="white" />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>Terms & Privacy Policy</Text>
              <Text style={s.rowSubtitle}>Data privacy framework guidelines</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => Alert.alert("App Review", "Opening App Store review page...")}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: "rgba(255, 255, 255, 0.06)" }]}>
              <HelpIcon color="#CCFF00" />
            </View>
            <View style={s.rowTexts}>
              <Text style={s.rowTitle}>{t("rateTactica")}</Text>
              <Text style={s.rowSubtitle}>{t("rateSubtitle")}</Text>
            </View>
          </View>
          <View style={s.rateBadge}>
            <Text style={s.rateBadgeText}>{t("rateButton")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.signOutBtn} activeOpacity={0.8} onPress={handleSignOut}>
          <SignOutIcon />
          <Text style={s.signOutBtnText}>{t("signOut")}</Text>
        </TouchableOpacity>

        <View style={s.footer}>
          <Text style={s.footerText}>{t("versionText")}</Text>
        </View>

      </ScrollView>

      {/* LANGUAGE SELECTOR MODAL */}
      <Modal visible={languageOpen} transparent animationType="fade" onRequestClose={() => { setLangSearch(""); setLanguageOpen(false); }}>
        <TouchableOpacity style={s.modalBg} activeOpacity={1} onPress={() => { setLangSearch(""); setLanguageOpen(false); }}>
          <TouchableWithoutFeedback>
            <View style={s.modalCard}>
              <Text style={s.modalHeader}>{t("selectLanguage")}</Text>

              <TextInput
                style={s.textInput}
                placeholder="Search language..."
                placeholderTextColor="rgba(142, 155, 174, 0.4)"
                value={langSearch}
                onChangeText={setLangSearch}
                autoCorrect={false}
              />

              <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
                {LANGUAGES.filter(lang => lang.toLowerCase().includes(langSearch.toLowerCase())).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[s.langRow, language === lang && s.langRowSelected]}
                    onPress={() => handleSelectLanguage(lang)}
                  >
                    <Text style={[s.langText, language === lang && s.langTextSelected]}>{lang}</Text>
                    {language === lang && <Text style={{ color: "#CCFF00" }}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[s.modalBtn, s.modalCancelBtn, { marginTop: 14 }]}
                onPress={() => { setLangSearch(""); setLanguageOpen(false); }}
              >
                <Text style={s.modalCancelBtnText}>{t("close")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1317" },
  scrollContent: { paddingBottom: 110 },
  hero: { alignSelf: "stretch", alignItems: "center", paddingTop: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: "#2A3B47", marginBottom: 1 },
  avatarContainer: { position: "relative", marginBottom: 14 },
  avatarBorder: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "#CCFF00", backgroundColor: "#223040", justifyContent: "center", alignItems: "center", overflow: "hidden", shadowColor: "#CCFF00", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  avatarImage: { width: "100%", height: "100%" },
  avatarInitials: { color: "#CCFF00", fontSize: 28, fontFamily: "PlayfairDisplay-Bold", fontWeight: "700", textAlign: "center" },
  editPhotoBadge: { width: 26, height: 26, position: "absolute", right: -2, bottom: -2, backgroundColor: "#CCFF00", borderRadius: 13, borderWidth: 2, borderColor: "#0D1317", justifyContent: "center", alignItems: "center" },
  userName: { fontSize: 22, color: "#FFFFFF", fontFamily: "PlayfairDisplay-Bold", fontWeight: "700", marginBottom: 4, textAlign: "center" },
  userEmail: { fontSize: 13, color: "#8E9BAE", fontFamily: "DMSans-Regular", fontWeight: "400", marginBottom: 12, textAlign: "center" },
  teamBadge: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(204, 255, 0, 0.08)", borderWidth: 1, borderColor: "rgba(204, 255, 0, 0.20)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  teamBadgeText: { color: "#CCFF00", fontSize: 12, fontFamily: "DMSans-Bold", fontWeight: "600" },
  statsRow: { flexDirection: "row", alignSelf: "stretch", borderBottomWidth: 1, borderBottomColor: "#2A3B47", justifyContent: "center", alignItems: "center", marginBottom: 8, paddingHorizontal: 16 },
  statCol: { flex: 1, paddingVertical: 16, alignItems: "center", gap: 2 },
  statColBorder: { borderRightWidth: 1, borderRightColor: "#2A3B47" },
  statNum: { color: "#CCFF00", fontSize: 22, fontFamily: "PlayfairDisplay-Bold", fontWeight: "700", textAlign: "center" },
  statLabel: { color: "#8E9BAE", fontSize: 10, fontFamily: "DMSans-Medium", fontWeight: "500", textTransform: "uppercase", textAlign: "center" },
  sectionHeader: { alignSelf: "stretch", paddingTop: 14, paddingBottom: 8, paddingHorizontal: 24, color: "#8E9BAE", fontSize: 11, fontFamily: "DMSans-Bold", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.76 },
  row: { flexDirection: "row", alignSelf: "stretch", paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(42, 59, 71, 0.40)", justifyContent: "space-between", alignItems: "center" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBox: { width: 38, height: 38, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  rowTexts: { flexDirection: "column", gap: 1 },
  rowTitle: { color: "#FFFFFF", fontSize: 14, fontFamily: "DMSans-Bold", fontWeight: "600" },
  rowSubtitle: { color: "#8E9BAE", fontSize: 11, fontFamily: "DMSans-Regular", fontWeight: "400" },
  rateBadge: { backgroundColor: "#CCFF00", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  rateBadgeText: { color: "#000000", fontSize: 10, fontFamily: "DMSans-Bold", fontWeight: "700" },
  signOutBtn: { alignSelf: "stretch", height: 50, backgroundColor: "rgba(255, 71, 87, 0.08)", borderWidth: 1, borderColor: "rgba(255, 71, 87, 0.25)", borderRadius: 12, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, marginTop: 20, marginHorizontal: 24 },
  signOutBtnText: { color: "#FF4757", fontSize: 15, fontFamily: "DMSans-Bold", fontWeight: "600" },
  footer: { alignSelf: "stretch", paddingTop: 24, paddingBottom: 16, alignItems: "center", justifyContent: "center" },
  footerText: { color: "rgba(142, 155, 174, 0.40)", fontSize: 11, fontFamily: "DMSans-Regular", fontWeight: "400", textAlign: "center" },
  modalBg: { flex: 1, backgroundColor: "rgba(13, 19, 23, 0.85)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: { width: "100%", backgroundColor: "#1A242B", borderWidth: 1, borderColor: "#2A3B47", borderRadius: 20, padding: 24, alignItems: "stretch", gap: 16 },
  modalHeader: { fontSize: 20, color: "#FFFFFF", fontFamily: "PlayfairDisplay-Bold", fontWeight: "700", textAlign: "center", marginBottom: 8 },
  textInput: { height: 48, backgroundColor: "#0D1317", borderWidth: 1, borderColor: "#2A3B47", borderRadius: 10, paddingHorizontal: 16, color: "#FFFFFF", fontFamily: "DMSans-Medium", fontSize: 14 },
  modalBtn: { height: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  modalCancelBtn: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#2A3B47" },
  modalCancelBtnText: { color: "#8E9BAE", fontSize: 14, fontFamily: "DMSans-Bold", fontWeight: "600" },
  langRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "rgba(42, 59, 71, 0.3)" },
  langRowSelected: { backgroundColor: "rgba(204, 255, 0, 0.05)" },
  langText: { color: "#FFFFFF", fontFamily: "DMSans-Medium", fontSize: 14 },
  langTextSelected: { color: "#CCFF00", fontFamily: "DMSans-Bold" }
});