import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import BottomNavigation from "./BottomNavigation";
import PaymentNavigator from "./PaymentNavigator";
import Print from "../screens/Print";
import { enableScreens } from "react-native-screens";
import PaymentList from "../screens/PaymentList";
import PayNavigation from "./PayNavigation";
import { StatusBar } from "react-native";
import AddCustomer from "../screens/AddCustomer";
import ViewCustomers from "../screens/ViewCustomer";
import CustomerNavigation from "./CustomerNavigation";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import MyTaskListScreen from '../screens/MyTaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import CompleteTaskScreen from '../screens/CompleteTaskScreen';

enableScreens();

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      {/* Transparent Status Bar */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={Home}
        />
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={Welcome}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="PayNavigation"
          component={PayNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentNavigator"
          options={{ headerShown: false }}
          component={PaymentNavigator}
        />
        <Stack.Screen
          name="CustomerNavigation"
          options={{ headerShown: false }}
          component={CustomerNavigation}
        />

        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        <Stack.Screen name="MyTasks" options={{ headerShown: false }} component={MyTaskListScreen} />
        <Stack.Screen name="Task Detail" component={TaskDetailScreen} />
        <Stack.Screen name="CompleteTask"  options={{ headerShown: false }}component={CompleteTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
