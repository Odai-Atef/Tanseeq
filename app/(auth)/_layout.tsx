import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerBackTitleVisible: false ,title: 'Edit Profile' }} />
    </Stack>
  );
}
