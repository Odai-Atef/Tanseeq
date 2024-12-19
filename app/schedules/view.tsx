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
import { Schedule } from '../../types/Schedule';

interface ApiResponse {
  data: any[];
}

const ADMIN_ROLE = "5e81b539-8401-4106-9e8f-a076f881453b";

export default function ScheduleView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

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
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');

        const response = await fetch(API_ENDPOINTS.USER_INFO, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user info');

        const userData = await response.json();
        setUserRole(userData.data.role);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch(
          `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[id][_eq]=${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }

        const result: ApiResponse = await response.json();
        if (result.data && result.data.length > 0) {
          setSchedule(Schedule.fromAPI(result.data[0]));
        } else {
          throw new Error('Schedule not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load schedule';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchedule();
    }
  }, [id]);

  const handleCancel = async () => {
    Alert.alert(
      "Cancel Schedule",
      "Are you sure you want to cancel this schedule?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              if (!token) throw new Error('No access token found');

              const response = await fetch(`${API_ENDPOINTS.SCHEDULE}/${id}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'Cancelled'
                })
              });

              if (!response.ok) throw new Error('Failed to cancel schedule');

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Schedule cancelled successfully',
                position: 'top',
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30
              });

              router.replace('/schedules');
            } catch (error) {
              showError('Failed to cancel schedule. Please try again.');
              console.error('Error cancelling schedule:', error);
            }
          }
        }
      ]
    );
  };

  const handleStartTask = async () => {
    Alert.alert(
      "Start Task",
      "Are you sure you want to start this task?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              if (!token) throw new Error('No access token found');

              const response = await fetch(`${API_ENDPOINTS.SCHEDULE}/${id}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'In-progress',
                  start_at: new Date().toISOString()
                })
              });

              if (!response.ok) throw new Error('Failed to start task');

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Task started successfully',
                position: 'top',
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30
              });

              router.replace('/tasks/calendar');
            } catch (error) {
              showError('Failed to start task. Please try again.');
              console.error('Error starting task:', error);
            }
          }
        }
      ]
    );
  };

  const handleCloseTask = async () => {
    Alert.alert(
      "Close Task",
      "Are you sure you want to close this task?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              if (!token) throw new Error('No access token found');

              const response = await fetch(`${API_ENDPOINTS.SCHEDULE}/${id}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'Done',
                  end_at: new Date().toISOString()
                })
              });

              if (!response.ok) throw new Error('Failed to close task');

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Task closed successfully',
                position: 'top',
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 30
              });

              router.replace('/tasks/calendar');
            } catch (error) {
              showError('Failed to close task. Please try again.');
              console.error('Error closing task:', error);
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

  if (error || !schedule) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText style={{ color: colors.danger }}>{error || 'Schedule not found'}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const renderFooter = () => {
    if (schedule.status === 'Done') {
      return null;
    }
    if (schedule.status === 'Not-Started') {
      if (userRole === ADMIN_ROLE) {
        return (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonDanger, { flex: 1 }]}
              onPress={handleCancel}
            >
              <Ionicons name="close-circle" size={20} color="white" style={styles.footerButtonIcon} />
              <ThemedText style={styles.footerButtonText}>Cancel Schedule</ThemedText>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonPrimary, { flex: 1 }]}
              onPress={handleStartTask}
            >
              <Ionicons name="play" size={20} color="white" style={styles.footerButtonIcon} />
              <ThemedText style={styles.footerButtonText}>Start this task</ThemedText>
            </TouchableOpacity>
          </View>
        );
      }
    }

    if (schedule.status === 'In-progress' && userRole !== ADMIN_ROLE) {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.footerButtonPrimary, { flex: 1 }]}
            onPress={handleCloseTask}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" style={styles.footerButtonIcon} />
            <ThemedText style={styles.footerButtonText}>Close the task</ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonPrimary, { flex: 1 }]}
          onPress={() => router.push({
            pathname: "/schedules/add",
            params: { id: schedule.id }
          })}
        >
          <Ionicons name="pencil" size={20} color="white" style={styles.footerButtonIcon} />
          <ThemedText style={styles.footerButtonText}>Edit Schedule</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.title}>{schedule.task.name}</ThemedText>
          <ThemedText style={styles.description}>{schedule.task.description}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Day</ThemedText>
          <ThemedText style={styles.description}>{schedule.day}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Time</ThemedText>
          <ThemedText style={styles.description}>
            {schedule.getFormattedStartTime()} - {schedule.getFormattedEndTime()}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Status</ThemedText>
          <ThemedText style={styles.description}>{schedule.status}</ThemedText>
        </View>
      </ScrollView>

      {renderFooter()}
    </ThemedView>
  );
}
