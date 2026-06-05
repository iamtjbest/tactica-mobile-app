import * as React from "react";
import {StyleSheet, View, Text, Pressable, Image, TouchableOpacity} from "react-native";
import { router } from "expo-router";

const ForgotPassword = () => {
  	
  	return (
    		<View style={[styles.forgotPassword, styles.container4Layout]}>
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
              							<Image style={styles.vectorIcon2} resizeMode="cover" />
              							<Image style={styles.vectorIcon3} resizeMode="cover" />
              							<Image style={styles.vectorIcon4} resizeMode="cover" />
            						</View>
          					</View>
        				</View>
        				<View style={styles.title}>
          					<View style={[styles.container4, styles.container4Layout]}>
            						<Text style={styles.resetYourPassword}>Reset Your{'\n'}Password</Text>
          					</View>
        				</View>
        				<View style={styles.subText}>
          					<View style={styles.title}>
            						<Text style={[styles.enterYourEmail, styles.text5Clr]}>Enter your email address and we'll send you a reset{'\n'}code.</Text>
              							</View>
              							</View>
              							<View style={styles.email}>
                								<View style={[styles.field, styles.fieldBorder]}>
                  									<View style={styles.component23}>
                    										<Image style={[styles.vectorIcon5, styles.vectorIconPosition]} resizeMode="cover" />
                    										<Image style={[styles.vectorIcon6, styles.vectorIconPosition]} resizeMode="cover" />
                  									</View>
                  									<View style={[styles.text, styles.textFlexBox]}>
                    										<View style={styles.email}>
                      											<Text style={[styles.emailAddress, styles.signIn3Typo]}>Email Address</Text>
                    										</View>
                    										<View style={styles.email}>
                      											<Text style={styles.youremailcom}>your@email.com</Text>
                    										</View>
                  									</View>
                								</View>
              							</View>
              							<View style={styles.info}>
                								<View style={[styles.container6, styles.fieldBorder]}>
                  									<View style={styles.icon2}>
                    										<View style={styles.component23}>
                      											<Image style={[styles.vectorIcon7, styles.vectorIconPosition]} resizeMode="cover" />
                      											<Image style={[styles.vectorIcon8, styles.iconPosition]} resizeMode="cover" />
                      											<Image style={[styles.vectorIcon9, styles.iconPosition]} resizeMode="cover" />
                    										</View>
                  									</View>
                  									<View style={styles.text2}>
                    										<Text style={styles.a6DigitCode}>A 6-digit code will be sent to your email. The code{'\n'}expires in 10 minutes.</Text>
                  									</View>
                								</View>
              							</View>
              							<View style={styles.buttons}>
                								<TouchableOpacity style={styles.sendCode} onPress={() => router.push("/(auth)/verify-email")}>
                  									<View style={[styles.text3, styles.textFlexBox]}>
                    										<Text style={[styles.sendResetCode, styles.time2Typo]}>Send Reset Code</Text>
                  									</View>
                								</TouchableOpacity>
                								<View style={styles.signIn}>
                  									<Text style={[styles.rememberedIt, styles.text5Clr]}>Remembered it?</Text>
                    										<Pressable onPress={() => router.push("/(auth)/sign-in")}>
                      											<Text style={styles.text4Typo}>
                        												<Text style={styles.text5Clr}>{` `}</Text>
                        												<Text style={styles.signIn3Typo}>Sign In</Text>
                      											</Text>
                    										</Pressable>
                    										</View>
                    										</View>
                    										</View>
                    										<View style={[styles.statusBar, styles.statusPosition]}>
                      											<View style={styles.blurview} />
                      											<View style={[styles.statusBarChild, styles.statusPosition]} />
                      											<View style={[styles.statusBarIphone, styles.meshPosition]}>
                        												<View style={[styles.time, styles.timeFlexBox]}>
                          													<Text style={[styles.time2, styles.time2Typo]}>9:41</Text>
                        												</View>
                        												<View style={[styles.levels, styles.timeFlexBox]}>
                          													<Image style={styles.cellularConnectionIcon} resizeMode="cover" />
                          													<Image style={styles.wifiIcon} resizeMode="cover" />
                          													<View style={styles.frame}>
                            														<View style={[styles.border, styles.iconPosition]} />
                            														<Image style={[styles.capIcon, styles.iconPosition]} resizeMode="cover" />
                            														<View style={[styles.capacity, styles.iconPosition]} />
                          													</View>
                        												</View>
                      											</View>
                    										</View>
                    										<View style={[styles.mesh, styles.meshPosition]}>
                      											<View style={styles.after} />
                    										</View>
                    										</View>);
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
                    										vectorIconPosition: {
                      											left: "8.33%",
                      											right: "8.33%",
                      											width: "83.33%",
                      											position: "absolute"
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
                    										iconPosition: {
                      											left: "50%",
                      											position: "absolute"
                    										},
                    										time2Typo: {
                      											fontSize: 16,
                      											textAlign: "center"
                    										},
                    										statusPosition: {
                      											top: 0,
                      											marginLeft: -195,
                      											width: 390,
                      											left: "50%",
                      											height: 54,
                      											position: "absolute"
                    										},
                    										meshPosition: {
                      											top: 1,
                      											position: "absolute",
                      											justifyContent: "center",
                      											alignItems: "center"
                    										},
                    										timeFlexBox: {
                      											height: 21.34,
                      											flexDirection: "row",
                      											flex: 1,
                      											justifyContent: "center",
                      											alignItems: "center"
                    										},
                    										forgotPassword: {
                      											height: 844,
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
                    										component22: {
                      											width: 36,
                      											height: 36,
                      											overflow: "hidden"
                    										},
                    										vectorIcon2: {
                      											height: "45.83%",
                      											width: "75%",
                      											top: "45.83%",
                      											right: "12.5%",
                      											left: "12.5%",
                      											bottom: "8.33%",
                      											position: "absolute"
                    										},
                    										vectorIcon3: {
                      											height: "37.5%",
                      											width: "41.67%",
                      											right: "29.17%",
                      											bottom: "54.17%",
                      											left: "29.17%",
                      											top: "8.33%",
                      											position: "absolute"
                    										},
                    										vectorIcon4: {
                      											height: "8.33%",
                      											width: "8.33%",
                      											top: "62.5%",
                      											right: "45.83%",
                      											bottom: "29.17%",
                      											left: "45.83%",
                      											position: "absolute"
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
                      											textAlign: "center",
                      											alignSelf: "stretch"
                    										},
                    										email: {
                      											alignItems: "flex-start",
                      											alignSelf: "stretch"
                    										},
                    										field: {
                      											borderColor: "#ccff00",
                      											paddingVertical: 0,
                      											height: 54,
                      											borderRadius: 12,
                      											backgroundColor: "#1a242b",
                      											alignItems: "center"
                    										},
                    										component23: {
                      											height: 15,
                      											width: 15,
                      											overflow: "hidden"
                    										},
                    										vectorIcon5: {
                      											height: "66.67%",
                      											top: "16.67%",
                      											bottom: "16.67%"
                    										},
                    										vectorIcon6: {
                      											height: "29.33%",
                      											bottom: "45.67%",
                      											top: "25%"
                    										},
                    										text: {
                      											gap: 2,
                      											alignItems: "flex-start"
                    										},
                    										emailAddress: {
                      											fontSize: 10,
                      											letterSpacing: 0.8,
                      											textTransform: "uppercase",
                      											textAlign: "left",
                      											alignSelf: "stretch"
                    										},
                    										youremailcom: {
                      											fontSize: 14,
                      											fontWeight: "500",
                      											fontFamily: "DMSans-Medium",
                      											textAlign: "left",
                      											color: "#fff",
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
                    										vectorIcon7: {
                      											height: "83.33%",
                      											top: "8.33%",
                      											bottom: "8.33%"
                    										},
                    										vectorIcon8: {
                      											height: "16.67%",
                      											width: "8.67%",
                      											top: "33.33%",
                      											right: "41.33%",
                      											bottom: "50%"
                    										},
                    										vectorIcon9: {
                      											height: "8.67%",
                      											top: "66.67%",
                      											bottom: "24.67%"
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
                      											boxShadow: "0px 8px 30px rgba(204, 255, 0, 0.28)",
                      											elevation: 30,
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
                      											textAlign: "center"
                    										},
                    										text4Typo: {
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
                      											gap: 149,
                      											marginLeft: -195,
                      											width: 390,
                      											top: 1,
                      											left: "50%",
                      											height: 54,
                      											paddingBottom: 18,
                      											flexDirection: "row"
                    										},
                    										time: {
                      											paddingTop: 1
                    										},
                    										time2: {
                      											fontWeight: "600",
                      											fontFamily: "SF Pro",
                      											lineHeight: 21,
                      											color: "#fff"
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
                      											zIndex: 2
                    										},
                    										after: {
                      											width: 360,
                      											height: 360,
                      											bottom: 406,
                      											left: 14,
                      											borderRadius: 180,
                      											backgroundColor: "transparent",
                      											position: "absolute",
                      											zIndex: 0
                    										}
                  									});
                  									
                  									export default ForgotPassword;
                  									
