import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/theme";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TopToast } from "@/components/TopToast";

const EditProfile = () => {
    const [firstName, setFirstName] = useState("Tj");
    const [lastName, setLastName] = useState("Best");
    const [username, setUsername] = useState("@tjbest");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "info" | "error">("info");

    // Seed data inputs straight from current live session profiles on mount
    useEffect(() => {
        const initializeFields = async () => {
            if (auth.currentUser) {
                const user = auth.currentUser;
                setEmail(user.email || "");

                if (user.displayName) {
                    const parts = user.displayName.trim().split(/\s+/);
                    setFirstName(parts[0] || "");
                    setLastName(parts.slice(1).join(" ") || "");
                }
            }
            const cachedUserTag = await AsyncStorage.getItem("@custom_username");
            if (cachedUserTag) {
                setUsername(cachedUserTag);
            }
        };
        initializeFields();
    }, []);

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setToastMessage("First and Last name cannot be blank.");
            setToastType("error");
            setToastVisible(true);
            return;
        }

        try {
            setSaving(true);
            const combinedFullName = `${firstName.trim()} ${lastName.trim()}`;

            // 1. Sync directly to Firebase Authentication profile state
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: combinedFullName
                });
            }

            // 2. Persist custom username token locally to disk storage nodes
            await AsyncStorage.setItem("@custom_username", username.trim());

            setToastMessage("Profile updated successfully.");
            setToastType("success");
            setToastVisible(true);
            setTimeout(() => router.back(), 2000);
        } catch (error: any) {
            setToastMessage(error.message || "Could not update profile.");
            setToastType("error");
            setToastVisible(true);
        } finally {
            setSaving(false);
        }
    };

    const renderField = (label: string, value: string, onChange: (t: string) => void, fieldId: string, placeholder?: string, editable = true) => {
        const isFocused = focusedField === fieldId;
        return (
            <View style={[styles.epField, isFocused && styles.epFieldFocused, !editable && styles.disabledField]} >
                <Text style={[styles.epFl, isFocused && styles.epFlFocused]}> {label} </Text>
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(142, 155, 174, 0.45)"
                    onFocus={() => setFocusedField(fieldId)}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="none"
                    editable={editable}
                />
            </View>
        );
    };

    return (
        <View style={styles.mainContainer} >
            {/* Top Header Fixed Navigation Row Block */}
            <View style={styles.hdrBar} >
                <Pressable style={styles.bk} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.hdrTitle}> Edit Profile </Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color={C.volt} />
                    ) : (
                        <Text style={styles.saveLink}> Save </Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} >
                {/* Avatar Profile Interaction Unit */}
                <View style={styles.avatarSection} >
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarText}>
                                {((firstName.charAt(0) || "") + (lastName.charAt(0) || "")).toUpperCase() || "TJ"}
                            </Text>
                        </View>
                        <View style={styles.cameraIconBadge} >
                            <Ionicons name="camera-outline" size={12} color="#000000" />
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changePhotoText}> Change Photo </Text>
                    </TouchableOpacity>
                </View>

                {/* Form Group Block */}
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}> Personal Info </Text>
                    <View style={styles.rowFields} >
                        <View style={styles.flexField}>
                            {renderField("First Name", firstName, setFirstName, "first")}
                        </View>
                        <View style={styles.flexField} >
                            {renderField("Last Name", lastName, setLastName, "last")}
                        </View>
                    </View>
                    {renderField("Username", username, setUsername, "user")}
                    {renderField("Bio", bio, setBio, "bio", "Tell us about yourself…")}

                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}> Contact </Text>
                    {renderField("Email Address", email, setEmail, "email", "your@email.com", false)}
                    {renderField("Phone (optional)", phone, setPhone, "phone", "+234 · Your number")}
                </View>
            </ScrollView>
            <TopToast 
                visible={toastVisible} 
                message={toastMessage} 
                type={toastType}
                onClose={() => setToastVisible(false)} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: C.bg },
    hdrBar: { height: 58, marginTop: 44, borderBottomWidth: 1, borderColor: C.bd, backgroundColor: C.sur, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, gap: 12 },
    bk: { width: 33, height: 33, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 9, alignItems: "center", justifyContent: "center" },
    hdrTitle: { fontFamily: "PlayfairDisplay-Bold", fontSize: 18, fontWeight: "700", color: C.tx, flex: 1, textAlign: "left" },
    saveLink: { fontSize: 13, fontWeight: "700", color: C.volt, fontFamily: "DMSans-Bold" },
    scrollBody: { paddingBottom: 40 },
    avatarSection: { alignItems: "center", paddingVertical: 22, borderBottomWidth: 1, borderColor: C.bd },
    avatarWrapper: { position: "relative", marginBottom: 10 },
    avatarFallback: { width: 82, height: 82, borderRadius: 41, backgroundColor: C.sur2, borderWidth: 3, borderColor: C.volt, alignItems: "center", justifyContent: "center" },
    avatarText: { fontFamily: "PlayfairDisplay-Bold", fontSize: 26, fontWeight: "700", color: C.volt },
    cameraIconBadge: { position: "absolute", bottom: 0, right: 0, width: 25, height: 25, borderRadius: 12.5, backgroundColor: C.volt, borderWidth: 2, borderColor: C.bg, alignItems: "center", justifyContent: "center" },
    changePhotoText: { fontSize: 13, fontWeight: "600", color: C.volt, fontFamily: "DMSans-SemiBold" },
    formContainer: { paddingHorizontal: 22, paddingTop: 16 },
    sectionTitle: { fontSize: 11, fontWeight: "700", color: C.mt, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10, fontFamily: "DMSans-Bold", textAlign: "left" },
    rowFields: { flexDirection: "row", gap: 8 },
    flexField: { flex: 1 },
    epField: { width: "100%", height: 52, backgroundColor: C.sur, borderRadius: 11, borderWidth: 1, borderColor: C.bd, paddingHorizontal: 14, justifyContent: "center", marginBottom: 8 },
    epFieldFocused: { borderColor: C.volt },
    disabledField: { opacity: 0.5, backgroundColor: "rgba(0,0,0,0.15)" },
    epFl: { fontSize: 10, fontWeight: "700", color: C.mt, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 2, fontFamily: "DMSans-Bold", textAlign: "left" },
    epFlFocused: { color: C.volt },
    textInput: { fontFamily: "DMSans-Medium", fontSize: 14, color: C.tx, padding: 0, height: 20 },
});

export default EditProfile;