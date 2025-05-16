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
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/color";
import Header from "../components/Header";
const MyCommission = ({ route, navigation }) => {
    const { commissions } = route.params;
    const [goldLeads, setGoldLeads] = useState([]);
    const [isChitLoading, setIsChitLoading] = useState(false);
    const [isGoldLoading, setIsGoldLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("CHIT");
    useEffect(() => {
        console.log(commissions.commission_data, "commission data")
        if (commissions.commission_data) {
            setIsChitLoading(false)
        }

    }, [activeTab])
    const renderCommissionCard = ({ item }) => {

        return (
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <Text style={styles.name}>{item?.user_name}</Text>
                    <Text style={styles.groupName}>
                        {item?.group_name ? item.group_name: "No Group Name"}
                    </Text>
                    <Text style={styles.groupName}>
                        {item?.group_value ? item.group_value: "No Group Value"}
                    </Text>
                </View>
                <View style={styles.rightSection}>
                    <Text style={styles.schemeType}>
                        {item?.commission_rate}
                    </Text>
                    <Text style={styles.phoneNumber}>{item?.actual_commission}</Text>
                    <Text style={styles.phoneNumber}>{item?.commission_released}</Text>
                </View>
            </View>
        );
    }

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
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>My Commission</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                                {commissions?.summary?.total_estimated || 0}
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
                                ) : !(commissions?.success) ? (
                                    <Text style={styles.noLeadsText}>No Commission Data Found</Text>
                                ) : (

                                    <FlatList
                                        data={commissions?.commission_data || []}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderCommissionCard}
                                        ListHeaderComponent={() => (<View style={styles.colorCard}>
                                            <View style={styles.containerNew} >
                                                <Text style={styles.colorContainerText}>
                                                Total Customers  {commissions?.summary?.total_customers}
                                               
                                                </Text>
                                            </View>
                                            <View style={styles.containerNew}>
                                                <Text style={styles.colorContainerText}>
                                                    Total Groups {commissions?.summary?.total_groups}
                                                </Text>
                                                
                                            </View>
                                            <View style={styles.containerNew}>
                                                <Text style={styles.colorContainerText}>
                                               
                                               My Business {commissions?.summary?.actual_business}
                                                </Text>
                                            </View>
                                            <View style={styles.containerNew}>
                                                <Text style={styles.colorContainerText}>
                                                My Commission   {commissions?.summary?.total_actual}
                                                
                                                </Text>
                                            </View>

                                        </View>)}
                                    />




                                )
                            ) : isGoldLoading ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#000"
                                    style={{ marginTop: 20 }}
                                />
                            ) : goldLeads.length === 0 ? (
                                <Text style={styles.noLeadsText}>No commission Data Found</Text>
                            ) : (
                                <FlatList
                                    data={commissions?.commission_data || []}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderCommissionCard}
                                />
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
    containerNew:{
        flexDirection:"row",
        justifyContent:"center"
    },
    colorContainerText:{
        fontWeight:"bold",
            },
    colorCard: {
        backgroundColor: "#FEF3E2",
        flexDirection: "column",
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
});

export default MyCommission;
