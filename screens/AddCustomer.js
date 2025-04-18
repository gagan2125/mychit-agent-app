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

const AddCustomer = ({ route, navigation }) => {
	const { user, customer } = route.params;
	const [receipt, setReceipt] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedCustomerType, setSelectedCustomerType] = useState("chit");

	const [customerInfo, setCustomerInfo] = useState({
		full_name: "",
		phone_number: "",
		email: "",
		password: "",
		address: "",
		pincode: "",
		adhaar_no: "",
		pan_no: "",
	});
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

	const handleAddCustomer = async () => {
		setIsLoading(true);

		const baseUrl =
			selectedCustomerType === "chit" ? `${chitBaseUrl}` : `${goldBaseUrl}`;

		if (
			!customerInfo.full_name ||
			!customerInfo.phone_number ||
			!customerInfo.email ||
			!customerInfo.password ||
			!customerInfo.address ||
			!customerInfo.pincode ||
			!customerInfo.adhaar_no ||
			!selectedCustomerType
		) {
			Alert.alert("Required", "All fields must be valid and required. ");
			setIsLoading(false);
			return;
		}

		try {
			const data = {
				full_name: customerInfo.full_name,
				phone_number: customerInfo.phone_number,
				email: customerInfo.email,
				password: customerInfo.password,
				address: customerInfo.address,
				pincode: customerInfo.pincode,
				adhaar_no: customerInfo.adhaar_no,
				pan_no: customerInfo?.pan_no,
				// customer_type: selectedTicket === "chit" ? user.userId : receipt.name,
			};
			const response = await axios.post(`${baseUrl}/user/add-user`, data);
			if (response.status === 400) {
				ToastAndroid.show(
					"Customer Already Exists!",
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
			}
			if (response.status === 201) {
				// Alert.alert("Success", "Customer added successfully!");
				ToastAndroid.show(
					"Customer Added Successfully!",
					ToastAndroid.SHORT,
					ToastAndroid.CENTER
				);
				setCustomerInfo({
					full_name: "",
					phone_number: "",
					email: "",
					password: "",
					address: "",
					pincode: "",
					adhaar_no: "",
					pan_no: "",
				});
				setSelectedCustomerType("chit");
				navigation.navigate("EnrollCustomer", { user: user });
			} else {
				console.log("Error:", response.data);
			}
		} catch (error) {
			console.error("Error adding :", error);
			Alert.alert("Error adding Customer. Please try again.");
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
								Add Customer
							</Text>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("Customer", {
										user: user,
									})
								}
								style={{
									paddingHorizontal: 10,
									paddingVertical: 5,
									backgroundColor: "#3d3d3d",
									borderRadius: 5,
								}}
							>
								<Text style={{ color: "white", fontSize: 14 }}>
									My Customers
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.container}>
							<View style={styles.contentContainer}>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Full Name</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>

								<TextInput
									style={styles.textInput}
									placeholder="Enter Full Name"
									keyboardType="default"
									onChangeText={(value) => {
										if (value.length > 2) handleInputChange("full_name", value);
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Email</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>
								<TextInput
									style={styles.textInput}
									placeholder="Enter Email"
									keyboardType="email-address"
									onChangeText={(value) => {
										if (value.length > 2) {
											// /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
											// value.length <= 254
											handleInputChange("email", value);
										}
									}}
									phone_number
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Phone Number</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>

								<TextInput
									style={styles.textInput}
									placeholder="Enter Phone Number"
									keyboardType="number-pad"
									onChangeText={(value) => {
										if (value.length <= 10 && value.length > 0)
											handleInputChange("phone_number", value);
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Password</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>
								<TextInput
									style={styles.textInput}
									placeholder="Enter Password"
									keyboardType="number-pad"
									onChangeText={(value) => {
										if (value.length >= 4) handleInputChange("password", value);
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Pincode</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>
								<TextInput
									style={styles.textInput}
									placeholder="Enter Pincode"
									keyboardType="number-pad"
									onChangeText={(value) => {
										if (value.length > 2) handleInputChange("pincode", value);
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Phone Number</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>
								<TextInput
									style={styles.textInput}
									placeholder="Enter Adhaar Number"
									keyboardType="number-pad"
									onChangeText={(value) => {
										if (value.length > 2) {
											// /^\d{12}$/.test(value)
											handleInputChange("adhaar_no", value);
										}
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Pan Number</Text>
								</View>
								<TextInput
									style={styles.textInput}
									placeholder="Enter Pan Number"
									keyboardType="default"
									onChangeText={(value) => {
										handleInputChange("pan_no", value);
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Address</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>
								<TextInput
									style={styles.textInput}
									placeholder="Enter Address"
									keyboardType="default"
									onChangeText={(value) => {
										if (value.length > 2) handleInputChange("address", value);
									}}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ fontWeight: "bold" }}>Customer Type</Text>
									<Text style={{ fontWeight: "bold", color: "red" }}> *</Text>
								</View>
								<View style={styles.pickerContainer}>
									<Picker
										style={styles.picker}
										selectedValue={selectedCustomerType}
										onValueChange={(itemValue) => {
											setSelectedCustomerType(itemValue);
										}}
									>
										<Picker.Item label="Chit" value={"chit"} />
										<Picker.Item label="Gold Chit" value={"goldChit"} />
									</Picker>
								</View>
								<Button
									title={isLoading ? "Please wait..." : "Add Customer"}
									filled
									disabled={isLoading}
									style={{
										marginTop: 18,
										marginBottom: 4,
										backgroundColor: isLoading ? "gray" : COLORS.third,
									}}
									onPress={handleAddCustomer}
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

export default AddCustomer;
