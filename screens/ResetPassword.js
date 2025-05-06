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

export default function ResetPassword({ route, navigation }) {
  const { mobile } = route.params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/agent/reset-password`, {
        phone_number: mobile,
        password: password,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Password reset successfully.");
        navigation.navigate("Login"); // Redirect to Login
      } else {
        Alert.alert("Error", response.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Failed to reset password.");
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
        <Text style={styles.welcomeText}>Reset Password</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create New Password</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={COLORS.black}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your new password"
            placeholderTextColor={COLORS.black}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Login</Text>
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
