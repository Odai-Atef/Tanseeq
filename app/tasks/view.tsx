import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { TasksTheme } from '../../constants/TasksTheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TaskImage {
  id: string;
  filename_download: string;
}

interface Task {
  id: number;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  name: string;
  description: string;
  images: string;
  repeat_days: string[];
  repeat_monthly: string;
}

interface ApiResponse {
  data: Task[];
}

type DayMap = {
  [key in '1' | '2' | '3' | '4' | '5' | '6' | '7']: string;
};

const days: DayMap = {
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday'
};

const getDayName = (day: string): string => {
  return days[day as keyof DayMap] || day;
};

export default function TaskView() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch(
          `${API_ENDPOINTS.TASKS}?fields=*,task.*,task.images.*&filter[id][_eq]=${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }

        const result: ApiResponse = await response.json();
        if (result.data && result.data.length > 0) {
          setTask(result.data[0]);
        } else {
          throw new Error('Task not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={TasksTheme.container}>
        <View style={TasksTheme.header}>
          <TouchableOpacity onPress={() => router.back()} style={TasksTheme.backButton}>
            <Ionicons name="arrow-back" size={24} color="#31394F" />
          </TouchableOpacity>
          <ThemedText style={TasksTheme.headerTitle}>Task Details</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={[TasksTheme.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#7980FF" />
        </View>
      </ThemedView>
    );
  }

  if (error || !task) {
    return (
      <ThemedView style={TasksTheme.container}>
        <View style={TasksTheme.header}>
          <TouchableOpacity onPress={() => router.back()} style={TasksTheme.backButton}>
            <Ionicons name="arrow-back" size={24} color="#31394F" />
          </TouchableOpacity>
          <ThemedText style={TasksTheme.headerTitle}>Task Details</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={[TasksTheme.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText style={{ color: '#F05A5A' }}>{error || 'Task not found'}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={TasksTheme.container}>
      <ScrollView style={TasksTheme.content}>
        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.title}>{task.name}</ThemedText>
          <ThemedText style={TasksTheme.description}>{task.description}</ThemedText>
        </View>

        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.subtitle}>Status</ThemedText>
          <View style={[
            TasksTheme.statusBadge,
            {
              backgroundColor: '#7980FF'
            }
          ]}>
            <ThemedText style={TasksTheme.statusText}>
              {task.status}
            </ThemedText>
          </View>
        </View>

        {task.repeat_days && task.repeat_days.length > 0 && (
          <View style={TasksTheme.section}>
            <ThemedText style={TasksTheme.subtitle}>Repeat Days</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {task.repeat_days.map((day) => (
                <View 
                  key={day}
                  style={{
                    backgroundColor: '#F8F9FD',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <ThemedText style={{ color: '#31394F' }}>{getDayName(day)}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {task.repeat_monthly && (
          <View style={TasksTheme.section}>
            <ThemedText style={TasksTheme.subtitle}>Monthly Repeat</ThemedText>
            <ThemedText style={TasksTheme.description}>
              Day {task.repeat_monthly} of every month
            </ThemedText>
          </View>
        )}

        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.subtitle}>Created</ThemedText>
          <ThemedText style={TasksTheme.description}>
            {new Date(task.date_created).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </ThemedText>
        </View>

        <View style={TasksTheme.section}>
          <ThemedText style={TasksTheme.subtitle}>Last Updated</ThemedText>
          <ThemedText style={TasksTheme.description}>
            {new Date(task.date_updated).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
