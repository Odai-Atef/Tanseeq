import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export const handleAuthError = async (error: any) => {
  // Check if error is related to authentication
  if (
    error.message?.includes('token') ||
    error.message?.includes('authentication') ||
    error.message?.includes('unauthorized') ||
    error.message?.includes('forbidden') ||
    error.status === 401 ||
    error.status === 403
  ) {
    // Clear stored tokens
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
    
    // Show toast message
    Toast.show({
      type: 'error',
      text1: 'Session Expired',
      text2: 'Your token is expired. You have to sign in again.',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });

    // Redirect to login
    router.replace('/(auth)/signin');
    return true;
  }
  return false;
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Your token is expired. You have to sign in again.',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30
      });
      router.replace('/(auth)/signin');
      return false;
    }
    return true;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Session Expired',
      text2: 'Your token is expired. You have to sign in again.',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30
    });
    router.replace('/(auth)/signin');
    return false;
  }
};
