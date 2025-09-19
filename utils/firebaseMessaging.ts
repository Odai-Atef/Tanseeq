import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';

// Request user permission for notifications (iOS only)
export const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  return true; // Android doesn't need explicit permission for FCM
};

// Get the FCM token
export const getFCMToken = async () => {
  try {
    const savedToken = await AsyncStorage.getItem('fcm_token');

    if (!savedToken) {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcm_token', token);
        return token;
      }
    }

    return savedToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Register the device with your backend
export const registerDeviceWithBackend = async () => {
  try {
    const token = await getFCMToken();
    if (token) {
      const authToken = await AsyncStorage.getItem('access_token');
      if (authToken) {
        await fetch(API_ENDPOINTS.USER_INFO, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fcm_token: token }),
        });
      }
    }
  } catch (error) {
    console.error('Error registering device with backend:', error);
  }
};

// Foreground notification handler
export const setupForegroundNotificationHandler = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message received:', remoteMessage);
    return remoteMessage;
  });
};

// Background notification handler (must be called at the entry point, not inside a component)
export const setupBackgroundNotificationHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background Message received:', remoteMessage);
    return Promise.resolve();
  });
};
