import { View, Text, ScrollView, StyleSheet, TextInput, Modal, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import RNPrint from 'react-native-print';


import COLORS from "../constants/color";
import Header from "../components/Header";
import RouteCustomerList from "../components/RouteCustomerList";
import baseUrl from "../constants/baseUrl";

import axios from "axios";
import PaymentChitList from "../components/PaymentChitList";

const ChitPayments = ({ route, navigation }) => {
  const { user, areaId } = route.params;

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [cus, setCus] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState({})

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const [filters, setFilters] = useState([
    { id: 'date', title: 'Date', value: formatDate(selectedDate) },
    { id: 'group', title: 'Group', value: '' },
    { id: 'customer', title: 'Customer', value: '' },
    { id: 'paymentMode', title: 'Payment Mode', value: selectedPaymentMode },
  ]);

  const paymentModes = ['cash', 'online'];

  const handleFilterPress = (filterId) => {
    setSelectedFilter(filterId);
    setShowPicker(true);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${baseUrl}/payment/get-payment-agent/${user.userId}`
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

  useEffect(() => {
    const fetchCus = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${baseUrl}/user/get-user`
        );
        if (response.data) {
          setCus(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchCus();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${baseUrl}/group/get-group`
        );
        if (response.data) {
          setGroups(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchGroups();
  }, []);

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((customer) => {
      const nameMatch = customer?.user_id?.full_name?.toLowerCase().includes(search.toLowerCase());
      const dateMatch = isSameDate(customer.pay_date, selectedDate);
      const customerMatch = !selectedCustomer || customer.user_id._id === selectedCustomer;
      const groupMatch = !selectedGroup || customer.group_id._id === selectedGroup;
      const paymentModeMatch = !selectedPaymentMode || customer.pay_type === selectedPaymentMode;
      return nameMatch && dateMatch && customerMatch && groupMatch && paymentModeMatch;
    })
    : [];

  const totalAmount = filteredCustomers.reduce((sum, customer) => {
    const amount = parseFloat(customer.amount) || 0;
    return sum + amount;
  }, 0);



  const renderPicker = () => {
    switch (selectedFilter) {
      case 'date':
        return (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) {
                setSelectedDate(date);
                setFilters((prevFilters) =>
                  prevFilters.map((filter) =>
                    filter.id === 'date'
                      ? { ...filter, value: formatDate(date) }
                      : filter
                  )
                );
              }
            }}
          />
        );
      case 'group':
        return (
          <Picker
            selectedValue={selectedGroup}
            onValueChange={(value) => {
              const selected = groups.find((group) => group._id === value);
              setSelectedGroup(value);
              setSelectedCustomerName(selected?.full_name || '');
              setFilters((prevFilters) =>
                prevFilters.map((filter) =>
                  filter.id === 'group'
                    ? { ...filter, value: selected?.group_name || 'Select an option' }
                    : filter
                )
              );
              setShowPicker(false);
            }}
          >
            <Picker.Item label="All Customers" value="" />
            {groups.map((group) => (
              <Picker.Item
                key={group._id}
                label={`${group.group_name}`}
                value={group._id}
              />
            ))}
          </Picker>
        );
      case 'customer':
        return (
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(value) => {
              const selected = cus.find((customer) => customer._id === value);
              setSelectedCustomer(value);
              setSelectedCustomerName(selected?.full_name || '');
              setFilters((prevFilters) =>
                prevFilters.map((filter) =>
                  filter.id === 'customer'
                    ? { ...filter, value: selected?.full_name || 'Select an option' }
                    : filter
                )
              );
              setShowPicker(false);
            }}
          >
            <Picker.Item label="All Customers" value="" />
            {cus.map((customer) => (
              <Picker.Item
                key={customer._id}
                label={`${customer.full_name} - ${customer.phone_number}`}
                value={customer._id}
              />
            ))}
          </Picker>

        );
      case 'paymentMode':
        return (
          <Picker
            selectedValue={selectedPaymentMode}
            onValueChange={(value) => {
              setSelectedPaymentMode(value);
              setFilters((prevFilters) =>
                prevFilters.map((filter) =>
                  filter.id === 'paymentMode'
                    ? { ...filter, value }
                    : filter
                )
              );
              setShowPicker(false);
            }}>
            {paymentModes.map((mode) => (
              <Picker.Item key={mode} label={mode} value={mode} />
            ))}
          </Picker>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/agent/get-agent-by-id/${user.userId}`
        );
        setAgent(response.data)

      } catch (error) {
        x
        console.error("Error fetching customer data:", error);
      }
    };

    fetchAgent();
  }, [user.userId]);

  const printPDF = async () => {
    const isSameDate = (date1, date2) => {
      const d1 = new Date(date1).toDateString();
      const d2 = new Date(date2).toDateString();
      return d1 === d2;
    };

    const filteredCustomers = customers
      .filter((customer) => {
        const nameMatch = customer?.user_id?.full_name?.toLowerCase().includes(search.toLowerCase());
        const dateMatch = isSameDate(customer.pay_date, selectedDate);
        const customerMatch = !selectedCustomer || customer.user_id._id === selectedCustomer;
        const groupMatch = !selectedGroup || customer.group_id._id === selectedGroup;
        const paymentModeMatch = !selectedPaymentMode || customer.pay_type === selectedPaymentMode;
        return nameMatch && dateMatch && customerMatch && groupMatch && paymentModeMatch;
      })
      .map((customer, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${customer?.group_id?.group_name || "N/A"}</td>
          <td>${customer.ticket || "N/A"}</td>
          <td>${customer?.user_id?.full_name || "N/A"}</td>
          <td>${customer?.user_id?.phone_number || "N/A"}</td>
          <td>${customer.amount || "N/A"}</td>
          <td>${customer.receipt_no || "N/A"}</td>
          <td>${customer.pay_type || "N/A"}</td>
        </tr>
      `)
      .join("");

    const htmlContent = `
      <html>
      <head>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
          .container {
            padding: 10mm;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th, .table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .table th {
            background-color: #f2f2f2;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Collection Print</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Group Name</th>
                <th>Ticket</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Amount</th>
                <th>Receipt Number</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCustomers}
            </tbody>
          </table>
          <div class="footer">
            <p>${agent.name} | ${selectedDate} </p>
            <p>Thank You!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await RNPrint.print({ html: htmlContent });
    } catch (error) {
      Alert.alert("Print Error", "Failed to print the document.");
    }
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ marginHorizontal: 22, marginTop: 12 }}>
        <Header />
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
          <Text style={styles.title}>Chit Payments</Text>
          <Text style={styles.title}>₹ {totalAmount.toFixed(2)}</Text>
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
            placeholder="Search chit payments..."
            placeholderTextColor={COLORS.darkGray}
            style={styles.searchInput}
          />
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.card}
              onPress={() => handleFilterPress(filter.id)}
            >
              <Text style={styles.cardTitle}>{filter.title}</Text>
              <Text style={styles.cardValue}>
                {filter.value || 'Select'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={printPDF} style={{ marginHorizontal: 22, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", padding: 10 }}>
          <Text style={{ fontSize: 14 }}>Print PDF</Text>
        </TouchableOpacity>
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPicker(false)}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
              {renderPicker()}
            </View>
          </View>
        </Modal>
      </View>
      {
        loading ? (
          <>
            <Text style={{ textAlign: "center", fontSize: 20, marginTop: 30 }}>loading...</Text>
          </>
        ) : (
          <>
            <ScrollView
              style={{ flex: 1, marginHorizontal: 22, marginTop: 0 }}
              contentContainerStyle={{ paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            >
              {Array.isArray(customers) && customers.filter((customer) => {
                const nameMatch = customer?.user_id?.full_name?.toLowerCase().includes(search.toLowerCase());
                const dateMatch = isSameDate(customer.pay_date, selectedDate);
                const customerMatch = !selectedCustomer || customer.user_id._id === selectedCustomer;
                const groupMatch = !selectedGroup || customer.group_id._id === selectedGroup;
                const paymentModeMatch = !selectedPaymentMode || customer.pay_type === selectedPaymentMode;
                return nameMatch && dateMatch && customerMatch && groupMatch && paymentModeMatch;
              }).length === 0 ? (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No Payments are available</Text>
                </View>
              ) : (
                customers
                  .filter((customer) => {
                    const nameMatch = customer?.user_id?.full_name?.toLowerCase().includes(search.toLowerCase());
                    const dateMatch = isSameDate(customer.pay_date, selectedDate);
                    const customerMatch = !selectedCustomer || customer.user_id._id === selectedCustomer;
                    const groupMatch = !selectedGroup || customer.group_id._id === selectedGroup;
                    const paymentModeMatch = !selectedPaymentMode || customer.pay_type === selectedPaymentMode;
                    return nameMatch && dateMatch && customerMatch && groupMatch && paymentModeMatch;
                  })
                  .map((customer, index) => (
                    <PaymentChitList
                      key={index}
                      idx={index}
                      name={customer?.user_id?.full_name}
                      cus_id={customer._id}
                      phone={customer.user_id.phone_number}
                      receipt={customer.receipt_no}
                      date={customer.pay_date}
                      amount={customer.amount}
                      group={customer.group_id.group_name}
                      type={customer.pay_type}
                      navigation={navigation}
                      user={user}
                      onPress={() => { }}
                      customer={customer}
                    />
                  ))
              )}
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
  container: {
    marginTop: 0,
    marginBottom: 15,
  },
  scrollContainer: {
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  pickerContainer: {
    backgroundColor: '#ececec',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ChitPayments;
