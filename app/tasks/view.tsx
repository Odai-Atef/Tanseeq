import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { TasksTheme } from '../../constants/TasksTheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/Theme';
import Toast from 'react-native-toast-message';

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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
        const errorMessage = err instanceof Error ? err.message : 'Failed to load task';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const token = await AsyncStorage.getItem('access_token');
              if (!token) throw new Error('No access token found');

              const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) throw new Error('Failed to delete task');

              router.replace('/tasks');
            } catch (error) {
              showError('Failed to delete task. Please try again.');
              console.error('Error deleting task:', error);
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={TasksTheme.container}>
        <View style={[TasksTheme.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#7980FF" />
        </View>
      </ThemedView>
    );
  }

  if (error || !task) {
    return (
      <ThemedView style={TasksTheme.container}>
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
          <ThemedText style={TasksTheme.description}>
          {task.status}
            </ThemedText>
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

      <View style={{
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: colors.line,
        backgroundColor: colors.white,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onPress={() => router.push({
            pathname: "/tasks/add",
            params: { id: task.id }
          })}
        >
          <Ionicons name="pencil" size={20} color="white" style={{ marginRight: 8 }} />
          <ThemedText style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Edit Task</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: colors.danger,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Ionicons name="trash" size={20} color="white" style={{ marginRight: 8 }} />
          <ThemedText style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
