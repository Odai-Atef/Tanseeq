import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preloader } from '../components/Preloader';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      // Show preloader for at least 1.5 seconds for a smooth experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (token) {
        router.replace('/dashboard');
      } else {
        router.replace('/(auth)/signin');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/(auth)/signin');
    } finally {
      setIsLoading(false);
    }
  };

  return <Preloader visible={isLoading} />;
}
