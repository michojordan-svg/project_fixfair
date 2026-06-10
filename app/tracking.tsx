import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';
import { useUser } from '@/contexts/UserContext';

const JOB_STEPS = [
  { id: 1, label: 'Booked',     sublabel: 'Jun 7, 10:30 AM',   done: true  },
  { id: 2, label: 'Confirmed',  sublabel: 'Marcus accepted',    done: true  },
  { id: 3, label: 'En Route',   sublabel: 'ETA 2:30 PM',        done: true  },
  { id: 4, label: 'Arrived',    sublabel: 'Pending',            done: false },
  { id: 5, label: 'Completed',  sublabel: 'Pending',            done: false },
];

export default function TrackingScreen() {
  const router = useRouter();
  const { jobs } = useUser();
  const [eta, setEta] = useState(18);

  const activeJob = jobs.find(j => j.status === 'in_progress') ?? jobs[0];

  useEffect(() => {
    const t = setInterval(() => setEta(prev => (prev > 0 ? prev - 1 : 0)), 60000);
    return () => clearInterval(t);
  }, []);

  const handleApprove = () =>
    Alert.alert(
      'Payment Released! 🎉',
      `Thank you! $${activeJob?.amount} has been released to ${activeJob?.tech}. Your 90-day warranty is now active.`,
      [{ text: 'Done', onPress: () => router.back() }]
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Job Tracking</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Map area */}
          <View style={styles.mapArea}>
            <View style={styles.mapGrid}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={styles.mapGridLine} />
              ))}
            </View>
            <View style={styles.mapPulse}>
              <View style={styles.mapPulseRing} />
              <Ionicons name="navigate" size={24} color={theme.accent} />
            </View>
            <Text style={styles.mapLabel}>Technician En Route</Text>
            <View style={styles.etaBadge}>
              <Text style={styles.etaBadgeText}>ETA {eta} min</Text>
            </View>
            <View style={styles.homePinWrap}>
              <Ionicons name="home" size={14} color={theme.bg} />
            </View>
          </View>

          {/* Job card */}
          {activeJob && (
            <Card borderColor="rgba(0,212,170,0.2)">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.jobId}>{activeJob.id}</Text>
                  <Text style={styles.jobTitle}>{activeJob.title}</Text>
                </View>
                <Badge variant="green">In Progress</Badge>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar initials={activeJob.techInitials} color={activeJob.techColor} size={44} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.techName}>{activeJob.tech}</Text>
                  <Text style={styles.techSpec}>{activeJob.category} · ⭐ 4.9</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="call" size={18} color={theme.accent} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="chatbubble" size={18} color={theme.accent} />
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Progress steps */}
          <Card>
            <Text style={styles.sectionLabel}>Job Progress</Text>
            {JOB_STEPS.map((step, i) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                    {step.done
                      ? <Ionicons name="checkmark" size={12} color={theme.bg} />
                      : <View style={styles.stepDotEmpty} />}
                  </View>
                  {i < JOB_STEPS.length - 1 && (
                    <View style={[styles.stepLine, step.done && styles.stepLineDone]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, !step.done && { color: theme.textMuted }]}>{step.label}</Text>
                  <Text style={styles.stepSublabel}>{step.sublabel}</Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Escrow */}
          {activeJob && (
            <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.escrowLabel}>🔒 Escrow Balance</Text>
                  <Text style={styles.escrowAmount}>${activeJob.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.lockIcon}>
                  <Ionicons name="lock-closed" size={20} color={theme.accent} />
                </View>
              </View>
              <Text style={styles.escrowNote}>
                Released only when you approve. 90-day warranty included.
              </Text>
              <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
                <Ionicons name="checkmark-circle" size={18} color={theme.bg} />
                <Text style={styles.approveBtnText}>Approve & Release Payment</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* Live Activity Indicator */}
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live updates every 30 seconds · Last updated just now</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 67 : spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.bgCard, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: theme.text },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  mapArea: {
    height: 200,
    backgroundColor: '#03111F',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.2)',
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: { position: 'absolute', inset: 0, flexDirection: 'row', flexWrap: 'wrap', opacity: 0.07 },
  mapGridLine: { width: '10%', height: 200, borderRightWidth: 1, borderColor: '#00D4AA' },
  mapPulse: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,212,170,0.12)', borderWidth: 2, borderColor: 'rgba(0,212,170,0.4)', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  mapPulseRing: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, borderColor: 'rgba(0,212,170,0.2)' },
  mapLabel: { color: theme.textMuted, fontSize: 12, marginTop: 8 },
  etaBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: theme.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  etaBadgeText: { color: theme.bg, fontSize: 12, fontWeight: '700' },
  homePinWrap: { position: 'absolute', bottom: 24, right: 40, width: 26, height: 26, borderRadius: 13, backgroundColor: theme.accentPurple, justifyContent: 'center', alignItems: 'center' },
  jobId: { fontSize: 12, color: theme.textMuted, marginBottom: 2 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: theme.text },
  techName: { fontSize: 14, fontWeight: '700', color: theme.text },
  techSpec: { fontSize: 12, color: theme.textMuted },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(0,212,170,0.1)', justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: theme.text, marginBottom: 16 },
  stepRow: { flexDirection: 'row', gap: 12, minHeight: 52 },
  stepLeft: { alignItems: 'center', width: 24 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.bgElevated, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  stepDotDone: { backgroundColor: theme.success, borderColor: theme.success },
  stepDotEmpty: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.textDim },
  stepLine: { flex: 1, width: 2, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 2 },
  stepLineDone: { backgroundColor: theme.success },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepLabel: { fontSize: 14, fontWeight: '600', color: theme.text },
  stepSublabel: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  escrowLabel: { fontSize: 12, color: theme.textMuted },
  escrowAmount: { fontSize: 24, fontWeight: '800', color: theme.accent, marginTop: 4 },
  lockIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,212,170,0.1)', justifyContent: 'center', alignItems: 'center' },
  escrowNote: { fontSize: 12, color: theme.textMuted, marginTop: 8, lineHeight: 18, marginBottom: 12 },
  approveBtn: { backgroundColor: theme.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: borderRadius.lg },
  approveBtnText: { color: theme.bg, fontSize: 15, fontWeight: '700' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.success },
  liveText: { fontSize: 11, color: theme.textDim },
});
