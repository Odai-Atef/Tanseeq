import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../components/Toast';
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

  const showError = () => {
    showToast({
      type: 'error',
      text1Key: 'common.toast.error',
      text2Key: 'common.error.general'
    });
  };

  const fetchSchedules = async (date: string) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showToast({
          type: 'error',
          text1Key: 'common.toast.auth.required',
          text2Key: 'common.error.auth.required'
        });
        return;
      }

      const defaultHomeStr = await AsyncStorage.getItem('DEFAULT_HOME');
      let url = `${API_ENDPOINTS.SCHEDULE}?fields=*,task.*&filter[day][_eq]=${date}`;
      
      if (defaultHomeStr) {
        const defaultHome = JSON.parse(defaultHomeStr);
        url += `&filter[task][property_id][_eq]=${defaultHome.id}`;
      }

      const response = await fetch(
        url,
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
      showToast({
        type: 'error',
        text1Key: 'common.toast.error',
        text2Key: 'common.toast.schedule.error.load'
      });
      console.error('Error fetching schedules:', err);
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
