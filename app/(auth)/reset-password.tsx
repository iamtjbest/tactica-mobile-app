import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Pressable, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { EyeIcon, EyeOffIcon, PasswordIcon } from "@/components/Icons";
import { TopToast } from "@/components/TopToast";

// Core Backend Security Infrastructure
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const ResetPassword = () => {
	const params = useLocalSearchParams();
	const email = (params.email as string) || "";

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
	const [loading, setLoading] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<"success" | "info" | "error">("info");

	// Live Dynamic Requirement Listeners
	const isAtLeast8Chars = password.length >= 8;
	const hasUppercase = /[A-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

	const handleUpdatePassword = async () => {
		if (!password || !confirmPassword) {
			setToastMessage("Please fill in all fields.");
			setToastType("error");
			setToastVisible(true);
			return;
		}

		if (password !== confirmPassword) {
			setToastMessage("Passwords do not match.");
			setToastType("error");
			setToastVisible(true);
			return;
		}

		if (!isAtLeast8Chars || !hasUppercase || !hasNumber || !hasSpecialChar) {
			setToastMessage("Please satisfy all password complexity rules.");
			setToastType("error");
			setToastVisible(true);
			return;
		}

		setLoading(true);
		try {
			const targetEmail = email.toLowerCase().trim();

			if (!targetEmail || targetEmail === "your@email.com") {
				throw new Error("Missing verification email identity handle context.");
			}

			// Secure database write pattern bypassing any client session locks
			await setDoc(doc(db, "password_resets", targetEmail), {
				newPassword: password.trim(),
				requestedAt: serverTimestamp(),
				status: "pending"
			});

			setToastMessage("Password reset request submitted successfully.");
			setToastType("success");
			setToastVisible(true);

			setTimeout(() => {
				router.replace("/(auth)/sign-in");
			}, 2000);
		} catch (error: any) {
			console.log("🔴 Reset Password Transaction Error:", error);
			setToastMessage(error.message || "Password update failed.");
			setToastType("error");
			setToastVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<View style={[styles.resetPassword, styles.container3Layout]}>
				<View style={styles.container}>

					{/* Custom Left-Aligned Back Navigation Box */}
					<View style={styles.back}>
						<Pressable style={[styles.container2, styles.containerBorder]} onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={20} color="#FFFFFF" />
						</Pressable>
					</View>

					{/* Heading Structure Block Layout */}
					<View style={styles.heading}>
						<View style={styles.icon}>
							<View style={[styles.container2Main, styles.viewFlexBox]}>
								<View style={styles.component2}>
									<Ionicons name="lock-open-outline" size={32} color="#ccff00" />
								</View>
							</View>
						</View>
						<View style={styles.title}>
							<View style={[styles.container3, styles.container3Layout]}>
								<Text style={[styles.newPassword, styles.newPasswordFlexBox]}>New Password</Text>
							</View>
						</View>
						<View style={styles.subText}>
							<View style={styles.container4}>
								<Text style={[styles.createAStrong, styles.newPasswordFlexBox]}>Create a strong password for your Tactica account.</Text>
							</View>
						</View>
					</View>

					<View style={styles.fields}>
						{/* Input 1: Password Input Wrapper Field */}
						<View style={[styles.passwordLayout, passwordFocused ? { borderColor: "#ccff00" } : { borderColor: "#2a3b47" }]}>
							<View style={styles.component22}>
								<PasswordIcon size={15} color="#8E9BAE" />
							</View>
							<View style={styles.text}>
								<View style={styles.subText}>
									<Text style={[styles.passwordTypo, { color: passwordFocused ? "#ccff00" : "#8e9bae" }]}>New Password</Text>
								</View>
								<View style={styles.subText}>
									<TextInput
										style={styles.textInputStyle}
										value={password}
										onChangeText={setPassword}
										placeholder="••••••••••••"
										placeholderTextColor="rgba(142, 155, 174, 0.4)"
										secureTextEntry={!showPassword}
										autoCapitalize="none"
										onFocus={() => setPasswordFocused(true)}
										onBlur={() => setPasswordFocused(false)}
									/>
								</View>
							</View>
							<TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
								{showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
							</TouchableOpacity>
						</View>

						{/* Input 2: Confirm Password Input Wrapper Field */}
						<View style={[styles.passwordLayout, confirmPasswordFocused ? { borderColor: "#ccff00" } : { borderColor: "#2a3b47" }]}>
							<View style={styles.component22}>
								<PasswordIcon size={15} color="#8E9BAE" />
							</View>
							<View style={styles.text}>
								<View style={styles.subText}>
									<Text style={[styles.passwordTypo, { color: confirmPasswordFocused ? "#ccff00" : "#8e9bae" }]}>Confirm Password</Text>
								</View>
								<View style={styles.subText}>
									<TextInput
										style={styles.textInputStyle}
										value={confirmPassword}
										onChangeText={setConfirmPassword}
										placeholder="Re-enter password"
										placeholderTextColor="rgba(142, 155, 174, 0.4)"
										secureTextEntry={!showConfirmPassword}
										autoCapitalize="none"
										onFocus={() => setConfirmPasswordFocused(true)}
										onBlur={() => setConfirmPasswordFocused(false)}
									/>
								</View>
							</View>
							<TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 4 }}>
								{showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
							</TouchableOpacity>
						</View>
					</View>

					{/* Dynamic Requirement Rules Grid Array */}
					<View style={styles.rules}>
						<View style={[styles.view, styles.viewFlexBox]}>
							<View style={[styles.divrpLayout, isAtLeast8Chars ? styles.divrpRuledot : styles.divrpRuledotInactive]} />
							<Text style={[styles.atLeast8, styles.atLeast8Typo, isAtLeast8Chars ? { color: "#ccff00" } : { color: "#8e9bae" }]}>At least 8 characters</Text>
						</View>
						<View style={[styles.view, styles.viewFlexBox]}>
							<View style={[styles.divrpLayout, hasUppercase ? styles.divrpRuledot : styles.divrpRuledotInactive]} />
							<Text style={[styles.atLeast8, styles.atLeast8Typo, hasUppercase ? { color: "#ccff00" } : { color: "#8e9bae" }]}>Contains uppercase letter</Text>
						</View>
						<View style={[styles.view, styles.viewFlexBox]}>
							<View style={[styles.divrpLayout, hasNumber ? styles.divrpRuledot : styles.divrpRuledotInactive]} />
							<Text style={[styles.atLeast8, styles.atLeast8Typo, hasNumber ? { color: "#ccff00" } : { color: "#8e9bae" }]}>Contains a number</Text>
						</View>
						<View style={[styles.view, styles.viewFlexBox]}>
							<View style={[styles.divrpLayout, hasSpecialChar ? styles.divrpRuledot : styles.divrpRuledotInactive]} />
							<Text style={[styles.atLeast8, styles.atLeast8Typo, hasSpecialChar ? { color: "#ccff00" } : { color: "#8e9bae" }]}>Contains special character</Text>
						</View>
					</View>

					{/* Full-width Submission Button Module */}
					<View style={styles.button}>
						<TouchableOpacity style={styles.setPassword} onPress={handleUpdatePassword} disabled={loading}>
							<Text style={[styles.setNewPassword, styles.time2Typo]}>
								{loading ? "Processing..." : "Set New Password"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.mesh, styles.meshPosition]}>
					<View style={styles.after} />
				</View>
				<TopToast
					visible={toastVisible}
					message={toastMessage}
					type={toastType}
					onClose={() => setToastVisible(false)}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container3Layout: {
		width: "100%",
		alignItems: "flex-start"
	},
	viewFlexBox: {
		flexDirection: "row",
		alignItems: "center"
	},
	newPasswordFlexBox: {
		textAlign: "left",
		alignSelf: "stretch"
	},
	passwordLayout: {
		paddingVertical: 0,
		backgroundColor: "#1a242b",
		borderRadius: 12,
		height: 54,
		gap: 10,
		flexDirection: "row",
		borderWidth: 1,
		borderStyle: "solid",
		paddingHorizontal: 16,
		alignSelf: "stretch",
		alignItems: "center"
	},
	passwordTypo: {
		textAlign: "left",
		textTransform: "uppercase",
		letterSpacing: 0.8,
		fontSize: 10,
		fontFamily: "DMSans-Bold",
		fontWeight: "700",
		alignSelf: "stretch"
	},
	divrpLayout: {
		borderRadius: 3,
		width: 6,
		height: 6
	},
	divrpRuledot: {
		backgroundColor: "#ccff00"
	},
	divrpRuledotInactive: {
		backgroundColor: "#2a3b47"
	},
	atLeast8: {
		textAlign: "left"
	},
	atLeast8Typo: {
		fontSize: 12,
		textAlign: "left",
		fontFamily: "DMSans-Regular"
	},
	time2Typo: {
		fontSize: 16,
		textAlign: "center",
		color: "#000",
		fontFamily: "DMSans-Bold",
		fontWeight: "700"
	},
	meshPosition: {
		top: 1,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center"
	},
	containerBorder: {
		borderWidth: 1,
		borderStyle: "solid"
	},
	resetPassword: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-start",
		backgroundColor: "#0d1317"
	},
	container: {
		paddingVertical: 64,
		zIndex: 0,
		paddingHorizontal: 16,
		flex: 1,
		alignSelf: "stretch",
		alignItems: "flex-start",
		overflow: "hidden"
	},
	back: {
		flexDirection: "row",
		alignSelf: "stretch",
		alignItems: "center",
		marginBottom: 10
	},
	container2: {
		borderRadius: 10,
		borderColor: "#2a3b47",
		backgroundColor: "#1a242b",
		width: 36,
		height: 36,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	heading: {
		paddingBottom: 28,
		alignSelf: "stretch",
		alignItems: "flex-start"
	},
	icon: {
		paddingTop: 40,
		paddingBottom: 22,
		alignSelf: "stretch",
		alignItems: "flex-start"
	},
	container2Main: {
		width: 80,
		height: 80,
		borderRadius: 22,
		backgroundColor: "rgba(204, 255, 0, 0.08)",
		borderColor: "rgba(204, 255, 0, 0.22)",
		borderWidth: 1,
		borderStyle: "solid",
		justifyContent: "center"
	},
	component2: {
		height: 36,
		width: 36,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		paddingBottom: 8,
		alignSelf: "stretch",
		alignItems: "flex-start"
	},
	container3: {
		maxWidth: "100%",
		alignItems: "flex-start"
	},
	newPassword: {
		fontSize: 28,
		fontFamily: "PlayfairDisplay-Bold",
		color: "#fff",
		fontWeight: "700"
	},
	subText: {
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	container4: {
		paddingBottom: 0,
		alignSelf: "stretch",
		alignItems: "flex-start"
	},
	createAStrong: {
		fontSize: 13,
		color: "#8e9bae",
		fontFamily: "DMSans-Regular",
		lineHeight: 21
	},
	fields: {
		gap: 10,
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	component22: {
		height: 15,
		width: 15,
		overflow: "hidden"
	},
	text: {
		gap: 2,
		alignItems: "flex-start",
		flex: 1
	},
	rules: {
		paddingTop: 20,
		paddingBottom: 5,
		gap: 8,
		alignItems: "flex-start",
		alignSelf: "stretch"
	},
	view: {
		gap: 8,
		alignSelf: "stretch"
	},
	button: {
		paddingTop: 20,
		alignItems: "center",
		alignSelf: "stretch"
	},
	setPassword: {
		height: 56,
		borderRadius: 14,
		backgroundColor: "#ccff00",
		alignSelf: "stretch",
		justifyContent: "center",
		alignItems: "center"
	},
	setNewPassword: {
		letterSpacing: 0.32,
	},
	mesh: {
		width: 389,
		height: 843,
		left: 390,
		padding: 10,
		transform: [{ rotate: "180deg" }],
		zIndex: -1
	},
	after: {
		width: 360,
		height: 360,
		bottom: 406,
		left: 14,
		borderRadius: 180,
		backgroundColor: "transparent",
		position: "absolute",
	},
	textInputStyle: {
		fontFamily: "DMSans-Medium",
		fontSize: 14,
		color: "#ffffff",
		height: 28,
		padding: 0,
		alignSelf: "stretch",
		width: "100%"
	}
});

export default ResetPassword;