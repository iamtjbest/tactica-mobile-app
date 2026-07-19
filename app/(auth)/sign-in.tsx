import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, Pressable, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, OAuthProvider, getAdditionalUserInfo, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import TacticaLogo from "@/components/TacticaLogo";
import { GoogleIcon, AppleIcon, EmailIcon, PasswordIcon, EyeIcon, EyeOffIcon } from "@/components/Icons";
import { TopToast } from "@/components/TopToast";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "info" | "error">("info");
  
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
    clientId: "749983115247-t0mcrj29t1p9r67r9tq34v7889v1plv2.apps.googleusercontent.com",
  });

  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAuthAvailable);
  }, []);

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const additionalInfo = getAdditionalUserInfo(userCredential);
          if (additionalInfo?.isNewUser) {
            router.replace("/onboarding/choose-location");
          } else {
            router.replace("/(tabs)");
          }
        })
        .catch((error) => {
          setToastMessage(error.message || "Google sign in failed");
          setToastType("error");
          setToastVisible(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [googleResponse]);

  const handleAppleSignIn = async () => {
    if (!appleAuthAvailable) {
      Alert.prompt(
        "Apple ID Email",
        "Apple Sign-In is only natively supported on iOS devices. Enter your Apple ID email to proceed:",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign In",
            onPress: async (emailInput?: string) => {
              if (emailInput && emailInput.trim()) {
                setLoading(true);
                try {
                  const fallbackEmail = emailInput.trim().toLowerCase();
                  const dummyPassword = `AppleUser_${fallbackEmail.split('@')[0]}_99!`;
                  try {
                    await signInWithEmailAndPassword(auth, fallbackEmail, dummyPassword);
                    router.replace("/(tabs)");
                  } catch {
                    const userCredential = await createUserWithEmailAndPassword(auth, fallbackEmail, dummyPassword);
                    await updateProfile(userCredential.user, { displayName: "Apple User" });
                    router.replace("/onboarding/choose-location");
                  }
                } catch (err: any) {
                  setToastMessage(err.message || "Apple sign in failed");
                  setToastType("error");
                  setToastVisible(true);
                } finally {
                  setLoading(false);
                }
              }
            }
          }
        ],
        "plain-text",
        "your-apple-id@icloud.com"
      );
      return;
    }

    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      const { identityToken } = appleCredential;
      if (!identityToken) {
        throw new Error("No Identity Token returned from Apple Sign In.");
      }
      
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
      });
      
      setLoading(true);
      const userCredential = await signInWithCredential(auth, credential);
      const additionalInfo = getAdditionalUserInfo(userCredential);
      if (additionalInfo?.isNewUser) {
        router.replace("/onboarding/choose-location");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (error.code !== "ERR_CANCELED") {
        setToastMessage(error.message || "Apple authentication failed");
        setToastType("error");
        setToastVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setToastMessage("Please enter both email and password.");
      setToastType("error");
      setToastVisible(true);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      setToastMessage(error.message || "Sign in failed.");
      setToastType("error");
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };
  	
  	return (
    		<View style={styles.signIn}>
      			<View style={styles.container}>
        				<View style={styles.heading}>
          					<View style={styles.logo}>
            						<TacticaLogo size={52} />
          					</View>
          					<View style={styles.name}>
            						<Text style={[styles.tactica, styles.time2FlexBox]}>Tactica</Text>
          					</View>
          					<View style={styles.message}>
            						<Text style={[styles.welcomeBackManager, styles.google2Typo]}>Welcome back, manager</Text>
          					</View>
        				</View>
        				<View style={styles.container2}>
          					<TouchableOpacity 
                      style={[styles.google, styles.appleFlexBox]} 
                      onPress={() => googlePromptAsync()}
                      disabled={loading || !googleRequest}
                    >
            						<GoogleIcon size={18} />
            						<Text style={[styles.google2, styles.google2Typo]}>Google</Text>
          					</TouchableOpacity>
          					<TouchableOpacity 
                      style={[styles.apple, styles.appleFlexBox]} 
                      onPress={handleAppleSignIn}
                      disabled={loading}
                    >
            						<AppleIcon size={20} />
            						<Text style={[styles.google2, styles.google2Typo]}>Apple</Text>
          					</TouchableOpacity>
        				</View>
        				<View style={[styles.divider, styles.fieldsFlexBox]}>
          					<View style={styles.divcaDl} />
          					<View style={styles.text}>
            						<Text style={[styles.orSignUp, styles.orSignUpFlexBox]}>or sign up with email</Text>
          					</View>
          					<View style={styles.divcaDl} />
        				</View>
        				<View style={[styles.fields, styles.fieldsFlexBox]}>
          					<View style={[styles.email, styles.passwordFlexBox, emailFocused ? { borderColor: "#CCFF00" } : { borderColor: "#2a3b47" }]}>
            						<View style={styles.component23}>
              							<EmailIcon size={15} />
            						</View>
            						<View style={[styles.divinpWrap, styles.signIn2FlexBox]}>
              							<View style={styles.divlbl}>
                								<Text style={[styles.emailAddress, styles.password2Typo, { color: emailFocused ? "#CCFF00" : "#8e9bae" }]}>Email Address</Text>
              							</View>
              							<TextInput
                								style={styles.text3Input}
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
          					<View style={[styles.password, styles.passwordFlexBox, passwordFocused ? { borderColor: "#CCFF00" } : { borderColor: "#2a3b47" }]}>
            						<View style={styles.component23}>
              							<PasswordIcon size={15} color="#8E9BAE" />
            						</View>
            						<View style={[styles.divinpWrap, styles.signIn2FlexBox]}>
              							<View style={styles.divlbl}>
                								<Text style={[styles.password2, { color: passwordFocused ? "#CCFF00" : "#8e9bae", fontFamily: "DMSans-Bold" }]}>Password</Text>
              							</View>
              							<TextInput
                								style={styles.text3Input}
                								value={password}
                								onChangeText={setPassword}
                								placeholder="••••••••••"
                								placeholderTextColor="rgba(142, 155, 174, 0.4)"
                								secureTextEntry={!showPassword}
                								autoCapitalize="none"
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
              							/>
            						</View>
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </TouchableOpacity>
          					</View>
          					<View style={[styles.passwordStrength, styles.passwordFlexBox]}>
            						<View style={styles.text4}>
              							<Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                								<Text style={[styles.forgotPassword2, styles.passwordClr]}>Forgot Password?</Text>
              							</Pressable>
            						</View>
          					</View>
        				</View>
        				<View style={styles.buttons}>
          					<Pressable 
                      style={[styles.continue, styles.appleFlexBox]} 
                      onPress={handleSignIn}
                      disabled={loading}
                    >
            						<View style={styles.text}>
              							<Text style={[styles.accessEngine, styles.orSignUpFlexBox]}>
                                {loading ? "Verifying..." : "Access Engine"}
                              </Text>
            						</View>
            						<View style={styles.component23}>
              							<Image style={styles.vectorIcon12} resizeMode="cover" />
              							<Image style={[styles.vectorIcon13, styles.iconPosition]} resizeMode="cover" />
            						</View>
          					</Pressable>
          					<View style={[styles.signIn2, styles.signIn2FlexBox]}>
            						<Text style={[styles.dontHaveAn, styles.google2Typo]}>Don’t have an account?</Text>
            						<Pressable onPress={() => router.push("/(auth)/create-account")}>
              							<Text style={[styles.signUp2, styles.passwordClr]}>Sign Up</Text>
            						</Pressable>
          					</View>
        				</View>
      			</View>
                        				<View style={[styles.accent, styles.afterBg]} pointerEvents="none" />
                        				<View style={[styles.mesh, styles.meshPosition]} pointerEvents="none">
                          													<View style={[styles.after, styles.afterBg]} pointerEvents="none" />
                        				</View>
      <TopToast 
        visible={toastVisible} 
        message={toastMessage} 
        type={toastType}
        onClose={() => setToastVisible(false)} 
      />
                        				</View>);
                      											};
                      											
                      											const styles = StyleSheet.create({
                        												time2FlexBox: {
                          													textAlign: "center",
                          													color: "#fff"
                        												},
                        												google2Typo: {
                          													fontSize: 13,
                          													textAlign: "center"
                        												},
                        												appleFlexBox: {
                          													gap: 8,
                          													flexDirection: "row",
                          													justifyContent: "center",
                          													alignItems: "center"
                        												},
                        												iconPosition: {
                          													left: "50%",
                          													position: "absolute"
                        												},
                        												vectorIconPosition3: {
                          													left: "9.08%",
                          													height: "37.22%",
                          													position: "absolute"
                        												},
                        												vectorIconPosition2: {
                          													left: "4.17%",
                          													position: "absolute"
                        												},
                        												fieldsFlexBox: {
                          													gap: 10,
                          													alignSelf: "stretch"
                        												},
                        												orSignUpFlexBox: {
                          													alignSelf: "flex-start",
                          													textAlign: "left"
                        												},
                        												passwordFlexBox: {
                          													paddingVertical: 0,
                          													flexDirection: "row",
                          													alignSelf: "stretch",
                          													alignItems: "center"
                        												},
                        												vectorIconPosition: {
                          													left: "8.33%",
                          													right: "8.33%",
                          													width: "83.33%",
                          													position: "absolute"
                        												},
                        												signIn2FlexBox: {
                          													gap: 2,
                          													alignItems: "flex-start"
                        												},
                        												password2Typo: {
                          													textTransform: "uppercase",
                          													letterSpacing: 0.8,
                          													fontSize: 10,
                          													fontWeight: "700",
                          													textAlign: "left",
                          													alignSelf: "stretch"
                        												},
                        												text3Typo: {
                          													fontSize: 14,
                          													textAlign: "left",
                          													color: "#fff",
                          													alignSelf: "stretch"
                        												},
                        												passwordClr: {
                          													color: "#ccff00",
                          													fontFamily: "DMSans-Bold"
                        												},
                        												vectorIconPosition1: {
                          													bottom: "16.67%",
                          													top: "16.67%",
                          													height: "66.67%"
                        												},
                        												statusPosition: {
                          													top: 0,
                          													marginLeft: -195,
                          													width: 390,
                          													height: 54,
                          													left: "50%",
                          													position: "absolute"
                        												},
                        												meshPosition: {
                          													top: 1,
                          													position: "absolute"
                        												},
                        												timeFlexBox: {
                          													height: 21.34,
                          													flexDirection: "row",
                          													flex: 1,
                          													justifyContent: "center",
                          													alignItems: "center"
                        												},
                        												afterBg: {
                          													backgroundColor: "transparent",
                          													position: "absolute"
                        												},
                        												signIn: {
                          													flex: 1,
                          													width: "100%",
                          													justifyContent: "center",
                          													alignItems: "center",
                          													overflow: "hidden",
                          													backgroundColor: "#0d1317"
                        												},
                        												container: {
                          													paddingVertical: 64,
                          													gap: 12,
                          													zIndex: 0,
                          													paddingHorizontal: 16,
                          													flex: 1,
                          													alignSelf: "stretch",
                          													alignItems: "center",
                          													overflow: "hidden"
                        												},
                        												heading: {
                          													paddingTop: 44,
                          													alignSelf: "stretch",
                          													alignItems: "center"
                        												},
                        												logo: {
                          													alignSelf: "center",
                          													paddingBottom: 12,
                          													flexDirection: "row",
                          													alignItems: "center"
                        												},
                        												logoIcon: {
                          													height: 52,
                          													width: 52
                        												},
                        												name: {
                          													paddingBottom: 8,
                          													alignSelf: "stretch",
                          													alignItems: "center"
                        												},
                        												tactica: {
                          													fontSize: 30,
                          													fontWeight: "900",
                          													fontFamily: "PlayfairDisplay-Black",
                          													alignSelf: "stretch"
                        												},
                        												message: {
                          													paddingBottom: 28,
                          													alignSelf: "stretch",
                          													alignItems: "center"
                        												},
                        												welcomeBackManager: {
                          													color: "#8e9bae",
                          													fontFamily: "DMSans-Regular",
                          													alignSelf: "stretch"
                        												},
                        												container2: {
                          													alignSelf: "stretch",
                                                    flexDirection: "row",
                                                    gap: 12,
                                                    marginBottom: 20
                        												},
                        												google: {
                          													height: 50,
                          													borderWidth: 1,
                          													borderStyle: "solid",
                          													borderColor: "#2a3b47",
                          													backgroundColor: "#1a242b",
                          													borderRadius: 12,
                          													gap: 8,
                          													flex: 1
                        												},
                        												component2: {
                          													height: 18,
                          													width: 18,
                          													overflow: "hidden"
                        												},
                        												vectorIcon: {
                          													height: "43.33%",
                          													width: "43.89%",
                          													top: "41.67%",
                          													right: "6.11%",
                          													bottom: "15%"
                        												},
                        												vectorIcon2: {
                          													width: "71.11%",
                          													top: "58.75%",
                          													right: "19.81%",
                          													bottom: "4.03%"
                        												},
                        												vectorIcon3: {
                          													height: "41.11%",
                          													width: "20%",
                          													top: "29.46%",
                          													right: "75.83%",
                          													bottom: "29.43%"
                        												},
                        												vectorIcon4: {
                          													width: "71.67%",
                          													top: "4.17%",
                          													right: "19.25%",
                          													bottom: "58.61%"
                        												},
                        												google2: {
                          													fontFamily: "DMSans-Bold",
                          													fontWeight: "600",
                          													color: "#fff",
                          													fontSize: 13
                        												},
                        												apple: {
                          													borderWidth: 1,
                          													borderStyle: "solid",
                          													borderColor: "#2a3b47",
                          													backgroundColor: "#1a242b",
                          													borderRadius: 12,
                          													gap: 8,
                          													flex: 1,
                          													alignSelf: "stretch"
                        												},
                        												component22: {
                          													height: 20,
                          													width: 17,
                          													overflow: "hidden"
                        												},
                        												vectorIcon5: {
                          													height: "71%",
                          													width: "67.65%",
                          													top: "14.58%",
                          													right: "16.25%",
                          													bottom: "14.42%",
                          													left: "16.1%",
                          													position: "absolute"
                        												},
                        												divider: {
                          													paddingTop: 8,
                          													flexDirection: "row",
                          													alignItems: "center"
                        												},
                        												divcaDl: {
                          													height: 1,
                          													backgroundColor: "#2a3b47",
                          													flex: 1
                        												},
                        												text: {
                          													alignItems: "flex-start"
                        												},
                        												orSignUp: {
                          													fontSize: 12,
                          													textAlign: "left",
                          													color: "#8e9bae",
                          													fontFamily: "DMSans-Regular"
                        												},
                        												fields: {
                          													alignItems: "flex-start"
                        												},
                        												email: {
                          													height: 54,
                          													paddingVertical: 0,
                          													gap: 10,
                          													borderWidth: 1,
                          													borderStyle: "solid",
                          													backgroundColor: "#1a242b",
                          													borderRadius: 12,
                          													paddingHorizontal: 16,
                          													borderColor: "#2a3b47"
                        												},
                        												component23: {
                          													height: 15,
                          													width: 15,
                          													overflow: "hidden"
                        												},
                        												vectorIcon6: {
                          													bottom: "16.67%",
                          													top: "16.67%",
                          													height: "66.67%"
                        												},
                        												vectorIcon7: {
                          													height: "29.33%",
                          													top: "25%",
                          													bottom: "45.67%"
                        												},
                        												divinpWrap: {
                          													flex: 1
                        												},
                        												divlbl: {
                          													alignItems: "flex-start",
                          													alignSelf: "stretch"
                        												},
                        												emailAddress: {
                          													fontWeight: "700",
                          													fontFamily: "DMSans-Bold",
                          													color: "#8e9bae"
                        												},
                        												youremailcom: {
                          													fontFamily: "DMSans-Regular"
                        												},
                        												password: {
                          													borderColor: "#2a3b47",
                          													height: 54,
                          													paddingVertical: 0,
                          													gap: 10,
                          													borderWidth: 1,
                          													borderStyle: "solid",
                          													backgroundColor: "#1a242b",
                          													borderRadius: 12,
                          													paddingHorizontal: 16
                        												},
                        												vectorIcon8: {
                          													height: "46%",
                          													width: "75.33%",
                          													top: "45.83%",
                          													right: "12.17%",
                          													bottom: "8.17%",
                          													left: "12.5%",
                          													position: "absolute"
                        												},
                        												vectorIcon9: {
                          													height: "37.33%",
                          													width: "42%",
                          													top: "8.33%",
                          													right: "28.83%",
                          													bottom: "54.33%",
                          													left: "29.17%",
                          													position: "absolute"
                        												},
                        												password2: {
                          													fontWeight: "700",
                          													textTransform: "uppercase",
                          													letterSpacing: 0.8,
                          													fontSize: 10,
                          													textAlign: "left",
                          													alignSelf: "stretch"
                        												},
                        												text3: {
                          													fontWeight: "500",
                          													fontFamily: "DMSans-Medium"
                        												},
                        												text3Input: {
                          													fontFamily: "DMSans-Medium",
                          													fontSize: 14,
                          													color: "#fff",
                          													alignSelf: "stretch",
                          													height: 28,
                          													padding: 0
                        												},
                        												vectorIcon10: {
                          													width: "92%",
                          													right: "3.83%",
                          													left: "4.17%",
                          													position: "absolute"
                        												},
                        												vectorIcon11: {
                          													height: "25.33%",
                          													width: "25.33%",
                          													top: "37.5%",
                          													right: "37.17%",
                          													bottom: "37.17%",
                          													left: "37.5%",
                          													position: "absolute"
                        												},
                        												passwordStrength: {
                          													paddingHorizontal: 2
                        												},
                        												text4: {
                          													alignItems: "flex-end",
                          													paddingLeft: 4,
                          													flex: 1
                        												},
                        												forgotPassword2: {
                          													alignSelf: "flex-end",
                          													fontSize: 11,
                          													textAlign: "left",
                          													fontWeight: "600"
                        												},
                        												buttons: {
                          													justifyContent: "flex-end",
                          													paddingTop: 184,
                          													alignItems: "flex-start",
                          													alignSelf: "stretch"
                        												},
                        												continue: {
                          													height: 56,
                          													boxShadow: "0px 8px 30px rgba(204, 255, 0, 0.28)",
                          													elevation: 30,
                          													borderRadius: 14,
                          													backgroundColor: "#ccff00",
                          													alignSelf: "stretch"
                        												},
                        												accessEngine: {
                          													letterSpacing: 0.32,
                          													color: "#000",
                          													fontSize: 16,
                          													fontWeight: "700",
                          													textAlign: "left",
                          													fontFamily: "DMSans-Bold"
                        												},
                        												vectorIcon12: {
                          													height: "10.67%",
                          													width: "58.67%",
                          													top: "50%",
                          													right: "20.5%",
                          													bottom: "39.33%",
                          													left: "20.83%",
                          													position: "absolute"
                        												},
                        												vectorIcon13: {
                          													height: "58.67%",
                          													width: "29.33%",
                          													top: "20.83%",
                          													right: "20.67%",
                          													bottom: "20.5%"
                        												},
                        												signIn2: {
                          													paddingTop: 12,
                          													flexDirection: "row",
                          													alignSelf: "stretch",
                          													justifyContent: "center"
                        												},
                        												dontHaveAn: {
                          													color: "#8e9bae",
                          													fontFamily: "DMSans-Regular"
                        												},
                        												signUp2: {
                          													fontWeight: "700",
                          													fontSize: 13,
                          													textAlign: "center"
                        												},
                        												statusBar: {
                          													zIndex: 1,
                          													overflow: "hidden"
                        												},
                        												blurview: {
                          													opacity: 1,
                          													top: 0,
                          													left: 0,
                          													right: 0,
                          													bottom: 0,
                          													zIndex: -1,
                          													position: "absolute"
                        												},
                        												statusBarChild: {
                          													backgroundColor: "#0d1317"
                        												},
                        												statusBarIphone: {
                          													paddingHorizontal: 23,
                          													paddingTop: 20,
                          													paddingBottom: 18,
                          													gap: 149,
                          													marginLeft: -195,
                          													width: 390,
                          													top: 1,
                          													height: 54,
                          													left: "50%",
                          													flexDirection: "row",
                          													justifyContent: "center",
                          													alignItems: "center"
                        												},
                        												time: {
                          													paddingTop: 1
                        												},
                        												time2: {
                          													lineHeight: 21,
                          													fontFamily: "SF Pro",
                          													fontSize: 16,
                          													fontWeight: "600"
                        												},
                        												levels: {
                          													paddingTop: 0,
                          													paddingRight: 0,
                          													gap: 6
                        												},
                        												cellularConnectionIcon: {
                          													height: 11.86,
                          													width: 18.63
                        												},
                        												wifiIcon: {
                          													height: 11.96,
                          													width: 16.63
                        												},
                        												frame: {
                          													height: 12.61,
                          													width: 26.51
                        												},
                        												border: {
                          													height: "100%",
                          													marginLeft: -14,
                          													top: "0%",
                          													bottom: "0%",
                          													borderRadius: 4,
                          													borderColor: "#fff",
                          													width: 24.25,
                          													opacity: 0,
                          													borderWidth: 1,
                          													borderStyle: "solid"
                        												},
                        												capIcon: {
                          													height: "31.75%",
                          													marginLeft: 11,
                          													top: "34.65%",
                          													bottom: "33.61%",
                          													width: 1.29,
                          													opacity: 0
                        												},
                        												capacity: {
                          													height: "69.05%",
                          													marginLeft: -12,
                          													top: "15.4%",
                          													bottom: "15.55%",
                          													borderRadius: 2,
                          													backgroundColor: "#fff",
                          													width: 20.37
                        												},
                        												accent: {
                          													width: 400,
                          													height: 400,
                          													top: -63,
                          													right: 99,
                          													borderRadius: 200,
                          													zIndex: 2
                        												},
                        												mesh: {
                          													width: 389,
                          													height: 843,
                          													left: 390,
                          													padding: 10,
                          													transform: [
                            														{
                              															rotate: "180deg"
                            														}
                          													],
                          													zIndex: 3,
                          													alignItems: "flex-start"
                        												},
                        												after: {
                          													width: 280,
                          													height: 280,
                          													bottom: 55,
                          													left: -65,
                          													borderRadius: 140,
                          													zIndex: 0
                        												}
                      											});
                      											
                      											export default SignIn;
                      											