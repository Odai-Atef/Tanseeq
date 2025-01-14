import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, Theme, NavigationContainer } from '@react-navigation/native';
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
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize OneSignal
    OneSignal.setAppId(ONESIGNAL_APP_ID);
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      const notification = notificationReceivedEvent.getNotification();
      
      // Show Toast notification
      Toast.show({
        type: 'info',
        text1: notification.title || 'New Notification',
        text2: notification.body || '',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        onPress: () => {
          // Handle notification tap if needed
          notificationReceivedEvent.complete(notification);
        }
      });

      // Complete the notification
      notificationReceivedEvent.complete(notification);
    });

    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });

    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("OneSignal: user response:", response);
    });
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
    <LanguageProvider>
      <NavigationContainer theme={navigationTheme[colorScheme ?? 'light']}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="tasks" options={{ headerShown: false }} />
          <Stack.Screen name="schedules" options={{ headerShown: false }} />
          <Stack.Screen name="tasks/calendar" options={{ headerBackTitleVisible: false, title: 'Calendar', headerShown: true }} />
          <Stack.Screen name="tasks/index" options={{ headerBackTitleVisible: false, title: 'Tasks', headerShown: true }} />
          <Stack.Screen name="tasks/view" options={{ headerBackTitleVisible: false ,title:'Task Details',headerShown: true }} />
          <Stack.Screen name="tasks/add" options={{ headerBackTitleVisible: false ,headerBackTitle:'',headerShown: true, title: 'Add Task' }} />
          <Stack.Screen name="schedules/view" options={{ headerBackTitleVisible: false ,headerBackTitle:'',headerShown: true, title: 'Schedule View' }} />
          <Stack.Screen name="home/invite" options={{ headerBackTitleVisible: false ,headerBackTitle:'',headerShown: true, title: 'Invite Housemaid' }} />
          <Stack.Screen name="home/join" options={{ headerBackTitleVisible: false ,headerBackTitle:'',headerShown: true, title: 'Join House' }} />

        </Stack>
        <Toast />
      </NavigationContainer>
    </LanguageProvider>
  );
}
