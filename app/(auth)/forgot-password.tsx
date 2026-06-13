import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Core Backend Security Infrastructure
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [emailFocused, setEmailFocused] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSendResetEmail = async () => {
		if (!email.trim()) {
			Alert.alert("Error", "Please enter your email.");
			return;
		}

		setLoading(true);
		try {
			const targetEmail = email.trim().toLowerCase();

			// Fire the native Firebase security link dispatcher directly
			await sendPasswordResetEmail(auth, targetEmail);

			Alert.alert(
				"Link Sent! 🚀",
				"A secure password reset link has been sent to your inbox. Use it to safely update your credentials.",
				[{ text: "OK", onPress: () => router.replace("/(auth)/sign-in") }]
			);

		} catch (error: any) {
			console.log("🔴 Reset Email Request Failed:", error);
			Alert.alert("Reset Failed", error.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={[styles.forgotPassword, styles.container4Layout]}>
			<View style={styles.container}>
				<View style={styles.back}>
					<Pressable style={[styles.container2, styles.containerBorder]} onPress={() => router.back()}>
						<Ionicons name="chevron-back" size={20} color="#FFFFFF" />
					</Pressable>
				</View>
				<View style={styles.icon}>
					<View style={[styles.container3, styles.containerBorder]}>
						<Ionicons name="lock-closed-outline" size={32} color="#00E5FF" />
					</View>
				</View>
				<View style={styles.title}>
					<View style={[styles.container4, styles.container4Layout]}>
						<Text style={styles.resetYourPassword}>Reset Your{"\n"}Password</Text>
					</View>
				</View>
				<View style={styles.subText}>
					<View style={styles.title}>
						<Text style={[styles.enterYourEmail, styles.text5Clr]}>
							Enter your email address and we'll send you a secure{"\n"}reset link.
						</Text>
					</View>
				</View>
				<View style={styles.email}>
					<View style={[styles.field, styles.fieldBorder, emailFocused ? { borderColor: "#ccff00" } : { borderColor: "#2a3b47" }]}>
						<View style={styles.component23}>
							<Ionicons name="mail-outline" size={16} color={emailFocused ? "#ccff00" : "#8E9BAE"} />
						</View>
						<View style={[styles.text, styles.textFlexBox]}>
							<View style={styles.email}>
								<Text style={[styles.emailAddress, styles.signIn3Typo, { color: emailFocused ? "#ccff00" : "#8e9bae" }]}>Email Address</Text>
							</View>
							<TextInput
								style={styles.textInputStyle}
								value={email}
								onChangeText={setEmail}
								placeholder="your@email.com"
								placeholderTextColor="rgba(142, 155, 174, 0.4)"
								keyboardType="email-address"
								autoCapitalize="none"
								onFocus={() => setEmailFocused(true)}
								onBlur={() => setEmailFocused(false)}
							/>
						</View>
					</View>
				</View>
				<View style={styles.info}>
					<View style={[styles.container6, styles.fieldBorder]}>
						<View style={styles.icon2}>
							<Ionicons name="time-outline" size={16} color="#00E5FF" />
						</View>
						<View style={styles.text2}>
							<Text style={styles.a6DigitCode}>
								A secure link will open a validation window to overwrite your credentials safely.
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.buttons}>
					<TouchableOpacity style={styles.sendCode} onPress={handleSendResetEmail} disabled={loading}>
						<View style={[styles.text3, styles.textFlexBox]}>
							<Text style={[styles.sendResetCode, styles.time2Typo]}>
								{loading ? "Sending Link..." : "Send Reset Link"}
							</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.signIn}>
						<Text style={[styles.rememberedIt, styles.text5Clr]}>Remembered it?</Text>
						<Pressable onPress={() => router.push("/(auth)/sign-in")}>
							<Text style={styles.text4Typo}>
								<Text style={styles.text5Clr}>{" "}</Text>
								<Text style={styles.signIn3Typo}>Sign In</Text>
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container4Layout: {
		width: "100%",
		alignItems: "center"
	},
	containerBorder: {
		borderWidth: 1,
		borderStyle: "solid"
	},
	text5Clr: {
		color: "#8e9bae",
		fontFamily: "DMSans-Regular"
	},
	fieldBorder: {
		borderRadius: 12,
		borderWidth: 1,
		borderStyle: "solid",
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 16,
		alignSelf: "stretch"
	},
	textFlexBox: {
		flex: 1,
		alignItems: "flex-start"
	},
	signIn3Typo: {
		color: "#ccff00",
		fontFamily: "DMSans-Bold",
		fontWeight: "700"
	},
	time2Typo: {
		fontSize: 16,
		textAlign: "center"
	},
	forgotPassword: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		backgroundColor: "#0d1317"
	},
	container: {
		paddingVertical: 64,
		zIndex: 0,
		gap: 10,
		paddingHorizontal: 16,
		flex: 1,
		alignSelf: "stretch",
		alignItems: "center",
		overflow: "hidden"
	},
	back: {
		flexDirection: "row",
		alignSelf: "stretch",
		alignItems: "center"
	},
	container2: {
		borderRadius: 10,
		borderColor: "#2a3b47",
		backgroundColor: "#1a242b",
		borderStyle: "solid",
		width: 36,
		height: 36,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	icon: {
		paddingTop: 24,
		paddingBottom: 18,
		alignSelf: "stretch",
		alignItems: "center",
		overflow: "hidden"
	},
	container3: {
		width: 80,
		height: 80,
		borderRadius: 22,
		backgroundColor: "rgba(0, 229, 255, 0.08)",
		borderColor: "rgba(0, 229, 255, 0.22)",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		alignSelf: "stretch",
		alignItems: "center"
	},
	container4: {
		maxWidth: "100%",
		alignItems: "center"
	},
	resetYourPassword: {
		fontSize: 28,
		fontFamily: "PlayfairDisplay-Bold",
		textAlign: "center",
		fontWeight: "700",
		color: "#fff",
		alignSelf: "stretch"
	},
	subText: {
		paddingBottom: 16,
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	enterYourEmail: {
		lineHeight: 21,
		fontSize: 13,
		fontFamily: "DMSans-Regular",
		textAlign: "center",
		alignSelf: "stretch"
	},
	email: {
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	field: {
		backgroundColor: "#1a242b",
		alignItems: "center",
		height: 54,
	},
	component23: {
		height: 15,
		width: 15,
		overflow: "hidden"
	},
	text: {
		gap: 2,
		alignItems: "flex-start"
	},
	emailAddress: {
		fontSize: 10,
		letterSpacing: 0.8,
		textTransform: "uppercase",
		fontFamily: "DMSans-Bold",
		textAlign: "left",
		alignSelf: "stretch"
	},
	info: {
		paddingTop: 8,
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	container6: {
		backgroundColor: "rgba(0, 229, 255, 0.06)",
		borderColor: "rgba(0, 229, 255, 0.2)",
		paddingVertical: 11,
		alignItems: "flex-start"
	},
	icon2: {
		height: 16,
		paddingTop: 2,
		width: 15,
		alignItems: "flex-start"
	},
	text2: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	a6DigitCode: {
		fontSize: 12,
		lineHeight: 19,
		color: "rgba(0, 229, 255, 0.8)",
		textAlign: "left",
		fontFamily: "DMSans-Regular"
	},
	buttons: {
		paddingTop: 10,
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	sendCode: {
		height: 56,
		borderRadius: 14,
		backgroundColor: "#ccff00",
		flexDirection: "row",
		alignSelf: "stretch",
		justifyContent: "center",
		alignItems: "center"
	},
	text3: {
		alignItems: "flex-start",
		maxWidth: "100%"
	},
	sendResetCode: {
		letterSpacing: 0.32,
		color: "#000",
		fontFamily: "DMSans-Bold",
		fontSize: 16,
		fontWeight: "700",
		alignSelf: "stretch"
	},
	signIn: {
		paddingTop: 12,
		alignItems: "flex-start",
		flexDirection: "row",
		alignSelf: "stretch",
		justifyContent: "center"
	},
	rememberedIt: {
		fontSize: 13,
		fontFamily: "DMSans-Regular",
		textAlign: "center"
	},
	text4Typo: {
		fontSize: 13,
		fontFamily: "DMSans-Bold",
		textAlign: "center"
	},
	textInputStyle: {
		fontFamily: "DMSans-Medium",
		fontSize: 14,
		color: "#ffffff",
		height: 32,
		padding: 0,
		alignSelf: "stretch",
		marginTop: 4,
	}
});

export default ForgotPassword;