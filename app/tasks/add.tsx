import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskAddStyles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PeriodValues = {
  'Every Day': string;
  'Weekly': string;
  'Bi Weekly': string;
  'Monthly': string;
  'Every 3 Months': string;
  'Every 6 Months': string;
  'Every Year': string;
};

interface Task {
  id: number;
  name: string;
  description: string;
  repeat_monthly: string;
  repeat_days: string[];
}

export default function TaskAdd() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      fetchTaskData();
    }
  }, [id]);

  const fetchTaskData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const result = await response.json();


      const task: Task = result;
      setTaskName(task.name);
      setDescription(task.description);
      setSelectedPeriod(task.repeat_monthly);
      // setSelectedDays(task.repeat_days);
    } catch (error) {
      showNotification('Failed to load task data', 'error');
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const periodValues: PeriodValues = {
    'Every Day': '1',
    'Weekly': '7',
    'Bi Weekly': '14',
    'Monthly': '28',
    'Every 3 Months': '90',
    'Every 6 Months': '180',
    'Every Year': '360'
  };

  const periods = Object.keys(periodValues) as (keyof PeriodValues)[];

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
      showNotification('Please enter a task name', 'error');
      return;
    }
    if (!description.trim()) {
      showNotification('Please enter a description', 'error');
      return;
    }
    if (!selectedPeriod) {
      showNotification('Please select a period', 'error');
      return;
    }
    if (selectedDays.length === 0) {
      showNotification('Please select at least one day', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showNotification('Authentication required', 'error');
        setIsSubmitting(false);
        return;
      }

      const endpoint = id ? `${API_ENDPOINTS.TASKS}/${id}` : API_ENDPOINTS.TASKS;
      const method = id ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: taskName,
          description,
          repeat_monthly: selectedPeriod,
          repeat_days: selectedDays,
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${id ? 'update' : 'create'} task`);
      }

      const data = await response.json();
      setIsSubmitting(false);
      showNotification(`Task ${id ? 'updated' : 'created'} successfully`, 'success');
      
      // Navigate after a brief delay to allow the toast to be seen
      setTimeout(() => {
        router.push(`/tasks/view?id=${id || data.id}`);
      }, 1000);

    } catch (error) {
      showNotification(`Failed to ${id ? 'update' : 'create'} task. Please try again.`, 'error');
      console.error('Error submitting task:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[taskAddStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </ThemedView>
    );
  }

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
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  taskAddStyles.radioButton,
                  selectedPeriod === periodValues[period] && taskAddStyles.radioButtonActive
                ]}
                onPress={() => setSelectedPeriod(periodValues[period])}
              >
                <View style={[
                  taskAddStyles.checkbox,
                  selectedPeriod === periodValues[period] && taskAddStyles.checkboxChecked
                ]} />
                <ThemedText style={taskAddStyles.checkboxText}>{period}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={taskAddStyles.section}>
          <ThemedText style={taskAddStyles.label}>Days *</ThemedText>
          <View style={taskAddStyles.radioGroup}>
            {[ 'Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'].map((day, index) => (
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
        <TouchableOpacity 
          style={[
            taskAddStyles.submitButton,
            isSubmitting && { opacity: 0.5 }
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={taskAddStyles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : id ? 'Update' : 'Create'}
          </Text>
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

      {showToast && (
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: [{ translateX: -150 }],
            backgroundColor: toastType === 'success' ? '#4CAF50' : '#f44336',
            padding: 16,
            borderRadius: 8,
            width: 300,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>{toastMessage}</Text>
        </View>
      )}
    </ThemedView>
  );
}
