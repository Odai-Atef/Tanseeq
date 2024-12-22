import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { colors, taskTheme as styles } from '../../constants/Theme';
import { API_ENDPOINTS } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Task } from '../../types/Task';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../../utils/fileUpload';

type PeriodValues = {
  'Every Day': string;
  'Weekly': string;
  'Bi Weekly': string;
  'Monthly': string;
  'Every 3 Months': string;
  'Every 6 Months': string;
  'Every Year': string;
};

export default function TaskAdd() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const initialTask = new Task({
    id: undefined,
    name: '',
    description: '',
    repeat_monthly: '',
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
        setSelectedImage(result.data.images);
      }
    } catch (error) {
      showNotification('Failed to load task data', 'error');
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const periodValues: PeriodValues = {
    'Every Day': '1',
    'Weekly': '7',
    'Bi Weekly': '14',
    'Monthly': '28',
    'Every 3 Months': '90',
    'Every 6 Months': '180',
    'Every Year': '360'
  };

  const periods = Object.keys(periodValues) as (keyof PeriodValues)[];

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
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showNotification('Permission to access media library is required!', 'error');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        updateTaskField('images', null); // Set to null initially, will be updated with ID after upload
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showNotification('Failed to pick image', 'error');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showNotification('Permission to access camera is required!', 'error');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        updateTaskField('images', null); // Set to null initially, will be updated with ID after upload
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

      // Upload image first if selected
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
        images: imageId, // Use the uploaded image ID
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

      const data = await response.json();
      setIsSubmitting(false);
      showNotification(`Task ${id ? 'updated' : 'created'} successfully`, 'success');
      
      // Clear form after successful submission
      if (!id) {
        setTask(initialTask);
        setSelectedImage(null);
      }
      
      // Navigate after a brief delay to allow the toast to be seen
      setTimeout(() => {
        router.push('/tasks');
      }, 1000);

    } catch (error) {
      showNotification(`Failed to ${id ? 'update' : 'create'} task. Please try again.`, 'error');
      console.error('Error submitting task:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.label}>Title *</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Task name"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            value={task.name}
            onChangeText={name => updateTaskField('name', name)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your description"
            placeholderTextColor="rgba(49, 57, 79, 0.6)"
            multiline
            numberOfLines={4}
            value={task.description || ''}
            onChangeText={description => updateTaskField('description', description)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Images (Optional)</ThemedText>
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity style={[styles.uploadButton, { marginRight: 10 }]} onPress={pickImage}>
              <Feather name="image" size={24} color={colors.textPrimary} />
              <ThemedText style={styles.uploadText}>Choose Image</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
              <Feather name="camera" size={24} color={colors.textPrimary} />
              <ThemedText style={styles.uploadText}>Take Photo</ThemedText>
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => {
                  setSelectedImage(null);
                  updateTaskField('images', null);
                }}
              >
                <Ionicons name="close-circle" size={24} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Period *</ThemedText>
          <View style={styles.radioGroup}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.radioButton,
                  task.repeat_monthly === periodValues[period] && styles.radioButtonActive
                ]}
                onPress={() => updateTaskField('repeat_monthly', periodValues[period])}
              >
                <View style={[
                  styles.checkbox,
                  task.repeat_monthly === periodValues[period] && styles.checkboxChecked
                ]} />
                <ThemedText style={styles.checkboxText}>{period}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Days *</ThemedText>
          <View style={styles.radioGroup}>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checkboxContainer,
                  task.repeatsOnDay((index + 1).toString()) && styles.checkboxActive
                ]}
                onPress={() => toggleDaySelection((index + 1).toString())}
              >
                <View style={[
                  styles.checkbox,
                  task.repeatsOnDay((index + 1).toString()) && styles.checkboxChecked
                ]} />
                <ThemedText style={styles.checkboxText}>{day}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && { opacity: 0.5 }
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : id ? 'Update' : 'Create'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}
    </ThemedView>
  );
}
