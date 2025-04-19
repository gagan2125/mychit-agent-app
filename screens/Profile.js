// screens/Profile.js
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";
import Header from "../components/Header";
import COLORS from "../constants/color";
import axios from "axios";
import baseUrl from "../constants/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ route, navigation }) => {
	const { user } = route.params;
	const [form, setForm] = useState({
		darkMode: false,
		emailNotifications: true,
		pushNotifications: false,
	});
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
		};

		fetchAgent();
	}, []);

	const removeUserLocalStorage = async () => {
		try {
			await AsyncStorage.clear();
		} catch (err) {
			console.log("failed to remove user from localstorage");
		}
	};
	const handleLogout = () => {
		removeUserLocalStorage();
		navigation.navigate("Login", { user });
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<View style={{ marginHorizontal: 22, marginTop: 12 }}>
				<Header />
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>Profile</Text>
						{/* <Text style={styles.headerSubtitle}>
              Manage your Account, Tickets & Queries
            </Text> */}
					</View>
					<ScrollView
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 180 }}
					>
						<View style={styles.profile}>
							<Image
								alt=""
								source={{
									uri: "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=",
								}}
								style={styles.profileAvatar}
							/>
							<Text style={styles.profileName}>
								{agent.name} - {agent.phone_number}
							</Text>
							{/* <Text style={styles.profileEmail}>digitory@gmail.com</Text> */}
							{/* <TouchableOpacity onPress={() => { }}>
                <View style={styles.profileAction}>
                  <Text style={styles.profileActionText}>Edit Profile</Text>
                  <FeatherIcon color="#fff" name="edit" size={16} />
                </View>
              </TouchableOpacity> */}
						</View>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Account</Text>
							<View style={styles.sectionBody}>
								<View style={[styles.rowWrapper, styles.rowFirst]}>
									<TouchableOpacity
										onPress={() => {
											/* handle onPress */
										}}
										style={styles.row}
									>
										<View
											style={[
												styles.rowIcon,
												{ backgroundColor: COLORS.third },
											]}
										>
											<FeatherIcon color="#fff" name="globe" size={20} />
										</View>
										<Text style={styles.rowLabel}>Language</Text>
										<View style={styles.rowSpacer} />
										<Text style={styles.rowValue}>English</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.rowWrapper}>
									<TouchableOpacity
										onPress={() => navigation.navigate("PaymentNavigator")}
										style={styles.row}
									>
										<View
											style={[
												styles.rowIcon,
												{ backgroundColor: COLORS.third },
											]}
										>
											<FeatherIcon color="#fff" name="file-plus" size={20} />
										</View>
										<Text style={styles.rowLabel}>Collections</Text>
										<View style={styles.rowSpacer} />
										<FeatherIcon
											color="#C6C6C6"
											name="chevron-right"
											size={20}
										/>
									</TouchableOpacity>
								</View>
								<View style={styles.rowWrapper}>
									<TouchableOpacity
										onPress={() =>
											navigation.navigate("PayNavigation", { user: user })
										}
										style={styles.row}
									>
										<View
											style={[
												styles.rowIcon,
												{ backgroundColor: COLORS.third },
											]}
										>
											<FeatherIcon color="#fff" name="shield" size={20} />
										</View>
										<Text style={styles.rowLabel}>Payments</Text>
										<View style={styles.rowSpacer} />
										<FeatherIcon
											color="#C6C6C6"
											name="chevron-right"
											size={20}
										/>
									</TouchableOpacity>
								</View>
								<View style={styles.rowWrapper}>
									<TouchableOpacity
										onPress={() =>
											navigation.navigate("PayNavigation", {
												screen: "ViewLeads",
												params: { user: user },
											})
										}
										style={styles.row}
									>
										<View
											style={[
												styles.rowIcon,
												{ backgroundColor: COLORS.third },
											]}
										>
											<FeatherIcon color="#fff" name="shield" size={20} />
										</View>
										<Text style={styles.rowLabel}>Leads</Text>
										<View style={styles.rowSpacer} />
										<FeatherIcon
											color="#C6C6C6"
											name="chevron-right"
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>
							<Text style={styles.sectionTitle}>General</Text>
							<View style={styles.sectionBody}>
								<View style={[styles.rowWrapper, styles.rowFirst]}>
									<TouchableOpacity
										onPress={() => {
											/* handle onPress */
										}}
										style={styles.row}
									>
										<View
											style={[
												styles.rowIcon,
												{ backgroundColor: COLORS.third },
											]}
										>
											<FeatherIcon color="#fff" name="help-circle" size={20} />
										</View>
										<Text style={styles.rowLabel}>Help & Support</Text>
										<View style={styles.rowSpacer} />
										<Text style={styles.rowValue}>FAQ</Text>
										<FeatherIcon
											color="#C6C6C6"
											name="chevron-right"
											size={20}
										/>
									</TouchableOpacity>
								</View>
								<View style={styles.rowWrapper}>
									<TouchableOpacity
										onPress={() => {
											/* handle onPress */
										}}
										style={styles.row}
									>
										<View
											style={[
												styles.rowIcon,
												{ backgroundColor: COLORS.third },
											]}
										>
											<FeatherIcon color="#fff" name="book-open" size={20} />
										</View>
										<Text style={styles.rowLabel}>About MyChits</Text>
										<View style={styles.rowSpacer} />
										<Text style={styles.rowValue}>T&C, Policy</Text>
										<FeatherIcon
											color="#C6C6C6"
											name="chevron-right"
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>
							<TouchableOpacity onPress={handleLogout}>
								<View style={styles.profileAction}>
									<Text style={styles.profileActionText}>Logout</Text>
									<FeatherIcon color="#fff" name="log-out" size={16} />
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		paddingHorizontal: 0,
		flexGrow: 1,
		flexShrink: 1,
	},
	contentFooter: {
		marginTop: 24,
		fontSize: 13,
		fontWeight: "500",
		color: "#929292",
		textAlign: "center",
	},
	header: {
		paddingHorizontal: 14,
		marginBottom: 12,
		marginTop: 20,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1d1d1d",
	},
	headerSubtitle: {
		fontSize: 12,
		fontWeight: "500",
		color: "#929292",
		marginTop: 6,
	},
	profile: {
		padding: 12,
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#e3e3e3",
	},
	profileAvatar: {
		width: 60,
		height: 60,
		borderRadius: 9999,
	},
	profileName: {
		marginTop: 12,
		fontSize: 16,
		fontWeight: "600",
		color: "#090909",
	},
	profileEmail: {
		marginTop: 6,
		fontSize: 12,
		fontWeight: "400",
		color: "#848484",
	},
	profileAction: {
		marginTop: 10,
		paddingVertical: 8,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.primary,
		borderRadius: 12,
	},
	profileActionText: {
		marginRight: 8,
		fontSize: 15,
		fontWeight: "600",
		color: "#fff",
	},
	section: {
		paddingTop: 0,
	},
	sectionTitle: {
		marginVertical: 6,
		marginHorizontal: 0,
		fontSize: 12,
		fontWeight: "600",
		color: "#a7a7a7",
		textTransform: "uppercase",
		letterSpacing: 1.2,
	},
	sectionBody: {
		paddingLeft: 14,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#e3e3e3",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingRight: 16,
		height: 50,
	},
	rowWrapper: {
		borderTopWidth: 1,
		borderColor: "#e3e3e3",
	},
	rowFirst: {
		borderTopWidth: 0,
	},
	rowIcon: {
		width: 30,
		height: 30,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	rowLabel: {
		fontSize: 15,
		fontWeight: "500",
		color: "#000",
	},
	rowSpacer: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
	},
	rowValue: {
		fontSize: 12,
		fontWeight: "500",
		color: "#8B8B8B",
		marginRight: 4,
	},
});

export default Profile;
