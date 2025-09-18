import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { LanguageProvider } from '../contexts/LanguageContext';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { useColorScheme, LogBox } from 'react-native';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { colors } from '../constants/Theme';
import * as SplashScreen from 'expo-splash-screen';
import firebase from '@react-native-firebase/app';
import { FIREBASE_CONFIG } from '../constants/Firebase';
import { initializeFirebaseMessaging, setupBackgroundNotificationHandler } from '../utils/firebaseMessaging';

// Ignore specific warnings
LogBox.ignoreLogs(['Warning: ...']); // Ignore specific warnings

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

// Initialize Firebase at the app level, outside of any component
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

// Set up background message handler outside of any component
setupBackgroundNotificationHandler();

export default function Layout() {
  const [loaded] = useFonts({
    'Cairo': require('../assets/fonts/Cairo/Cairo-VariableFont_slnt,wght.ttf'),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Firebase is already initialized at the app level
        // Just initialize Firebase Messaging
        await initializeFirebaseMessaging();
      } catch (error) {
        console.error('Error initializing Firebase Messaging:', error);
      }
    };

    initFirebase();
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
