import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerBackTitle: '',headerShown: false }} />
        <Stack.Screen name="tasks/calendar" options={{  headerBackTitleVisible: false, headerBackTitle: '',title: 'Calendar', headerShown: true }} />
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
    </ThemeProvider>
  );
}
