import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import COLORS from "../constants/color";
import Header from "../components/Header";
import RouteCustomerList from "../components/RouteCustomerList";
import baseUrl from "../constants/baseUrl";

import axios from "axios";

const RouteCustomer = ({ route, navigation }) => {
  const { user, areaId } = route.params;

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${baseUrl}/user/get-user`
        );
        if (response.data) {
          setCustomers(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchCustomers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ marginHorizontal: 22, marginTop: 12 }}>
        <Header />
        <View style={styles.searchContainers}>
          <Text style={styles.title}>Chit Customers</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#ccc"
            style={styles.searchIcon}
          />
          <TextInput
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder="Search chit customers..."
            placeholderTextColor={COLORS.darkGray}
            style={styles.searchInput}
          />
        </View>
      </View>
      {
        loading ? (
          <>
            <Text style={{ textAlign: "center", fontSize: 20, marginTop: 30 }}>loading...</Text>
          </>
        ) : (
          <>
            <ScrollView
              style={{ flex: 1, marginHorizontal: 22, marginTop: 12 }}
              contentContainerStyle={{ paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            >
              {Array.isArray(customers) &&
                customers
                  .filter((customer) =>
                    customer.full_name?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((customer, index) => (
                    <RouteCustomerList
                      key={index}
                      idx={index}
                      name={customer.full_name}
                      cus_id={customer._id}
                      phone={customer.phone_number}
                      navigation={navigation}
                      user={user}
                      onPress={() =>
                        navigation.navigate("Payin", { customer:customer._id })
                      }
                    />
                  ))}
            </ScrollView>
          </>
        )
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d0d0d0",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  searchContainers: {
    marginTop: 15,
    padding: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#333',
  },
});

export default RouteCustomer;
