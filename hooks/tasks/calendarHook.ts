import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Schedule } from '../../types/Schedule';
import { API_ENDPOINTS } from '../../constants/api';

interface ApiResponse {
  data: any[];
}

export const useCalendar = () => {
  const [expandedSections, setExpandedSections] = useState({
    inProgress: true,
    done: true,
    notStarted: true
  });
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchSchedules = async (date: string) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[day][_eq]=${date}`,
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

      const result: ApiResponse = await response.json();
      const scheduleInstances = (result.data || []).map(schedule => Schedule.fromAPI(schedule));
      setSchedules(scheduleInstances);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const toggleSection = (section: 'inProgress' | 'done' | 'notStarted') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const inProgressTasks = schedules.filter(schedule => schedule.status === 'In-progress');
  const doneTasks = schedules.filter(schedule => schedule.status === 'Done');
  const notStartedTasks = schedules.filter(schedule => schedule.status === 'Not-Started');

  return {
    expandedSections,
    selectedDate,
    schedules,
    loading,
    inProgressTasks,
    doneTasks,
    notStartedTasks,
    setSelectedDate,
    toggleSection,
    fetchSchedules
  };
};
