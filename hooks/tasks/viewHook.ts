import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useLanguage } from '../useLanguage';
import { Task } from '../../types/Task';
import { useRouter } from 'expo-router';

interface ApiResponse {
  data: any[];
}

interface HistoricalLog {
  id: string;
  day: string;
  status: string;
}

export const useTaskView = (id: string | string[]) => {
  const { t } = useLanguage();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [historicalLogs, setHistoricalLogs] = useState<HistoricalLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);


  useEffect(() => {
    const fetchTask = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          Toast.show({
    type: 'error',
    text1: t('common.toast.auth.required'),
    text2: t('common.error.auth.required'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});          return;
        }

        const defaultHomeStr = await AsyncStorage.getItem('DEFAULT_HOME');
        let url = `${API_ENDPOINTS.TASKS}?fields=*,task.*,task.images.*&filter[id][_eq]=${id}`;
        
        if (defaultHomeStr) {
          const defaultHome = JSON.parse(defaultHomeStr);
          url += `&filter[property_id][_eq]=${defaultHome.id}`;
        }

        const response = await fetch(
          url,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }

        const result: ApiResponse = await response.json();
        if (result.data && result.data.length > 0) {
          const taskData = Task.fromAPI(result.data[0]);
          setTask(taskData);
          setToken(accessToken);
          
          // Fetch historical logs after task is loaded
          fetchHistoricalLogs(taskData.id, accessToken);
        } else {
          throw new Error('Task not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load task';
        setError(errorMessage);
        Toast.show({
    type: 'error',
    text1: t('common.toast.error'),
    text2: t('common.toast.task.error.load'),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 70
});        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);
  
  const fetchHistoricalLogs = async (taskId: number, accessToken: string) => {
    try {
      setLogsLoading(true);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch schedule data for the task from the API
      // Filter by task ID and day less than or equal to today
      const url = `${API_ENDPOINTS.SCHEDULE}?fields=id,day,status&filter[task][_eq]=${taskId}&filter[day][_lte]=${today}`;
      
      const response = await fetch(
        url,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch historical logs');
      }

      const result: ApiResponse = await response.json();
      
      if (result.data && result.data.length > 0) {
        // Map the API response to our HistoricalLog interface
        const logs: HistoricalLog[] = result.data.map((item: any) => ({
          id: item.id,
          day: item.day,
          status: item.status
        }));
        
        // Sort logs by day (newest first)
        const sortedLogs = logs.sort((a, b) => {
          const dateA = new Date(a.day);
          const dateB = new Date(b.day);
          return dateB.getTime() - dateA.getTime();
        });
        
        setHistoricalLogs(sortedLogs);
      } else {
        setHistoricalLogs([]);
      }
    } catch (err) {
      console.error('Error fetching historical logs:', err);
      setHistoricalLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!task) return;
    
    try {
      setDeleteLoading(true);
      const accessToken = await AsyncStorage.getItem('access_token');
      if (!accessToken) {
        Toast.show({
          type: 'error',
          text1: t('common.toast.auth.required'),
          text2: t('common.error.auth.required'),
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 70
        });
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.TASKS}/${task.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Inactive'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      Toast.show({
        type: 'success',
        text1: t('common.toast.success'),
        text2: t('common.success.deleted', { item: t('tasks.title') }),
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70
      });
      
      // Navigate back to tasks list
      router.replace('/tasks');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      Toast.show({
        type: 'error',
        text1: t('common.toast.error'),
        text2: errorMessage,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 70
      });
      console.error('Error deleting task:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    task,
    loading,
    error,
    token,
    deleteTask,
    deleteLoading,
    historicalLogs,
    logsLoading
  };
};
