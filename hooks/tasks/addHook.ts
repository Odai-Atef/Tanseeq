import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Task } from '../../types/Task';
import { API_ENDPOINTS } from '../../constants/api';
import { uploadFile } from '../../utils/fileUpload';

type PeriodValues = {
  'Manual Assignment (No Schedule)': string;
  'Every Day': string;
  'Weekly': string;
  'Bi Weekly': string;
  'Monthly': string;
  'Every 3 Months': string;
  'Every 6 Months': string;
  'Annually': string;
};

export const useTaskAdd = (id?: string) => {
  const router = useRouter();
  const initialTask = new Task({
    id: undefined,
    name: '',
    description: '',
    repeat_monthly: '-1',
    repeat_days: [],
    status: 'Active',
    user_created: '',
    date_created: new Date().toISOString(),
    user_updated: null,
    date_updated: null,
    images: null
  });

  const [task, setTask] = useState<Task>(initialTask);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const periodValues: PeriodValues = {
    'Manual Assignment (No Schedule)': '-1',
    'Every Day': '1',
    'Weekly': '7',
    'Bi Weekly': '14',
    'Monthly': '28',
    'Every 3 Months': '90',
    'Every 6 Months': '180',
    'Annually': '360'
  };

  const periods = Object.keys(periodValues) as (keyof PeriodValues)[];

  const showNotification = (message: string, type: 'success' | 'error') => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Success' : 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
  };

  useEffect(() => {
    if (id) {
      fetchTaskData();
    }
  }, [id]);

  const fetchTaskData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }

      const result = await response.json();
      setTask(Task.fromAPI(result.data));
      if (result.data.images) {
        setSelectedImage(`${API_ENDPOINTS.BASE_URL}/assets/${result.data.images}?access_token=${token}`);
      }
    } catch (error) {
      showNotification('Failed to load task data', 'error');
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const toggleDaySelection = (day: string) => {
    const newTask = task.clone();
    if (newTask.repeatsOnDay(day)) {
      newTask.repeat_days = newTask.repeat_days.filter(d => d !== day);
    } else {
      newTask.repeat_days = [...newTask.repeat_days, day];
    }
    setTask(newTask);
  };

  const updateTaskField = (field: keyof Task, value: any) => {
    const newTask = task.clone();
    (newTask as any)[field] = value;
    setTask(newTask);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showNotification('Permission to access media library is required!', 'error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        updateTaskField('images', null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showNotification('Failed to pick image', 'error');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showNotification('Permission to access camera is required!', 'error');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        updateTaskField('images', null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showNotification('Failed to take photo', 'error');
    }
  };

  const handleSubmit = async () => {
    const validation = task.validate();
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        showNotification(error, 'error');
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showNotification('Authentication required', 'error');
        setIsSubmitting(false);
        return;
      }

      let imageId = null;
      if (selectedImage) {
        imageId = await uploadFile(selectedImage, token);
        if (!imageId) {
          showNotification('Failed to upload image', 'error');
          setIsSubmitting(false);
          return;
        }
      }

      const endpoint = id ? `${API_ENDPOINTS.TASKS}/${id}` : API_ENDPOINTS.TASKS;
      const method = id ? 'PATCH' : 'POST';

      const taskData = {
        status: task.status,
        name: task.name,
        description: task.description,
        images: imageId,
        repeat_days: task.repeat_days,
        repeat_monthly: task.repeat_monthly
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${id ? 'update' : 'create'} task`);
      }

      await response.json();
      setIsSubmitting(false);
      showNotification(`Task ${id ? 'updated' : 'created'} successfully`, 'success');
      
      if (!id) {
        setTask(initialTask);
        setSelectedImage(null);
      }
      
      setTimeout(() => {
        router.push('/tasks');
      }, 1000);

    } catch (error) {
      showNotification(`Failed to ${id ? 'update' : 'create'} task. Please try again.`, 'error');
      console.error('Error submitting task:', error);
      setIsSubmitting(false);
    }
  };

  return {
    task,
    startDate,
    showStartPicker,
    isSubmitting,
    isLoading,
    selectedImage,
    showPicker,
    periodValues,
    periods,
    setShowStartPicker,
    setShowPicker,
    handleStartDateChange,
    toggleDaySelection,
    updateTaskField,
    pickImage,
    takePhoto,
    handleSubmit,
    setSelectedImage
  };
};
