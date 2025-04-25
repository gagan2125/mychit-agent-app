import React, { useEffect, useLayoutEffect } from "react";
import {
	View,
	Text,
	Image,
	Pressable,
	StyleSheet,
	Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Welcome({ navigation }) {
	// useLayoutEffect(() => {
	// 	const PreventLogin = async () => {
	// 		try {
	// 			const data = await AsyncStorage.getItem("user");
	// 			if (data) {
	// 				navigation.replace("BottomNavigation", { user: JSON.parse(data) });
	// 			} else {
	// 				throw new Error("User need to login");
	// 			}
	// 		} catch (err) {
	// 			console.log("User Need to Login!");
	// 		}
	// 	};
	// 	PreventLogin();
	// }, []);
	return (
		<LinearGradient
			style={styles.container}
			colors={["#432F92", "#F7A906"]}
			start={{ x: 2, y: 0 }}
			end={{ x: 2, y: 0.6 }}
		>
			<View style={styles.logoContainer}>
				<Image source={require("../assets/logo.png")} style={styles.logo} />
			</View>

			<View style={styles.card}>
				<Text style={styles.subTitle}>Agent App</Text>
				<Image
					source={require("../assets/welcome-image.png")}
					style={styles.image}
				/>

				<Pressable
					style={styles.button}
					onPress={() => navigation.navigate("Login")}
				>
					<Text style={styles.buttonText}>Login Now</Text>
					<FontAwesome
						name="sign-in"
						size={20}
						color="#fff"
						style={styles.icon}
					/>
				</Pressable>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	logoContainer: {
		position: "absolute",
		top: height * 0.2,
		alignItems: "center",
	},
	logo: {
		width: 160,
		height: 160,
		resizeMode: "contain",
	},
	appTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#fff",
		marginTop: 10,
	},
	card: {
		position: "absolute",
		bottom: 0,
		backgroundColor: "#FCFCDF",
		width: width,
		padding: 30,
		paddingVertical: 90,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignItems: "center",
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	subTitle: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#322383",
		marginBottom: 15,
	},
	image: {
		width: 140,
		height: 140,
		resizeMode: "contain",
		marginBottom: 20,
	},
	button: {
		flexDirection: "row",
		backgroundColor: "#322383",
		paddingVertical: 14,
		paddingHorizontal: 30,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "800",
	},
	icon: {
		marginLeft: 10,
	},
});
