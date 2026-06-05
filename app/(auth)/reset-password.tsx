import * as React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import { router } from "expo-router";

const ResetPassword = () => {
  	
  	return (
    		<View style={[styles.resetPassword, styles.container3Layout]}>
      			<View style={styles.container}>
        				<View style={styles.heading}>
          					<View style={styles.icon}>
            						<View style={[styles.container2, styles.viewFlexBox]}>
              							<View style={styles.component2}>
                								<Image style={[styles.vectorIcon, styles.vectorIconPosition]} resizeMode="cover" />
              							</View>
            						</View>
          					</View>
          					<View style={styles.title}>
            						<View style={styles.container3, styles.container3Layout}>
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
          					<View style={[styles.newPassword2, styles.passwordLayout]}>
            						<View style={styles.component22}>
              							<Image style={styles.vectorIcon2} resizeMode="cover" />
              							<Image style={[styles.vectorIcon3, styles.vectorIconPosition]} resizeMode="cover" />
            						</View>
            						<View style={styles.text}>
              							<View style={styles.subText}>
                								<Text style={[styles.newPassword3, styles.passwordTypo]}>New Password</Text>
              							</View>
              							<View style={styles.subText}>
                								<Text style={[styles.text2, styles.text2Typo]}>••••••••••••</Text>
              							</View>
            						</View>
            						<View style={styles.component22}>
              							<Image style={styles.vectorIcon4} resizeMode="cover" />
              							<Image style={styles.vectorIcon5} resizeMode="cover" />
            						</View>
          					</View>
          					<View style={[styles.confirmPassword, styles.passwordLayout]}>
            						<View style={styles.component22}>
              							<Image style={styles.vectorIcon2} resizeMode="cover" />
              							<Image style={[styles.vectorIcon3, styles.vectorIconPosition]} resizeMode="cover" />
            						</View>
            						<View style={styles.text}>
              							<View style={styles.subText}>
                								<Text style={[styles.confirmPassword2, styles.passwordTypo]}>Confirm Password</Text>
              							</View>
              							<View style={styles.subText}>
                								<Text style={[styles.reEnterPassword, styles.text2Typo]}>Re-enter password</Text>
              							</View>
            						</View>
          					</View>
        				</View>
        				<View style={styles.rules}>
          					<View style={[styles.view, styles.viewFlexBox]}>
            						<View style={[styles.divrpRuledot, styles.divrpLayout]} />
            						<Text style={[styles.atLeast8, styles.atLeast8Typo]}>At least 8 characters</Text>
          					</View>
          					<View style={[styles.view, styles.viewFlexBox]}>
            						<View style={[styles.divrpRuledot, styles.divrpLayout]} />
            						<Text style={[styles.atLeast8, styles.atLeast8Typo]}>Contains uppercase letter</Text>
          					</View>
          					<View style={[styles.view, styles.viewFlexBox]}>
            						<View style={[styles.divrpRuledot, styles.divrpLayout]} />
            						<Text style={[styles.atLeast8, styles.atLeast8Typo]}>Contains a number</Text>
          					</View>
          					<View style={[styles.view, styles.viewFlexBox]}>
            						<View style={[styles.divrpRuledot4, styles.divrpLayout]} />
            						<Text style={[styles.containsSpecialCharacter, styles.atLeast8Typo]}>Contains special character</Text>
          					</View>
        				</View>
        				<View style={styles.button}>
          					<TouchableOpacity style={[styles.setPassword, styles.viewFlexBox]} onPress={() => router.replace("/(auth)/sign-in")}>
            						<Text style={[styles.setNewPassword, styles.time2Typo]}>Set New Password</Text>
          					</TouchableOpacity>
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
              							<View style={[styles.border, styles.borderBorder]} />
              							<Image style={styles.capIcon} resizeMode="cover" />
              							<View style={styles.capacity} />
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
  	container3Layout: {
    		width: "100%",
    		alignItems: "center"
  	},
  	viewFlexBox: {
    		flexDirection: "row",
    		alignItems: "center"
  	},
  	vectorIconPosition: {
    		top: "8.33%",
    		position: "absolute"
  	},
  	newPasswordFlexBox: {
    		textAlign: "center",
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
  	text2Typo: {
    		fontSize: 14,
    		textAlign: "left",
    		alignSelf: "stretch"
  	},
  	divrpLayout: {
    		borderRadius: 3,
    		width: 6,
    		height: 6
  	},
  	atLeast8Typo: {
    		fontSize: 12,
    		textAlign: "left",
    		fontFamily: "DMSans-Regular"
  	},
  	time2Typo: {
    		fontSize: 16,
    		textAlign: "center"
  	},
  	statusPosition: {
    		top: 0,
    		left: "50%",
    		marginLeft: -195,
    		width: 390,
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
  	borderBorder: {
    		borderWidth: 1,
    		borderStyle: "solid"
  	},
  	resetPassword: {
    		height: 844,
    		justifyContent: "center",
    		alignItems: "center",
    		overflow: "hidden",
    		backgroundColor: "#0d1317"
  	},
  	container: {
    		paddingVertical: 64,
    		zIndex: 0,
    		paddingHorizontal: 16,
    		flex: 1,
    		alignSelf: "stretch",
    		alignItems: "center",
    		overflow: "hidden"
  	},
  	heading: {
    		paddingBottom: 28,
    		alignSelf: "stretch",
    		alignItems: "center"
  	},
  	icon: {
    		paddingTop: 72,
    		paddingBottom: 22,
    		alignSelf: "stretch",
    		alignItems: "center"
  	},
  	container2: {
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
    		overflow: "hidden"
  	},
  	vectorIcon: {
    		height: "83.33%",
    		width: "66.67%",
    		right: "16.67%",
    		bottom: "8.33%",
    		left: "16.67%"
  	},
  	title: {
    		paddingBottom: 8,
    		alignSelf: "stretch",
    		alignItems: "center"
  	},
  	container3: {
    		maxWidth: "100%",
    		alignItems: "center"
  	},
  	newPassword: {
    		fontSize: 28,
    		fontFamily: "PlayfairDisplay-Bold",
    		color: "#fff",
    		fontWeight: "700",
    		textAlign: "center"
  	},
  	subText: {
    		alignItems: "flex-start",
    		alignSelf: "stretch"
  	},
  	container4: {
    		paddingBottom: 0,
    		alignSelf: "stretch",
    		alignItems: "center"
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
  	newPassword2: {
    		borderColor: "#ccff00"
  	},
  	component22: {
    		height: 15,
    		width: 15,
    		overflow: "hidden"
  	},
  	vectorIcon2: {
    		height: "46%",
    		width: "75.33%",
    		top: "45.83%",
    		right: "12.17%",
    		bottom: "8.17%",
    		left: "12.5%",
    		position: "absolute"
  	},
  	vectorIcon3: {
    		height: "37.33%",
    		width: "42%",
    		right: "28.83%",
    		bottom: "54.33%",
    		left: "29.17%"
  	},
  	text: {
    		gap: 2,
    		alignItems: "flex-start",
    		flex: 1
  	},
  	newPassword3: {
    		color: "#ccff00"
  	},
  	text2: {
    		fontWeight: "500",
    		fontFamily: "DMSans-Medium",
    		color: "#fff"
  	},
  	vectorIcon4: {
    		height: "66.67%",
    		width: "92%",
    		top: "16.67%",
    		right: "3.83%",
    		bottom: "16.67%",
    		left: "4.17%",
    		position: "absolute"
  	},
  	vectorIcon5: {
    		height: "25.33%",
    		width: "25.33%",
    		top: "37.5%",
    		right: "37.17%",
    		bottom: "37.17%",
    		left: "37.5%",
    		position: "absolute"
  	},
  	confirmPassword: {
    		borderColor: "#2a3b47"
  	},
  	confirmPassword2: {
    		color: "#8e9bae"
  	},
  	reEnterPassword: {
    		color: "rgba(142, 155, 174, 0.55)",
    		fontFamily: "DMSans-Regular"
  	},
  	rules: {
    		paddingTop: 10,
    		paddingBottom: 5,
    		gap: 5,
    		alignItems: "flex-start",
    		alignSelf: "stretch"
  	},
  	view: {
    		gap: 8,
    		alignSelf: "stretch"
  	},
  	divrpRuledot: {
    		boxShadow: "0px 0px 6px #ccff00",
    		elevation: 6,
    		backgroundColor: "#ccff00"
  	},
  	atLeast8: {
    		color: "#ccff00"
  	},
  	divrpRuledot4: {
    		backgroundColor: "#2a3b47"
  	},
  	containsSpecialCharacter: {
    		color: "#8e9bae"
  	},
  	button: {
    		paddingTop: 20,
    		alignItems: "flex-start",
    		alignSelf: "stretch"
  	},
  	setPassword: {
    		height: 56,
    		boxShadow: "0px 8px 30px rgba(204, 255, 0, 0.28)",
    		elevation: 30,
    		borderRadius: 14,
    		backgroundColor: "#ccff00",
    		alignSelf: "stretch",
    		justifyContent: "center"
  	},
  	setNewPassword: {
    		letterSpacing: 0.32,
    		color: "#000",
    		display: "flex",
    		fontFamily: "DMSans-Bold",
    		fontSize: 16,
    		fontWeight: "700",
    		flex: 1,
    		alignSelf: "stretch",
    		justifyContent: "center",
    		alignItems: "center"
  	},
  	statusBar: {
    		zIndex: 1,
    		left: "50%",
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
    		left: "50%",
    		backgroundColor: "#0d1317"
  	},
  	statusBarIphone: {
    		paddingHorizontal: 23,
    		paddingBottom: 18,
    		gap: 149,
    		left: "50%",
    		marginLeft: -195,
    		width: 390,
    		top: 1,
    		paddingTop: 20,
    		height: 54,
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
    		left: "50%",
    		position: "absolute"
  	},
  	capIcon: {
    		height: "31.75%",
    		marginLeft: 11,
    		top: "34.65%",
    		bottom: "33.61%",
    		width: 1.29,
    		opacity: 0,
    		left: "50%",
    		position: "absolute"
  	},
  	capacity: {
    		height: "69.05%",
    		marginLeft: -12,
    		top: "15.4%",
    		bottom: "15.55%",
    		borderRadius: 2,
    		backgroundColor: "#fff",
    		width: 20.37,
    		left: "50%",
    		position: "absolute"
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

export default ResetPassword;
