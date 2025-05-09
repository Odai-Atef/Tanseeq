import { Redirect, Href } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { ADMIN_ROLE } from '../constants/roles';
import { View, ActivityIndicator } from 'react-native';
import { AppIntro, checkIfIntroShown } from '../components/AppIntroSlider';

const ROUTES = {
  SIGNIN: '/(auth)/signin' as Href,
  DASHBOARD: '/dashboard' as Href,
  CALENDAR: '/tasks/calendar' as Href,
};

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<Href | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Check if intro has been shown
      const introShown = await checkIfIntroShown();
      if (!introShown) {
        setShowIntro(true);
        setLoading(false);
        return;
      }
      
      // If intro has been shown, proceed with token validation
      await validateToken();
    };

    initialize();
  }, []);

  const validateToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setRedirectTo(ROUTES.SIGNIN);
        return;
      }

      const response = await fetch(API_ENDPOINTS.USER_INFO, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Token is invalid
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('userInfo');
        setRedirectTo(ROUTES.SIGNIN);
        return;
      }

      const userData = await response.json();
      if (userData.data) {
        // Store updated user info
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData.data));
        // Redirect based on role
        setRedirectTo(ROUTES.DASHBOARD);
      } else {
        setRedirectTo(ROUTES.SIGNIN);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setRedirectTo(ROUTES.SIGNIN);
    } finally {
      setLoading(false);
    }
  };

  const handleIntroDone = () => {
    setShowIntro(false);
    validateToken();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7980FF" />
      </View>
    );
  }

  if (showIntro) {
    return <AppIntro onDone={handleIntroDone} />;
  }

  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }

  return null;
}
