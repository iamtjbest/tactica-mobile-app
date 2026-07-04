import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, TouchableOpacity, TextInput, Keyboard, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { TopToast } from "@/components/TopToast";

const VerifyEmail = () => {
	const params = useLocalSearchParams();

	const email = (params.email as string) || "";
	const password = (params.password as string) || "";
	const firstName = (params.firstName as string) || "";
	const lastName = (params.lastName as string) || "";

	const emailToShow = email || "your@email.com";
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [inputFocused, setInputFocused] = useState(false);
	const inputRef = useRef<TextInput>(null);
	const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState<"success" | "info" | "error">("info");

	// Force Keyboard Engagement Hook
	useEffect(() => {
		const timer = setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 300);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (secondsLeft <= 0) return;
		const interval = setInterval(() => {
			setSecondsLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [secondsLeft]);

	const formatTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const seconds = secs % 60;
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleVerifyOTP = async () => {
		if (code.length !== 6) {
			setToastMessage("Please enter a 6-digit validation code.");
			setToastType("error");
			setToastVisible(true);
			return;
		}

		setLoading(true);
		try {
			if (!email) {
				throw new Error("Missing email context verification address.");
			}
			const targetEmail = email.toLowerCase().trim();
			const otpDocRef = doc(db, "otps", targetEmail);
			const otpDocSnap = await getDoc(otpDocRef);

			if (!otpDocSnap.exists()) {
				throw new Error("Validation record missing or expired. Please request a new token.");
			}

			const savedData = otpDocSnap.data();

			if (savedData.code !== code) {
				throw new Error("Invalid security token. Please try again.");
			}

			// Purge the used code out of the database collection securely
			await deleteDoc(otpDocRef);

			// Create account profile inside core auth engine
			const userCredential = await createUserWithEmailAndPassword(auth, targetEmail, password);

			// Set user profile context values inside permanent collection paths
			await setDoc(doc(db, "users", userCredential.user.uid), {
				uid: userCredential.user.uid,
				email: targetEmail,
				firstName: firstName,
				lastName: lastName,
				role: "user",
				createdAt: new Date().toISOString()
			});

			setToastMessage("Account verified successfully!");
			setToastType("success");
			setToastVisible(true);
			
			setTimeout(() => {
				router.replace("/(tabs)");
			}, 1500);

		} catch (error: any) {
			setToastMessage(error.message || "Verification failed.");
			setToastType("error");
			setToastVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
		<View style={styles.verifyEmail}>
			<View style={styles.container}>
				<View style={styles.back}>
					<Pressable style={[styles.container2, styles.containerBorder]} onPress={() => router.back()}>
						<View style={styles.component2}>
							<Ionicons name="chevron-back" size={16} color="#FFFFFF" style={{ marginTop: -1 }} />
						</View>
					</Pressable>
				</View>
				<View style={styles.icon}>
					<View style={[styles.container3, styles.containerBorder]}>
						<View style={styles.component22}>
							<Ionicons name="mail-open-outline" size={32} color="#ccff00" />
						</View>
					</View>
				</View>
				<View style={styles.title}>
					<View style={styles.container4}>
						<Text style={styles.checkYourEmail}>Check Your{'\n'}Email</Text>
					</View>
				</View>
				<View style={styles.subText}>
					<Text style={[styles.weSentAContainer, styles.codeContainerTypo]}>
						<Text style={[styles.weSentA, styles.weSentAClr]}>We sent a 6-digit verification code to{"\n"}</Text>
						<Text style={[styles.youremailcom, styles.time2Typo]}>{emailToShow}</Text>
					</Text>
				</View>

				{/* OTP Box Entry Array */}
				<View style={styles.otp}>
					<Pressable style={styles.row} onPress={() => inputRef.current?.focus()}>
						{[0, 1, 2, 3, 4, 5].map((index) => {
							const char = code[index] || "";
							const isCurrent = index === code.length && inputFocused;
							const hasValue = !!char;

							return (
								<View
									key={index}
									style={[
										styles.otpBox,
										isCurrent ? styles.otpBoxActive : (hasValue ? styles.otpBoxFilled : styles.otpBoxInactive)
									]}
								>
									<Text style={[styles.otpText, hasValue && styles.otpTextFilled]}>
										{char}
									</Text>
								</View>
							);
						})}
					</Pressable>

					<TextInput
						ref={inputRef}
						style={styles.hiddenInput}
						value={code}
						onChangeText={(text) => {
							const cleanText = text.replace(/[^0-9]/g, "");
							setCode(cleanText);
							if (cleanText.length === 6) {
								Keyboard.dismiss();
							}
						}}
						keyboardType="number-pad"
						maxLength={6}
						onFocus={() => setInputFocused(true)}
						onBlur={() => setInputFocused(false)}
					/>
				</View>

				<View style={styles.timer}>
					<Text style={[styles.codeExpiresInContainer, styles.codeContainerTypo]}>
						<Text style={styles.weSentAClr}>{`Code expires in `}</Text>
						<Text style={[styles.text4, styles.textClr]}>{formatTime(secondsLeft)}</Text>
					</Text>
				</View>
				<View style={styles.buttons}>
					<TouchableOpacity style={styles.verify} onPress={handleVerifyOTP} disabled={loading}>
						<View style={styles.text5}>
							<Text style={styles.verifyEmail2}>{loading ? "Validating..." : "Verify Email"}</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.signIn}>
						<Text style={[styles.didntReceiveIt, styles.weSentAClr]}>Didn’t receive it? </Text>
						<TouchableOpacity>
							<Text style={[styles.resendCode, styles.textClr]}>Resend Code</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.issue}>
					<Pressable onPress={() => router.back()}>
						<Text style={styles.wrongEmailGoBackToEdit}>Wrong email? Go back to edit</Text>
					</Pressable>
				</View>
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
	containerBorder: {
		borderWidth: 1,
		borderStyle: "solid"
	},
	codeContainerTypo: {
		fontSize: 13,
		textAlign: "center"
	},
	weSentAClr: {
		color: "#8e9bae",
		fontFamily: "DMSans-Regular"
	},
	time2Typo: {
		fontWeight: "600",
		lineHeight: 21,
		color: "#fff",
		fontFamily: "DMSans-Bold"
	},
	textClr: {
		color: "#ccff00",
		fontWeight: "700"
	},
	verifyEmail: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		backgroundColor: "#0d1317"
	},
	container: {
		paddingHorizontal: 16,
		paddingVertical: 64,
		gap: 12,
		zIndex: 1,
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
		borderWidth: 1,
		borderStyle: "solid",
		backgroundColor: "#1a242b",
		width: 36,
		height: 36,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	component2: {
		height: 16,
		width: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		height: 194,
		paddingTop: 84,
		paddingBottom: 24,
		alignItems: "center",
		justifyContent: "center",
		width: "100%"
	},
	container3: {
		height: 80,
		borderRadius: 22,
		backgroundColor: "rgba(204, 255, 0, 0.08)",
		borderColor: "rgba(204, 255, 0, 0.22)",
		width: 80,
		borderStyle: "solid",
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	component22: {
		width: 36,
		height: 36,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		paddingBottom: 8,
		alignItems: "center",
		alignSelf: "stretch"
	},
	container4: {
		alignSelf: "stretch",
		alignItems: "center"
	},
	checkYourEmail: {
		textAlign: "center",
		color: "#fff",
		fontFamily: "PlayfairDisplay-Bold",
		fontWeight: "700",
		fontSize: 28,
		alignSelf: "stretch"
	},
	subText: {
		paddingBottom: 32,
		alignSelf: "stretch",
		alignItems: "center"
	},
	weSentAContainer: {
		lineHeight: 21,
		alignSelf: "stretch"
	},
	weSentA: {
		lineHeight: 21
	},
	youremailcom: {
		fontFamily: "DMSans-Bold"
	},
	otp: {
		paddingBottom: 12,
		alignItems: "center",
		alignSelf: "stretch",
		position: "relative"
	},
	row: {
		justifyContent: "space-between",
		gap: 14,
		alignItems: "center",
		flexDirection: "row",
		alignSelf: "stretch"
	},
	otpBox: {
		width: 48,
		height: 58,
		borderRadius: 14,
		borderWidth: 2,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1a242b",
	},
	otpBoxInactive: {
		borderColor: "#2a3b47",
	},
	otpBoxActive: {
		borderColor: "#ccff00",
		backgroundColor: "rgba(204, 255, 0, 0.05)",
	},
	otpBoxFilled: {
		borderColor: "#2a3b47",
	},
	otpText: {
		fontSize: 28,
		fontFamily: "PlayfairDisplay-Bold",
		color: "#fff",
		textAlign: "center",
	},
	otpTextFilled: {
		color: "#ccff00",
	},
	hiddenInput: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0,
		zIndex: 5
	},
	timer: {
		paddingBottom: 28,
		alignSelf: "stretch",
		alignItems: "center"
	},
	codeExpiresInContainer: {
		alignSelf: "stretch"
	},
	text4: {
		fontFamily: "DMSans-Bold"
	},
	buttons: {
		justifyContent: "flex-end",
		alignItems: "center",
		alignSelf: "stretch"
	},
	verify: {
		height: 56,
		boxShadow: "0px 8px 30px rgba(204, 255, 0, 0.28)",
		elevation: 30,
		backgroundColor: "#ccff00",
		borderRadius: 14,
		flexDirection: "row",
		alignSelf: "stretch",
		justifyContent: "center",
		alignItems: "center"
	},
	text5: {
		alignItems: "center"
	},
	verifyEmail2: {
		letterSpacing: 0.32,
		color: "#000",
		textAlign: "center",
		fontSize: 16,
		fontFamily: "DMSans-Bold",
		fontWeight: "700"
	},
	signIn: {
		paddingTop: 12,
		alignItems: "center",
		flexDirection: "row",
		alignSelf: "stretch",
		justifyContent: "center"
	},
	didntReceiveIt: {
		fontSize: 13,
		textAlign: "center"
	},
	resendCode: {
		fontFamily: "DMSans-Bold",
		fontSize: 13,
		textAlign: "center"
	},
	issue: {
		paddingTop: 16,
		alignSelf: "stretch",
		alignItems: "center"
	},
	wrongEmailGoBackToEdit: {
		fontSize: 12,
		color: "rgba(142, 155, 174, 0.5)",
		fontFamily: "DMSans-Regular",
		textAlign: "center",
		alignSelf: "stretch",
		textDecorationLine: "underline"
	}
});

export default VerifyEmail;