import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Routes from "../screens/Routes";

import { enableScreens } from "react-native-screens";
import ViewCustomers from "../screens/ViewCustomer";
import AddCustomer from "../screens/AddCustomer";
import EnrollCustomer from "../screens/EnrollCustomer";

enableScreens();

const stack = createNativeStackNavigator();

const CustomerNavigation = ({ route }) => {
	const { user } = route.params;

	return (
		<stack.Navigator>
			<stack.Screen
				name="Customer"
				component={ViewCustomers}
				initialParams={{ user }}
				options={{ headerShown: false }}
			/>
			<stack.Screen
				name="AddCustomer"
				component={AddCustomer}
				initialParams={{ user }}
				options={{ headerShown: false }}
			/>
			<stack.Screen
				name="EnrollCustomer"
				component={EnrollCustomer}
				initialParams={{ user }}
				options={{ headerShown: false }}
			/>
		</stack.Navigator>
	);
};

export default CustomerNavigation;
