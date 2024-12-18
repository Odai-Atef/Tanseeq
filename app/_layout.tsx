import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import OneSignal, {
  NotificationReceivedEvent,
  OpenedEvent,
  OSNotification
} from 'react-native-onesignal';
import { ONESIGNAL_APP_ID } from '../constants/OneSignal';

import { useColorScheme } from '../hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const initializeOneSignal = () => {
      // Initialize OneSignal
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId(ONESIGNAL_APP_ID);

      // Handle notification received when app is in foreground
      OneSignal.setNotificationWillShowInForegroundHandler((event: NotificationReceivedEvent) => {
        const notification = event.getNotification();
        
        Toast.show({
          type: 'info',
          text1: notification.title || 'New Notification',
          text2: notification.body || '',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30
        });

        // Complete with notification to show it
        event.complete(notification);
      });

      // Handle notification opened
      OneSignal.setNotificationOpenedHandler((event: OpenedEvent) => {
        console.log('OneSignal: notification opened:', event);
      });

      // Request push notification permission
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('OneSignal: permission response:', response);
      });
    };

    if (loaded) {
      SplashScreen.hideAsync();
      try {
        initializeOneSignal();
      } catch (error) {
        console.error('Failed to initialize OneSignal:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to initialize notifications',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30
        });
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerBackTitle: '',headerShown: false }} />
        <Stack.Screen name="tasks/calendar" options={{ headerBackTitle: '',title: 'Calendar', headerShown: true }} />
        <Stack.Screen name="tasks/index" options={{ title: 'Tasks', headerShown: true }} />

       
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="tasks/view" options={{ title:'Task Details',headerShown: true }} />
        <Stack.Screen name="tasks/add" options={{ headerBackTitle:'',headerShown: true, title: 'Add Task' }} />
        <Stack.Screen name="schedules/add" options={{ headerShown: true, title: 'Assign Task to Schedule' }} />

        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
