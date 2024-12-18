import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { colors, scheduleTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

interface TaskImage {
  id: string;
  filename_download: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  images: TaskImage[];
}

interface Schedule {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  task: Task;
}

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
  };

  const fetchSchedules = async (date: Date) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetch(
        `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*,task.images.*&filter[day][_eq]=${formattedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      setSchedules(data.data || []);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return colors.success;
      case 'in progress':
        return colors.info;
      case 'pending':
        return colors.warning;
      default:
        return colors.secondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return colors.rgbaSuccess;
      case 'in progress':
        return colors.rgbaInfo;
      case 'pending':
        return colors.rgbaWarning;
      default:
        return colors.rgbaDisable;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Schedule</ThemedText>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {schedules.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No schedules for this date</ThemedText>
            </View>
          ) : (
            schedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleItem}>
                <View style={styles.timeContainer}>
                  <ThemedText style={styles.time}>
                    {format(new Date(`2000-01-01T${schedule.start_time}`), 'hh:mm a')}
                  </ThemedText>
                  <ThemedText style={styles.timeDivider}>-</ThemedText>
                  <ThemedText style={styles.time}>
                    {format(new Date(`2000-01-01T${schedule.end_time}`), 'hh:mm a')}
                  </ThemedText>
                </View>

                <View style={styles.taskContainer}>
                  <ThemedText style={styles.taskTitle}>{schedule.task.title}</ThemedText>
                  <ThemedText style={styles.taskDescription}>{schedule.task.description}</ThemedText>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBgColor(schedule.task.status) }
                  ]}>
                    <ThemedText style={[
                      styles.statusText,
                      { color: getStatusColor(schedule.task.status) }
                    ]}>
                      {schedule.task.status}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}
