import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { API_ENDPOINTS } from '../../constants/api';
import { useTranslation } from '../../contexts/LanguageContext';

interface Task {
  id: number;
  name: string;
}

interface ApiResponse {
  data: Task[];
}

export const useScheduleAdd = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [date, setDate] = useState(today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const showError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: t('common.error.general'),
      text2: t(message),
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
  };

  const showSuccess = (message: string) => {
    Toast.show({
      type: 'success',
      text1: t('common.success.created'),
      text2: t(message),
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30
    });
  };

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
        `${API_ENDPOINTS.TASKS}?fields=id,name`,
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
      if (!result.data || result.data.length === 0) {
        setError(t('schedules.add.noTasks'));
      } else {
        setTasks(result.data);
      }
    } catch (error) {
      const errorMessage = t('schedules.add.error');
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (newDate < today) {
        Alert.alert(
          t('common.error.general'),
          t('schedules.add.invalidDate')
        );
        return;
      }
      
      setDate(newDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTaskId) {
      Alert.alert(
        t('common.error.general'),
        t('schedules.add.selectTask')
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch(API_ENDPOINTS.SCHEDULE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: selectedTaskId,
          day: date.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create schedule');

      await response.json();
      showSuccess(t('schedules.add.success'));
      router.back();
    } catch (error) {
      showError(t('schedules.add.error'));
      console.error('Error creating schedule:', error);
    }
  };

  return {
    date,
    showDatePicker,
    tasks,
    loading,
    error,
    selectedTaskId,
    setShowDatePicker,
    setSelectedTaskId,
    handleDateChange,
    handleSubmit,
    today
  };
};
