import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Task } from '../../types/Task';

interface ApiResponse {
  data: any[];
}

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
          setTask(Task.fromAPI(result.data[0]));
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

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Task deleted successfully',
                position: 'top',
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30
              });

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
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (error || !task) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText style={{ color: colors.danger }}>{error || 'Task not found'}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.title}>{task.name}</ThemedText>
          <ThemedText style={styles.description}>{task.description}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Status</ThemedText>
          <ThemedText style={styles.description}>
            {task.status}
          </ThemedText>
        </View>

        {task.repeat_days.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Repeat Days</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {task.getRepeatDayNames().map((dayName) => (
                <View key={dayName} style={styles.repeatDayChip}>
                  <ThemedText style={styles.repeatDayText}>{dayName}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {task.repeat_monthly && (
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Monthly Repeat</ThemedText>
            <ThemedText style={styles.description}>
              Day {task.repeat_monthly} of every month
            </ThemedText>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Created</ThemedText>
          <ThemedText style={styles.description}>
            {task.getFormattedCreatedDate()}
          </ThemedText>
        </View>

        {task.date_updated && (
          <View style={styles.section}>
            <ThemedText style={styles.subtitle}>Last Updated</ThemedText>
            <ThemedText style={styles.description}>
              {task.getFormattedUpdatedDate()}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonPrimary]}
          onPress={() => router.push({
            pathname: "/tasks/add",
            params: { id: task.id }
          })}
        >
          <Ionicons name="pencil" size={20} color="white" style={styles.footerButtonIcon} />
          <ThemedText style={styles.footerButtonText}>Edit Task</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonDanger]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Ionicons name="trash" size={20} color="white" style={styles.footerButtonIcon} />
          <ThemedText style={styles.footerButtonText}>
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
