// app/privacy-policy.tsx — Terms of Service & Privacy Policy Layout (Screen 10)
import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Polyline } from "react-native-svg";
import { C, CARD_SHADOW, FONT } from "@/constants/theme";

// SVG Inline Navigation Icons
const BackChevronIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="15 18 9 12 15 6" />
    </Svg>
);

const CheckmarkIcon = () => (
    <Svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="#000000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="2,7 6,11 12,3" />
    </Svg>
);

interface BulletRowProps {
    text: string;
}

const BulletClauseRow = ({ text }: BulletRowProps) => (
    <View style={styles.bulletRowItem}>
        <View style={styles.bulletDotPoint} />
        <Text style={styles.bulletRowText}>{text}</Text>
    </View>
);

export default function LegalTermsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<"Terms" | "Privacy">("Terms");
    const [isAgreed, setIsAgreed] = useState(false);

    const handleAcceptanceProceed = () => {
        if (!isAgreed) {
            Alert.alert("Agreement Required", "Please review and accept the Terms of Service and Privacy Policy to initialize the engine.");
            return;
        }
        Alert.alert("Success", "Legal frameworks confirmed safely.");
        router.back();
    };

    return (
        <View style={styles.mainContainer}>
            {/* FIXED HEADER SEGMENT BLOCK */}
            <View style={[styles.hdrBar, { paddingTop: insets.top }]}>
                <Pressable style={styles.bk} onPress={() => router.back()}>
                    <BackChevronIcon />
                </Pressable>
                <Text style={styles.hdrTitle}>Legal</Text>
                <Text style={styles.updatedBadgeText}>Updated May 2026</Text>
            </View>

            {/* INTERACTIVE NAVIGATION TABS SWITCHER ROW */}
            <View style={styles.tabsTabBarTrack}>
                <Pressable style={[styles.t10t, activeTab === "Terms" && styles.t10tActive]} onPress={() => setActiveTab("Terms")}>
                    <Text style={[styles.tabSelectionText, activeTab === "Terms" && { color: C.volt }]}>Terms of Service</Text>
                </Pressable>
                <Pressable style={[styles.t10t, activeTab === "Privacy" && styles.t10tActive]} onPress={() => setActiveTab("Privacy")}>
                    <Text style={[styles.tabSelectionText, activeTab === "Privacy" && { color: C.volt }]}>Privacy Policy</Text>
                </Pressable>
            </View>

            {/* DYNAMIC SCROLLABLE BODY TEXT CLUSTER */}
            <ScrollView contentContainerStyle={styles.scrollContentBody} showsVerticalScrollIndicator={false}>

                {/* BRAND LOGO CONTEXT EMBED BOX */}
                <View style={styles.t10lg}>
                    <View style={styles.diamondWrapper}>
                        <View style={styles.t10ld} />
                    </View>
                    <View style={styles.brandMetadataTexts}>
                        <Text style={styles.t10ln}>Tactica</Text>
                        <Text style={styles.t10ls}>by Linea Football</Text>
                    </View>
                </View>

                {activeTab === "Terms" ? (
                    <View style={styles.clauseWrapperContent}>
                        {/* Clause Block 1 */}
                        <View style={styles.t10s}>
                            <View style={styles.clauseHeaderTitleRow}>
                                <View style={styles.t10sn}><Text style={styles.badgeNumberText}>1</Text></View>
                                <Text style={styles.clauseTitleLabel}>Acceptance of Terms</Text>
                            </View>
                            <Text style={styles.t10bd2}>
                                By using <Text style={styles.boldWhiteText}>Tactica</Text>, you agree to be bound by these Terms. If you disagree, do not use the app.
                            </Text>
                            <View style={styles.t10hl}>
                                <Text style={styles.calloutText}>
                                    These terms apply to all users including free and future premium subscribers.
                                </Text>
                            </View>
                        </View>

                        {/* Clause Block 2 */}
                        <View style={styles.t10s}>
                            <View style={styles.clauseHeaderTitleRow}>
                                <View style={styles.t10sn}><Text style={styles.badgeNumberText}>2</Text></View>
                                <Text style={styles.clauseTitleLabel}>Use of the Service</Text>
                            </View>
                            <Text style={[styles.t10bd2, { marginBottom: 10 }]}>You agree not to:</Text>
                            <BulletClauseRow text="Reverse-engineer or copy the Tactical AI engine" />
                            <BulletClauseRow text="Resell or redistribute match data" />
                            <BulletClauseRow text="Use automated scripts to scrape data" />
                        </View>

                        {/* Clause Block 3 */}
                        <View style={styles.t10s}>
                            <View style={styles.clauseHeaderTitleRow}>
                                <View style={styles.t10sn}><Text style={styles.badgeNumberText}>3</Text></View>
                                <Text style={styles.clauseTitleLabel}>Data &amp; Statistics</Text>
                            </View>
                            <Text style={styles.t10bd2}>
                                Match data is from third-party providers. <Text style={styles.boldWhiteText}>Tactica makes no guarantee of real-time accuracy.</Text> Player availability not included in v1.0.
                            </Text>
                        </View>

                        {/* Clause Block 4 */}
                        <View style={styles.t10s}>
                            <View style={styles.clauseHeaderTitleRow}>
                                <View style={styles.t10sn}><Text style={styles.badgeNumberText}>4</Text></View>
                                <Text style={styles.clauseTitleLabel}>Intellectual Property</Text>
                            </View>
                            <Text style={styles.t10bd2}>
                                The Tactica name, logo, and <Text style={styles.boldWhiteText}>Linea Football</Text> brand are proprietary. All rights reserved.
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.clauseWrapperContent}>
                        {/* Privacy Policy Context Block Layout Fallback */}
                        <View style={styles.t10s}>
                            <View style={styles.clauseHeaderTitleRow}>
                                <View style={styles.t10sn}><Text style={styles.badgeNumberText}>1</Text></View>
                                <Text style={styles.clauseTitleLabel}>Data Protection Framework</Text>
                            </View>
                            <Text style={styles.t10bd2}>
                                We prioritize data privacy structures. Sensitive parameters are encrypted locally and routed safely via secure Firebase parameters.
                            </Text>
                        </View>
                        <View style={styles.t10s}>
                            <View style={styles.clauseHeaderTitleRow}>
                                <View style={styles.t10sn}><Text style={styles.badgeNumberText}>2</Text></View>
                                <Text style={styles.clauseTitleLabel}>Telemetry Logs</Text>
                            </View>
                            <Text style={styles.t10bd2}>
                                Anonymized data is cached via device storage engines to track system load parameters and refine formation prediction reliability matrices.
                            </Text>
                        </View>
                    </View>
                )}

                <Text style={styles.t10lup}>Last updated: 28 May 2026 · Linea Football</Text>
            </ScrollView>

            {/* STICKY INTERACTIVE BOTTOM ACCEPTANCE UNIT CARD */}
            <View style={[styles.t10bot, { paddingBottom: Math.max(24, insets.bottom + 12) }]}>
                <Pressable style={styles.t10ag} onPress={() => setIsAgreed(!isAgreed)}>
                    <View style={[styles.t10cb, { backgroundColor: isAgreed ? C.volt : "transparent", borderColor: isAgreed ? C.volt : C.bd }]}>
                        {isAgreed && <CheckmarkIcon />}
                    </View>
                    <Text style={styles.t10at}>
                        I have read and agree to the <Text style={styles.boldVoltText}>Terms of Service</Text> and <Text style={styles.boldVoltText}>Privacy Policy</Text>
                    </Text>
                </Pressable>

                {/* FIXED: Ternary condition block evaluation handles dynamic visual styles cleanly without crash errors */}
                <TouchableOpacity
                    style={[styles.bvButton, !isAgreed ? styles.bvButtonDisabled : null]}
                    onPress={handleAcceptanceProceed}
                    activeOpacity={0.85}
                    disabled={!isAgreed}
                >
                    <Text style={styles.bvButtonLabel}>I Agree &amp; Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: C.bg
    },
    hdrBar: {
        height: 88,
        backgroundColor: C.sur,
        borderBottomWidth: 1,
        borderColor: C.bd,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        gap: 12
    },
    bk: {
        width: 33,
        height: 33,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center"
    },
    hdrTitle: {
        fontFamily: FONT.headingBold,
        fontSize: 18,
        fontWeight: "700",
        color: C.tx,
        flex: 1,
        textAlign: "left"
    },
    updatedBadgeText: {
        fontSize: 10,
        color: C.mt,
        fontFamily: FONT.medium
    },
    tabsTabBarTrack: {
        height: 44,
        backgroundColor: C.sur,
        borderBottomWidth: 1,
        borderColor: C.bd,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18
    },
    t10t: {
        flex: 1,
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    t10tActive: {
        borderBottomWidth: 2,
        borderBottomColor: C.volt
    },
    tabSelectionText: {
        fontSize: 13,
        fontWeight: "600",
        color: C.mt,
        fontFamily: FONT.medium
    },
    scrollContentBody: {
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: 180
    },
    t10lg: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        padding: 12,
        backgroundColor: "rgba(204,255,0,0.04)",
        borderWidth: 1,
        borderColor: "rgba(204,255,0,0.12)",
        borderRadius: 14
    },
    diamondWrapper: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    t10ld: {
        width: 18,
        height: 18,
        backgroundColor: C.volt,
        transform: [{ rotate: "45deg" }, { scale: 1.1 }]
    },
    brandMetadataTexts: {
        alignItems: "flex-start"
    },
    t10ln: {
        fontFamily: FONT.headingBold,
        fontSize: 15,
        fontWeight: "700",
        color: C.tx
    },
    t10ls: {
        fontSize: 10,
        color: C.mt,
        fontFamily: FONT.regular,
        marginTop: 1
    },
    clauseWrapperContent: {
        alignSelf: "stretch"
    },
    t10s: {
        marginBottom: 20,
        alignItems: "flex-start"
    },
    clauseHeaderTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8
    },
    t10sn: {
        width: 20,
        height: 20,
        backgroundColor: "rgba(204,255,0,0.12)",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    badgeNumberText: {
        fontSize: 11,
        fontWeight: "700",
        color: C.volt,
        fontFamily: FONT.bold
    },
    clauseTitleLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: C.volt,
        fontFamily: FONT.bold
    },
    t10bd2: {
        fontSize: 12,
        color: C.mt,
        fontFamily: FONT.regular,
        lineHeight: 20,
        textAlign: "left"
    },
    boldWhiteText: {
        color: C.tx,
        fontWeight: "700"
    },
    t10hl: {
        backgroundColor: "rgba(0,229,255,0.05)",
        borderLeftWidth: 2,
        borderLeftColor: C.cyan,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 10,
        width: "100%",
        alignItems: "flex-start"
    },
    calloutText: {
        fontSize: 11,
        color: "rgba(0,229,255,0.85)",
        fontFamily: FONT.regular,
        lineHeight: 16,
        textAlign: "left"
    },
    bulletRowItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 6,
        width: "100%",
        paddingLeft: 4
    },
    bulletDotPoint: {
        width: 5,
        height: 5,
        backgroundColor: C.volt,
        borderRadius: 2.5,
        marginTop: 7
    },
    bulletRowText: {
        fontSize: 12,
        color: C.mt,
        fontFamily: FONT.regular,
        lineHeight: 18,
        flex: 1,
        textAlign: "left"
    },
    t10lup: {
        fontSize: 11,
        color: "rgba(142, 155, 174, 0.35)",
        textAlign: "center",
        paddingVertical: 14,
        fontFamily: FONT.regular
    },
    t10bot: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 22,
        paddingTop: 16,
        backgroundColor: C.bg,
        borderTopWidth: 1,
        borderColor: "rgba(42, 59, 71, 0.3)"
    },
    t10ag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
        width: "100%"
    },
    t10cb: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center"
    },
    t10at: {
        fontSize: 12,
        color: C.mt,
        fontFamily: FONT.regular,
        lineHeight: 18,
        flex: 1,
        textAlign: "left"
    },
    boldVoltText: {
        color: C.volt,
        fontWeight: "700",
        fontFamily: FONT.bold
    },
    bvButton: {
        width: "100%",
        height: 56,
        backgroundColor: C.volt,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        ...CARD_SHADOW
    },
    bvButtonDisabled: {
        backgroundColor: C.sur,
        borderColor: C.bd,
        borderWidth: 1,
        opacity: 0.4,
        shadowOpacity: 0,
        elevation: 0
    },
    bvButtonLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000000",
        fontFamily: FONT.bold,
        letterSpacing: 0.2
    }
});