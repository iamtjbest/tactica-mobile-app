import * as React from "react";
import {StyleSheet, View, Pressable, Text, Image, TouchableOpacity} from "react-native";
import { router } from "expo-router";

const VerifyEmail = () => {
    		
    		return (
      			<View style={styles.verifyEmail}>
        				<View style={styles.container}>
          					<View style={styles.back}>
            						<Pressable style={[styles.container2, styles.containerBorder]} onPress={() => router.back()}>
              							<View style={styles.component2}>
                								<Image style={styles.vectorIcon} resizeMode="cover" />
              							</View>
            						</Pressable>
          					</View>
          					<View style={styles.icon}>
            						<View style={[styles.container3, styles.containerBorder]}>
              							<View style={styles.component22}>
                								<Image style={[styles.vectorIcon2, styles.vectorIconPosition]} resizeMode="cover" />
                								<Image style={[styles.vectorIcon3, styles.vectorIconPosition]} resizeMode="cover" />
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
              							<Text style={[styles.weSentA, styles.weSentAClr]}>We sent a 6-digit verification code to{'\n'}</Text>
              							<Text style={[styles.youremailcom, styles.time2Typo]}>your@email.com</Text>
            						</Text>
          					</View>
          					<View style={styles.otp}>
            						<View style={styles.row}>
              							<View style={[styles.view, styles.viewLayout]}>
                								<Text style={[styles.text, styles.textClr]}>7</Text>
              							</View>
              							<View style={[styles.view, styles.viewLayout]}>
                								<Text style={[styles.text, styles.textClr]}>4</Text>
              							</View>
              							<View style={[styles.view, styles.viewLayout]}>
                								<Text style={[styles.text, styles.textClr]}>2</Text>
              							</View>
              							<View style={[styles.view4, styles.viewLayout]} />
              							<View style={[styles.view5, styles.viewLayout]} />
              							<View style={[styles.view5, styles.viewLayout]} />
            						</View>
          					</View>
          					<View style={styles.timer}>
            						<Text style={[styles.codeExpiresInContainer, styles.codeContainerTypo]}>
              							<Text style={styles.weSentAClr}>{`Code expires in `}</Text>
              							<Text style={[styles.text4, styles.textClr]}>04:32</Text>
            						</Text>
          					</View>
          					<View style={styles.buttons}>
            						<TouchableOpacity style={styles.verify} onPress={() => router.push("/(auth)/reset-password")}>
              							<View style={styles.text5}>
                								<Text style={styles.verifyEmail2}>Verify Email</Text>
              							</View>
            						</TouchableOpacity>
            						<View style={styles.signIn}>
              							<Text style={[styles.didntReceiveIt, styles.weSentAClr]}>Didn’t receive it?</Text>
                								<Text style={[styles.resendCode, styles.textClr]}>Resend Code</Text>
                								</View>
                								</View>
                								<View style={styles.issue}>
                  									<Pressable onPress={() => router.back()}>
                    										<Text style={styles.wrongEmailGoBackToEdit}>Wrong email? Go back to edit</Text>
                      											</Pressable>
                      											</View>
                      											</View>
                      											<View style={[styles.statusBar, styles.statusPosition]}>
                        												<View style={styles.blurview} />
                        												<View style={[styles.statusBarChild, styles.statusPosition]} />
                        												<View style={[styles.statusBarIphone, styles.statusPosition]}>
                          													<View style={[styles.time, styles.timeFlexBox]}>
                            														<Text style={[styles.time2, styles.time2Typo]}>9:41</Text>
                          													</View>
                          													<View style={[styles.levels, styles.timeFlexBox]}>
                            														<Image style={styles.cellularConnectionIcon} resizeMode="cover" />
                            														<Image style={styles.wifiIcon} resizeMode="cover" />
                            														<View style={styles.frame}>
                              															<View style={[styles.border, styles.statusPosition]} />
                              															<Image style={[styles.capIcon, styles.statusPosition]} resizeMode="cover" />
                              															<View style={[styles.capacity, styles.statusPosition]} />
                            														</View>
                          													</View>
                        												</View>
                      											</View>
                      											<View style={styles.accent} />
                      											</View>);
                    										};
                    										
                    										const styles = StyleSheet.create({
                      											containerBorder: {
                        												borderWidth: 1,
                        												borderStyle: "solid"
                      											},
                      											vectorIconPosition: {
                        												left: "8.33%",
                        												right: "8.33%",
                        												width: "83.33%",
                        												position: "absolute"
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
                        												color: "#fff"
                      											},
                      											viewLayout: {
                        												borderWidth: 2,
                        												width: 48,
                        												height: 58,
                        												borderRadius: 14,
                        												borderStyle: "solid"
                      											},
                      											textClr: {
                        												color: "#ccff00",
                        												fontWeight: "700"
                      											},
                      											statusPosition: {
                        												left: "50%",
                        												position: "absolute"
                      											},
                      											timeFlexBox: {
                        												height: 21.34,
                        												flexDirection: "row",
                        												flex: 1,
                        												justifyContent: "center",
                        												alignItems: "center"
                      											},
                      											verifyEmail: {
                        												height: 844,
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
                        												zIndex: 0,
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
                        												height: 14,
                        												width: 14,
                        												overflow: "hidden"
                      											},
                      											vectorIcon: {
                        												height: "50%",
                        												width: "25%",
                        												right: "37.5%",
                        												bottom: "25%",
                        												left: "37.5%",
                        												top: "25%",
                        												position: "absolute"
                      											},
                      											icon: {
                        												height: 194,
                        												paddingTop: 84,
                        												paddingBottom: 24,
                        												alignItems: "flex-start",
                        												width: 80
                      											},
                      											container3: {
                        												height: 80,
                        												borderRadius: 22,
                        												backgroundColor: "rgba(204, 255, 0, 0.08)",
                        												borderColor: "rgba(204, 255, 0, 0.22)",
                        												width: 80,
                        												borderStyle: "solid",
                        												borderWidth: 1,
                        												flexDirection: "row",
                        												justifyContent: "center",
                        												alignItems: "center"
                      											},
                      											component22: {
                        												width: 36,
                        												height: 36,
                        												overflow: "hidden"
                      											},
                      											vectorIcon2: {
                        												height: "66.67%",
                        												top: "16.67%",
                        												bottom: "16.67%"
                      											},
                      											vectorIcon3: {
                        												height: "29.17%",
                        												bottom: "45.83%",
                        												top: "25%"
                      											},
                      											title: {
                        												paddingBottom: 8,
                        												alignItems: "flex-start",
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
                        												alignItems: "flex-start",
                        												alignSelf: "stretch"
                      											},
                      											row: {
                        												justifyContent: "space-between",
                        												gap: 14,
                        												alignItems: "flex-start",
                        												flexDirection: "row",
                        												alignSelf: "stretch"
                      											},
                      											view: {
                        												borderColor: "#ccff00",
                        												borderWidth: 2,
                        												width: 48,
                        												height: 58,
                        												backgroundColor: "#1a242b",
                        												flexDirection: "row",
                        												justifyContent: "center",
                        												alignItems: "center"
                      											},
                      											text: {
                        												textAlign: "center",
                        												fontFamily: "PlayfairDisplay-Bold",
                        												fontSize: 28,
                        												color: "#ccff00"
                      											},
                      											view4: {
                        												backgroundColor: "rgba(204, 255, 0, 0.05)",
                        												borderColor: "#ccff00",
                        												borderWidth: 2,
                        												width: 48,
                        												height: 58
                      											},
                      											view5: {
                        												borderWidth: 2,
                        												width: 48,
                        												height: 58,
                        												borderColor: "#2a3b47",
                        												backgroundColor: "#1a242b"
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
                        												alignItems: "flex-start",
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
                        												alignItems: "flex-start"
                      											},
                      											verifyEmail2: {
                        												alignSelf: "flex-start",
                        												letterSpacing: 0.32,
                        												color: "#000",
                        												textAlign: "left",
                        												fontSize: 16,
                        												fontFamily: "DMSans-Bold",
                        												fontWeight: "700"
                      											},
                      											signIn: {
                        												paddingTop: 12,
                        												gap: 2,
                        												alignItems: "flex-start",
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
                        												paddingTop: 6,
                        												alignSelf: "stretch",
                        												alignItems: "center"
                      											},
                      											wrongEmailGoBackToEdit: {
                        												fontSize: 12,
                        												color: "rgba(142, 155, 174, 0.5)",
                        												fontFamily: "DMSans-Regular",
                        												textAlign: "center",
                        												alignSelf: "stretch"
                      											},
                      											statusBar: {
                        												zIndex: 1,
                        												top: 0,
                        												left: "50%",
                        												marginLeft: -195,
                        												height: 54,
                        												width: 390,
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
                        												top: 0,
                        												left: "50%",
                        												marginLeft: -195,
                        												height: 54,
                        												width: 390,
                        												backgroundColor: "#0d1317"
                      											},
                      											statusBarIphone: {
                        												top: 1,
                        												paddingHorizontal: 23,
                        												paddingTop: 20,
                        												paddingBottom: 18,
                        												gap: 149,
                        												marginLeft: -195,
                        												height: 54,
                        												width: 390,
                        												left: "50%",
                        												flexDirection: "row",
                        												justifyContent: "center",
                        												alignItems: "center"
                      											},
                      											time: {
                        												paddingTop: 1
                      											},
                      											time2: {
                        												fontFamily: "SF Pro",
                        												fontSize: 16,
                        												textAlign: "center"
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
                        												width: 360,
                        												height: 360,
                        												top: 106,
                        												right: 17,
                        												borderRadius: 180,
                        												backgroundColor: "transparent",
                        												zIndex: 2,
                        												position: "absolute"
                      											}
                    										});
                    										
                    										export default VerifyEmail;
                    										