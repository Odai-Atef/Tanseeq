import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../components/Toast';
import { Task } from '../../types/Task';

interface ApiResponse {
  data: any[];
}

export const useTaskView = (id: string | string[]) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const fetchTask = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          showToast({
            type: 'error',
            text1Key: 'common.toast.auth.required',
            text2Key: 'common.error.auth.required'
          });
          return;
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
        showToast({
          type: 'error',
          text1Key: 'common.toast.error',
          text2Key: 'common.toast.task.error.load'
        });
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  return {
    task,
    loading,
    error,
    token
  };
};
