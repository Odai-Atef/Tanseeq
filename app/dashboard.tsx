import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { dashboardStyles as styles, colors } from '../constants/Theme';
import { Footer } from '../components/Footer';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  start_time: string;
  end_time: string;
  date_updated: string;
  date: string;
}

const TaskItem = ({ title, description, time, status }: { title: string, description: string, time: string, status: string }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{title}</Text>
      <Ionicons name="ellipsis-vertical" size={20} color="#464D61" />
    </View>
    <Text style={styles.taskDescription}>{description}</Text>
    <View style={styles.taskFooter}>
      <Text style={styles.taskTime}>{time}</Text>
      <View style={[styles.statusBadge, { backgroundColor: status === 'done' ? '#E8F5E9' : '#E3F2FD' }]}>
        <Text style={[styles.statusText, { color: status === 'done' ? '#4CAF50' : '#2196F3' }]}>
          {status}
        </Text>
      </View>
    </View>
  </View>
);

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="calendar-outline" size={48} color="#464D61" style={styles.emptyStateIcon} />
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

export default function Dashboard() {
  const [userName, setUserName] = useState('User');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [firstInProgressTask, setFirstInProgressTask] = useState<Task | null>(null);
  const [recentCompletedTask, setRecentCompletedTask] = useState<Task | null>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          const fullName = [userInfo.first_name, userInfo.last_name]
            .filter(Boolean)
            .join(' ');
          setUserName(fullName || 'User');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`${API_ENDPOINTS.SCHEDULE}?filter[date][_eq]=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data = await response.json();
      const todayTasks: Task[] = data.data || [];
      setTasks(todayTasks);

      // Find first in-progress task
      const inProgressTask = todayTasks.find(task => task.status === 'in progress');
      setFirstInProgressTask(inProgressTask || null);

      // Find most recent completed task
      const completedTasks = todayTasks.filter(task => task.status === 'done');
      const mostRecentCompleted = completedTasks.sort((a, b) => 
        new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime()
      )[0];
      setRecentCompletedTask(mostRecentCompleted || null);

      // Calculate progress percentage
      const totalTasks = todayTasks.length;
      const activeTasks = todayTasks.filter(task => 
        !['done', 'cancelled'].includes(task.status)
      ).length;
      
      const percentage = totalTasks > 0 
        ? Math.round((activeTasks / totalTasks) * 100)
        : 0;
      
      setProgressPercentage(percentage);
    } catch (error) {
      console.error('Error fetching today tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      );
    }

    if (error) {
      return <EmptyState message={error} />;
    }

    if (tasks.length === 0) {
      return <EmptyState message="No tasks scheduled for today" />;
    }

    return (
      <>
        {firstInProgressTask && (
          <TaskItem 
            title={firstInProgressTask.title}
            description={firstInProgressTask.description}
            time={`${firstInProgressTask.start_time} - ${firstInProgressTask.end_time}`}
            status={firstInProgressTask.status}
          />
        )}
        
        {recentCompletedTask && (
          <TaskItem 
            title={recentCompletedTask.title}
            description={recentCompletedTask.description}
            time={`${recentCompletedTask.start_time} - ${recentCompletedTask.end_time}`}
            status={recentCompletedTask.status}
          />
        )}

        {!firstInProgressTask && !recentCompletedTask && (
          <EmptyState message="No in-progress or completed tasks" />
        )}
      </>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subGreeting}>Let's complete your tasks</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressSection}>
          <View style={[styles.progressCircle, { backgroundColor: '#7980FF' }]}>
            <CircularProgress
              value={progressPercentage}
              radius={25}
              duration={2000}
              progressValueColor={colors.white}
              activeStrokeColor={colors.white}
              inActiveStrokeColor={'rgba(255, 255, 255, 0.3)'}
              inActiveStrokeWidth={5}
              activeStrokeWidth={5}
              titleColor={colors.white}
              titleStyle={{ fontWeight: '600' }}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Progress Today Task</Text>
            <Text style={styles.progressSubtext}>
              {tasks.filter(task => task.status === 'done').length}/{tasks.length} Tasks Completed
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/tasks/calendar')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {renderTaskContent()}
      </ScrollView>

      <Footer activeTab="home" />
    </ThemedView>
  );
}
