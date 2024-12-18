import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Task } from '../../types/Task';

type PeriodValues = {
  'Every Day': string;
  'Weekly': string;
  'Bi Weekly': string;
  'Monthly': string;
  'Every 3 Months': string;
  'Every 6 Months': string;
  'Every Year': string;
};

export default function TaskAdd() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const [task, setTask] = useState<Task>(new Task({
    id: undefined,
    name: '',
    description: '',
    repeat_monthly: '',
    repeat_days: [],
    status: 'Active',
    user_created: '',
    date_created: new Date().toISOString(),
    user_updated: null,
    date_updated: null,
    images: null
  }));
  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setTask(Task.fromAPI(result.data));
    } catch (error) {
      showNotification('Failed to load task data', 'error');
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Success' : 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
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
    const newTask = task.clone();
    if (newTask.repeatsOnDay(day)) {
      newTask.repeat_days = newTask.repeat_days.filter(d => d !== day);
    } else {
      newTask.repeat_days = [...newTask.repeat_days, day];
    }
    setTask(newTask);
  };

  const updateTaskField = (field: keyof Task, value: any) => {
    const newTask = task.clone();
    (newTask as any)[field] = value;
    setTask(newTask);
  };

  const handleSubmit = async () => {
    const validation = task.validate();
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        showNotification(error, 'error');
      });
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
        body: JSON.stringify(task.toAPI())
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
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.label}>Title *</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Wireframe for NFT Landing Page"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={task.name}
            onChangeText={name => updateTaskField('name', name)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Description *</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your description"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            multiline
            numberOfLines={4}
            value={task.description || ''}
            onChangeText={description => updateTaskField('description', description)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Images (Optional)</ThemedText>
          <TouchableOpacity style={styles.uploadButton}>
            <Feather name="upload" size={24} color={colors.textPrimary} />
            <ThemedText style={styles.uploadText}>Upload Image</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Period *</ThemedText>
          <View style={styles.radioGroup}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.radioButton,
                  task.repeat_monthly === periodValues[period] && styles.radioButtonActive
                ]}
                onPress={() => updateTaskField('repeat_monthly', periodValues[period])}
              >
                <View style={[
                  styles.checkbox,
                  task.repeat_monthly === periodValues[period] && styles.checkboxChecked
                ]} />
                <ThemedText style={styles.checkboxText}>{period}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Days *</ThemedText>
          <View style={styles.radioGroup}>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checkboxContainer,
                  task.repeatsOnDay((index + 1).toString()) && styles.checkboxActive
                ]}
                onPress={() => toggleDaySelection((index + 1).toString())}
              >
                <View style={[
                  styles.checkbox,
                  task.repeatsOnDay((index + 1).toString()) && styles.checkboxChecked
                ]} />
                <ThemedText style={styles.checkboxText}>{day}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && { opacity: 0.5 }
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : id ? 'Update' : 'Create'}
          </ThemedText>
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
