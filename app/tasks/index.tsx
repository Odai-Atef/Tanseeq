import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
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

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface ApiResponse {
  data: Task[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onEdit, onDelete }) => {
  const renderRightActions = () => {
    return (
      <View style={{ 
        flexDirection: 'row',
        height: '100%',
        alignItems: 'stretch'
      }}>
        <TouchableOpacity
          onPress={onEdit}
          style={{
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            minHeight: 80,
          }}
        >
          <Ionicons name="pencil" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={{
            backgroundColor: colors.danger,
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            minHeight: 80,
          }}
        >
          <Ionicons name="trash" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      containerStyle={styles.swipeableContainer}
    >
      <TouchableOpacity 
        onPress={onPress} 
        style={[styles.taskItem, { minHeight: 80 }]}
      >
        <Text style={styles.taskTitle}>{task.name}</Text>
        <Text style={styles.taskTime}>{task.description}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
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
      setTasks(result.data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (taskId: number) => {
    router.push({
      pathname: "/tasks/add",
      params: { id: taskId }
    });
  };

  const handleDelete = async (taskId: number) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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
            <Text style={styles.sectionTitle}>Tasks ({tasks.length})</Text>
          </View>

          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => router.push({
                  pathname: "/tasks/view",
                  params: { id: task.id }
                })}
                onEdit={() => handleEdit(task.id)}
                onDelete={() => handleDelete(task.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Footer activeTab="tasks" />
    </View>
  );
}
