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
import { Card, Badge, Avatar, ProgressBar, SectionHeader } from '@/components/Card';

const systemScores = [
  { label: 'Plumbing',   score: 85, color: theme.accentBlue,   icon: 'water' },
  { label: 'Electrical', score: 88, color: theme.warning,       icon: 'flash' },
  { label: 'HVAC',       score: 55, color: theme.accentWarm,    icon: 'snow' },
  { label: 'Appliances', score: 91, color: theme.accentPurple,  icon: 'settings' },
  { label: 'Roofing',    score: 74, color: theme.success,       icon: 'home' },
];

const reminders = [
  { id: 1, icon: 'snow-outline',  label: 'HVAC Filter Due',   sub: 'Replace by Jun 15', color: theme.accentWarm, urgent: true },
  { id: 2, icon: 'water-outline', label: 'Water Heater Check', sub: 'Annual service — Jul 1', color: theme.accentBlue, urgent: false },
  { id: 3, icon: 'flash-outline', label: 'Electrical Panel',  sub: 'Inspection overdue', color: theme.warning, urgent: true },
];

const nearbyTechs = [
  { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber', rating: 4.9, initials: 'MW', color: theme.accentBlue, eta: 'Today 2-4 PM', price: 170 },
  { id: 2, name: 'Sarah Chen',  specialty: 'HVAC Specialist',    rating: 4.8, initials: 'SC', color: theme.accentWarm, eta: 'Today 4-6 PM', price: 165 },
];

const healthColor = (s: number) => s >= 75 ? theme.success : s >= 55 ? theme.warning : theme.danger;

export default function HomeScreen() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<number[]>([]);
  const active = reminders.filter(r => !dismissed.includes(r.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* ── Header ── */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Good afternoon,</Text>
              <Text style={styles.headerName}>Alex Johnson 👋</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color={theme.text} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* ── Home Health Score ── */}
          <Card style={{ borderColor: 'rgba(0,212,170,0.25)', backgroundColor: 'rgba(13,31,53,0.9)' }}>
            <View style={styles.row}>
              <View>
                <Text style={styles.scoreLabel}>Home Health Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                  <Text style={styles.scoreNumber}>79</Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Badge variant="yellow">HVAC Attention</Badge>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Good overall</Text>
              </View>
            </View>
            <ProgressBar progress={79} />

            {/* System scores — 2-column grid */}
            <View style={styles.sysGrid}>
              {systemScores.map(sys => (
                <View key={sys.label} style={styles.sysCell}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <Ionicons name={sys.icon as any} size={11} color={sys.color} />
                    <Text style={styles.sysLabel}>{sys.label}</Text>
                    <Text style={[styles.sysScore, { color: healthColor(sys.score) }]}>{sys.score}</Text>
                  </View>
                  <View style={styles.sysBg}>
                    <View style={[styles.sysFill, { width: `${sys.score}%` as any, backgroundColor: sys.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* ── Quick Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { flex: 2, backgroundColor: theme.accent }]}
              onPress={() => router.push('/(tabs)/diagnose')}
            >
              <Ionicons name="videocam" size={17} color={theme.bg} />
              <Text style={[styles.actionBtnText, { color: theme.bg }]}>Record & Diagnose</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { flex: 1, backgroundColor: theme.bgCard }]}
              onPress={() => router.push('/(tabs)/diagnose')}
            >
              <Ionicons name="chatbubble-ellipses" size={17} color={theme.accentPurple} />
              <Text style={[styles.actionBtnText, { color: theme.accentPurple }]}>AI Doctor</Text>
            </TouchableOpacity>
          </View>

          {/* ── Eco Savings Banner ── */}
          <Card style={{ backgroundColor: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.ecoIcon}>
                  <Ionicons name="leaf" size={17} color={theme.success} />
                </View>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: theme.success }}>Eco Savings This Year</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>By repairing instead of replacing</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: theme.success }}>$1,240</Text>
                <Text style={{ fontSize: 10, color: theme.textMuted }}>3 items saved</Text>
              </View>
            </View>
          </Card>

          {/* ── Maintenance Reminders ── */}
          {active.length > 0 && (
            <>
              <SectionHeader title="⏰ Maintenance Reminders" />
              {active.map(r => (
                <Card key={r.id} style={{ borderColor: r.urgent ? `${r.color}44` : undefined, marginBottom: 8 }}>
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.reminderIcon, { backgroundColor: r.color + '18' }]}>
                        <Ionicons name={r.icon as any} size={17} color={r.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reminderLabel}>{r.label}</Text>
                        <Text style={{ fontSize: 11, color: r.urgent ? theme.warning : theme.textMuted }}>{r.sub}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setDismissed(p => [...p, r.id])} style={{ padding: 4 }}>
                      <Ionicons name="close" size={17} color={theme.textDim} />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* ── Active Job ── */}
          <SectionHeader title="Active Job" />
          <Card borderColor="rgba(0,212,170,0.25)" onPress={() => router.push('/tracking')}>
            <View style={styles.row}>
              <View>
                <Text style={styles.idText}>FX-2847</Text>
                <Text style={styles.jobTitle}>Plumbing — Leaky Faucet</Text>
              </View>
              <Badge variant="green">In Progress</Badge>
            </View>
            <View style={styles.jobFooter}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar initials="MW" color={theme.accentBlue} size={30} />
                <View>
                  <Text style={styles.techName}>Marcus Webb</Text>
                  <Text style={styles.techEta}>ETA: 2:30 PM · en route</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.escrowAmt}>$170</Text>
                <Text style={{ fontSize: 10, color: theme.textMuted }}>in escrow</Text>
              </View>
            </View>
          </Card>

          {/* ── Nearby Technicians ── */}
          <SectionHeader title="Nearby Technicians" action="See All" onAction={() => router.push('/technicians')} />
          {nearbyTechs.map(tech => (
            <Card key={tech.id} onPress={() => router.push('/technicians')}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Avatar initials={tech.initials} color={tech.color} size={46} />
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={styles.techCardName}>{tech.name}</Text>
                    <Text style={styles.techPrice}>${tech.price} fixed</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{tech.specialty}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }}>
                    {[1,2,3,4,5].map(i => (
                      <Ionicons key={i} name={i <= 4 ? 'star' : 'star-outline'} size={10} color="#F59E0B" />
                    ))}
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>{tech.rating}</Text>
                    <Text style={{ fontSize: 11, color: theme.textDim }}>·</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>{tech.eta}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}

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
    paddingTop: Platform.OS === 'web' ? 60 : spacing.lg,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: { fontSize: 13, color: theme.textMuted },
  headerName: { fontSize: 24, fontWeight: '800', color: theme.text, marginTop: 1 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: theme.bgCard,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 9, right: 9,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: theme.danger,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Health score
  scoreLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 2 },
  scoreNumber: { fontSize: 40, fontWeight: '800', color: theme.accent, lineHeight: 46 },
  scoreMax: { fontSize: 15, color: theme.textMuted },

  // System grid — 2 columns
  sysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  sysCell: { width: '47%' },
  sysLabel: { fontSize: 10, color: theme.textMuted, flex: 1 },
  sysScore: { fontSize: 11, fontWeight: '800' },
  sysBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
  },
  sysFill: { height: 3, borderRadius: 2 },

  // Quick actions
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: borderRadius.lg,
  },
  actionBtnText: { fontSize: 13, fontWeight: '700' },

  // Eco
  ecoIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Reminders
  reminderIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  reminderLabel: { fontSize: 13, fontWeight: '700', color: theme.text },

  // Active job
  idText: { fontSize: 11, color: theme.textMuted, marginBottom: 2 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: theme.text },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  techName: { fontSize: 12, fontWeight: '600', color: theme.text },
  techEta: { fontSize: 11, color: theme.textMuted, marginTop: 1 },
  escrowAmt: { fontSize: 16, fontWeight: '800', color: theme.accent },

  // Nearby techs
  techCardName: { fontSize: 14, fontWeight: '700', color: theme.text },
  techPrice: { fontSize: 14, fontWeight: '800', color: theme.accent },
});
