import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import moment from "moment";

import COLORS from "../constants/color";
import Header from "../components/Header";
import Button from "../components/Button";
import baseUrl from "../constants/baseUrl";

const Payin = ({ route, navigation }) => {
	const { user, customer } = route.params;

	const [currentDate, setCurrentDate] = useState("");
	const [receipt, setReceipt] = useState({});
	const [paymentDetails, setPaymentDetails] = useState("cash");
	const [amount, setAmount] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [additionalInfo, setAdditionalInfo] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [customerInfo, setCustomerInfo] = useState({});
	const [groups, setGroups] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState("");
	const [selectedTicket, setSelectedTicket] = useState("");
	const [allData, setAllData] = useState([]);

	useEffect(() => {
		const fetchCustomer = async () => {
			try {
				const response = await axios.get(
					`${baseUrl}/user/get-user-by-id/${customer}`
				);
				if (response.data) {
					setCustomerInfo(response.data);
				} else {
					console.error("Unexpected API response format:", response.data);
				}
			} catch (error) {
				console.error("Error fetching customer data:", error);
			}
		};

		fetchCustomer();
	}, [customer]);

	useEffect(() => {
		const fetchEnrollDetails = async () => {
			try {
				const response = await axios.post(
					`${baseUrl}/enroll/get-user-tickets/${customer}`
				);

				setAllData(response.data);

				// Filter out null group_id and reduce to unique groups
				const uniqueGroups = response.data
					.filter((group) => group.group_id !== null) // Exclude entries with null group_id
					.reduce((acc, group) => {
						if (
							!acc.some(
								(g) => g.group_id.group_name === group.group_id.group_name
							)
						) {
							acc.push(group);
						}
						return acc;
					}, []);

				setGroups(uniqueGroups);
			} catch (error) {
				console.error("Error fetching customer data:", error);
			}
		};

		fetchEnrollDetails();
	}, [customer]);

	useEffect(() => {
		const today = moment().format("DD-MM-YYYY");
		setCurrentDate(today);
	}, []);

	useEffect(() => {
		const fetchReceipt = async () => {
			try {
				const response = await axios.get(
					`${baseUrl}/payment/get-latest-receipt`
				);

				setReceipt(response.data);
			} catch (error) {
				console.error("Error fetching customer data:", error);
			}
		};
		fetchReceipt();
	}, []);

	const handleGroupChange = (groupId) => {
		setSelectedGroup(groupId);
		setSelectedTicket("");

		if (groupId) {
			const groupTickets = allData
				.filter((item) => item.group_id && item.group_id._id === groupId) // Check for non-null group_id
				.map((item) => item.tickets);
			setTickets(groupTickets);
		} else {
			setTickets([]);
		}
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

	const handleAddPayment = async () => {
		// Validate mandatory fields before submission
		if (
			!customerInfo.full_name ||
			!selectedGroup ||
			!selectedTicket ||
			!currentDate ||
			!(receipt.receipt_no || receipt.receipt_no === 0) ||
			!paymentDetails ||
			!amount ||
			(additionalInfo !== "" && !transactionId)
		) {
			Alert.alert("Validation Error", "Please fill all mandatory fields.");
			return;
		}

		setIsLoading(true);
		try {
			const data = {
				user_id: customer,
				group_id: selectedGroup,
				ticket: selectedTicket,
				pay_date: new Date().toISOString().split("T")[0],
				receipt_no: receipt.receipt_no ? receipt.receipt_no.toString() : "",
				pay_type: paymentDetails,
				amount: amount,
				transaction_id: transactionId,
				collected_by: user.userId,
			};
			const response = await axios.post(`${baseUrl}/payment/add-payment`, data);
			if (response.status === 201) {
				Alert.alert("Success", "Payment added successfully!");
				navigation.navigate("Print", { store_id: response.data._id });
			} else {
				console.log("Error:", response.data);
			}
		} catch (error) {
			console.error("Error adding payment:", error);
			Alert.alert("Error adding payment. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (tickets.length === 1) {
			setSelectedTicket(tickets[0].toString());
		}
	}, [tickets]);

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
						<View style={{ marginTop: 30 }}>
							<Text style={{ fontWeight: "bold", fontSize: 18 }}>
								Add Payment
							</Text>
						</View>
						<View style={styles.container}>
							<View style={styles.contentContainer}>
								<Text style={styles.label}>
									Name<Text style={styles.star}>*</Text>
								</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Enter The Name"
									keyboardType="default"
									value={customerInfo.full_name}
									editable={false}
								/>
								<Text style={styles.label}>
									Group<Text style={styles.star}>*</Text>
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										selectedValue={selectedGroup}
										onValueChange={handleGroupChange}
										style={styles.picker}
									>
										<Picker.Item label="Select Group" value="" />
										{groups.map((group, index) => (
											<Picker.Item
												key={index}
												label={group.group_id.group_name}
												value={group.group_id._id}
											/>
										))}
									</Picker>
								</View>
								<Text style={styles.label}>
									Ticket<Text style={styles.star}>*</Text>
								</Text>
								<View style={styles.pickerContainer}>
									<Picker
										selectedValue={selectedTicket}
										onValueChange={(itemValue) => setSelectedTicket(itemValue)}
										style={styles.picker}
										enabled={selectedGroup !== ""}
									>
										<Picker.Item label="Select Ticket" value="" />
										{tickets.map((ticket, index) => (
											<Picker.Item
												key={index}
												label={`${ticket}`}
												value={ticket.toString()}
											/>
										))}
									</Picker>
								</View>
								<View style={styles.row}>
									<View style={styles.column}>
										<Text style={styles.label}>
											Date<Text style={styles.star}>*</Text>
										</Text>
										<TextInput
											style={styles.textInput}
											placeholder="Select Date"
											keyboardType="default"
											value={currentDate}
											editable={false}
										/>
									</View>
									<View style={styles.column}>
										<Text style={styles.label}>
											Receipt<Text style={styles.star}>*</Text>
										</Text>
										<TextInput
											style={styles.textInput}
											placeholder="Select Receipt"
											keyboardType="numeric"
											value={receipt.receipt_no ? receipt.receipt_no : ""}
											editable={false}
										/>
									</View>
								</View>
								<View style={styles.row}>
									<View style={styles.column}>
										<Text style={styles.label}>
											Payment Type<Text style={styles.star}>*</Text>
										</Text>
										<View style={styles.pickerContainer}>
											<Picker
												selectedValue={paymentDetails}
												onValueChange={(itemValues) =>
													handlePaymentTypeChange(itemValues)
												}
												style={styles.picker}
											>
												<Picker.Item label="Cash" value="cash" />
												<Picker.Item label="Online" value="online" />
											</Picker>
										</View>
									</View>
									<View style={styles.column}>
										<Text style={styles.label}>
											Amount<Text style={styles.star}>*</Text>
										</Text>
										<TextInput
											style={styles.textInput}
											placeholder="Enter The Amount"
											keyboardType="numeric"
											value={amount}
											onChangeText={(value) => setAmount(value)}
										/>
									</View>
								</View>
								{additionalInfo !== "" && (
									<>
										<Text style={styles.label}>
											{additionalInfo}
											<Text style={styles.star}>*</Text>
										</Text>
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
									title={isLoading ? "Please wait..." : "Add Payment"}
									filled
									disabled={isLoading}
									style={{
										marginTop: 18,
										marginBottom: 4,
										backgroundColor: isLoading ? "gray" : COLORS.third,
									}}
									onPress={handleAddPayment}
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
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	picker: {
		height: 40,
		width: "100%",
	},
	label: {
		fontWeight: "bold",
		marginTop: 10,
	},
	star: {
		color: "red",
	},
});

export default Payin;
