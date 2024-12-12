import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { colors, taskAddStyles } from '../constants/Theme';
import { taskStore } from '../utils/taskStore';

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
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    try {
      await taskStore.addTask({
        name: taskName,
        description,
        status: 'todo',
        startDate: startDate.toISOString(),
        dueDate: new Date(startDate.getTime() + (parseInt(selectedDays[0] || '1') * 24 * 60 * 60 * 1000)).toISOString(),
      });
      
      router.push('/tasks');
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
      console.error('Error creating task:', error);
    }
  };

  return (
    <ThemedView style={taskAddStyles.container}>
      <ScrollView style={taskAddStyles.content}>
        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Task Name</ThemedText>
          <TextInput
            style={taskAddStyles.input}
            placeholder="Wireframe for NFT Landing Page"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Description</ThemedText>
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
          <ThemedText style={taskAddStyles.label}>Images</ThemedText>
          <TouchableOpacity style={taskAddStyles.uploadButton}>
            <Feather name="upload" size={24} color={colors.textPrimary} />
            <ThemedText style={taskAddStyles.uploadText}>Upload Image</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Period</ThemedText>
          <View style={taskAddStyles.radioGroup}>
            {['Style 01', 'Style 02', 'Style 03', 'Style 04'].map((period, index) => (
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
          <ThemedText style={taskAddStyles.label}>Days</ThemedText>
          <View style={taskAddStyles.radioGroup}>
            {['Style 01', 'Style 02', 'Style 03', 'Style 04'].map((day, index) => (
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
