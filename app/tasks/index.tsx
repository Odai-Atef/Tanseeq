import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Footer } from '../../components/Footer';
import { myTasksTheme as styles } from '../../constants/MyTasksTheme';
import { colors } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: number;
  status: string;
  name: string;
  description: string;
  date_created: string;
  date_updated: string;
}

interface ApiResponse {
  data: Task[];
}

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch(
          `${API_ENDPOINTS.TASKS}`,
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
        setTasks(result.data || []);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Footer activeTab="tasks" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: colors.danger }}>{error}</Text>
        </View>
        <Footer activeTab="tasks" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.taskSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Total Tasks</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tasks.length}</Text>
            </View>
          </View>

          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.taskItem}
                onPress={() => router.push({
                  pathname: "/tasks/view",
                  params: { id: task.id }
                })}
              >
                <Text style={styles.taskTitle}>{task.name}</Text>
                <Text style={styles.taskTime}>
                  {new Date(task.date_created).toLocaleDateString('en-US', {
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <Footer activeTab="tasks" />
    </View>
  );
}
