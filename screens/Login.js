import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/color";
import Button from "../components/Button";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import baseUrl from "../constants/baseUrl";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const { width, height } = Dimensions.get("window");

export default function Login({ navigation }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert(
        "Validation Error",
        "Please enter both mobile number and password."
      );
      return;
    }
    try {
      const cleanedPassword = password.replace(/\s/g, "");
      const response = await fetch(`${baseUrl}/agent/login-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ phone_number: mobile, password: password }),
      });
      const data = await response.json();
      if (response.ok) {
        // await AsyncStorage.setItem("user", JSON.stringify(data));
        const agentDetail = await axios.get(
          `${baseUrl}/agent/get-agent-by-id/${data.userId}`
        );
        navigation.navigate("BottomNavigation", {
          user: data,
          agentInfo: agentDetail?.data,
        });
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error(error);
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
        <Text style={styles.welcomeText}>Welcome Agent</Text>
        <Image
          source={require("../assets/login-image.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. 8765349076"
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="***************"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordShown ? "eye-off" : "eye"}
                size={24}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text
            style={{
              color: "#322383",
              marginTop: 15,
              textDecorationLine: "underline",
              fontWeight: "bold",
            }}
          >
            Forgot Password?
          </Text>
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
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    top: height * 0.25,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
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
    alignSelf: "flex-start", // Aligns to left
  },
});
