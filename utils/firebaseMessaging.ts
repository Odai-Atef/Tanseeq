import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';

// Request user permission for notifications (iOS only)
export const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
  
  return true; // Android doesn't need explicit permission for FCM
};

// Get the FCM token
export const getFCMToken = async () => {
  try {
    // Check if we have a token saved
    const savedToken = await AsyncStorage.getItem('fcm_token');
    
    if (!savedToken) {
      // Get a new token
      const token = await messaging().getToken();
      
      if (token) {
        // Save the token
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
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fcm_token: token
          })
        });
      }
    }
  } catch (error) {
    console.error('Error registering device with backend:', error);
  }
};

// Set up foreground notification handler
export const setupForegroundNotificationHandler = () => {
  return messaging().onMessage(async remoteMessage => {
    // Handle the message here
    console.log('Foreground Message received:', remoteMessage);
    
    // You can use a notification library like react-native-toast-message
    // to show the notification while the app is in the foreground
    return remoteMessage;
  });
};

// Set up background notification handler
export const setupBackgroundNotificationHandler = () => {
  // This needs to be called outside of any component
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background Message received:', remoteMessage);
    // Handle the message here
    return Promise.resolve();
  });
};

// Initialize Firebase Messaging
export const initializeFirebaseMessaging = async () => {
  try {
    // Check if messaging is available
    if (!messaging) {
      console.error('Firebase Messaging is not available');
      return;
    }
    
    // Request permission (iOS)
    const hasPermission = await requestUserPermission();
    
    if (hasPermission) {
      // Get and save the FCM token
      const token = await getFCMToken();
      console.log('FCM Token obtained:', token ? 'Success' : 'Failed');
      
      // Register with backend
      await registerDeviceWithBackend();
      
      // Set up notification handlers
      setupForegroundNotificationHandler();
      
      // Check if the app was opened from a notification
      try {
        const initialNotification = await messaging().getInitialNotification();
        
        if (initialNotification) {
          console.log('App opened from notification:', initialNotification);
          // Handle the initial notification if needed
        }
      } catch (notificationError) {
        console.error('Error checking initial notification:', notificationError);
      }
    } else {
      console.log('Push notification permission not granted');
    }
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    // Don't show alert in production, but useful for debugging
    if (__DEV__) {
      Alert.alert(
        'Firebase Messaging Error',
        'There was an error initializing Firebase Messaging. Please check your configuration.',
        [{ text: 'OK' }]
      );
    }
  }
};
