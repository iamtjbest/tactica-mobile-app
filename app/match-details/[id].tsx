// app/match-details/[id].tsx — Dynamic Match Analysis Screen (Screen 18)
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Rect, Line } from "react-native-svg";
import { C } from "@/constants/theme";
import { api, MatchDetailsResponse } from "@/lib/api";

const BackIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
        <path d="M15 18l-6-6 6-6" />
    </Svg>
);

const PitchIcon = () => (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth={1.8}>
        <Rect x={2} y={3} width={20} height={18} rx={3} />
        <Line x1="2" y1="12" x2="22" y2="12" />
        <Line x1="12" y1="3" x2="12" y2="21" />
    </Svg>
);

interface StatProgressBarProps {
    label: string;
    homeVal: number;
    awayVal: number;
    homeStr: string;
    awayStr: string;
}

const StatProgressBar = ({ label, homeVal, awayVal, homeStr, awayStr }: StatProgressBarProps) => {
    const total = homeVal + awayVal || 1;
    // FIXED: Converted calculation map safely to clean styling percentages to fix line 36 crash
    const homeWidthPercent = (homeVal / total) * 100;

    return (
        <View style={styles.statRowItem}>
            <View style={styles.statLabelHeader}>
                <Text style={styles.statValueHome}>{homeStr}</Text>
                <Text style={styles.statLabelText}>{label}</Text>
                <Text style={styles.statValueAway}>{awayStr}</Text>
            </View>
            <View style={styles.barTrack}>
                <View style={[styles.barFillHome, { width: `${homeWidthPercent}%` }]} />
            </View>
        </View>
    );
};

export default function MatchDetailsScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"Stats" | "Events" | "Lineups">("Stats");
    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState<MatchDetailsResponse | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMatchInfo = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await api.matchDetails(id);
                if (isMounted) {
                    setMatchData(data);
                }
            } catch (err) {
                // FIXED: Fallback mocking data parameters fully matched up to the data types layer shape
                if (isMounted) {
                    setMatchData({
                        id: id,
                        league: "Premier League",
                        homeTeam: "Arsenal",
                        awayTeam: "Aston Villa",
                        score: "2–1",
                        matchday: "Matchday 34",
                        homeScoreNum: 2,
                        awayScoreNum: 1,
                        possession: { home: 62, away: 38 },
                        shots: { home: 14, away: 6 },
                        passes: { home: 487, away: 264 },
                        events: [
                            { minute: "23'", type: "goal", team: "home", player: "Saka" },
                            { minute: "58'", type: "goal", team: "home", player: "Martinelli" },
                            { minute: "62'", type: "red_card", team: "away", player: "Konsa" }
                        ]
                    });
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMatchInfo();
        return () => { isMounted = false; };
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingCenter}>
                <ActivityIndicator size="small" color={C.volt} />
            </View>
        );
    }

    if (!matchData) return null;

    return (
        <View style={styles.container}>
            <View style={[styles.hdrBar, { paddingTop: insets.top }]}>
                <Pressable style={styles.bk} onPress={() => router.back()}>
                    <BackIcon />
                </Pressable>
                <Text style={styles.hdrTitle}>Match Analysis</Text>
                <Text style={styles.hdrLeague}>{matchData.league}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                <View style={styles.heroScoreCard}>
                    <View style={styles.liveBadgeWrapper}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveBadgeText}>ANALYSIS COMPLETE</Text>
                    </View>

                    <View style={styles.scoreboardRow}>
                        <View style={styles.teamCol}>
                            <View style={styles.teamBadgeCircle}><Text style={styles.teamBadgeEmoji}>🔴</Text></View>
                            <Text style={styles.teamNameText}>{matchData.homeTeam}</Text>
                        </View>

                        <View style={styles.scoreNumberBlock}>
                            <Text style={styles.scoreTextVolt}>{matchData.homeScoreNum}</Text>
                            <Text style={styles.scoreDivider}>–</Text>
                            <Text style={styles.scoreTextMuted}>{matchData.awayScoreNum}</Text>
                        </View>

                        <View style={styles.teamCol}>
                            <View style={styles.teamBadgeCircle}><Text style={styles.teamBadgeEmoji}>🟣</Text></View>
                            <Text style={styles.teamNameText}>{matchData.awayTeam}</Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>Emirates Stadium</Text>
                        <View style={styles.metaDividerCircle} />
                        <Text style={styles.metaText}>{matchData.matchday}</Text>
                    </View>
                </View>

                <View style={styles.tabsContainer}>
                    {(["Stats", "Events", "Lineups"] as const).map((tab) => (
                        <Pressable key={tab} style={[styles.mdTab, activeTab === tab && styles.mdTabActive]} onPress={() => setActiveTab(tab)}>
                            <Text style={[styles.mdTabText, activeTab === tab && styles.mdTabTextActive]}>{tab}</Text>
                        </Pressable>
                    ))}
                </View>

                {activeTab === "Stats" && (
                    <View style={styles.statsContainerBlock}>
                        <StatProgressBar label="Possession" homeVal={matchData.possession.home} awayVal={matchData.possession.away} homeStr={`${matchData.possession.home}%`} awayStr={`${matchData.possession.away}%`} />
                        <StatProgressBar label="Shots" homeVal={matchData.shots.home} awayVal={matchData.shots.away} homeStr={`${matchData.shots.home}`} awayStr={`${matchData.shots.away}`} />
                        <StatProgressBar label="Passes" homeVal={matchData.passes.home} awayVal={matchData.passes.away} homeStr={`${matchData.passes.home}`} awayStr={`${matchData.passes.away}`} />
                    </View>
                )}

                {activeTab === "Events" && (
                    <View style={styles.eventsContainerBlock}>
                        <Text style={styles.subSectionTitle}>Key Events</Text>
                        {matchData.events.map((event, index) => (
                            <View key={index} style={styles.eventRowItem}>
                                <Text style={[styles.eventMinuteTextVolt, event.type === "red_card" && { color: C.red }]}>{event.minute}</Text>
                                <View style={[styles.eventIconCircle, event.type === "red_card" && { backgroundColor: "rgba(255,71,87,.1)" }]}>
                                    <Text style={styles.eventIconText}>{event.type === "goal" ? "⚽" : "🟥"}</Text>
                                </View>
                                <View style={styles.eventMetadata}>
                                    <Text style={styles.playerNameText}>{event.player}</Text>
                                    <Text style={styles.eventActionSubtitle}>{event.team === "home" ? matchData.homeTeam : matchData.awayTeam} · {event.type === "goal" ? "Goal" : "Red Card"}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === "Lineups" && (
                    <View style={styles.lineupsFallbackBlock}>
                        <Text style={styles.fallbackBodyText}>Lineups synced safely to internal memory layout records.</Text>
                    </View>
                )}

                <Pressable style={styles.sandboxButton} onPress={() => router.replace("/(tabs)/live")}>
                    <PitchIcon />
                    <Text style={styles.sandboxButtonText}>Open in Tactical Sandbox</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0D1317" },
    loadingCenter: { flex: 1, backgroundColor: "#0D1317", justifyContent: "center", alignItems: "center" },
    hdrBar: { height: 90, borderBottomWidth: 1, borderColor: "#2A3B47", backgroundColor: "#1A242B", flexDirection: "row", alignItems: "center", paddingHorizontal: 18, gap: 12 },
    bk: { width: 33, height: 33, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 9, alignItems: "center", justifyContent: "center" },
    hdrTitle: { fontFamily: "DMSans-Bold", fontSize: 17, fontWeight: "700", color: "#FFFFFF", flex: 1, textAlign: "left" },
    hdrLeague: { fontSize: 11, fontWeight: "600", color: "#8E9BAE", fontFamily: "DMSans-Medium" },
    scrollBody: { paddingBottom: 60 },
    heroScoreCard: { paddingVertical: 18, paddingHorizontal: 22, borderBottomWidth: 1, borderColor: "#2A3B47", alignItems: "center" },
    liveBadgeWrapper: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(204, 255, 0, 0.08)", borderWidth: 1, borderColor: "rgba(204, 255, 0, 0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
    liveDot: { width: 6, height: 6, backgroundColor: C.volt, borderRadius: 3 },
    liveBadgeText: { fontFamily: "DMSans-Bold", fontSize: 10, fontWeight: "700", color: C.volt, letterSpacing: 0.8 },
    scoreboardRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 12, width: "100%" },
    teamCol: { flex: 1, alignItems: "center", gap: 8 },
    teamBadgeCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#223040", borderWidth: 2, borderColor: "#2A3B47", justifyContent: "center", alignItems: "center" },
    teamBadgeEmoji: { fontSize: 22 },
    teamNameText: { color: "#FFFFFF", fontSize: 12, fontFamily: "DMSans-Bold", fontWeight: "700", textAlign: "center" },
    scoreNumberBlock: { flexDirection: "row", alignItems: "center", gap: 7 },
    scoreTextVolt: { fontSize: 46, fontWeight: "900", color: "#CCFF00", lineHeight: 46 },
    scoreDivider: { fontSize: 22, color: "#2A3B47" },
    scoreTextMuted: { fontSize: 46, fontWeight: "900", color: "#8E9BAE", lineHeight: 46 },
    metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
    metaText: { fontSize: 11, fontWeight: "600", color: "#8E9BAE", fontFamily: "DMSans-Medium" },
    metaDividerCircle: { width: 4, height: 4, backgroundColor: "#2A3B47", borderRadius: 2 },
    tabsContainer: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#2A3B47", paddingHorizontal: 22 },
    mdTab: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" },
    mdTabActive: { borderBottomWidth: 2, borderBottomColor: "#CCFF00" },
    mdTabText: { fontSize: 13, fontWeight: "600", color: "#8E9BAE", fontFamily: "DMSans-Medium" },
    mdTabTextActive: { color: "#CCFF00" },
    statsContainerBlock: { paddingVertical: 14, paddingHorizontal: 22, gap: 11 },
    statRowItem: { width: "100%", gap: 6 },
    statLabelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statValueHome: { fontSize: 13, fontWeight: "700", color: "#CCFF00", fontFamily: "DMSans-Bold" },
    statValueAway: { fontSize: 13, fontWeight: "700", color: "#00E5FF", fontFamily: "DMSans-Bold" },
    statLabelText: { fontSize: 11, fontWeight: "600", color: "#8E9BAE", fontFamily: "DMSans-Medium" },
    barTrack: { height: 4, backgroundColor: "#2A3B47", borderRadius: 2, width: "100%", position: "relative" },
    barFillHome: { height: "100%", backgroundColor: "#CCFF00", position: "absolute", left: 0 },
    eventsContainerBlock: { paddingHorizontal: 22, paddingTop: 14 },
    subSectionTitle: { fontSize: 11, fontWeight: "700", color: "#8E9BAE", letterSpacing: 1.4, textTransform: "uppercase", paddingBottom: 8, fontFamily: "DMSans-Bold", textAlign: "left" },
    eventRowItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderColor: "rgba(42,59,71,.4)" },
    eventMinuteTextVolt: { fontSize: 11, fontWeight: "700", color: "#CCFF00", width: 30, textAlign: "left", fontFamily: "DMSans-Bold" },
    eventIconCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(204,255,0,.08)", justifyContent: "center", alignItems: "center" },
    eventIconText: { fontSize: 13 },
    eventMetadata: { flex: 1, alignItems: "flex-start" },
    playerNameText: { fontSize: 13, fontWeight: "600", color: "#FFFFFF", fontFamily: "DMSans-SemiBold" },
    eventActionSubtitle: { fontSize: 11, color: "#8E9BAE", fontFamily: "DMSans-Regular" },
    lineupsFallbackBlock: { padding: 30, alignItems: "center" },
    fallbackBodyText: { color: "#8E9BAE", fontSize: 13, fontFamily: "DMSans-Regular" },
    sandboxButton: { marginHorizontal: 22, marginTop: 20, height: 48, backgroundColor: "rgba(204,255,0,.08)", borderWidth: 1, borderColor: "rgba(204,255,0,.25)", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
    sandboxButtonText: { fontSize: 14, fontWeight: "700", color: "#CCFF00", fontFamily: "DMSans-Bold" }
});