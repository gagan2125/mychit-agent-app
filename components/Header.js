import React from "react";
import { View, Image } from "react-native";
import COLORS from "../constants/color";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import navigation and route hooks

const Header = () => {
  const navigation = useNavigation(); // Access navigation object
  const route = useRoute(); // Access the current route

  const isHomeScreen = route.name === "Home"; // Check if current screen is Home

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {!isHomeScreen && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.black} />
        </TouchableOpacity>
      )}
      <Image
        source={require("../assets/hero1.jpg")}
        resizeMode="contain"
        style={{
          width: 35,
          height: 32,
        }}
      />
    </View>
  );
};

export default Header;
