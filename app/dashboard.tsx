import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { dashboardTheme as styles, colors } from '../constants/Theme';
import { Footer } from '../components/Footer';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { router } from 'expo-router';
import { Schedule } from '../types/Schedule';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TaskItem = ({ schedule }: { schedule: Schedule }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{schedule.task.name}</Text>
      <Ionicons name="ellipsis-vertical" size={20} color="#464D61" />
    </View>
    <Text style={styles.taskDescription}>{schedule.task.description}</Text>
    <View style={styles.taskFooter}>
      <Text style={styles.taskTime}>
        {schedule.getFormattedStartTime()} - {schedule.getFormattedEndTime()}
      </Text>
      <View style={[styles.statusBadge, { backgroundColor: schedule.status === 'Done' ? '#E8F5E9' : '#E3F2FD' }]}>
        <Text style={[styles.statusText, { color: schedule.status === 'Done' ? '#4CAF50' : '#2196F3' }]}>
          {schedule.status}
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
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [firstInProgressSchedule, setFirstInProgressSchedule] = useState<Schedule | null>(null);
  const [recentCompletedSchedule, setRecentCompletedSchedule] = useState<Schedule | null>(null);
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
    fetchTodaySchedules();
  }, []);

  const fetchTodaySchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('access_token');
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[day][_eq]=${today}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch schedules');
      
      const data = await response.json();
      const todaySchedules = (data.data || []).map((item: any) => Schedule.fromAPI(item));
      setSchedules(todaySchedules);

      // Find first in-progress schedule
      const inProgressSchedule = todaySchedules.find((schedule: Schedule) => schedule.status === 'In-progress');
      setFirstInProgressSchedule(inProgressSchedule || null);

      // Find most recent completed schedule
      const completedSchedules = todaySchedules.filter((schedule: Schedule) => schedule.status === 'Done');
      const mostRecentCompleted = completedSchedules.sort((a: Schedule, b: Schedule) => {
        const dateA = a.task.date_updated ? new Date(a.task.date_updated).getTime() : 0;
        const dateB = b.task.date_updated ? new Date(b.task.date_updated).getTime() : 0;
        return dateB - dateA;
      })[0];
      setRecentCompletedSchedule(mostRecentCompleted || null);

      // Calculate progress percentage
      const totalSchedules = todaySchedules.length;
      const activeSchedules = todaySchedules.filter((schedule: Schedule) => 
        ['Done', 'Cancelled'].includes(schedule.status)
      ).length;
      
      const percentage = totalSchedules > 0 
        ? Math.round((activeSchedules / totalSchedules) * 100)
        : 0;
      
      setProgressPercentage(percentage);
    } catch (error) {
      console.error('Error fetching today schedules:', error);
      setError('Failed to load schedules. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading schedules...</Text>
        </View>
      );
    }

    if (error) {
      return <EmptyState message={error} />;
    }

    if (schedules.length === 0) {
      return <EmptyState message="No schedules for today" />;
    }

    return (
      <>
        {firstInProgressSchedule && (
          <TaskItem schedule={firstInProgressSchedule} />
        )}
        
        {recentCompletedSchedule && (
          <TaskItem schedule={recentCompletedSchedule} />
        )}

        {!firstInProgressSchedule && !recentCompletedSchedule && (
          <EmptyState message="No in-progress or completed schedules" />
        )}
      </>
    );
  };

  return (
    <ThemedView style={[styles.container, { borderTopWidth: 50, borderTopColor: 'rgb(121, 128, 255)' }]}>
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
              {schedules.filter((schedule: Schedule) => 
                ['Done', 'Cancelled'].includes(schedule.status)
              ).length}/{schedules.length} Tasks Completed
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
