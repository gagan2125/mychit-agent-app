import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import COLORS from "../constants/color";
import baseUrl from "../constants/baseUrl";

const { width, height } = Dimensions.get("window");

export default function ForgotPassword({ navigation }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // To track if OTP has been sent

  // Validate phone number before sending OTP
  const validatePhoneNumber = () => {
    const isValid = phone.length === 10;
    if (!isValid) {
      Alert.alert("Validation Error", "Please enter a valid phone number.");
    }
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!validatePhoneNumber()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/agent/forgot-password`, {
        phone_number: phone,
      });

      if (response.status === 200) {
        Alert.alert("Success", "OTP has been sent to your phone.");
        setIsOtpSent(true); // OTP sent, show OTP input field
      } else {
        Alert.alert("Error", response.status || "Something went wrong.");
      }
    } catch (error) {
      console.error("Network Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Validation Error", "Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/agent/verify-otp`, {
        phone_number: phone,
        otp: otp,
      });

      if (response.status === 200) {
        Alert.alert("Success", "OTP verified.");
        navigation.navigate("ResetPassword", { mobile: phone }); // Redirect to NewPassword screen
      } else {
        Alert.alert("Error", "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Invalid OTP or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["#432F92", "#F7A906"]}
      start={{ x: 2, y: 0 }}
      end={{ x: 2, y: 0.6 }}
    >
      <View style={styles.topContainer}>
        <Text style={styles.welcomeText}>Forgot Password</Text>
      </View>

      <View style={styles.card}>
        {!isOtpSent ? (
          <>
            <Text style={styles.title}>Enter Phone Number</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.black}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Pressable
              style={styles.button}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Enter OTP</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor={COLORS.black}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
              />
            </View>

            <Pressable
              style={styles.button}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </Pressable>
          </>
        )}

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back to Login</Text>
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
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    position: "absolute",
    top: height * 0.25,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FCFCDF",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 90,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 5,
    color: "#322383",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingLeft: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#322383",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#322383",
    marginTop: 15,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
