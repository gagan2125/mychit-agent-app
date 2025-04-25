import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home";
import COLORS from "../constants/color";
import PaymentNavigator from "./PaymentNavigator";
import ProfileNavigator from "./ProfileNavigator";
import { enableScreens } from "react-native-screens";
enableScreens();

const Tab = createBottomTabNavigator();

const screenOptions = {
	tabBarShowLabel: false,
	headerShown: false,
	tabBarHideOnKeyboard: true,
	tabBarStyle: {
		position: "absolute",
		bottom: 0,
		right: 0,
		left: 0,
		elevation: 0,
		height: 60,
		backgroundColor: COLORS.white,
	},
};

const BottomNavigation = ({ route }) => {
	const { user, agentInfo } = route.params;

	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen
				name="Home"
				component={Home}
				initialParams={{ user, agentInfo }}
				options={{
					tabBarIcon: ({ focused }) => (
						<MaterialCommunityIcons
							name={focused ? "home" : "home-outline"}
							size={24}
							color={COLORS.black}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="PaymentNavigator"
				component={PaymentNavigator}
				initialParams={{ user, agentInfo }}
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "document" : "document-outline"}
							size={24}
							color={COLORS.black}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="ProfileNavigator"
				component={ProfileNavigator}
				initialParams={{ user, agentInfo }}
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={24}
							color={COLORS.black}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default BottomNavigation;
