import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskAddStyles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskAdd() {
  const router = useRouter();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!selectedPeriod) {
      Alert.alert('Error', 'Please select a period');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: taskName,
          description,
          period: selectedPeriod,
          days: selectedDays,
          start_date: startDate.toISOString(),
          due_date: new Date(startDate.getTime() + (parseInt(selectedDays[0] || '1') * 24 * 60 * 60 * 1000)).toISOString(),
          status: 'todo'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      Alert.alert(
        'Success',
        'Task created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.push('/tasks')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
      console.error('Error creating task:', error);
    }
  };

  return (
    <ThemedView style={taskAddStyles.container}>
      <ScrollView style={taskAddStyles.content}>
        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Title *</ThemedText>
          <TextInput
            style={taskAddStyles.input}
            placeholder="Wireframe for NFT Landing Page"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Description *</ThemedText>
          <TextInput
            style={[taskAddStyles.input, taskAddStyles.textArea]}
            placeholder="Write your description"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Images (Optional)</ThemedText>
          <TouchableOpacity style={taskAddStyles.uploadButton}>
            <Feather name="upload" size={24} color={colors.textPrimary} />
            <ThemedText style={taskAddStyles.uploadText}>Upload Image</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Period *</ThemedText>
          <View style={taskAddStyles.radioGroup}>
            {['Every Day', 'Weekly', 'Bi Weekly', 'Monthly','Every 3 Months','Every 6 Months','Every Year'].map((period, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  taskAddStyles.radioButton,
                  selectedPeriod === (index + 1).toString() && taskAddStyles.radioButtonActive
                ]}
                onPress={() => setSelectedPeriod((index + 1).toString())}
              >
                <View style={[
                  taskAddStyles.checkbox,
                  selectedPeriod === (index + 1).toString() && taskAddStyles.checkboxChecked
                ]} />
                <ThemedText style={taskAddStyles.checkboxText}>{period}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Days *</ThemedText>
          <View style={taskAddStyles.radioGroup}>
            {['Friday', 'Saturday', 'Sunday', 'Monday','Tuesday','Wednesday','Thursday'].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  taskAddStyles.checkboxContainer,
                  selectedDays.includes((index + 1).toString()) && taskAddStyles.checkboxActive
                ]}
                onPress={() => toggleDaySelection((index + 1).toString())}
              >
                <View style={[
                  taskAddStyles.checkbox,
                  selectedDays.includes((index + 1).toString()) && taskAddStyles.checkboxChecked
                ]} />
                <ThemedText style={taskAddStyles.checkboxText}>{day}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={taskAddStyles.footer}>
        <TouchableOpacity style={taskAddStyles.submitButton} onPress={handleSubmit}>
          <Text style={taskAddStyles.submitButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}
    </ThemedView>
  );
}
