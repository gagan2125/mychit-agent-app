import {
	View,
	Text,
	FlatList,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	ActivityIndicator,
	Linking,
	Alert,
	Pressable,
} from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import COLORS from "../constants/color";
import Header from "../components/Header";
import baseUrl from "../constants/baseUrl";
import { Feather } from "@expo/vector-icons";
const sendWhatsappMessage = async (item) => {
	if (item?.phone_number) {
		let url = `whatsapp://send?phone=${
			item.phone_number
		}&text=${encodeURIComponent(whatsappMessage)}`;

		Linking.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					return Linking.openURL(url);
				} else {
					Alert.alert("WhatsApp is not installed");
				}
			})
			.catch((err) => console.error("An error occurred", err));
	}
};
const openDialer = (item) => {
	if (item.phone_number) {
		Linking.canOpenURL(`tel:${item.phone_number}`)
			.then((supported) => {
				if (supported) {
					Linking.openURL(`tel:${item.phone_number}`);
				}
			})
			.catch((err) => {
				Alert.alert("Somthing went wrong!");
			});
	}
};
const sendEmail = async (item) => {
	if (item?.email) {
		Linking.canOpenURL(`mailto:${item.email}`)
			.then((supported) => {
				if (supported) {
					Linking.openURL(`mailto:${item.email}`);
				} else {
					Alert.alert("Mail service is not installed");
				}
			})
			.catch((err) => {
				Alert.alert("Something went wrong!");
			});
	}
};
const ViewCustomers = ({ route, navigation }) => {
	const { user } = route.params;
	const [chitCustomerLength, setChitCustomerLength] = useState(0);
	const [goldCustomerLength, setGoldCustomerLength] = useState(0);
	const [isChitLoading, setIsChitLoading] = useState(false);
	const [isGoldLoading, setIsGoldLoading] = useState(false);
	const [customers, setCustomer] = useState([]);
	const [activeTab, setActiveTab] = useState("CHIT");

	const handleTelephone = () => {};
	const handleEmail = () => {};
	useEffect(() => {
		console.log(user, "this is user");
		const fetchCustomers = async () => {
			const currentUrl =
				activeTab === "CHIT" ? `${baseUrl}` : "http://13.60.68.201:3000/api";
			try {
				activeTab === "CHIT" ? setIsChitLoading(true) : setIsGoldLoading(true);
				const response = await axios.get(
					`${currentUrl}/user/get-users-by-agent-id/${user.userId}`
				);
				if (response.status >= 400)
					throw new Error("Failed to fetch Customer Data");
				setCustomer(response.data);
				activeTab === "CHIT"
					? setChitCustomerLength(response?.data?.length)
					: setGoldCustomerLength(response?.data?.length);
			} catch (err) {
				console.log(err, "error");
				setCustomer([]);
			} finally {
				activeTab === "CHIT"
					? setIsChitLoading(false)
					: setIsGoldLoading(false);
			}
		};
		fetchCustomers();
	}, [activeTab, user]);

	const renderCustomerCard = ({ item }) => (
		<TapGestureHandler
			numberOfTaps={2}
			onActivated={() => {
				sendWhatsappMessage(item);
			}}
		>
			<View style={styles.card}>
				<View style={styles.leftSection}>
					<Text style={styles.name}>{item?.full_name || "No Name"}</Text>
					<TouchableOpacity onPress={() => sendEmail(item)}>
						<Text style={styles.groupName}>{item?.email || "No Email"}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.rightSection}>
					<Text style={styles.schemeType}>
						{activeTab[0] + activeTab?.slice(1).toLowerCase()}
					</Text>
					<TouchableOpacity
						onPress={() => {
							openDialer(item);
						}}
					>
						<Text style={styles.phoneNumber}>
							{item.phone_number || "No Mob Number"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</TapGestureHandler>
	);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
			>
				<View style={{ flexGrow: 1 }}>
					<View style={{ marginHorizontal: 22, marginTop: 12, flex: 1 }}>
						<Header />
						<View
							style={{
								marginTop: 30,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Text style={{ fontWeight: "bold", fontSize: 18 }}>
								Customers
							</Text>
							<Text style={{ fontWeight: "bold", fontSize: 18 }}>
								{(chitCustomerLength + goldCustomerLength) | 0}
							</Text>
						</View>

						<View style={styles.container}>
							<View style={styles.tabContainer}>
								<TouchableOpacity
									style={[styles.tab, activeTab === "CHIT" && styles.activeTab]}
									onPress={() => setActiveTab("CHIT")}
								>
									<Text
										style={[
											styles.tabText,
											activeTab === "CHIT" && styles.activeTabText,
										]}
									>
										Chits {chitCustomerLength || 0}
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.tab, activeTab === "GOLD" && styles.activeTab]}
									onPress={() => setActiveTab("GOLD")}
								>
									<Text
										style={[
											styles.tabText,
											activeTab === "GOLD" && styles.activeTabText,
										]}
									>
										Gold Chits {goldCustomerLength || 0}
									</Text>
								</TouchableOpacity>
							</View>

							{activeTab === "CHIT" ? (
								isChitLoading ? (
									<ActivityIndicator
										size="large"
										color="#000"
										style={{ marginTop: 20 }}
									/>
								) : chitCustomerLength === 0 ? (
									<Text style={styles.noLeadsText}>
										No Chit Customers found
									</Text>
								) : (
									<FlatList
										data={customers}
										keyExtractor={(item, index) => index.toString()}
										renderItem={renderCustomerCard}
									/>
								)
							) : isGoldLoading ? (
								<ActivityIndicator
									size="large"
									color="#000"
									Chits
									style={{ marginTop: 20 }}
								/>
							) : goldCustomerLength === 0 ? (
								<Text style={styles.noLeadsText}>No gold Customers found</Text>
							) : (
								<FlatList
									data={customers}
									keyExtractor={(item, index) => index.toString()}
									renderItem={renderCustomerCard}
								/>
							)}
						</View>
					</View>
				</View>
				<TouchableOpacity
					onPress={() => navigation.navigate("AddCustomer", { user: user })}
					style={{
						position: "absolute",
						bottom: 20,
						right: 20,
						backgroundColor: COLORS.primary,
						borderRadius: 30,
						width: 60,
						height: 60,
						justifyContent: "center",
						alignItems: "center",
						elevation: 5,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.3,
						shadowRadius: 3,
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 12,
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						<Feather name="user-plus" size={20} />
					</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 0,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	column: {
		flex: 1,
		marginHorizontal: 3,
	},
	textInput: {
		height: 40,
		width: "100%",
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginVertical: 10,
		color: "#000",
	},
	contentContainer: {
		marginTop: 20,
	},
	pickerContainer: {
		borderColor: COLORS.lightGray,
		borderWidth: 1,
		borderRadius: 8,
		backgroundColor: COLORS.white,
		marginTop: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	picker: {
		height: 40,
		width: "100%",
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		marginTop: 20,
	},
	tabContainer: {
		flexDirection: "row",
		backgroundColor: "#fff",
		marginBottom: 10,
		elevation: 0,
		backgroundColor: "#f4f4f4",
	},
	tab: {
		flex: 1,
		paddingVertical: 10,
		justifyContent: "center",

		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "transparent",
	},
	activeTab: {
		borderBottomColor: COLORS.primary,
		backgroundColor: "#fff0db",
	},
	tabText: {
		fontSize: 16,
		color: "#666",
		fontWeight: "500",
		textAlign: "center",
	},
	activeTabText: {
		color: COLORS.primary,
	},
	card: {
		backgroundColor: "#fff",
		flexDirection: "row",
		padding: 15,
		marginHorizontal: 5,
		marginVertical: 5,
		borderRadius: 8,
		elevation: 2,
	},
	leftSection: {
		flex: 1,
	},
	rightSection: {
		alignItems: "flex-end",
	},
	name: {
		fontSize: 16,
		fontWeight: "600",
		color: "#000",
		marginBottom: 15,
	},
	groupName: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},
	schemeType: {
		fontSize: 14,
		color: "#000",
		fontWeight: "500",
		marginBottom: 15,
	},
	phoneNumber: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},
	noLeadsText: {
		textAlign: "center",
		marginTop: 20,
		fontSize: 16,
		color: "#666",
	},
});

export default ViewCustomers;
