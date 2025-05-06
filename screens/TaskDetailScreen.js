import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function TaskDetailScreen({ navigation, route }) {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Title: {task.taskTitle}</Text>
        <Text style={styles.detail}>Description: {task.taskDescription}</Text>
        <Text style={styles.detail}>Status: {task.status}</Text>
        <Text style={styles.detail}>Start: {new Date(task.startDate).toLocaleDateString()}</Text>
        <Text style={styles.detail}>End: {new Date(task.endDate).toLocaleDateString()}</Text>
        <View style={styles.button}>
          <Button
            title="Mark as Complete"
            onPress={() => navigation.navigate('CompleteTask', { taskId: task._id })}
            color="#4e5ae8"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  button: {
    marginTop: 20,
  },
});
