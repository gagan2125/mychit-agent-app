import { View, Text, FlatList, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import moment from "moment";

import COLORS from "../constants/color";
import Header from "../components/Header";
import Button from "../components/Button";
import baseUrl from "../constants/baseUrl";
import { useFocusEffect } from "@react-navigation/native";

const ViewLeads = ({ route, navigation }) => {
    const { user, customer } = route.params;

    const [currentDate, setCurrentDate] = useState("");
    const [receipt, setReceipt] = useState({});
    const [paymentDetails, setPaymentDetails] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [customerInfo, setCustomerInfo] = useState({
        full_name: '',
        phone_number: '',
        profession: '',
    });

    const [groups, setGroups] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedTicket, setSelectedTicket] = useState("");
    const [allData, setAllData] = useState([]);
    const [chitLeads, setChitLeads] = useState([]);
    const [goldLeads, setGoldLeads] = useState([]);
    const [isChitLoading, setIsChitLoading] = useState(false);
    const [isGoldLoading, setIsGoldLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('CHIT');

    useEffect(() => {
        const fetchGroups = async () => {
            const currentUrl = selectedTicket === 'chit'
                ? `${baseUrl}`
                : 'http://13.60.68.201:3000/api';

            try {
                const response = await axios.get(`${currentUrl}/group/get-group`);
                if (response.data) {
                    setGroups(response.data || []);
                } else {
                    console.error("No data in response");
                }
            } catch (error) {
                console.error("Error fetching groups:", error.message);
            }
        };

        if (selectedTicket) {
            fetchGroups();
        }
    }, [selectedTicket]);

    useEffect(() => {
        const today = moment().format("DD-MM-YYYY");
        setCurrentDate(today);
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
    }, []);

    const fetchChitLeads = async () => {
        setIsChitLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}/lead/get-lead-by-agent/${receipt.phone_number}`
            );
            setChitLeads(response.data);
        } catch (error) {
            console.error("Error fetching chit leads data:", error);
        } finally {
            setIsChitLoading(false);
        }
    };

    useEffect(() => {
        fetchChitLeads();
    }, [receipt.phone_number]);

    const fetchGoldLeads = async () => {
        setIsGoldLoading(true);
        try {
            const response = await axios.get(
                `http://13.60.68.201:3000/api/lead/get-lead-by-agent/${receipt.phone_number}`
            );
            setGoldLeads(response.data);
        } catch (error) {
            console.error("Error fetching gold leads data:", error);
        } finally {
            setIsGoldLoading(false);
        }
    };

    useEffect(() => {
        fetchGoldLeads();
    }, [receipt.phone_number]);

    useFocusEffect(
        useCallback(() => {
            fetchChitLeads();
            fetchGoldLeads();
        }, [receipt.phone_number])
    );

    const renderLeadCard = ({ item }) => (
        <>
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <Text style={styles.name}>{item.lead_name}</Text>
                    <Text style={styles.groupName}>
                        {item.group_id ? item.group_id.group_name : 'No Group'}
                    </Text>
                </View>
                <View style={styles.rightSection}>
                    <Text style={styles.schemeType}>
                        {item.scheme_type.charAt(0).toUpperCase() + item.scheme_type.slice(1)}
                    </Text>
                    <Text style={styles.phoneNumber}>{item.lead_phone}</Text>
                </View>
            </View>
        </>
    );

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
                        <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                                Leads
                            </Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                                {chitLeads.length + goldLeads.length | 0}
                            </Text>
                        </View>

                        <View style={styles.container}>
                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab === 'CHIT' && styles.activeTab
                                    ]}
                                    onPress={() => setActiveTab('CHIT')}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        activeTab === 'CHIT' && styles.activeTabText
                                    ]}>Chits {chitLeads.length || 0}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab === 'GOLD' && styles.activeTab
                                    ]}
                                    onPress={() => setActiveTab('GOLD')}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        activeTab === 'GOLD' && styles.activeTabText
                                    ]}>Gold Chits {goldLeads.length || 0}</Text>
                                </TouchableOpacity>
                            </View>

                            {activeTab === 'CHIT' ? (
                                isChitLoading ? (
                                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                                ) : chitLeads.length === 0 ? (
                                    <Text style={styles.noLeadsText}>No chit leads found</Text>
                                ) : (
                                    <FlatList
                                        data={chitLeads}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderLeadCard}
                                    />
                                )
                            ) : (
                                isGoldLoading ? (
                                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                                ) : goldLeads.length === 0 ? (
                                    <Text style={styles.noLeadsText}>No gold leads found</Text>
                                ) : (
                                    <FlatList
                                        data={goldLeads}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderLeadCard}
                                    />
                                )
                            )}
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
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                    }}
                >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
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
        marginTop: 0,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    column: {
        flex: 1,
        marginHorizontal: 3,
    },
    textInput: {
        height: 40,
        width: "100%",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        color: "#000"
    },
    contentContainer: {
        marginTop: 20,
    },
    pickerContainer: {
        borderColor: COLORS.lightGray,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        marginTop: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    picker: {
        height: 40,
        width: "100%",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 10,
        elevation: 0,
        backgroundColor: "#f4f4f4"
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
        backgroundColor: "#fff0db"
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: COLORS.primary,
    },
    card: {
        backgroundColor: '#fff',
        flexDirection: 'row',
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
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15
    },
    groupName: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    schemeType: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        marginBottom: 15
    },
    phoneNumber: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    noLeadsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default ViewLeads;
