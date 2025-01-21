import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Footer } from '../../components/Footer';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../types/Task';
import { TaskItem } from '../../components/TaskItem';

interface ApiResponse {
  data: any[];
}

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

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
        `${API_ENDPOINTS.TASKS}?sort=-id`,
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
      setTasks((result.data || []).map(item => Task.fromAPI(item)));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  return (
    <ThemedView style={styles.container_trans}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
            <ThemedText style={{ color: colors.danger }}>{error}</ThemedText>
          </View>
        ) : (
          <View>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                item={task}
                type="task"
              />
            ))}
          </View>
        )}
      </ScrollView>
      <Footer activeTab="tasks" />
    </ThemedView>
  );
}
