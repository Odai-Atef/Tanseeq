import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

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
  const [error, setError] = useState('');

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
      setError(err instanceof Error ? err.message : 'Failed to load schedules');
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
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {schedules.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No schedules for this date</Text>
            </View>
          ) : (
            schedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>
                    {format(new Date(`2000-01-01T${schedule.start_time}`), 'hh:mm a')}
                  </Text>
                  <Text style={styles.timeDivider}>-</Text>
                  <Text style={styles.time}>
                    {format(new Date(`2000-01-01T${schedule.end_time}`), 'hh:mm a')}
                  </Text>
                </View>

                <View style={styles.taskContainer}>
                  <Text style={styles.taskTitle}>{schedule.task.title}</Text>
                  <Text style={styles.taskDescription}>{schedule.task.description}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBgColor(schedule.task.status) }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(schedule.task.status) }
                    ]}>
                      {schedule.task.status}
                    </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
  },
  scheduleItem: {
    flexDirection: 'row' as const,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: colors.secondary,
  },
  timeDivider: {
    fontSize: 14,
    color: colors.secondary,
    marginVertical: 4,
  },
  taskContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
