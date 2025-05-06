import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import COLORS from '../constants/color';
import baseUrl from '../constants/baseUrl';
import axios from 'axios';

export default function CompleteTaskScreen({ route, navigation }) {
  const { taskId } = route.params;
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Completed');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
  ]);

  const handleCompleteTask = async () => {
    if (!message) {
      Alert.alert('Validation Error', 'Please enter a message.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${baseUrl}/task/complete-task/${taskId}`, {
        message,
        status,
      });

      Alert.alert('Success', 'Task updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complete Task</Text>

      <Text style={styles.label}>Status</Text>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            const nextStatus =
              status === 'Completed'
                ? 'Pending'
                : status === 'Pending'
                ? 'In Progress'
                : 'Completed';
            setStatus(nextStatus);
          }}
        >
          <Text style={styles.dropdownText}>{status}</Text>
        </TouchableOpacity>
      </View>


      <Text style={styles.label}>Message</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Enter message"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <Button title="Submit" onPress={handleCompleteTask} color={COLORS.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.black,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.black,
  },
  dropdown: {
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  dropdownContainer: {
    borderColor: COLORS.lightGray,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
