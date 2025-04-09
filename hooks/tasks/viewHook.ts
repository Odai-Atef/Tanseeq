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

export const useTaskView = (id: string | string[]) => {
  const { t } = useLanguage();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


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
          setTask(Task.fromAPI(result.data[0]));
          setToken(accessToken);
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
    deleteLoading
  };
};
