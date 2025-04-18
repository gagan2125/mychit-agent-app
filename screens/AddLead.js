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
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import moment from "moment";

import COLORS from "../constants/color";
import Header from "../components/Header";
import Button from "../components/Button";
import chitBaseUrl from "../constants/baseUrl";
import goldBaseUrl from "../constants/goldBaseUrl";

const AddLead = ({ route, navigation }) => {
	const { user, customer } = route.params;

	const [currentDate, setCurrentDate] = useState("");
	const [receipt, setReceipt] = useState({});
	const [paymentDetails, setPaymentDetails] = useState("");
	const [amount, setAmount] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [additionalInfo, setAdditionalInfo] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [customerInfo, setCustomerInfo] = useState({
		full_name: "",
		phone_number: "",
		profession: "",
	});

	const [groups, setGroups] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState("");
	const [selectedTicket, setSelectedTicket] = useState("");
	const [selectedProfession, setSelectedProfession] = useState("");
	const [allData, setAllData] = useState([]);

	useEffect(() => {
		const fetchGroups = async () => {
			const currentUrl =
				selectedTicket === "chit" ? `${chitBaseUrl}` : `${goldBaseUrl}`;

			try {
				const response = await axios.get(`${currentUrl}/group/get-group`);
				if (response.data) {
					setGroups(response.data || []);
				} else {
					console.error("No data in response");
				}
			} catch (error) {
				console.error("Error fetching groups:", error.message);
			}
		};

		if (selectedTicket) {
			fetchGroups();
		}
	}, [selectedTicket]);

	console.log(selectedProfession);

	useEffect(() => {
		const today = moment().format("DD-MM-YYYY");
		setCurrentDate(today);
	}, []);

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

	const handleInputChange = (field, value) => {
		setCustomerInfo({ ...customerInfo, [field]: value });
	};

	const handleGroupChange = (value) => {
		const selectedGroup = groups.find((group) => group._id === value);
		setSelectedGroup(selectedGroup || { _id: "", group_name: "" });
	};

	const handlePaymentTypeChange = (type) => {
		setPaymentDetails(type);
		if (type === "online") {
			setAdditionalInfo("Transaction ID");
		} else if (type === "cheque") {
			setAdditionalInfo("Cheque Number");
		} else {
			setAdditionalInfo("");
		}
	};

	const handleAddLead = async () => {
		setIsLoading(true);
		const baseUrl =
			selectedTicket === "chit" ? `${chitBaseUrl}` : `${goldBaseUrl}`;

		if (
			!customerInfo.full_name ||
			!customerInfo.phone_number ||
			!selectedTicket ||
			!selectedGroup
		) {
			Alert.alert("Required", "Please fill out all fields!");
			setIsLoading(false);
			return;
		}

		try {
			const data = {
				lead_name: customerInfo.full_name,
				lead_phone: customerInfo.phone_number,
				lead_profession: selectedProfession,
				group_id: selectedGroup._id,
				lead_type: "agent",
				scheme_type: selectedTicket,
				lead_agent: selectedTicket === "chit" ? user.userId : receipt.name,
				agent_number: receipt.phone_number,
			};

			const response = await axios.post(`${baseUrl}/lead/add-lead`, data);

			if (response.status === 201) {
				Alert.alert("Success", "Lead added successfully!");
				setCustomerInfo({
					full_name: "",
					phone_number: "",
					profession: "",
				});
				setSelectedGroup("");
				setSelectedTicket("");
				navigation.navigate("ViewLeads", { user: user });
			} else {
				console.log("Error:", response.data);
			}
		} catch (error) {
			console.error("Error adding lead:", error);
			Alert.alert("Error adding lead. Please try again.");
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
							<Text style={{ fontWeight: "bold", fontSize: 18 }}>Add Lead</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate("ViewLeads", { user: user })}
								style={{
									paddingHorizontal: 10,
									paddingVertical: 5,
									backgroundColor: "#3d3d3d",
									borderRadius: 5,
								}}
							>
								<Text style={{ color: "white", fontSize: 14 }}>My Leads</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.container}>
							<View style={styles.contentContainer}>
								<Text style={{ fontWeight: "bold" }}>Name</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Enter The Name"
									keyboardType="default"
									value={customerInfo.full_name}
									onChangeText={(value) =>
										handleInputChange("full_name", value)
									}
								/>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Phone Number
								</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Enter The Phone Number"
									keyboardType="number-pad"
									value={customerInfo.phone_number}
									onChangeText={(value) => {
										if (/^\d*$/.test(value) && value.length <= 10) {
											handleInputChange("phone_number", value);
										}
									}}
								/>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Work/Profession
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										selectedValue={selectedProfession}
										onValueChange={(itemValue) =>
											setSelectedProfession(itemValue)
										}
										style={styles.picker}
									>
										<Picker.Item label="Select Work/Profession" value="" />
										<Picker.Item label="Employed" value="employed" />
										<Picker.Item label="Self Employed" value="self_employed" />
									</Picker>
								</View>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>
									Scheme Type
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										selectedValue={selectedTicket}
										onValueChange={(itemValue) => setSelectedTicket(itemValue)}
										style={styles.picker}
									>
										<Picker.Item label="Select Scheme Type" value="" />
										<Picker.Item label="Chits" value="chit" />
										<Picker.Item label="Gold Chits" value="gold" />
									</Picker>
								</View>
								<Text style={{ fontWeight: "bold", marginTop: 10 }}>Group</Text>
								<View style={styles.pickerContainer}>
									<Picker
										selectedValue={selectedGroup._id}
										onValueChange={handleGroupChange}
										style={styles.picker}
									>
										<Picker.Item label="Select Group" value="" />
										{groups.map((group, index) => (
											<Picker.Item
												key={index}
												label={group.group_name}
												value={group._id}
											/>
										))}
									</Picker>
								</View>
								{additionalInfo !== "" && (
									<>
										<Text style={{ fontWeight: "bold" }}>{additionalInfo}</Text>
										<TextInput
											style={styles.textInput}
											placeholder={`Enter ${additionalInfo}`}
											keyboardType="default"
											value={transactionId}
											onChangeText={(value) => setTransactionId(value)}
										/>
									</>
								)}
								<Button
									title={isLoading ? "Please wait..." : "Add Lead"}
									filled
									style={{
										marginTop: 18,
										marginBottom: 4,
										backgroundColor: isLoading ? "gray" : COLORS.third,
									}}
									onPress={handleAddLead}
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

export default AddLead;
