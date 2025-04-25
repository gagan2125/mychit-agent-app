import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/color";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";

import baseUrl from "../constants/baseUrl";
import axios from "axios";

const Home = ({ route, navigation }) => {
	const { user, agentInfo } = route.params;
	const [agent, setAgent] = useState([]);

	useEffect(() => {
		const fetchAgent = async () => {
			try {
				const response = await axios.get(
					`${baseUrl}/agent/get-agent-by-id/${user.userId}`
				);

				if (response.data) {
					setAgent(response.data);
				} else {
					console.error("Unexpected API response format:", response.data);
				}
			} catch (error) {
				console.error("Error fetching agent data:", error);
			}
			console.log(response.data, "user");
		};

		fetchAgent();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<View style={{ marginHorizontal: 22, marginTop: 12 }}>
				<Header />
				<ScrollView style={styles.scrollView}>
					<View style={styles.introContainer}>
						<View style={styles.welcomeContainer}>
							<Text style={styles.welcomeText}>Hello {agent.name},</Text>
							<Text style={styles.subWelcomeText}>
								Welcome to MyChits Agent App
							</Text>
						</View>
					</View>
				</ScrollView>
				<View style={styles.boxContainer}>
					{agentInfo?.app_permission?.collection === "true" && (
						<TouchableOpacity
							style={styles.box}
							onPress={() => navigation.navigate("PaymentNavigator")}
						>
							<Feather name="user" size={20} color={COLORS.primary} />
							<Text style={styles.boxText}>Collections</Text>
						</TouchableOpacity>
					)}
					{agentInfo?.app_permission?.daybook === "true" && (
						<TouchableOpacity
							style={styles.box}
							onPress={() =>
								navigation.navigate("PayNavigation", { user: user })
							}
						>
							<Feather name="file" size={20} color={COLORS.primary} />
							<Text style={styles.boxText}>Daybook</Text>
						</TouchableOpacity>
					)}
					{agentInfo?.app_permission?.targets === "true" && (
						<TouchableOpacity
							style={styles.box}
							onPress={() =>
								Alert.alert("Coming Soon", "This feature is coming soon!")
							}
						>
							<Feather name="check-circle" size={20} color={COLORS.primary} />
							<Text style={styles.boxText}>Targets</Text>
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.boxContainer}>
					{agentInfo?.app_permission?.myleads === "true" && (
						<TouchableOpacity
							style={styles.box}
							onPress={() =>
								navigation.navigate("PayNavigation", {
									screen: "ViewLeads",
									params: { user: user },
								})
							}
						>
							<Feather name="users" size={20} color={COLORS.primary} />
							<Text
								style={{
									marginTop: 4,
									fontSize: 12,
									color: COLORS.black,
									textAlign: "center",
								}}
							>
								{"My Leads"}
							</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.box}
						onPress={() =>
							navigation.navigate("CustomerNavigation", {
								screen: "Customer",
								params: { user },
							})
						}
					>
						<Feather name="user-plus" size={20} color={COLORS.primary} />
						<Text
							style={{
								marginTop: 4,
								fontSize: 12,
								color: COLORS.black,
								textAlign: "center",
							}}
						>
							{"Add  Customers"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.box}
						onPress={() =>
							navigation.navigate("CustomerNavigation", {
								screen: "ViewEnrollments",
								params: { user },
							})
						}
					>
						<Feather name="user-check" size={20} color={COLORS.primary} />
						<Text
							style={{
								marginTop: 4,
								fontSize: 12,
								color: COLORS.black,
								textAlign: "center",
							}}
						>
							{"My   Customers"}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.boxContainer}>
					{agentInfo?.app_permission?.reports === "true" && (
						<TouchableOpacity
							style={styles.box}
							onPress={() =>
								navigation.navigate("PayNavigation", {
									screen: "Reports",
									params: { user: user },
								})
							}
						>
							<Feather name="bar-chart" size={20} color={COLORS.primary} />
							<Text style={styles.boxText}>Reports</Text>
						</TouchableOpacity>
					)}
					{agentInfo?.app_permission?.commission === "true" && (
						<TouchableOpacity
							style={styles.box}
							onPress={() => Alert.alert("Coming soon...")}
						>
							<Feather name="command" size={20} color={COLORS.primary} />
							<Text style={styles.boxText}>Commission</Text>
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.stock_container}>
					{/* <Text style={styles.stock_title}>My Tasks</Text> */}
					{/* <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.stocks}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {categories.map((category, index) => (
              <TasksList
                key={index}
                idx={index}
                text={`${category}`}
                cat_count={`${categories_count}`}
                sub_count={`${sub_categories_count}`}
                item_count={`${items_count}`}
              />
            ))}
          </ScrollView> */}
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	stock_container: {
		paddingTop: 40,
		paddingHorizontal: 5,
	},
	stock_title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	stocks: {
		marginTop: 10,
		maxHeight: 300,
	},
	scrollView: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 20,
		marginTop: 30,
		marginHorizontal: 16,
	},
	introContainer: {
		flex: 1,
		marginHorizontal: 22,
		marginTop: -25,
	},
	welcomeContainer: {
		marginVertical: 22,
	},
	welcomeText: {
		fontSize: 20,
		fontWeight: "bold",
		marginVertical: 22,
		color: COLORS.primary,
	},
	subWelcomeText: {
		fontSize: 14,
		fontWeight: "bold",
		marginTop: -20,
		color: COLORS.primary,
	},
	boxContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 20,
		paddingHorizontal: 0,
	},
	box: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.white,
		borderRadius: 10,
		width: 80,
		height: 80,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 1.84,
		elevation: 2,
	},
	boxText: {
		marginTop: 10,
		fontSize: 12,
		color: COLORS.black,
	},
	detailsContainer: {
		marginTop: 20,
	},
	detail: {
		fontSize: 14,
		color: COLORS.black,
		marginBottom: 10,
	},
});

export default Home;
