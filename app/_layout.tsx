import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { theme } from '@/constants/theme';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="technicians"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="tracking"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="booking"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
