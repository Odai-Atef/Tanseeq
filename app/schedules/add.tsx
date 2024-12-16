import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, scheduleAddStyles as styles } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: number;
  name: string;
}

interface ApiResponse {
  data: Task[];
}

export default function ScheduleAdd() {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [date, setDate] = useState(today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${API_ENDPOINTS.TASKS}?fields=id,name`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const result: ApiResponse = await response.json();
      if (!result.data || result.data.length === 0) {
        setError('No tasks available. Please create a task first.');
      } else {
        setTasks(result.data);
      }
    } catch (error) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (newDate < today) {
        Alert.alert('Invalid Date', 'Please select today or a future date');
        return;
      }
      
      setDate(newDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTaskId) {
      Alert.alert('Error', 'Please select a task');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch(API_ENDPOINTS.SCHEDULE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: selectedTaskId,
          scheduled_date: date.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create schedule');

      const data = await response.json();
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create schedule. Please try again.');
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Add Schedule</ThemedText>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Date</ThemedText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.dateIcon} 
            />
            <ThemedText style={styles.dateText}>
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View>
          <ThemedText style={styles.sectionTitle}>Select Task</ThemedText>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : (
            <View style={styles.taskList}>
              {tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskItem,
                    selectedTaskId === task.id && styles.taskItemSelected,
                  ]}
                  onPress={() => setSelectedTaskId(task.id)}
                >
                  <ThemedText style={styles.taskItemText}>{task.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || !!error || !selectedTaskId) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !!error || !selectedTaskId}
        >
          <ThemedText style={styles.submitButtonText}>Create Schedule</ThemedText>
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' ? (
        showDatePicker && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: colors.line,
          }}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={today}
            />
          </View>
        )
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={today}
          />
        )
      )}
    </ThemedView>
  );
}
