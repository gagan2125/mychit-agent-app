import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import COLORS from "../constants/color";
import baseUrl from "../constants/baseUrl";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyTaskListScreen({ navigation, route }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const employeeId = route.params?.employeeId;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/task/get-tasks/${employeeId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      Alert.alert("Error", "Could not fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Task Detail", { task: item })}
    >
      <Text style={styles.cardTitle}>{item.taskTitle}</Text>
      <Text style={[styles.cardSubtitle,{color:item?.status==="Completed"?"green":"black"}]}> {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
    <View style={styles.container}>
      <Header />
      <Text style={styles.header}>My Tasks</Text>
      {loading ? (
  <ActivityIndicator size="large" color={COLORS.primary} />
) : tasks.length === 0 ? (
  <Text style={styles.noTaskText}>No tasks Assigned.</Text>
) : (
  <FlatList
    data={tasks}
    keyExtractor={(item) => item._id}
    renderItem={renderItem}
  />
)}

    </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    marginLeft:9,
    color: "#111",
  },
  card: {
    // backgroundColor: "#fff",
    // borderRadius: 10,
    // padding: 15,
    // marginVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,

    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 35,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    justifyContent:"center",
    alignItems:"center"
  },
  cardTitle: {
    // fontSize: 16,
    // fontWeight: "bold",
    // marginBottom: 5,
    // color: "#333",
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    // marginBottom: 15,
  },

  noTaskText: {
  fontSize: 16,
  fontWeight: "500",
  textAlign: "center",
  marginTop: 20,
  color: "#888",
},

  cardSubtitle: {
    alignItems: "flex-end",
fontWeight:"bold",
fontSize: 14,

  },
});
