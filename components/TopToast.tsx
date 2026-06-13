import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C, TOAST_SHADOW } from "@/constants/theme";

interface TopToastProps {
    visible: boolean;
    message: string;
    type?: "success" | "info" | "error";
    onClose: () => void;
}

export const TopToast = ({ visible, message, type = "info", onClose }: TopToastProps) => {
    const slideAnim = useRef(new Animated.Value(-120)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 54, // Clear system status bar headers safely
                useNativeDriver: true,
                tension: 40,
                friction: 7,
            }).start();

            // Automatically auto-dismiss after 4.5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 4500);
            return () => clearTimeout(timer);
        } else {
            Animated.timing(slideAnim, {
                toValue: -120,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    const getAccentColor = () => {
        if (type === "success") return C.grn;
        if (type === "error") return C.red;
        return C.cyan;
    };

    return (
        <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={[styles.innerContent, { borderColor: getAccentColor() }]}>
                <View style={styles.messageRow}>
                    <View style={[styles.statusIconWrapper, { backgroundColor: `${getAccentColor()}1A`, borderColor: `${getAccentColor()}4D` }]}>
                        <Ionicons
                            name={type === "success" ? "checkmark" : type === "error" ? "alert" : "paper-plane-outline"}
                            size={14}
                            color={getAccentColor()}
                        />
                    </View>
                    <View style={styles.textBlock}>
                        <Text style={[styles.titleText, { color: getAccentColor() }]}>
                            {type === "success" ? "Notifications Enabled" : type === "error" ? "System Error" : "New Code Sent"}
                        </Text>
                        <Text style={styles.toastText} numberOfLines={2}>{message}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                    <Ionicons name="close" size={16} color={C.mt} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        top: 0,
        left: 18,
        right: 18,
        zIndex: 9999,
    },
    innerContent: {
        backgroundColor: C.sur,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...TOAST_SHADOW,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 11,
    },
    statusIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    textBlock: {
        flex: 1,
        alignItems: "flex-start",
    },
    titleText: {
        fontFamily: "DMSans-Bold",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 2,
    },
    toastText: {
        color: C.mt,
        fontFamily: "DMSans-Regular",
        fontSize: 12,
        lineHeight: 14,
    },
    closeBtn: {
        padding: 4,
        marginLeft: 8,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 6,
    },
});