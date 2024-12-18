import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preloader } from '../components/Preloader';
import { API_ENDPOINTS } from '../constants/api';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        // Wait minimum 1.5s for smooth preloader experience
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.replace('/(auth)/signin');
        return;
      }

      // Verify token with API
      const response = await fetch(API_ENDPOINTS.USER_INFO, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Wait minimum 1.5s for smooth preloader experience
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (response.status === 200) {
        router.replace('/dashboard');
      } else {
        // Token invalid or expired
        await AsyncStorage.removeItem('access_token');
        router.replace('/(auth)/signin');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Wait minimum 1.5s for smooth preloader experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      // On error, clear token and go to signin
      await AsyncStorage.removeItem('access_token');
      router.replace('/(auth)/signin');
    } finally {
      setIsLoading(false);
    }
  };

  return <Preloader visible={isLoading} />;
}
