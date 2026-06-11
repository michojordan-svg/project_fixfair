import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { theme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthScreen = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthScreen) {
      router.replace('/auth');
    } else if (isAuthenticated && inAuthScreen) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <UserProvider>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
            <Stack.Screen name="auth"         options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
            <Stack.Screen name="technicians"  options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="tracking"     options={{ headerShown: false }} />
            <Stack.Screen name="booking"      options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthGate>
        <StatusBar style="light" />
      </UserProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1, backgroundColor: theme.bg,
    justifyContent: 'center', alignItems: 'center',
  },
});
