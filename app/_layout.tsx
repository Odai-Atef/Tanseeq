import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { LanguageProvider } from '../contexts/LanguageContext';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { colors } from '../constants/Theme';
import * as SplashScreen from 'expo-splash-screen';
import OneSignal from 'react-native-onesignal';
import { ONESIGNAL_APP_ID } from '../constants/OneSignal';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.light,
      card: colors.white,
      text: colors.textPrimary,
      border: colors.secondary,
      notification: colors.primary,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary,
      background: colors.dark,
      card: colors.secondary,
      text: colors.white,
      border: colors.secondary,
      notification: colors.primary,
    },
  },
};

export default function Layout() {
  const [loaded] = useFonts({
    'Cairo': require('../assets/fonts/Cairo/Cairo-VariableFont_slnt,wght.ttf'),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Initialize OneSignal
        OneSignal.initialize(ONESIGNAL_APP_ID);
        
        // Enable logging for debugging (optional)
        OneSignal.setLogLevel(6, 0);

        // Handle foreground notifications
        OneSignal.setNotificationWillShowInForegroundHandler((event) => {
          // Show Toast notification
          Toast.show({
            type: 'info',
            text1: event.notification.title || 'New Notification',
            text2: event.notification.body || '',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
          });
        });

        // Handle notification opened
        OneSignal.setNotificationOpenedHandler((event) => {
        });

        // Request push notification permission
        OneSignal.promptForPushNotificationsWithUserResponse();

        // Get OneSignal User ID and update user info
        const deviceState = await OneSignal.getDeviceState();
        if (deviceState?.userId) {
          const token = await AsyncStorage.getItem('access_token');
          if (token) {
            await fetch(API_ENDPOINTS.USER_INFO, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                one_signal: deviceState.userId
              })
            });
          }
        }
      } catch (error) {
      }
    };

    initOneSignal();
  }, []);

  useEffect(() => {
    if (loaded) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme[colorScheme ?? 'light']}>
      <LanguageProvider>
        <Stack screenOptions={{ 
          headerShown: false,
          headerTitleStyle: {
            fontFamily: 'Cairo'
          },
          headerBackTitleStyle: {
            fontFamily: 'Cairo'
          }
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="tasks/calendar" options={{ headerShown: false }} />
          <Stack.Screen name="tasks/index" options={{ headerShown: false }} />
          <Stack.Screen name="tasks/view" options={{ headerShown: false }} />
          <Stack.Screen name="tasks/add" options={{ headerBackTitle: '', headerShown: false }} />
          <Stack.Screen name="schedules/view" options={{ headerBackTitle: '', headerShown: false }} />
          <Stack.Screen name="schedules/add" options={{ headerBackTitle: '', headerShown: false }} />
          <Stack.Screen name="home/invite" options={{ headerBackTitle: '', headerShown: false }} />
          <Stack.Screen name="home/join" options={{ headerBackTitle: '', headerShown: false }} />
        </Stack>
        <Toast />
      </LanguageProvider>
    </ThemeProvider>
  );
}
