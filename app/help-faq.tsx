import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/theme";

const FAQItem = ({ question, answer, tip }: { question: string; answer: string; tip?: string }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <Pressable style={[styles.faqItem, expanded && styles.faqItemOpen]} onPress={() => setExpanded(!expanded)}>
            <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, expanded && { color: C.volt }]}>{question}</Text>
                <Ionicons name="chevron-down" size={14} color={C.mt} style={expanded && { transform: [{ rotate: "180deg" }] }} />
            </View>
            {expanded && (
                <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{answer}</Text>
                    {tip && (
                        <View style={styles.faqTip}>
                            <Text style={styles.faqTipText}>{tip}</Text>
                        </View>
                    )}
                </View>
            )}
        </Pressable>
    );
};

const HelpFAQ = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.hdrBar}>
                <Pressable style={styles.bk} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.hdrTitle}>Help & FAQ</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                {/* Dynamic Hero Search Layout Context */}
                <View style={styles.heroSearchSection}>
                    <Text style={styles.heroTitle}>How can we{"\n"}help you?</Text>
                    <Text style={styles.heroSubtitle}>Find answers below.</Text>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={14} color={C.mt} />
                        <TextInput style={styles.searchInput} placeholder="Search questions…" placeholderTextColor="rgba(142, 155, 174, 0.5)" editable={false} />
                    </View>
                </View>

                <Text style={styles.sectionHeader}>Account & Login</Text>
                <FAQItem
                    question="How do I verify my email address?"
                    answer="After signing up, a 6-digit OTP is sent to your email. Enter it on the verification screen within 10 minutes. Check spam if needed."
                    tip="💡 Gmail users: Check your 'Promotions' tab."
                />
                <FAQItem
                    question="I forgot my password. How do I reset it?"
                    answer="Tap Forgot Password on the sign-in screen, enter your email, then check your inbox for the native secure password reset connection link context."
                />

                <Text style={styles.sectionHeader}>Tactics & AI Engine</Text>
                <FAQItem
                    question="How does the formation suggester work?"
                    answer="The engine reads each team's last 5 completed matches, extracts real lineup data, identifies the most-used formation, and selects the best 11 players by rating."
                    tip="💡 Players are slotted by their pitch position from lineup data — not just their listed role."
                />

                {/* Help Request Sticky Bottom Module Row */}
                <View style={styles.contactCard}>
                    <View style={styles.contactIcon}>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color={C.volt} />
                    </View>
                    <View style={styles.contactTextContainer}>
                        <Text style={styles.contactTitle}>Still need help?</Text>
                        <Text style={styles.contactSubtitle}>Chat with our support team</Text>
                    </View>
                    <View style={styles.contactArrow}>
                        <Ionicons name="arrow-forward" size={12} color="#000000" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: C.bg },
    hdrBar: { height: 58, marginTop: 44, borderBottomWidth: 1, borderColor: C.bd, backgroundColor: C.sur, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, gap: 12 },
    bk: { width: 33, height: 33, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 9, alignItems: "center", justifyContent: "center" },
    hdrTitle: { fontFamily: "PlayfairDisplay-Bold", fontSize: 18, fontWeight: "700", color: C.tx, flex: 1, textAlign: "left" },
    scrollBody: { paddingBottom: 40 },
    heroSearchSection: { paddingHorizontal: 22, paddingVertical: 20, backgroundColor: "linear-gradient(180deg, rgba(204,255,0,0.06) 0%, transparent 100%)", borderBottomWidth: 1, borderColor: C.bd, alignItems: "flex-start" },
    heroTitle: { fontFamily: "PlayfairDisplay-Bold", fontSize: 22, fontWeight: "700", color: C.tx, textAlign: "left", lineHeight: 26, marginBottom: 5 },
    heroSubtitle: { fontSize: 13, color: C.mt, fontFamily: "DMSans-Regular", marginBottom: 13 },
    searchBar: { width: "100%", height: 44, backgroundColor: C.sur, borderRadius: 11, borderWidth: 1, borderColor: C.bd, flexDirection: "row", alignItems: "center", paddingHorizontal: 13, gap: 8 },
    searchInput: { flex: 1, fontFamily: "DMSans-Regular", fontSize: 13, color: C.tx },
    sectionHeader: { fontSize: 11, fontWeight: "700", color: C.mt, letterSpacing: 1.4, textTransform: "uppercase", paddingHorizontal: 22, paddingTop: 16, paddingBottom: 10, fontFamily: "DMSans-Bold", textAlign: "left" },
    faqItem: { marginHorizontal: 22, marginBottom: 7, backgroundColor: C.sur, borderRadius: 13, borderWidth: 1, borderColor: C.bd, overflow: "hidden" },
    faqItemOpen: { borderColor: "rgba(204,255,0,0.25)" },
    faqHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 14, gap: 11 },
    faqQuestion: { fontSize: 14, fontWeight: "600", color: C.tx, fontFamily: "DMSans-SemiBold", flex: 1, textAlign: "left", lineHeight: 18 },
    faqAnswerContainer: { paddingHorizontal: 15, paddingBottom: 14, paddingTop: 12, borderTopWidth: 1, borderColor: C.bd, alignItems: "flex-start" },
    faqAnswer: { fontSize: 13, color: C.mt, fontFamily: "DMSans-Regular", lineHeight: 20, textAlign: "left" },
    faqTip: { backgroundColor: "rgba(204,255,0,0.06)", borderLeftWidth: 2, borderLeftColor: C.volt, borderRadius: 7, paddingHorizontal: 11, paddingVertical: 7, marginTop: 8, width: "100%", alignItems: "flex-start" },
    faqTipText: { fontSize: 12, color: "rgba(204,255,0,0.8)", fontFamily: "DMSans-Regular" },
    contactCard: { marginHorizontal: 22, marginTop: 16, backgroundColor: C.sur, borderRadius: 15, borderWidth: 1, borderColor: "rgba(204,255,0,0.18)", padding: 16, flexDirection: "row", alignItems: "center", gap: 13 },
    contactIcon: { width: 42, height: 42, backgroundColor: "rgba(204,255,0,0.12)", borderRadius: 11, alignItems: "center", justifyContent: "center" },
    contactTextContainer: { flex: 1, alignItems: "flex-start" },
    contactTitle: { fontSize: 14, fontWeight: "700", color: C.tx, fontFamily: "DMSans-Bold" },
    contactSubtitle: { fontSize: 12, color: C.mt, fontFamily: "DMSans-Regular" },
    contactArrow: { width: 30, height: 30, backgroundColor: C.volt, borderRadius: 8, alignItems: "center", justifyContent: "center" }
});

export default HelpFAQ;