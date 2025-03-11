// screens/ItemList.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Routes from "../screens/Routes";
import RouteCustomerChit from "../screens/RouteCustomerChit";
import RouteCustomerGold from "../screens/RouteCustomerGold";
import Payin from "../screens/Payin";
import { enableScreens } from 'react-native-screens';
import Print from "../screens/Print";
import GoldPayin from "../screens/GoldPayin";
import GoldPrint from "../screens/GoldPrint";
import PaymentList from "../screens/PaymentList";
import ChitPayments from "../screens/ChitPayments";
import GoldPayments from "../screens/GoldPayments";
import AddLead from "../screens/AddLead";
import ViewLeads from "../screens/ViewLeads";
import Reports from "../screens/Reports";
enableScreens();

const stack = createNativeStackNavigator();

const PayNavigation = ({ route }) => {
  const { user } = route.params;

  return (
    <stack.Navigator>
      <stack.Screen
        name="PaymentList"
        component={PaymentList}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="ChitPayment"
        component={ChitPayments}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="GoldPayment"
        component={GoldPayments}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="AddLead"
        component={AddLead}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="ViewLeads"
        component={ViewLeads}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="Reports"
        component={Reports}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
    </stack.Navigator>
  );
};

export default PayNavigation;
