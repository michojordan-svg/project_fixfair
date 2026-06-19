import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
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

function PhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.desktopBg}>
      <View style={[
        styles.phoneOuter,
        {
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,212,170,0.06)',
        } as any,
      ]}>
        {/* Side buttons */}
        <View style={styles.volUp} />
        <View style={styles.volDown} />
        <View style={styles.powerBtn} />

        {/* Screen */}
        <View style={styles.phoneScreen}>
          {/* Notch */}
          <View style={styles.notch}>
            <View style={styles.notchCamera} />
            <View style={styles.notchSpeaker} />
          </View>
          <View style={styles.screenContent}>
            {children}
          </View>
          {/* Home indicator */}
          <View style={styles.homeIndicator} />
        </View>
      </View>

      {/* Label */}
      <View style={styles.label}>
        <View style={styles.labelDot} />
        <View style={{ flex: 1 }}>
          <View style={styles.labelLine} />
          <View style={[styles.labelLine, { width: 60, marginTop: 4 }]} />
        </View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <UserProvider>
        <AuthGate>
          <PhoneFrame>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
              <Stack.Screen name="auth"        options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)"      options={{ headerShown: false }} />
              <Stack.Screen name="technicians" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="tracking"    options={{ headerShown: false }} />
              <Stack.Screen name="booking"     options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </PhoneFrame>
        </AuthGate>
        <StatusBar style="light" />
      </UserProvider>
    </AuthProvider>
  );
}

const PHONE_W = 390;
const PHONE_H = 844;

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1, backgroundColor: theme.bg,
    justifyContent: 'center', alignItems: 'center',
  },
  desktopBg: {
    flex: 1,
    backgroundColor: '#07101f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneOuter: {
    width: PHONE_W + 36,
    height: PHONE_H + 36,
    borderRadius: 60,
    backgroundColor: '#3a4a60',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  volUp: {
    position: 'absolute',
    left: -9,
    top: 158,
    width: 6,
    height: 40,
    borderRadius: 3,
    backgroundColor: '#4a5e7a',
  },
  volDown: {
    position: 'absolute',
    left: -9,
    top: 210,
    width: 6,
    height: 40,
    borderRadius: 3,
    backgroundColor: '#4a5e7a',
  },
  powerBtn: {
    position: 'absolute',
    right: -9,
    top: 188,
    width: 6,
    height: 56,
    borderRadius: 3,
    backgroundColor: '#4a5e7a',
  },
  phoneScreen: {
    width: PHONE_W,
    height: PHONE_H,
    borderRadius: 46,
    backgroundColor: theme.bg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.08)',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%' as any,
    transform: [{ translateX: -58 }],
    width: 116,
    height: 32,
    backgroundColor: '#1a2235',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  notchCamera: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#2d3f58',
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.2)',
  },
  notchSpeaker: {
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2d3f58',
  },
  screenContent: {
    flex: 1,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%' as any,
    transform: [{ translateX: -60 }],
    width: 120,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    zIndex: 100,
  },
  label: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.4,
  },
  labelDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.accent,
  },
  labelLine: {
    height: 3,
    width: 90,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
