import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import moment from "moment";
import COLORS from "../constants/color";
import Header from "../components/Header";
import baseUrl from "../constants/baseUrl";
import { useFocusEffect } from "@react-navigation/native";

const ViewLeads = ({ route, navigation }) => {
  const { user } = route.params;

  const [currentDate, setCurrentDate] = useState("");
  const [receipt, setReceipt] = useState({});
  const [chitLeads, setChitLeads] = useState([]);
  const [goldLeads, setGoldLeads] = useState([]);
  const [isChitLoading, setIsChitLoading] = useState(false);
  const [isGoldLoading, setIsGoldLoading] = useState(false);
  const [chitLoaded, setChitLoaded] = useState(false);
  const [goldLoaded, setGoldLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("CHIT");

  useEffect(() => {
    setCurrentDate(moment().format("DD-MM-YYYY"));
  }, []);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/agent/get-agent-by-id/${user.userId}`
        );
        setReceipt(response.data);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };
    fetchReceipt();
  }, [user.userId]);

  const fetchChitLeads = async (phone) => {
    setIsChitLoading(true);
    setChitLoaded(false);
    try {
      const response = await axios.get(
        `${baseUrl}/lead/get-lead-by-agent/${phone}`
      );
      setChitLeads(response.data);
    } catch (error) {
      console.error("Error fetching chit leads data:", error);
      setChitLeads([]);
    } finally {
      setIsChitLoading(false);
      setChitLoaded(true);
    }
  };

  const fetchGoldLeads = async (phone) => {
    setIsGoldLoading(true);
    setGoldLoaded(false);
    try {
      const response = await axios.get(
        `http://13.60.68.201:3000/api/lead/get-lead-by-agent/${phone}`
      );
      setGoldLeads(response.data);
    } catch (error) {
      console.error("Error fetching gold leads data:", error);
      setGoldLeads([]);
    } finally {
      setIsGoldLoading(false);
      setGoldLoaded(true);
    }
  };

  useEffect(() => {
    if (receipt?.phone_number) {
      fetchChitLeads(receipt.phone_number);
      fetchGoldLeads(receipt.phone_number);
    }
  }, [receipt.phone_number]);

  useFocusEffect(
    useCallback(() => {
      if (receipt?.phone_number) {
        fetchChitLeads(receipt.phone_number);
        fetchGoldLeads(receipt.phone_number);
      }
    }, [receipt.phone_number])
  );

  const renderLeadCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Text style={styles.name}>{item.lead_name}</Text>
        <Text style={styles.groupName}>
          {item.group_id ? item.group_id.group_name : "No Group"}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.schemeType}>
          {item.scheme_type.charAt(0).toUpperCase() + item.scheme_type.slice(1)}
        </Text>
        <Text style={styles.phoneNumber}>{item.lead_phone}</Text>
      </View>
    </View>
  );

  // Pick active data, loading and loaded flags
  const isLoading = activeTab === "CHIT" ? isChitLoading : isGoldLoading;
  const dataLoaded = activeTab === "CHIT" ? chitLoaded : goldLoaded;
  const leads = activeTab === "CHIT" ? chitLeads : goldLeads;
  const noDataMessage =
    activeTab === "CHIT" ? "No chit leads found" : "No gold leads found";

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
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>Leads</Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {chitLeads.length + goldLeads.length || 0}
              </Text>
            </View>

            <View style={styles.container}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "CHIT" && styles.activeTab]}
                  onPress={() => setActiveTab("CHIT")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "CHIT" && styles.activeTabText,
                    ]}
                  >
                    Chits {chitLeads.length || 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, activeTab === "GOLD" && styles.activeTab]}
                  onPress={() => setActiveTab("GOLD")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "GOLD" && styles.activeTabText,
                    ]}
                  >
                    Gold Chits {goldLeads.length || 0}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ minHeight: 200 }}>
                {isLoading && <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />}
                {!isLoading && dataLoaded && leads.length > 0 && (
                  <FlatList
                    data={leads}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderLeadCard}
                  />
                )}
                {!isLoading && dataLoaded && leads.length === 0 && (
                  <Text style={styles.noLeadsText}>{noDataMessage}</Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddLead", { user: user })}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: COLORS.primary,
            borderRadius: 30,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
            + Add
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
    backgroundColor: "#fff0db",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 15,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 15,
  },
  groupName: {
    fontSize: 14,
    color: "#666",
  },
  schemeType: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#666",
  },
  noLeadsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default ViewLeads;
