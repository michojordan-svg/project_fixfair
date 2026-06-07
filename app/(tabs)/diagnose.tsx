import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card } from '@/components/Card';

const categories = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water', color: theme.accentBlue },
  { id: 'hvac', label: 'HVAC', icon: 'snow', color: theme.accentWarm },
  { id: 'electrical', label: 'Electrical', icon: 'flash', color: theme.warning },
  { id: 'appliance', label: 'Appliance', icon: 'settings', color: theme.accentPurple },
  { id: 'roofing', label: 'Roofing', icon: 'home', color: theme.success },
  { id: 'general', label: 'General', icon: 'hammer', color: theme.accent },
];

export default function DiagnoseScreen() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAnalyze = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={styles.title}>AI Diagnosis</Text>
            <Text style={styles.subtitle}>Video-powered issue detection</Text>
          </View>

          {step === 0 && (
            <>
              <View style={styles.aiBubble}>
                <Text style={styles.aiBubbleText}>
                  ⚡ Hi Alex! Select a category and record a 30–60 second video of the problem. I'll analyze it instantly.
                </Text>
              </View>

              <Text style={styles.sectionLabel}>Select issue category:</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryItem,
                      selectedCategory === cat.id && { borderColor: cat.color + '88', backgroundColor: cat.color + '15' },
                    ]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                      <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                    </View>
                    <Text style={[styles.categoryLabel, selectedCategory === cat.id && { color: theme.text }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, !selectedCategory && { opacity: 0.5 }]}
                onPress={() => selectedCategory && setStep(1)}
                disabled={!selectedCategory}
              >
                <Ionicons name="videocam" size={20} color={theme.bg} />
                <Text style={styles.primaryButtonText}>Start Recording</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 1 && (
            <>
              <View style={styles.recordingArea}>
                <View style={styles.recordButton}>
                  <View style={styles.recordButtonInner} />
                </View>
                <Text style={styles.recordingText}>Recording... 0:08</Text>
                <View style={styles.recBadge}>
                  <Text style={styles.recBadgeText}>● REC</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleAnalyze}>
                <Text style={styles.primaryButtonText}>Stop & Analyze</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(0)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <View style={styles.analyzingContainer}>
              <View style={styles.analyzingSpinner}>
                <ActivityIndicator size="large" color={theme.accent} />
              </View>
              <Text style={styles.analyzingTitle}>AI Analyzing Video</Text>
              <Text style={styles.analyzingSubtitle}>Computer vision is identifying the issue...</Text>

              <Card>
                {[
                  { label: 'Frame extraction', done: true },
                  { label: 'Object detection (YOLO)', done: true },
                  { label: 'Issue classification', done: false },
                  { label: 'Parts lookup & pricing', done: false },
                ].map((item, i) => (
                  <View key={i} style={styles.analysisStep}>
                    {item.done
                      ? <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                      : <ActivityIndicator size="small" color={theme.accent} />
                    }
                    <Text style={[styles.analysisStepText, { color: item.done ? theme.text : theme.textMuted }]}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </Card>
            </View>
          )}

          {step === 3 && (
            <>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={40} color={theme.success} />
                <Text style={styles.resultTitle}>Issue Identified</Text>
                <Text style={styles.resultSubtitle}>Confidence: 94%</Text>
              </View>

              <Card borderColor="rgba(0,212,170,0.2)">
                <Text style={styles.resultIssueLabel}>Detected Issue</Text>
                <Text style={styles.resultIssueName}>Leaking P-Trap Joint</Text>
                <Text style={styles.resultIssueDesc}>
                  Water seeping from the P-trap connection under sink. Likely worn gasket or loose compression fitting.
                </Text>
              </Card>

              <Card>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>Estimated Fix</Text>
                  <Text style={{ color: theme.accent, fontWeight: '800', fontSize: 18 }}>$85–$120</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>Urgency</Text>
                  <Text style={{ color: theme.warning, fontWeight: '600', fontSize: 13 }}>Moderate</Text>
                </View>
              </Card>

              <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(0)}>
                <Ionicons name="construct" size={20} color={theme.bg} />
                <Text style={styles.primaryButtonText}>Book a Technician</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(0)}>
                <Text style={styles.secondaryButtonText}>Diagnose Another Issue</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  scrollView: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: Platform.OS === 'web' ? 67 : spacing.lg,
  },
  title: { fontSize: 28, fontWeight: '800', color: theme.text },
  subtitle: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  aiBubble: {
    backgroundColor: 'rgba(0,212,170,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.25)',
    borderRadius: borderRadius.lg,
    padding: 12,
    marginBottom: spacing.xl,
    borderBottomRightRadius: 4,
  },
  aiBubbleText: { fontSize: 13, color: '#B8D0E8', lineHeight: 20 },
  sectionLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.xl },
  categoryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.lg,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  categoryLabel: { fontSize: 13, color: theme.textMuted, fontWeight: '600' },
  primaryButton: {
    backgroundColor: theme.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  primaryButtonText: { color: theme.bg, fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: { color: theme.text, fontSize: 14, fontWeight: '500' },
  recordingArea: {
    height: 360,
    backgroundColor: '#050a14',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: 'rgba(0,212,170,0.3)',
    marginBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EF4444' },
  recordingText: { color: 'rgba(255,255,255,0.8)', marginTop: 12, fontSize: 13 },
  recBadge: {
    position: 'absolute',
    top: 16,
    backgroundColor: 'rgba(239,68,68,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  recBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  analyzingContainer: { alignItems: 'center', marginVertical: 20 },
  analyzingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,212,170,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0,212,170,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  analyzingTitle: { fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: 8 },
  analyzingSubtitle: { fontSize: 13, color: theme.textMuted, marginBottom: spacing.xl },
  analysisStep: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  analysisStepText: { fontSize: 13 },
  resultHeader: { alignItems: 'center', marginBottom: spacing.xl },
  resultTitle: { fontSize: 24, fontWeight: '800', color: theme.text, marginTop: 12 },
  resultSubtitle: { fontSize: 13, color: theme.success, marginTop: 4 },
  resultIssueLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
  resultIssueName: { fontSize: 18, fontWeight: '800', color: theme.text, marginBottom: 8 },
  resultIssueDesc: { fontSize: 13, color: theme.textMuted, lineHeight: 20 },
});
