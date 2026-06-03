import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import Svg, { Circle, Polyline, Polygon, Line, Rect, Path } from 'react-native-svg';

// ============================================================
// THEME & STYLES
// ============================================================
const theme = {
  bg: '#0A0F1E',
  bgCard: '#111827',
  bgElevated: '#1A2235',
  accent: '#00D4AA',
  accentWarm: '#FF6B35',
  accentBlue: '#3B82F6',
  accentPurple: '#8B5CF6',
  text: '#F0F4FF',
  textMuted: '#8892A4',
  textDim: '#4B5568',
  border: '#1E2D45',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  padding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    marginBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: theme.textMuted,
    marginBottom: 4,
  },
  buttonPrimary: {
    backgroundColor: theme.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: theme.bg,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonTextSecondary: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
    fontSize: 11,
    fontWeight: '600',
  },
  badgeGreen: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    color: '#10B981',
  },
  badgeBlue: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    color: '#3B82F6',
  },
  badgeYellow: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    color: '#F59E0B',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.text,
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.accent,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 100,
  },
  icon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================================================
// ICONS - SVG COMPONENTS
// ============================================================
const IconHome = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <Polyline points="9 22 9 12 15 12 15 22"/>
  </Svg>
);

const IconVideo = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="23 7 16 12 23 17 23 7"/>
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </Svg>
);

const IconTool = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </Svg>
);

const IconUser = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <Circle cx="12" cy="7" r="4"/>
  </Svg>
);

const IconCheck = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12"/>
  </Svg>
);

const IconChevron = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6"/>
  </Svg>
);

const IconStar = ({ color = theme.text, size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </Svg>
);

const IconBell = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </Svg>
);

const IconLock = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <Path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </Svg>
);

const IconShield = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </Svg>
);

const IconSettings = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3"/>
    <Path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-4.22-7.78l4.24-4.24m-5.08 14.12l4.24 4.24"/>
  </Svg>
);

const IconArrow = ({ color = theme.text, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="5" y1="12" x2="19" y2="12"/>
    <Polyline points="12 5 19 12 12 19"/>
  </Svg>
);

// ============================================================
// SCREEN COMPONENTS
// ============================================================

const HomeScreen = ({ navigation }) => {
  const [healthScore] = useState(78);
  const [notifCount, setNotifCount] = useState(3);

  const categories = [
    { id: 'plumbing', label: 'Plumbing', icon: '🔧', color: '#3B82F6' },
    { id: 'hvac', label: 'HVAC', icon: '❄️', color: '#FF6B35' },
    { id: 'electrical', label: 'Electrical', icon: '⚡', color: '#F59E0B' },
    { id: 'appliance', label: 'Appliance', icon: '⚙️', color: '#8B5CF6' },
    { id: 'roofing', label: 'Roofing', icon: '🏠', color: '#10B981' },
    { id: 'general', label: 'General', icon: '🔨', color: '#00D4AA' },
  ];

  const technicians = [
    { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber', rating: 4.9, jobs: 847, eta: 'Today 2-4pm', price: 185, avatar: 'MW', color: '#3B82F6' },
    { id: 2, name: 'Sarah Chen', specialty: 'HVAC Specialist', rating: 4.8, jobs: 623, eta: 'Today 4-6pm', price: 165, avatar: 'SC', color: '#FF6B35' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          {/* Header */}
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.subtext}>Good afternoon,</Text>
            <Text style={[styles.header, { marginBottom: 0 }]}>Alex Johnson 👋</Text>
          </View>

          {/* Health Score Card */}
          <View style={[styles.card, { backgroundColor: 'rgba(13,31,53,0.8)', borderColor: 'rgba(0,212,170,0.2)' }]}>
            <View style={styles.row}>
              <View>
                <Text style={styles.subtext}>Home Health Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={{ fontSize: 42, fontWeight: '800', color: theme.accent }}>78</Text>
                  <Text style={{ fontSize: 16, color: theme.textMuted }}>/100</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={[styles.badge, styles.badgeYellow]}>
                  <Text style={{ color: '#F59E0B' }}>⚠️ HVAC Attention</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '78%' }]} />
            </View>
          </View>

          {/* Quick Action Button */}
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Video')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IconVideo color={theme.bg} size={20} />
              <Text style={styles.buttonText}>Record & Diagnose Issue</Text>
            </View>
          </TouchableOpacity>

          {/* Categories */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text, marginBottom: 14 }}>Service Categories</Text>
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {categories.map(cat => (
                <TouchableOpacity key={cat.id} style={{ flex: 1, minWidth: '31%', backgroundColor: theme.bgCard, borderRadius: 16, padding: 14, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                  <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: '500' }}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Active Job */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text, marginBottom: 14 }}>Active Job</Text>
            <TouchableOpacity style={[styles.card, { borderColor: 'rgba(0,212,170,0.2)' }]} onPress={() => navigation.navigate('Tracking')}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.subtext}>FX-2847</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>Plumbing - Leaky Faucet</Text>
                </View>
                <View style={[styles.badge, styles.badgeGreen]}>
                  <Text style={{ color: '#10B981' }}>🟢 Live</Text>
                </View>
              </View>
              <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
                <View style={styles.row}>
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>Marcus Webb</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>ETA: 2:30 PM</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: theme.accent }}>$185</Text>
                    <Text style={{ fontSize: 10, color: theme.textMuted }}>in escrow</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Trust Score */}
          <View style={[styles.card, { backgroundColor: 'rgba(26,10,46,0.6)', borderColor: 'rgba(139,92,246,0.2)' }]}>
            <View style={styles.row}>
              <View>
                <Text style={styles.subtext}>Your Trust Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: theme.accentPurple }}>847</Text>
                  <View style={[styles.badge, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
                    <Text style={{ color: theme.accentPurple }}>Top 15%</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: theme.success }}>↑ +12 this month</Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>5 jobs · 0 disputes</Text>
              </View>
            </View>
          </View>

          {/* Nearby Pros */}
          <View style={{ marginBottom: 20 }}>
            <View style={styles.row}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>Nearby Pros</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                <Text style={{ fontSize: 12, color: theme.accent }}>See Map →</Text>
              </TouchableOpacity>
            </View>
            {technicians.map(tech => (
              <TouchableOpacity key={tech.id} style={[styles.card, { marginBottom: 10 }]} onPress={() => navigation.navigate('TechProfile', { tech })}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: tech.color + '40', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '800', color: theme.text, fontSize: 12 }}>{tech.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={{ fontWeight: '600', fontSize: 15, color: theme.text }}>{tech.name}</Text>
                      <View style={[styles.badge, styles.badgeGreen]}>
                        <Text style={{ color: '#10B981' }}>✓ Verified</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{tech.specialty}</Text>
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <IconStar key={i} filled={i <= Math.floor(tech.rating)} color="#F59E0B" size={11} />
                        ))}
                      </View>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.rating}</Text>
                      <Text style={{ marginLeft: 'auto', fontWeight: '800', color: theme.text }}>€${tech.price}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const VideoScreen = ({ navigation }) => {
  const [videoStep, setVideoStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  const categories = [
    { id: 'plumbing', label: 'Plumbing', icon: '🔧', color: '#3B82F6' },
    { id: 'hvac', label: 'HVAC', icon: '❄️', color: '#FF6B35' },
    { id: 'electrical', label: 'Electrical', icon: '⚡', color: '#F59E0B' },
    { id: 'appliance', label: 'Appliance', icon: '⚙️', color: '#8B5CF6' },
    { id: 'roofing', label: 'Roofing', icon: '🏠', color: '#10B981' },
    { id: 'general', label: 'General', icon: '🔨', color: '#00D4AA' },
  ];

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.screen, { justifyContent: 'center', padding: 20 }]}>
          <Text style={[styles.header, { textAlign: 'center', marginBottom: 16 }]}>Camera Permission Needed</Text>
          <TouchableOpacity style={styles.buttonPrimary} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' }}>
              <IconChevron color={theme.text} size={18} style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
            <Text style={[styles.header, { marginBottom: 0 }]}>AI Diagnosis</Text>
          </TouchableOpacity>

          {videoStep === 0 && (
            <>
              {/* AI Bubble */}
              <View style={{ backgroundColor: 'rgba(0,212,170,0.08)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.25)', borderRadius: 16, padding: 12, marginBottom: 20, borderBottomRightRadius: 4 }}>
                <Text style={{ fontSize: 13, color: '#B8D0E8', lineHeight: 20 }}>
                  ⚡ Hi Alex! I'll analyze your home issue instantly. Record a 30–60 second video of the problem. Make sure to show the area from multiple angles for best results.
                </Text>
              </View>

              {/* Category Selection */}
              <Text style={[styles.subtext, { marginBottom: 14 }]}>Select issue category first:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat)}
                    style={{
                      flex: 1,
                      minWidth: '48%',
                      backgroundColor: selectedCategory?.id === cat.id ? cat.color + '22' : 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: selectedCategory?.id === cat.id ? cat.color + '66' : 'rgba(255,255,255,0.06)',
                      borderRadius: 14,
                      padding: 12,
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
                    <Text style={{ fontSize: 13, color: selectedCategory?.id === cat.id ? theme.text : theme.textMuted, fontWeight: '600' }}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Start Recording Button */}
              <TouchableOpacity style={styles.buttonPrimary} onPress={() => setVideoStep(1)}>
                <IconVideo color={theme.bg} size={20} />
                <Text style={styles.buttonText}>Start Recording</Text>
              </TouchableOpacity>
            </>
          )}

          {videoStep === 1 && (
            <>
              {/* Recording UI */}
              <View style={{ height: 400, backgroundColor: '#050a14', borderRadius: 20, borderWidth: 2, borderColor: 'rgba(0,212,170,0.3)', marginBottom: 20, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EF4444' }} />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 12, fontSize: 13 }}>Recording... 0:08</Text>
                <View style={{ position: 'absolute', top: 16, backgroundColor: 'rgba(239,68,68,0.85)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>● REC</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.buttonPrimary} onPress={() => setVideoStep(2)}>
                <Text style={styles.buttonText}>Stop & Analyze</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => setVideoStep(0)}>
                <Text style={styles.buttonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {videoStep === 2 && (
            <>
              {/* Analyzing UI */}
              <View style={{ alignItems: 'center', marginVertical: 40 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,212,170,0.1)', borderWidth: 2, borderColor: 'rgba(0,212,170,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                  <ActivityIndicator size="large" color={theme.accent} />
                </View>
                <Text style={[styles.header, { textAlign: 'center' }]}>AI Analyzing Video</Text>
                <Text style={[styles.subtext, { textAlign: 'center', marginBottom: 24 }]}>Computer vision is identifying the issue...</Text>
              </View>

              {/* Analysis Steps */}
              <View style={[styles.card, { backgroundColor: theme.bgCard, marginBottom: 16 }]}>
                {[
                  { label: 'Frame extraction', done: true },
                  { label: 'Object detection (YOLO)', done: true },
                  { label: 'Issue classification', done: false },
                  { label: 'Parts lookup & pricing', done: false },
                ].map((step, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: step.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: step.done ? '#10B981' : 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                      {step.done && <IconCheck color="#10B981" size={12} />}
                    </View>
                    <Text style={{ fontSize: 13, color: step.done ? theme.text : theme.textDim, flex: 1 }}>{step.label}</Text>
                    {step.done && <Text style={{ fontSize: 11, color: '#10B981' }}>✓</Text>}
                  </View>
                ))}
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center' }}>75% complete</Text>
            </>
          )}

          {videoStep === 3 && (
            <>
              {/* Result */}
              <View style={{ backgroundColor: 'rgba(0,212,170,0.08)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.25)', borderRadius: 20, padding: 16, marginBottom: 16 }}>
                <View style={[styles.badge, styles.badgeGreen, { marginBottom: 8 }]}>
                  <Text style={{ color: '#10B981' }}>✓ AI Diagnosis Complete - 94% confidence</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginBottom: 6 }}>Worn Faucet Cartridge</Text>
                <Text style={{ fontSize: 13, color: theme.textMuted, lineHeight: 20, marginBottom: 12 }}>
                  Video analysis detected a dripping faucet consistent with cartridge wear. Water pooling visible near base. Estimated repair time: 45–60 minutes.
                </Text>
              </View>

              {/* Fixed Price */}
              <View style={[styles.card, { borderColor: 'rgba(0,212,170,0.2)' }]}>
                <Text style={styles.subtext}>Parts to be brought</Text>
                {['Moen 1225B Cartridge', 'O-Ring Kit (3-pack)'].map((part, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Text style={{ fontSize: 16 }}>📦</Text>
                    <Text style={{ fontSize: 13, flex: 1, color: theme.text }}>{part}</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Included</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.card, { borderColor: 'rgba(0,212,170,0.2)', marginBottom: 16 }]}>
                <Text style={styles.subtext}>Fixed Price Quote</Text>
                {[['Labor (1 hr)', '$120'], ['Parts', '$28'], ['FixFair fee (15%)', '$22'], ['90-day warranty', 'Included']].map(([k, v]) => (
                  <View key={k} style={styles.row}>
                    <Text style={{ fontSize: 13, color: theme.textMuted }}>{k}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: v === 'Included' ? theme.success : theme.text }}>{v}</Text>
                  </View>
                ))}
                <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 10 }}>
                  <View style={styles.row}>
                    <Text style={{ fontWeight: '700', color: theme.text }}>Total (Fixed)</Text>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: theme.accent }}>$170</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Technicians')}>
                <Text style={styles.buttonText}>Book a Technician</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const JobsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');

  const activeJobs = [
    { id: 'FX-2847', type: 'Plumbing - Leaky Faucet', tech: 'Marcus Webb', status: 'In Progress', eta: '2:30 PM', amount: 185 },
  ];

  const pastJobs = [
    { id: 'FX-2831', type: 'Electrical - Outlet Repair', tech: 'James Rivera', status: 'Completed', date: 'May 24', amount: 145, rating: 5 },
    { id: 'FX-2819', type: 'HVAC - Filter Replacement', tech: 'Sarah Chen', status: 'Completed', date: 'May 18', amount: 89, rating: 4 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          <Text style={[styles.header, { marginBottom: 20 }]}>My Jobs</Text>

          {/* Tab Bar */}
          <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, gap: 2, marginBottom: 20 }}>
            {['active', 'past', 'warranty'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: activeTab === tab ? theme.bgElevated : 'transparent',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '500', color: activeTab === tab ? theme.text : theme.textDim, textAlign: 'center' }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Active Jobs */}
          {activeTab === 'active' && (
            <>
              {activeJobs.map(job => (
                <TouchableOpacity key={job.id} style={[styles.card, { borderColor: 'rgba(0,212,170,0.2)' }]} onPress={() => navigation.navigate('Tracking')}>
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.subtext}>{job.id}</Text>
                      <Text style={{ fontWeight: '600', fontSize: 15, color: theme.text }}>{job.type}</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeGreen]}>
                      <Text style={{ color: '#10B981' }}>🟢 In Progress</Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 13, color: theme.textMuted }}>{job.tech}</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: '700', color: theme.warning }}>${job.amount} escrow</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Past Jobs */}
          {activeTab === 'past' && (
            <>
              {pastJobs.map(job => (
                <TouchableOpacity key={job.id} style={styles.card} onPress={() => navigation.navigate('JobDetail', { job })}>
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.subtext}>{job.id} · {job.date}</Text>
                      <Text style={{ fontWeight: '600', fontSize: 14, color: theme.text }}>{job.type}</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeBlue]}>
                      <Text style={{ color: '#3B82F6' }}>✓ Done</Text>
                    </View>
                  </View>
                  <View style={[styles.row, { marginTop: 10 }]}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <IconStar key={i} filled={i <= job.rating} color="#F59E0B" size={14} />
                      ))}
                    </View>
                    <Text style={{ fontWeight: '700', color: theme.text }}>${job.amount}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Warranty Tab */}
          {activeTab === 'warranty' && (
            <>
              <View style={[styles.card, { borderColor: 'rgba(16,185,129,0.2)', marginBottom: 12 }]}>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.12)', justifyContent: 'center', alignItems: 'center' }}>
                    <IconShield color="#10B981" size={18} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: theme.text }}>Outlet Repair · FX-2831</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>Warranty expires Aug 24, 2025</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeGreen]}>
                    <Text style={{ color: '#10B981' }}>Active</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '30%', backgroundColor: '#10B981' }]} />
                </View>
                <View style={[styles.row, { marginTop: 6 }]}>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>May 24</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>90 days remaining</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>Aug 24</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: 'linear-gradient(180deg, #0D1F35, #0A0F1E)', paddingVertical: 24, alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: '#00D4AA', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: theme.bg }}>AJ</Text>
          </View>
          <Text style={[styles.header, { marginBottom: 4 }]}>Alex Johnson</Text>
          <Text style={styles.subtext}>123 Main St · San Francisco, CA</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <View style={[styles.badge, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
              <Text style={{ color: theme.accentPurple }}>Trust Score: 847</Text>
            </View>
            <View style={[styles.badge, styles.badgeGreen]}>
              <Text style={{ color: '#10B981' }}>Verified</Text>
            </View>
          </View>
        </View>

        <View style={styles.padding}>
          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Total Jobs', value: '7', icon: '🔧' },
              { label: 'Saved', value: '$340', icon: '💵' },
              { label: 'Avg Rating', value: '4.9★', icon: '⭐' },
            ].map(s => (
              <View key={s.label} style={[styles.card, { flex: 1, padding: 14, alignItems: 'center' }]}>
                <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text, marginVertical: 6 }}>{s.value}</Text>
                <Text style={{ fontSize: 10, color: theme.textMuted }}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Menu Items */}
          {[
            { icon: '🏠', label: 'My Properties', sub: '1 property' },
            { icon: '🛡️', label: 'Warranty Plans', sub: '1 active plan' },
            { icon: '💳', label: 'Payment Methods', sub: 'Visa ••••4242' },
            { icon: '🔔', label: 'Notifications', sub: 'All alerts on' },
            { icon: '⭐', label: 'Refer & Earn', sub: '$25 per referral' },
            { icon: '⚙️', label: 'Settings', sub: '' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
              <View style={styles.row}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text }}>{item.label}</Text>
                    {item.sub && <Text style={{ fontSize: 11, color: theme.textMuted }}>{item.sub}</Text>}
                  </View>
                </View>
                <IconChevron color={theme.textDim} size={16} />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.buttonSecondary, { marginTop: 20, borderColor: 'rgba(239,68,68,0.2)' }]}>
            <Text style={[styles.buttonTextSecondary, { color: '#EF4444' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TechnicianListScreen = ({ navigation }) => {
  const technicians = [
    { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber', rating: 4.9, jobs: 847, price: 185, avatar: 'MW', color: '#3B82F6' },
    { id: 2, name: 'Sarah Chen', specialty: 'HVAC Specialist', rating: 4.8, jobs: 623, price: 165, avatar: 'SC', color: '#FF6B35' },
    { id: 3, name: 'James Rivera', specialty: 'Electrician', rating: 4.7, jobs: 412, price: 145, avatar: 'JR', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' }}>
              <IconChevron color={theme.text} size={18} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.header, { marginBottom: 0 }]}>Available Pros</Text>
              <Text style={styles.subtext}>3 technicians match your job</Text>
            </View>
          </View>

          {/* Fixed Price Banner */}
          <View style={{ backgroundColor: 'rgba(0,212,170,0.08)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.2)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <IconLock color={theme.accent} size={14} />
            <Text style={{ fontSize: 12, color: '#B8D0E8', flex: 1 }}>
              Fixed price: <Text style={{ color: theme.text, fontWeight: '600' }}>$170</Text> — locked until job completion
            </Text>
          </View>

          {technicians.map(tech => (
            <View key={tech.id} style={[styles.card, { paddingHorizontal: 16, paddingVertical: 16 }]}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: tech.color + '50', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: '800', color: theme.text }}>{tech.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={{ fontWeight: '700', fontSize: 15, color: theme.text }}>{tech.name}</Text>
                    <View style={[styles.badge, styles.badgeBlue]}>
                      <Text style={{ color: '#3B82F6' }}>Pro</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{tech.specialty}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <IconStar key={i} filled={i <= Math.floor(tech.rating)} color="#F59E0B" size={12} />
                      ))}
                    </View>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.rating}</Text>
                    <Text style={{ fontSize: 11, color: theme.textDim }}>•</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.jobs} jobs</Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity style={[styles.buttonSecondary, { flex: 1, paddingVertical: 10 }]} onPress={() => navigation.navigate('TechProfile', { tech })}>
                  <Text style={[styles.buttonTextSecondary, { fontSize: 13 }]}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonPrimary, { flex: 1, paddingVertical: 10 }]} onPress={() => navigation.navigate('Booking', { tech })}>
                  <Text style={[styles.buttonText, { fontSize: 13 }]}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TrackingScreen = ({ navigation }) => {
  const [escrowReleased, setEscrowReleased] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.padding}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' }}>
              <IconChevron color={theme.text} size={18} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.header, { marginBottom: 0 }]}>Live Tracking</Text>
              <Text style={styles.subtext}>Job #FX-2847</Text>
            </View>
          </View>

          {/* Map Placeholder */}
          <View style={{ height: 200, backgroundColor: 'linear-gradient(135deg, #0D1F35, #0A1428)', borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.accentBlue, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>MW</Text>
            </View>
            <Text style={{ color: theme.accent, fontSize: 12, marginBottom: 6 }}>📍 Marcus Webb</Text>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>ETA: ~12 minutes</Text>
          </View>

          {/* Tech Card */}
          <View style={[styles.card, { borderColor: 'rgba(59,130,246,0.2)' }]}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#3B82F6' + '50', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>MW</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: theme.text }}>Marcus Webb</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted }}>Master Plumber</Text>
                <View style={{ flexDirection: 'row', gap: 3, marginTop: 2 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <IconStar key={i} filled={i <= 4} color="#F59E0B" size={11} />
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View style={[styles.card, { marginBottom: 16 }]}>
            <Text style={[styles.subtext, { marginBottom: 14 }]}>Job Timeline</Text>
            {[
              { label: 'Booking confirmed', time: '1:15 PM', done: true, active: false },
              { label: 'Technician en route', time: '1:48 PM', done: true, active: false },
              { label: 'Technician arrived', time: '~2:00 PM', done: false, active: true },
              { label: 'Work in progress', time: 'Pending', done: false, active: false },
              { label: 'Complete — approve payment', time: 'Pending', done: false, active: false },
            ].map((event, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: i < 4 ? 16 : 0 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: event.done ? '#10B981' : event.active ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', borderWidth: event.active ? 2 : 0, borderColor: event.active ? theme.accent : 'transparent' }}>
                    {event.done && <IconCheck color="#fff" size={12} />}
                  </View>
                  {i < 4 && <View style={{ width: 1, flex: 1, backgroundColor: event.done ? '#10B981' : 'rgba(255,255,255,0.08)', marginTop: 4 }} />}
                </View>
                <View style={{ flex: 1, paddingBottom: 4 }}>
                  <Text style={{ fontSize: 13, fontWeight: event.active ? '600' : '400', color: event.done || event.active ? theme.text : theme.textDim }}>
                    {event.label}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>{event.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Escrow */}
          <View style={[styles.card, { backgroundColor: 'rgba(13,31,53,0.6)', marginBottom: 16 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <IconLock color={theme.warning} size={14} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>Escrow Balance</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.warning }}>$170</Text>
            </View>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>Released only when you tap "Approve & Pay"</Text>
            <TouchableOpacity
              onPress={() => setEscrowReleased(true)}
              style={{
                backgroundColor: escrowReleased ? 'rgba(16,185,129,0.15)' : 'rgba(0,212,170,0.1)',
                borderWidth: 1,
                borderColor: escrowReleased ? '#10B981' : 'rgba(0,212,170,0.3)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ color: escrowReleased ? '#10B981' : theme.accent, fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                {escrowReleased ? '✓ Payment Released — Job Complete!' : 'Approve & Release Payment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================
// NAVIGATION
// ============================================================
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'rgba(17,24,39,0.95)',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 12,
          paddingTop: 0,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <IconHome color={color} size={22} />;
          if (route.name === 'Video') return <IconVideo color={color} size={22} />;
          if (route.name === 'Jobs') return <IconTool color={color} size={22} />;
          if (route.name === 'Profile') return <IconUser color={color} size={22} />;
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textDim,
        tabBarLabelStyle: { fontSize: 10, marginTop: 4 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Video" component={VideoScreen} options={{ tabBarLabel: 'Diagnose' }} />
      <Tab.Screen name="Jobs" component={JobsScreen} options={{ tabBarLabel: 'Jobs' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="Technicians" component={TechnicianListScreen} />
        <Stack.Screen name="TechProfile" component={TechnicianListScreen} />
        <Stack.Screen name="Booking" component={TechnicianListScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="JobDetail" component={JobsScreen} />
        <Stack.Screen name="Map" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
