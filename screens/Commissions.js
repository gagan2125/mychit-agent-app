import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import COLORS from "../constants/color";
import Header from "../components/Header";
import baseUrl from "../constants/baseUrl";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const Commissions = ({ route, navigation }) => {
    const { user } = route.params;
    const [chitCommissionLength, setChitCommissionLength] = useState(0);
    const [goldCommissionLength, setGoldCommissionLength] = useState(0);
    const [isChitLoading, setIsChitLoading] = useState(false);
    const [isGoldLoading, setIsGoldLoading] = useState(false);
    const [commissions, setCommissions] = useState([]);
    const [activeTab, setActiveTab] = useState("CHIT");
 const handleEstimatedCommission = ()=>{
    navigation.navigate("ExpectedCommissions", { user: user })
 }
 const handleMyCommission = ()=>{
    navigation.navigate("MyCommissions", { commissions: commissions })
 }
 const handleMyCustomers = ()=>{
    navigation.navigate("ViewEnrollments", { user: user })

 }
 const handleGroups = ()=>{
    navigation.navigate("MyGroups", { user: user })

 }
    const scrollData = [
        { title: "Customers", icon: "person", value: "total_customers" ,key:"#1",handlePress:handleMyCustomers}, 
        { title: "Groups", icon: "group", value: "total_groups",key:"#2" ,handlePress:handleGroups}, 
        { title: "My Business", icon: "query-stats", value: "actual_business" ,key:"#6",handlePress:handleMyCommission},
        { title: "Estimated Business", icon: "trending-up", value: "expected_business" ,key:"#5",handlePress:handleEstimatedCommission},
        { title: "My Commission", icon: "payments", value: "total_actual",key:"#4" ,handlePress:handleMyCommission},
        { title: "Estimated Commission", icon: "currency-rupee", value: "total_estimated",key:"#3" ,handlePress:handleEstimatedCommission}]
    useEffect(() => {
        const fetchCommissions = async () => {
            const currentUrl =
                activeTab === "CHIT" ? `${baseUrl}` : "http://13.60.68.201:3000/api";
            try {
                activeTab === "CHIT" ? setIsChitLoading(true) : setIsGoldLoading(true);
                const response = await axios.get(
                    `${currentUrl}/enroll/get-detailed-commission/${user.userId}`
                );
                if (response.status >= 400)
                    throw new Error("Failed to fetch Customer Data");
                setCommissions(response.data);
                activeTab === "CHIT"
                    ? setChitCommissionLength(response?.data?.length)
                    : setGoldCommissionLength(response?.data?.length);
            } catch (err) {
                console.log(err, "error");
                setCommissions([]);
            } finally {
                activeTab === "CHIT"
                    ? setIsChitLoading(false)
                    : setIsGoldLoading(false);
            }
        };
        fetchCommissions();
    }, [activeTab, user]);

    const renderCommissionCard = (commissionData) => (<ScrollView>
        {scrollData.map(({ title, icon, value,key,handlePress }) => (<TouchableOpacity key={key} activeOpacity={0.8} onPress={handlePress}>
            <View style={[styles.card, { backgroundColor: "#FDFDFD" }]} >
                <View style={[styles.leftSection]} >
                    <View style={{ borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                        <MaterialIcons name={icon} size={20} style={{ color: COLORS.primary }} />
                        <Text style={{ fontWeight: "bold", color: COLORS.primary, textAlign: "center",fontSize:12 }}>
                            {title}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                </View>
                <View style={{ flex: 1 }}>
                </View>
                <View style={styles.rightSection}>
                    <Text style={[ { color: COLORS.primary ,fontWeight:"bold",fontSize:12}]}>
                        {commissionData?.summary?.[value]}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
        )

        )}</ScrollView>)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <View style={{ flexGrow: 1 }}>
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
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                                Commissions
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
                                        Chits
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
                                        Gold Chits
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {activeTab === "CHIT" ? (
                                isChitLoading ? (
                                    <ActivityIndicator
                                        size="large"
                                        color="#000"
                                        style={{ marginTop: 20 }}
                                    />
                                ) : chitCommissionLength === 0 ? (
                                    <Text style={styles.noLeadsText}>
                                        No Chit Commission Found
                                    </Text>
                                ) : (
                                    renderCommissionCard(commissions)

                                )
                            ) : isGoldLoading ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#000"
                                    Chits
                                    style={{ marginTop: 20 }}
                                />
                            ) : goldCommissionLength === 0 ? (
                                <Text style={styles.noLeadsText}>No Gold Commission Found</Text>
                            ) : (


                                renderCommissionCard(commissions)
                            )}
                        </View>
                    </View>
                </View>

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
        color: "#000",
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
        backgroundColor: "#fff",
        marginTop: 20,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginBottom: 10,
        elevation: 0,
        backgroundColor: "#f4f4f4",
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",

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
        textAlign: "center",
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
        justifyContent:"center",
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
        marginTop: 4,
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
        marginTop: 4,
    },
    noLeadsText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#666",
    },
    box: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        borderRadius: 10,
        width: 80,
        height: 80,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.84,
        elevation: 2,
    },
    boxText: {
        marginTop: 10,
        fontSize: 12,
        color: COLORS.black,
    },
});

export default Commissions;
