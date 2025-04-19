import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import COLORS from "../constants/color";
import Header from "../components/Header";
import Button from "../components/Button";
import chitBaseUrl from "../constants/baseUrl";
import goldBaseUrl from "../constants/goldBaseUrl";
import { Picker } from "@react-native-picker/picker";

const EnrollCustomer = ({ route, navigation }) => {
	const { user, customer } = route.params;
	const [receipt, setReceipt] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedCustomerType, setSelectedCustomerType] = useState("chits");
	const [agentCustomers, setAgentCustomers] = useState([]);
	const [groups, setGroups] = useState([]);
	const [availableTickets, setAvailableTickets] = useState([]);
	const baseUrl =
		selectedCustomerType === "chits" ? `${chitBaseUrl}` : `${goldBaseUrl}`;
	const [formFields, setFormFields] = useState({
		user_id: "",
		group_id: "",
		no_of_tickets: "",
		tickets: "",
	});
	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await axios.get(`${baseUrl}/group/get-group`);
				if (response.status >= 400) throw new Error("Something went wrong!");
				setGroups(response.data);
			} catch (err) {
				console.error("Failed to load Group Data");
			}
		};
		fetchGroups();
	}, [selectedCustomerType]);
	useEffect(() => {
		const fetchAgentUsers = async () => {
			try {
				const response = await axios.get(`${baseUrl}/user/get-user`);
				if (response.status >= 400) throw new Error("Something went wrong");
				setAgentCustomers(response.data);
			} catch (err) {
				console.error("Failed to load Customers Data");
			}
		};
		fetchAgentUsers();
	}, [selectedCustomerType]);
	useEffect(() => {
		const fetchReceipt = async () => {
			try {
				const response = await axios.get(
					`${chitBaseUrl}/agent/get-agent-by-id/${user.userId}`
				);
				setReceipt(response.data);
			} catch (error) {
				console.error("Error fetching agent data:", error);
			}
		};
		fetchReceipt();
	}, []);
	const handleCancel = () => {
		Alert.alert("Confirmation", "Are you sure you want to Close?", [
			{
				text: "No",
			},
			{
				text: "Yes",
				onPress: () => {
					navigation.navigate("Home", { user: user });
				},
			},
		]);
	};
	const handleInputChange = async (field, value) => {
		setFormFields({ ...formFields, [field]: value });
		if (field === "group_id") {
			try {
				const response = await axios.post(
					`${baseUrl}/enroll/get-next-tickets/${value}`
				);
				if (response.status >= 400)
					throw new Error("Failed to fetch available tickets");
				setAvailableTickets(response.data.availableTickets);
			} catch (err) {
				console.error("Error fetching next tickets");
			}
		}
	};

	const handleEnrollCustomer = async () => {
		if (!formFields.no_of_tickets || isNaN(formFields.no_of_tickets)) {
			ToastAndroid.showWithGravity(
				"Number of tickets cannot be empty or zero.",
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
			return;
		}
		if (Number(formFields.no_of_tickets) > availableTickets.length) {
			ToastAndroid.showWithGravity(
				"Number of Tickets is more than available tickets.",
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
			return;
		}
		if (
			!formFields.user_id ||
			!formFields.group_id ||
			!formFields.no_of_tickets
		) {
			Alert.alert("Required", "Please fill out all fields!");
			return;
		}

		const { no_of_tickets, group_id, user_id } = formFields;
		const ticketsCount = parseInt(no_of_tickets, 10);
		setIsLoading(true);
		const ticketEntries = availableTickets
			.slice(0, ticketsCount)
			.map((ticketNumber) => ({
				group_id,
				user_id,
				no_of_tickets,
				tickets: ticketNumber,
			}));
		try {
			for (const ticketEntry of ticketEntries) {
				ticketEntry.agent = user.userId;
				await axios.post(`${baseUrl}/enroll/add-enroll`, ticketEntry);
			}
			ToastAndroid.show("Customer Enrolled Successfully!", ToastAndroid.SHORT);
			setFormFields({
				group_id: "",
				user_id: "",
				no_of_tickets: "",
			});
			navigation.replace("BottomNavigation", { user: { ...user } });
		} catch (error) {
			console.error("Error adding :", error);
			Alert.alert("Error Enrolling Customer. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
			>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
								Add Enrollment
							</Text>
							<TouchableOpacity
								onPress={handleCancel}
								style={{
									paddingHorizontal: 10,
									paddingVertical: 5,
									backgroundColor: COLORS.primary,
									borderRadius: 5,
								}}
							>
								<Text style={{ color: "white", fontSize: 14 }}>Skip</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.container}>
							<View style={styles.contentContainer}>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Customer Type
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										style={styles.picker}
										selectedValue={selectedCustomerType}
										onValueChange={(value) => setSelectedCustomerType(value)}
									>
										<Picker.Item label="Chits" value={"chits"} />
										<Picker.Item label="Gold Chits" value={"goldChit"} />
									</Picker>
								</View>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Groups
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										style={styles.picker}
										selectedValue={formFields.group_id}
										onValueChange={(value) =>
											handleInputChange("group_id", value)
										}
									>
										<Picker.Item label="Select Group" value={""} />
										{groups.map((group) => (
											<Picker.Item
												label={`${group?.group_name}`}
												value={group._id}
											/>
										))}
									</Picker>
								</View>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Customer
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										style={styles.picker}
										selectedValue={formFields.user_id}
										onValueChange={(value) =>
											handleInputChange("user_id", value)
										}
									>
										<Picker.Item label="Select Customer" value={""} />
										{agentCustomers.map((customer) => (
											<Picker.Item
												label={`${customer.full_name}`}
												value={customer._id}
											/>
										))}
									</Picker>
								</View>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Number of Tickets
								</Text>
								<TextInput
									placeholder="Enter Number of Tickets"
									style={styles.textInput}
									value={formFields.no_of_tickets}
									keyboardType="number-pad"
									onChangeText={(value) =>
										handleInputChange("no_of_tickets", value)
									}
								/>
								{formFields.group_id && (
									<Text
										style={{
											textAlign: "center",
											fontWeight: "bold",
											color: availableTickets.length > 0 ? "blue" : "red",
										}}
									>
										{availableTickets.length > 0
											? `Only ${availableTickets.length} tickets left`
											: "Group is Full"}
									</Text>
								)}
								<Button
									title={isLoading ? "Please wait..." : "Enroll Customer"}
									filled
									disabled={isLoading}
									style={{
										marginTop: 18,
										marginBottom: 4,
										backgroundColor: isLoading ? "gray" : COLORS.third,
									}}
									onPress={handleEnrollCustomer}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
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
});

export default EnrollCustomer;
