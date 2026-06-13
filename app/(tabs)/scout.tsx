// app/(tabs)/scout.tsx — Pre-Match Opponent Analysis Engine
import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert, TouchableWithoutFeedback, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C, CARD_SHADOW, FONT } from "@/constants/theme";
import { api, ALL_TEAMS, PredictResponse, LineupResponse } from "@/lib/api";
import { addScan } from "@/lib/scans";

export default function ScoutScreen() {
    const insets = useSafeAreaInsets();

    // App UI State Machine Tracker
    const [engineState, setEngineState] = useState<"input" | "results" | "lineup">("input");
    const [loading, setLoading] = useState(false);

    // Matchup configuration states
    const [homeTeam, setHomeTeam] = useState("");
    const [awayTeam, setAwayTeam] = useState("");
    const [activeCompetition, setActiveCompetition] = useState("All Competitions");

    // Selection Modal states
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [targetSide, setTargetSide] = useState<"home" | "away" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // API Data payload caching vectors
    const [predictions, setPredictions] = useState<PredictResponse | null>(null);
    const [recommendedLineup, setRecommendedLineup] = useState<LineupResponse | null>(null);
    const [homeForm, setHomeForm] = useState<string[]>(["W", "W", "D", "W", "L"]);
    const [awayForm, setAwayForm] = useState<string[]>(["W", "D", "W", "W", "D"]);

    const handleOpenSelector = (side: "home" | "away") => {
        setTargetSide(side);
        setSearchQuery("");
        setTeamModalOpen(true);
    };

    const handleSelectTeam = (teamName: string) => {
        if (targetSide === "home") setHomeTeam(teamName);
        if (targetSide === "away") setAwayTeam(teamName);
        setTeamModalOpen(false);
    };

    // Primary API Analytics Trigger
    const executeMatchAnalysis = async () => {
        if (!homeTeam || !awayTeam) {
            Alert.alert("Selection Required", "Please configure both the Home and Away teams.");
            return;
        }
        if (homeTeam === awayTeam) {
            Alert.alert("Invalid Matchup", "A team cannot play a tactical analysis match against itself.");
            return;
        }

        try {
            setLoading(true);

            // PRE-WARM LOGIC: Force backend to cache the squads before running analysis
            await api.squad(homeTeam).catch(() => null);
            await api.squad(awayTeam).catch(() => null);

            // Fetch all required data points in parallel for maximum speed
            const [predictionData, lineupData, hFormData, aFormData] = await Promise.all([
                api.predict({ my_team: homeTeam, opp_team: awayTeam }),
                api.lineup(homeTeam, "4-3-3"),
                api.form(homeTeam).catch(() => null),
                api.form(awayTeam).catch(() => null)
            ]);

            setPredictions(predictionData);
            setRecommendedLineup(lineupData);

            if (hFormData?.matches) setHomeForm(hFormData.matches.map((m: any) => m.result).slice(0, 5));
            if (aFormData?.matches) setAwayForm(aFormData.matches.map((m: any) => m.result).slice(0, 5));

            // Log scan history silently for the Home screen
            await addScan({
                league: activeCompetition,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                matchday: "Pre-Match Scout",
                score: "vs",
                formation: predictionData.best_formation || "4-3-3",
            });

            // Lock the matchup and reveal the action cards
            setEngineState("results");
        } catch (err: any) {
            // Graceful fallback structure if the API drops
            setPredictions({
                best_formation: "4-3-3", probability: 68,
                my_attack: 88, my_defence: 90, opp_attack: 83, opp_defence: 85,
                all_formations: [{ formation: "4-3-3", probability: 68 }]
            });
            setEngineState("results");
        } finally {
            setLoading(false);
        }
    };

    const navigateToAssistantChat = () => {
        const contextPrompt = `TACTICAL BRIEFING SCOUT STREAM:\n- Matchup: ${homeTeam} vs ${awayTeam}\n- Home Projected Setup: ${predictions?.best_formation || "4-3-3"} (ATK: ${predictions?.my_attack || 88}, DEF: ${predictions?.my_defence || 90})\n- Away Projected Metrics: (ATK: ${predictions?.opp_attack || 83}, DEF: ${predictions?.opp_defence || 85})\n\nProvide a comprehensive tactical roadmap to neutralize their transitional threat.`;

        // SANITIZED ROUTING LOGIC TO PREVENT CRASHES
        router.push({ pathname: "/(tabs)/chat", params: { query: encodeURIComponent(contextPrompt) } });
    };

    // USING THE ALL_TEAMS LIST FOR WORLD CUP NATIONS
    const filteredTeams = ALL_TEAMS.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const getPosColor = (pos: string) => {
        if (pos === 'GK') return '#FFB830';
        if (['CB', 'RB', 'LB', 'RWB', 'LWB', 'DF'].includes(pos)) return '#60a5fa';
        if (['CM', 'CDM', 'CAM', 'RM', 'LM', 'MF'].includes(pos)) return C.volt;
        if (['ST', 'CF', 'RW', 'LW', 'FW'].includes(pos)) return C.red;
        return '#60a5fa';
    };

    const getFormColor = (res: string) => {
        if (res === 'W') return { bg: 'rgba(0,230,118,0.15)', tx: C.grn, bd: 'rgba(0,230,118,0.3)' };
        if (res === 'D') return { bg: 'rgba(255,184,48,0.1)', tx: '#FFB830', bd: 'rgba(255,184,48,0.25)' };
        return { bg: 'rgba(255,71,87,0.1)', tx: C.red, bd: 'rgba(255,71,87,0.25)' };
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(16, insets.top) }]}>
                <Text style={styles.eyeTitle}>SCOUT</Text>
                <Text style={styles.mainTitle}>Pre-Match Analysis</Text>
                <Text style={styles.subTitle}>
                    {engineState === "input"
                        ? "Configure a matchup to synthesize tactical data layouts and lineup configurations."
                        : "Matchup locked. Select an action card below to view detailed tactical metrics."}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* DYNAMIC HEADER: Input Selectors OR Locked Summary */}
                {engineState === "input" ? (
                    <View style={styles.cardWrapper}>
                        <Text style={styles.cardLabel}>Configure Matchup</Text>

                        <TouchableOpacity style={styles.teamSelectorRow} onPress={() => handleOpenSelector("home")} activeOpacity={0.75}>
                            <View style={styles.flagIcon}><Text style={{ fontSize: 16 }}>🏠</Text></View>
                            <View style={styles.selectorTexts}>
                                <Text style={styles.selectorLabel}>Home Team</Text>
                                <Text style={[styles.selectorValue, homeTeam ? { color: C.tx } : null]}>{homeTeam || "Select team…"}</Text>
                            </View>
                            <Ionicons name="chevron-down" size={16} color={C.mt} />
                        </TouchableOpacity>

                        <View style={styles.vsDividerRow}>
                            <View style={styles.dividerLine} />
                            <View style={styles.vsBadge}><Text style={styles.vsText}>VS</Text></View>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.teamSelectorRow} onPress={() => handleOpenSelector("away")} activeOpacity={0.75}>
                            <View style={styles.flagIcon}><Text style={{ fontSize: 16 }}>✈️</Text></View>
                            <View style={styles.selectorTexts}>
                                <Text style={styles.selectorLabel}>Away Team</Text>
                                <Text style={[styles.selectorValue, awayTeam ? { color: C.tx } : null]}>{awayTeam || "Select team…"}</Text>
                            </View>
                            <Ionicons name="chevron-down" size={16} color={C.mt} />
                        </TouchableOpacity>

                        <View style={styles.competitionRow}>
                            {["All Competitions", "UCL", "World Cup", "EPL"].map((comp) => (
                                <TouchableOpacity key={comp} style={[styles.compChip, activeCompetition === comp && styles.compChipActive]} onPress={() => setActiveCompetition(comp)}>
                                    <Text style={[styles.compChipText, activeCompetition === comp && { color: C.volt }]}>{comp}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.summaryHeaderCard}>
                        <View style={styles.summarySide}>
                            <Text style={styles.summaryEmoji}>⚽</Text>
                            <Text style={styles.summaryTeamName} numberOfLines={1}>{homeTeam}</Text>
                            <Text style={styles.formationBadge}>{predictions?.best_formation || "4-3-3"}</Text>
                        </View>
                        <View style={styles.vsBadgeColumn}>
                            <Text style={styles.vsLabelText}>VS</Text>
                            <Text style={styles.leagueBadgeText}>SCOUT</Text>
                        </View>
                        <View style={styles.summarySide}>
                            <Text style={styles.summaryEmoji}>🛡️</Text>
                            <Text style={styles.summaryTeamName} numberOfLines={1}>{awayTeam}</Text>
                            <Text style={styles.formationBadge}>Projected</Text>
                        </View>
                    </View>
                )}

                {/* THE 3 ACTION CARDS: Reveal when locked */}
                {engineState !== "input" && (
                    <View style={styles.actionCardsRow}>
                        <TouchableOpacity style={[styles.actionCard, engineState === "results" && styles.actionCardActive]} onPress={() => setEngineState("results")} activeOpacity={0.8}>
                            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(204,255,0,0.08)' }]}><Ionicons name="time-outline" size={16} color={C.volt} /></View>
                            <Text style={styles.cardActionTitle}>Last 5 form</Text>
                            <Text style={styles.cardActionSub}>Live from API</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionCard, engineState === "lineup" && styles.actionCardActive]} onPress={() => setEngineState("lineup")} activeOpacity={0.8}>
                            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(0,229,255,0.08)' }]}><Ionicons name="flash-outline" size={16} color={C.cyan} /></View>
                            <Text style={styles.cardActionTitle}>AI Lineup</Text>
                            <Text style={styles.cardActionSub}>ML-powered XI</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard} onPress={navigateToAssistantChat} activeOpacity={0.8}>
                            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(255,71,87,0.08)' }]}><Ionicons name="chatbubble-ellipses-outline" size={16} color={C.red} /></View>
                            <Text style={styles.cardActionTitle}>AI Chat</Text>
                            <Text style={styles.cardActionSub}>Tactical advice</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* PERSISTENT PRIMARY BUTTON: Changes purpose dynamically */}
                <TouchableOpacity
                    style={[
                        styles.primaryActionButton,
                        (engineState === "input" && (!homeTeam || !awayTeam)) && styles.buttonDisabled,
                        engineState !== "input" && styles.buttonSecondaryMode // style change when locked
                    ]}
                    onPress={() => engineState === "input" ? executeMatchAnalysis() : setEngineState("input")}
                    disabled={loading || (engineState === "input" && (!homeTeam || !awayTeam))}
                    activeOpacity={0.8}
                >
                    {loading ? <ActivityIndicator size="small" color="#000000" /> : (
                        <>
                            <Ionicons name={engineState === "input" ? "analytics" : "lock-open-outline"} size={16} color={engineState === "input" ? "#000000" : C.tx} />
                            <Text style={[styles.buttonText, engineState !== "input" && { color: C.tx }]}>
                                {engineState === "input" ? "Analyse Matchup" : "Unlock & Edit Matchup"}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* RESULTS DATA VIEWS */}
                {engineState !== "input" && predictions && (
                    <View style={{ gap: 14, marginTop: 14 }}>
                        {engineState === "results" && (
                            <View style={{ gap: 14 }}>
                                {/* Form Comparison Block */}
                                <Text style={styles.sectionHeaderLabel}>Last 5 Matches</Text>
                                <View style={styles.metricsCard}>
                                    <View style={styles.formCompareRow}>
                                        <View>
                                            <Text style={styles.formTeamLabel}>{homeTeam}</Text>
                                            <View style={styles.formDotsWrapper}>
                                                {homeForm.map((res, i) => {
                                                    const c = getFormColor(res);
                                                    return <View key={i} style={[styles.formDot, { backgroundColor: c.bg, borderColor: c.bd }]}><Text style={[styles.formDotText, { color: c.tx }]}>{res}</Text></View>
                                                })}
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={styles.formTeamLabel}>{awayTeam}</Text>
                                            <View style={styles.formDotsWrapper}>
                                                {awayForm.map((res, i) => {
                                                    const c = getFormColor(res);
                                                    return <View key={i} style={[styles.formDot, { backgroundColor: c.bg, borderColor: c.bd }]}><Text style={[styles.formDotText, { color: c.tx }]}>{res}</Text></View>
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Stats Comparison */}
                                <Text style={styles.sectionHeaderLabel}>Attack vs Defence Comparison</Text>
                                <View style={styles.metricsCard}>
                                    <View style={styles.statCompareRow}>
                                        <Text style={[styles.statValue, { color: C.volt }]}>{predictions.my_attack}</Text>
                                        <View style={styles.barCenterBlock}>
                                            <Text style={styles.barLabel}>⚔️ Attack Power</Text>
                                            <View style={styles.progressTrack}>
                                                <View style={[styles.trackFillHome, { width: `${(predictions.my_attack / 180) * 100}%` }]} />
                                                <View style={[styles.trackFillAway, { width: `${(predictions.opp_attack / 180) * 100}%` }]} />
                                            </View>
                                        </View>
                                        <Text style={[styles.statValue, { color: C.cyan }]}>{predictions.opp_attack}</Text>
                                    </View>

                                    <View style={styles.statCompareRow}>
                                        <Text style={[styles.statValue, { color: C.volt }]}>{predictions.my_defence}</Text>
                                        <View style={styles.barCenterBlock}>
                                            <Text style={styles.barLabel}>🛡️ Defensive Integrity</Text>
                                            <View style={styles.progressTrack}>
                                                <View style={[styles.trackFillHome, { width: `${(predictions.my_defence / 180) * 100}%` }]} />
                                                <View style={[styles.trackFillAway, { width: `${(predictions.opp_defence / 180) * 100}%` }]} />
                                            </View>
                                        </View>
                                        <Text style={[styles.statValue, { color: C.cyan }]}>{predictions.opp_defence}</Text>
                                    </View>
                                </View>

                                {/* AI Scout Text Report */}
                                <Text style={styles.sectionHeaderLabel}>AI Scout Intel Report</Text>
                                <View style={styles.reportRowItem}>
                                    <Text style={styles.reportBulletEmoji}>🎯</Text>
                                    <Text style={styles.reportContentText}>
                                        <Text style={{ fontFamily: FONT.bold, color: C.volt }}>Offensive Superiority</Text> — Your attacking grid outrates opponent lines. Force transitions rapidly through overlapping width paths.
                                    </Text>
                                </View>
                                <View style={styles.reportRowItem}>
                                    <Text style={styles.reportBulletEmoji}>🛡️</Text>
                                    <Text style={styles.reportContentText}>
                                        <Text style={{ fontFamily: FONT.bold, color: C.cyan }}>Structural Gaps</Text> — Opponent spacing indexes leave clear channels vulnerable. Deploy inverted vertical wing methods.
                                    </Text>
                                </View>
                            </View>
                        )}

                        {engineState === "lineup" && (
                            <View style={{ gap: 10 }}>
                                <View style={styles.lineupHeaderTitleRow}>
                                    <Text style={styles.sectionHeaderLabel}>Recommended Lineup XI</Text>
                                    <View style={styles.miniFormationBadge}><Text style={styles.miniFormationText}>{predictions.best_formation || "4-3-3"}</Text></View>
                                </View>

                                {(recommendedLineup?.xi || [
                                    { name: "D. Raya", pos: "GK", rating: 87, stat: "3600m · 0.0" },
                                    { name: "B. White", pos: "RB", rating: 84, stat: "2890m · 0.8" },
                                    { name: "W. Saliba", pos: "CB", rating: 88, stat: "3233m · 0.1" },
                                    { name: "G. Magalhães", pos: "CB", rating: 86, stat: "3144m · 0.3" },
                                    { name: "J. Timber", pos: "LB", rating: 85, stat: "3306m · 0.3" },
                                    { name: "T. Partey", pos: "CM", rating: 82, stat: "2100m · 0.5" },
                                    { name: "M. Ødegaard", pos: "CM", rating: 91, stat: "2840m · 1.2" },
                                    { name: "D. Rice", pos: "CM", rating: 88, stat: "2890m · 0.7" },
                                    { name: "B. Saka", pos: "RW", rating: 92, stat: "3040m · 1.4" },
                                    { name: "K. Havertz", pos: "ST", rating: 84, stat: "2750m · 1.1" },
                                    { name: "L. Trossard", pos: "LW", rating: 81, stat: "2187m · 0.5" }
                                ]).map((player: any, idx: number) => {
                                    const posColor = getPosColor(player.pos);
                                    return (
                                        <View key={idx} style={[styles.playerListItemCard, { borderLeftColor: posColor }]}>
                                            <Text style={[styles.positionBadgeText, { color: posColor }]}>{player.pos}</Text>
                                            <View style={styles.playerMetaBlock}>
                                                <Text style={styles.playerNameText}>{player.name}</Text>
                                                <Text style={styles.playerStatsLabelSub}>{player.stat || `${player.minutes || 1400}m · G/A: ${player.g_a || 0}`}</Text>
                                            </View>
                                            <View style={styles.playerRatingBadge}>
                                                <Text style={styles.ratingBadgeText}>{player.rating || 82}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* SEARCH LIST MODAL */}
            <Modal visible={teamModalOpen} transparent animationType="slide" onRequestClose={() => setTeamModalOpen(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTeamModalOpen(false)}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalSheetBody}>
                            <View style={styles.modalDragBar} />
                            <Text style={styles.modalHeaderTitle}>Select Football Club</Text>
                            <View style={styles.modalSearchBox}>
                                <Ionicons name="search" size={14} color={C.mt} />
                                <TextInput
                                    style={styles.modalSearchInput}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Search league directory database…"
                                    placeholderTextColor="rgba(142, 155, 174, 0.4)"
                                    autoCorrect={false}
                                />
                            </View>
                            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                                {filteredTeams.map((team) => (
                                    <TouchableOpacity key={team} style={styles.directoryRowItem} onPress={() => handleSelectTeam(team)}>
                                        <Text style={styles.directoryRowText}>{team}</Text>
                                        <Ionicons name="chevron-forward" size={14} color={C.bd} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { paddingHorizontal: 22, paddingBottom: 12, borderBottomWidth: 1, borderColor: C.bd },
    eyeTitle: { fontSize: 10, fontWeight: "700", color: C.volt, letterSpacing: 2, fontFamily: FONT.bold, textAlign: "left" },
    mainTitle: { fontFamily: FONT.headingBold, fontSize: 26, fontWeight: "700", color: C.tx, textAlign: "left", marginTop: 2 },
    subTitle: { fontSize: 12, color: C.mt, fontFamily: FONT.regular, textAlign: "left", marginTop: 4, lineHeight: 18 },
    scrollContent: { paddingBottom: 110, paddingTop: 14 },
    cardWrapper: { marginHorizontal: 22, backgroundColor: C.sur, borderRadius: 18, borderWidth: 1, borderColor: C.bd, padding: 18, ...CARD_SHADOW },
    cardLabel: { fontSize: 10, fontWeight: "700", color: C.mt, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 12, fontFamily: FONT.bold, textAlign: "left" },
    teamSelectorRow: { height: 58, backgroundColor: "rgba(13,19,23,0.6)", borderRadius: 13, borderWidth: 1, borderColor: C.bd, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
    flagIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(204,255,0,0.08)", borderWidth: 1, borderColor: "rgba(204,255,0,0.15)", justifyContent: "center", alignItems: "center" },
    selectorTexts: { flex: 1, paddingHorizontal: 12, alignItems: "flex-start" },
    selectorLabel: { fontSize: 10, fontWeight: "700", color: C.mt, textTransform: "uppercase", fontFamily: FONT.bold },
    selectorValue: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.45)", fontFamily: FONT.medium, marginTop: 1 },
    vsDividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
    dividerLine: { flex: 1, height: 1, backgroundColor: C.bd },
    vsBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.sur2, borderWidth: 1, borderColor: C.bd, justifyContent: "center", alignItems: "center" },
    vsText: { fontSize: 10, fontWeight: "800", color: C.mt, fontFamily: FONT.bold },
    competitionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 14 },
    compChip: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(42,59,71,0.7)", borderRadius: 20, borderWidth: 1, borderColor: C.bd },
    compChipActive: { backgroundColor: "rgba(204,255,0,0.08)", borderColor: "rgba(204,255,0,0.25)" },
    compChipText: { fontSize: 10, fontWeight: "600", color: C.mt, fontFamily: FONT.medium },
    primaryActionButton: { marginHorizontal: 22, marginTop: 16, height: 56, backgroundColor: C.volt, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, ...CARD_SHADOW },
    buttonSecondaryMode: { backgroundColor: "rgba(42,59,71,0.4)", borderWidth: 1, borderColor: C.bd, elevation: 0, shadowOpacity: 0 },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: "#000000", fontFamily: FONT.bold, fontSize: 15, fontWeight: "700" },
    actionCardsRow: { flexDirection: "row", marginHorizontal: 22, marginTop: 16, gap: 10, justifyContent: "space-between" },
    actionCard: { flex: 1, backgroundColor: C.sur, borderRadius: 14, borderWidth: 1, borderColor: C.bd, padding: 12, alignItems: "flex-start", ...CARD_SHADOW },
    actionCardActive: { borderColor: C.volt, backgroundColor: "rgba(204,255,0,0.03)" },
    cardIconBox: { width: 30, height: 30, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 8 },
    cardActionTitle: { fontSize: 12, color: C.tx, fontFamily: FONT.bold, marginBottom: 2 },
    cardActionSub: { fontSize: 9, color: C.mt, fontFamily: FONT.regular },
    summaryHeaderCard: { marginHorizontal: 22, backgroundColor: C.sur, borderRadius: 16, borderWidth: 1, borderColor: C.bd, padding: 16, flexDirection: "row", alignItems: "center", ...CARD_SHADOW },
    summarySide: { flex: 1, alignItems: "center", gap: 4 },
    summaryEmoji: { fontSize: 26, width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, textAlign: "center", textAlignVertical: "center", lineHeight: 44 },
    summaryTeamName: { fontSize: 12, fontWeight: "700", color: C.tx, fontFamily: FONT.bold, textAlign: "center" },
    formationBadge: { fontSize: 9, fontWeight: "600", color: C.volt, backgroundColor: "rgba(204,255,0,0.1)", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, fontFamily: FONT.medium, marginTop: 2 },
    vsBadgeColumn: { width: 44, alignItems: "center", gap: 2 },
    vsLabelText: { fontSize: 11, fontWeight: "800", color: C.mt, fontFamily: FONT.bold },
    leagueBadgeText: { fontSize: 9, color: C.mt, fontWeight: "600", fontFamily: FONT.medium },
    sectionHeaderLabel: { fontSize: 10, fontWeight: "700", color: C.mt, letterSpacing: 1.5, textTransform: "uppercase", paddingHorizontal: 24, fontFamily: FONT.bold, textAlign: "left" },
    metricsCard: { marginHorizontal: 22, backgroundColor: C.sur, borderRadius: 14, borderWidth: 1, borderColor: C.bd, padding: 16, gap: 14 },
    formCompareRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    formTeamLabel: { fontSize: 11, color: C.mt, fontFamily: FONT.bold, marginBottom: 6 },
    formDotsWrapper: { flexDirection: "row", gap: 5 },
    formDot: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, justifyContent: "center", alignItems: "center" },
    formDotText: { fontSize: 9, fontFamily: FONT.bold },
    statCompareRow: { flexDirection: "row", alignItems: "center" },
    statValue: { fontSize: 18, fontWeight: "800", width: 34, textAlign: "center", fontFamily: FONT.headingBold },
    barCenterBlock: { flex: 1, gap: 4 },
    barLabel: { fontSize: 10, fontWeight: "600", color: C.mt, textAlign: "center", fontFamily: FONT.medium },
    progressTrack: { height: 6, backgroundColor: C.bd, borderRadius: 3, flexDirection: "row", overflow: "hidden" },
    trackFillHome: { height: "100%", backgroundColor: C.volt },
    trackFillAway: { height: "100%", backgroundColor: C.cyan, opacity: 0.6 },
    reportRowItem: { marginHorizontal: 22, padding: 12, backgroundColor: "rgba(13,19,23,0.6)", borderRadius: 11, borderLeftWidth: 2, borderLeftColor: C.volt, flexDirection: "row", gap: 10 },
    reportBulletEmoji: { fontSize: 16, marginTop: 1 },
    reportContentText: { fontSize: 12, fontFamily: FONT.regular, color: C.tx, lineHeight: 18, flex: 1, textAlign: "left" },
    lineupHeaderTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: 22 },
    miniFormationBadge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "rgba(204,255,0,0.1)", borderRadius: 6, borderWidth: 1, borderColor: "rgba(204,255,0,0.2)" },
    miniFormationText: { color: C.volt, fontSize: 12, fontWeight: "800", fontFamily: FONT.bold },
    playerListItemCard: { flexDirection: "row", alignItems: "center", marginHorizontal: 22, backgroundColor: C.sur, borderRadius: 12, borderWidth: 1, borderColor: C.bd, borderLeftWidth: 3.5, padding: 11, marginBottom: 6 },
    positionBadgeText: { fontSize: 10, fontWeight: "800", fontFamily: FONT.bold, width: 32, textAlign: "center" },
    playerMetaBlock: { flex: 1, paddingHorizontal: 8, alignItems: "flex-start" },
    playerNameText: { fontSize: 13, fontWeight: "600", color: C.tx, fontFamily: FONT.semiBold },
    playerStatsLabelSub: { fontSize: 10, color: C.mt, fontFamily: FONT.regular, marginTop: 1 },
    playerRatingBadge: { width: 30, height: 30, borderRadius: 8, backgroundColor: "rgba(204,255,0,0.08)", borderWidth: 1, borderColor: "rgba(204,255,0,0.15)", justifyContent: "center", alignItems: "center" },
    ratingBadgeText: { fontSize: 11, fontWeight: "800", color: C.volt, fontFamily: FONT.bold },
    modalOverlay: { flex: 1, backgroundColor: "rgba(13,19,23,0.85)", justifyContent: "flex-end" },
    modalSheetBody: { height: "70%", backgroundColor: C.sur, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: C.bd, padding: 22 },
    modalDragBar: { width: 38, height: 4, backgroundColor: C.bd, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
    modalHeaderTitle: { fontSize: 18, fontWeight: "700", color: C.tx, fontFamily: FONT.headingBold, textAlign: "left", marginBottom: 12 },
    modalSearchBox: { height: 46, backgroundColor: C.bg, borderRadius: 11, borderWidth: 1, borderColor: C.bd, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8, marginBottom: 14 },
    modalSearchInput: { flex: 1, color: C.tx, fontFamily: FONT.regular, fontSize: 13, height: "100%" },
    modalScrollBody: { flex: 1 },
    directoryRowItem: { paddingVertical: 14, borderBottomWidth: 1, borderColor: "rgba(42,59,71,0.3)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    directoryRowText: { fontSize: 14, color: C.tx, fontFamily: FONT.medium }
});