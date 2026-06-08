import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Avatar, Badge } from '@/components/Card';

const systemScores = [
  { label: 'Plumbing',   score: 85, color: theme.accentBlue,   icon: 'water' },
  { label: 'Electrical', score: 88, color: theme.warning,       icon: 'flash' },
  { label: 'HVAC',       score: 55, color: theme.accentWarm,    icon: 'snow' },
  { label: 'Appliances', score: 91, color: theme.accentPurple,  icon: 'settings' },
  { label: 'Roofing',    score: 74, color: theme.success,       icon: 'home' },
];

const reminders = [
  { id: 1, icon: 'snow-outline',  label: 'HVAC Filter Due',    sub: 'Replace by Jun 15', color: theme.accentWarm },
  { id: 2, icon: 'flash-outline', label: 'Electrical Panel',   sub: 'Inspection overdue', color: theme.warning },
  { id: 3, icon: 'water-outline', label: 'Water Heater Check', sub: 'Annual – Jul 1',     color: theme.accentBlue },
];

const nearbyTechs = [
  { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber',   rating: 4.9, initials: 'MW', color: theme.accentBlue, eta: 'Today 2–4 PM', price: 170 },
  { id: 2, name: 'Sarah Chen',  specialty: 'HVAC Specialist',  rating: 4.8, initials: 'SC', color: theme.accentWarm, eta: 'Today 4–6 PM', price: 165 },
];

const scoreColor = (s: number) => s >= 75 ? theme.success : s >= 55 ? theme.warning : theme.danger;

export default function HomeScreen() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<number[]>([]);
  const active = reminders.filter(r => !dismissed.includes(r.id));
  const topReminder = active[0] ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.name}>Alex Johnson 👋</Text>
          </View>
          <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={21} color={theme.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* ── Active Job Banner ── */}
        <TouchableOpacity style={styles.jobBanner} onPress={() => router.push('/tracking')}>
          <View style={styles.jobBannerLeft}>
            <View style={styles.jobDot} />
            <View>
              <Text style={styles.jobId}>FX-2847 · In Progress</Text>
              <Text style={styles.jobTitle}>Plumbing — Leaky Faucet</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.jobAmt}>$170</Text>
            <View style={styles.trackRow}>
              <Text style={styles.trackLabel}>Track</Text>
              <Ionicons name="chevron-forward" size={13} color={theme.accent} />
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Hero Health Card ── */}
        <View style={styles.heroCard}>
          {/* Score row */}
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>Home Health Score</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 2 }}>
                <Text style={styles.scoreNum}>79</Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Badge variant="yellow">HVAC Attention</Badge>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>Good overall</Text>
            </View>
          </View>

          {/* Master bar */}
          <View style={styles.masterTrack}>
            <View style={[styles.masterFill, { width: '79%' }]} />
          </View>

          {/* 5 system scores in 2-col */}
          <View style={styles.sysGrid}>
            {systemScores.map(s => (
              <View key={s.label} style={styles.sysItem}>
                <View style={styles.sysTop}>
                  <Ionicons name={s.icon as any} size={10} color={s.color} />
                  <Text style={styles.sysLabel}>{s.label}</Text>
                  <Text style={[styles.sysScore, { color: scoreColor(s.score) }]}>{s.score}</Text>
                </View>
                <View style={styles.sysTrack}>
                  <View style={[styles.sysFill, { width: `${s.score}%` as any, backgroundColor: s.color }]} />
                </View>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* CTA buttons inside card */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.ctaBtn, styles.ctaBtnPrimary]}
              onPress={() => router.push('/(tabs)/diagnose')}
            >
              <Ionicons name="videocam" size={15} color={theme.bg} />
              <Text style={[styles.ctaText, { color: theme.bg }]}>Record & Diagnose</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaBtn, styles.ctaBtnSecondary]}
              onPress={() => router.push('/(tabs)/diagnose')}
            >
              <Ionicons name="chatbubble-ellipses" size={15} color={theme.accentPurple} />
              <Text style={[styles.ctaText, { color: theme.accentPurple }]}>AI Doctor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stat Strip ── */}
        <View style={styles.statStrip}>
          <View style={styles.statPill}>
            <Ionicons name="warning" size={13} color={theme.danger} />
            <Text style={styles.statPillText}><Text style={{ color: theme.danger, fontWeight: '800' }}>2</Text> Alerts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Ionicons name="leaf" size={13} color={theme.success} />
            <Text style={styles.statPillText}><Text style={{ color: theme.success, fontWeight: '800' }}>$1.2K</Text> Eco Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Ionicons name="checkmark-circle" size={13} color={theme.accentBlue} />
            <Text style={styles.statPillText}><Text style={{ color: theme.accentBlue, fontWeight: '800' }}>5</Text> Jobs Done</Text>
          </View>
        </View>

        {/* ── Top Reminder (just the most urgent one) ── */}
        {topReminder && (
          <View style={[styles.reminderCard, { borderColor: topReminder.color + '40' }]}>
            <View style={[styles.reminderIcon, { backgroundColor: topReminder.color + '18' }]}>
              <Ionicons name={topReminder.icon as any} size={18} color={topReminder.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>{topReminder.label}</Text>
              <Text style={styles.reminderSub}>{topReminder.sub}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              {active.length > 1 && (
                <Text style={{ fontSize: 11, color: theme.accent, fontWeight: '700' }}>+{active.length - 1} more</Text>
              )}
              <TouchableOpacity onPress={() => setDismissed(p => [...p, topReminder.id])}>
                <Ionicons name="close" size={16} color={theme.textDim} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Nearby Technicians ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Technicians</Text>
          <TouchableOpacity onPress={() => router.push('/technicians')}>
            <Text style={styles.sectionAction}>See All</Text>
          </TouchableOpacity>
        </View>

        {nearbyTechs.map(tech => (
          <TouchableOpacity key={tech.id} style={styles.techCard} onPress={() => router.push('/technicians')}>
            <Avatar initials={tech.initials} color={tech.color} size={44} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techPrice}>${tech.price} fixed</Text>
              </View>
              <Text style={styles.techSpec}>{tech.specialty}</Text>
              <View style={styles.techMeta}>
                {[1,2,3,4,5].map(i => (
                  <Ionicons key={i} name={i <= Math.floor(tech.rating) ? 'star' : 'star-outline'} size={9} color="#F59E0B" />
                ))}
                <Text style={styles.techMetaText}>{tech.rating} · {tech.eta}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 56 : spacing.lg,
    paddingBottom: 48,
  },

  /* Header */
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  greeting: { fontSize: 12, color: theme.textMuted },
  name: { fontSize: 22, fontWeight: '800', color: theme.text, marginTop: 1 },
  bell: { width: 38, height: 38, borderRadius: 11, backgroundColor: theme.bgCard, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  bellDot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: theme.danger },

  /* Active Job Banner */
  jobBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,212,170,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.28)',
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },
  jobBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  jobDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: theme.accent },
  jobId: { fontSize: 10, color: theme.accent, fontWeight: '700', marginBottom: 2 },
  jobTitle: { fontSize: 13, fontWeight: '700', color: theme.text },
  jobAmt: { fontSize: 16, fontWeight: '800', color: theme.accent },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  trackLabel: { fontSize: 11, color: theme.accent, fontWeight: '600' },

  /* Hero Health Card */
  heroCard: {
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 18,
    marginBottom: 14,
  },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  scoreLabel: { fontSize: 11, color: theme.textMuted, letterSpacing: 0.3 },
  scoreNum: { fontSize: 44, fontWeight: '800', color: theme.accent, lineHeight: 50 },
  scoreMax: { fontSize: 14, color: theme.textMuted, marginBottom: 4 },
  masterTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 14 },
  masterFill: { height: 4, backgroundColor: theme.accent, borderRadius: 2 },

  /* System grid */
  sysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sysItem: { width: '47%' },
  sysTop: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  sysLabel: { fontSize: 10, color: theme.textMuted, flex: 1 },
  sysScore: { fontSize: 10, fontWeight: '800' },
  sysTrack: { height: 2.5, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2 },
  sysFill: { height: 2.5, borderRadius: 2 },

  /* Divider + CTAs inside hero */
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 14 },
  ctaRow: { flexDirection: 'row', gap: 8 },
  ctaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: borderRadius.lg },
  ctaBtnPrimary: { backgroundColor: theme.accent },
  ctaBtnSecondary: { backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)' },
  ctaText: { fontSize: 12, fontWeight: '700' },

  /* Stat strip */
  statStrip: {
    flexDirection: 'row',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 14,
  },
  statPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12 },
  statPillText: { fontSize: 12, color: theme.textMuted },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 8 },

  /* Reminder */
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  reminderIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reminderTitle: { fontSize: 13, fontWeight: '700', color: theme.text },
  reminderSub: { fontSize: 11, color: theme.textMuted, marginTop: 1 },

  /* Section header */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: theme.text },
  sectionAction: { fontSize: 12, color: theme.accent, fontWeight: '600' },

  /* Tech cards */
  techCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
    marginBottom: 10,
  },
  techName: { fontSize: 14, fontWeight: '700', color: theme.text },
  techPrice: { fontSize: 13, fontWeight: '800', color: theme.accent },
  techSpec: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  techMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  techMetaText: { fontSize: 11, color: theme.textMuted, marginLeft: 3 },
});
