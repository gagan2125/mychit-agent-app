import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

import COLORS from "../constants/color";
import Header from "../components/Header";
import RouteList from "../components/RouteList";

const Routes = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1, marginHorizontal: 22, marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <View style={styles.searchContainer}>
          <Text style={styles.title}>Customers</Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <RouteList
            key="chits-card"
            idx={0}
            name="Chits Customer"
            navigation={navigation}
            user={user}
            areaId="chits"
            redirect="RouteCustomerChit"
          />
          <RouteList
            key="gold-chits-card"
            idx={1}
            name="Gold Chits Customer"
            navigation={navigation}
            user={user}
            areaId="gold-chits"
            redirect="RouteCustomerGold"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop:30,
    padding: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#333',
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
});

export default Routes;
