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

const reminders = [
  { id: 1, icon: 'snow-outline', label: 'HVAC Filter Due', sub: 'Replace by Jun 15', color: theme.accentWarm, urgent: true },
  { id: 2, icon: 'water-outline', label: 'Water Heater Check', sub: 'Annual service - Jul 1', color: theme.accentBlue, urgent: false },
  { id: 3, icon: 'flash-outline', label: 'Electrical Panel', sub: 'Inspection overdue', color: theme.warning, urgent: true },
];

const faultStats = [
  { label: 'HVAC', count: 4, color: theme.accentWarm },
  { label: 'Plumbing', count: 3, color: theme.accentBlue },
  { label: 'Electrical', count: 1, color: theme.warning },
  { label: 'Appliances', count: 2, color: theme.accentPurple },
];

const nearbyTechs = [
  { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber', rating: 4.9, jobs: 847, price: 185, initials: 'MW', color: theme.accentBlue, eta: 'Today 2-4pm' },
  { id: 2, name: 'Sarah Chen', specialty: 'HVAC Specialist', rating: 4.8, jobs: 623, price: 165, initials: 'SC', color: theme.accentWarm, eta: 'Today 4-6pm' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);

  const activeReminders = reminders.filter(r => !dismissedReminders.includes(r.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header */}
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

          {/* Home Health Score */}
          <Card style={{ backgroundColor: 'rgba(13,31,53,0.9)', borderColor: 'rgba(0,212,170,0.25)' }}>
            <View style={styles.row}>
              <View>
                <Text style={styles.labelText}>Home Health Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={styles.healthScoreNumber}>79</Text>
                  <Text style={styles.healthScoreMax}>/100</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Badge variant="yellow">HVAC Attention</Badge>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Good overall</Text>
              </View>
            </View>
            <ProgressBar progress={79} />
            {/* Individual System Health Scores */}
            <View style={{ marginTop: 12, gap: 6 }}>
              {[
                { label: 'Plumbing', score: 85, color: theme.accentBlue },
                { label: 'Electrical', score: 88, color: theme.warning },
                { label: 'HVAC', score: 55, color: theme.accentWarm },
                { label: 'Appliances', score: 91, color: theme.accentPurple },
                { label: 'Roofing', score: 74, color: theme.success },
              ].map(sys => (
                <View key={sys.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 11, color: theme.textMuted, width: 68 }}>{sys.label}</Text>
                  <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <View style={{ height: 4, width: `${sys.score}%`, backgroundColor: sys.color, borderRadius: 2 }} />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: sys.color, width: 28, textAlign: 'right' }}>{sys.score}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Eco-Saving Banner */}
          <Card style={{ backgroundColor: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)', marginBottom: spacing.md }}>
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="leaf" size={18} color={theme.success} />
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

          {/* Quick Actions */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: spacing.xl }}>
            <TouchableOpacity style={[styles.quickAction, { flex: 2, backgroundColor: theme.accent }]}
              onPress={() => router.push('/(tabs)/diagnose')}>
              <Ionicons name="videocam" size={18} color={theme.bg} />
              <Text style={[styles.quickActionText, { color: theme.bg }]}>Record & Diagnose</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { flex: 1, backgroundColor: theme.bgCard }]}
              onPress={() => router.push('/(tabs)/diagnose')}>
              <Ionicons name="chatbubble-ellipses" size={18} color={theme.accentPurple} />
              <Text style={[styles.quickActionText, { color: theme.accentPurple }]}>AI Doctor</Text>
            </TouchableOpacity>
          </View>

          {/* Maintenance Reminders */}
          {activeReminders.length > 0 && (
            <>
              <SectionHeader title="⏰ Maintenance Reminders" />
              {activeReminders.map(r => (
                <Card key={r.id} style={{ borderColor: r.urgent ? `${r.color}44` : 'rgba(255,255,255,0.06)', marginBottom: 8 }}>
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: r.color + '20', justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name={r.icon as any} size={18} color={r.color} />
                      </View>
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>{r.label}</Text>
                        <Text style={{ fontSize: 11, color: r.urgent ? theme.warning : theme.textMuted }}>{r.sub}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setDismissedReminders(prev => [...prev, r.id])}>
                      <Ionicons name="close" size={18} color={theme.textDim} />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
              <View style={{ marginBottom: spacing.xl }} />
            </>
          )}

          {/* Active Job */}
          <SectionHeader title="Active Job" />
          <Card borderColor="rgba(0,212,170,0.2)" onPress={() => router.push('/tracking')}>
            <View style={styles.row}>
              <View>
                <Text style={styles.labelText}>FX-2847</Text>
                <Text style={styles.jobTitle}>Plumbing - Leaky Faucet</Text>
              </View>
              <Badge variant="green">In Progress</Badge>
            </View>
            <View style={styles.jobFooter}>
              <View>
                <Text style={styles.techName}>Marcus Webb</Text>
                <Text style={styles.techEta}>ETA: 2:30 PM</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.escrowAmount}>$185</Text>
                <Text style={styles.escrowLabel}>in escrow</Text>
              </View>
            </View>
          </Card>

          {/* Fault Statistics Dashboard */}
          <SectionHeader title="📊 Fault Statistics" action="Details" onAction={() => {}} />
          <Card>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>Most frequent issues (last 12 months)</Text>
            {faultStats.map((s, i) => (
              <View key={s.label} style={{ marginBottom: i < faultStats.length - 1 ? 10 : 0 }}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 13, color: theme.text, fontWeight: '500' }}>{s.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: s.color }}>{s.count} faults</Text>
                </View>
                <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 4 }}>
                  <View style={{ height: 4, width: `${(s.count / 4) * 100}%`, backgroundColor: s.color, borderRadius: 2 }} />
                </View>
              </View>
            ))}
          </Card>

          {/* Nearby Pros */}
          <SectionHeader title="Nearby Technicians" action="See All" onAction={() => router.push('/technicians')} />
          {nearbyTechs.map(tech => (
            <Card key={tech.id} onPress={() => router.push('/technicians')}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Avatar initials={tech.initials} color={tech.color} size={48} />
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={{ fontWeight: '600', fontSize: 15, color: theme.text }}>{tech.name}</Text>
                    <Badge variant="green">Verified</Badge>
                  </View>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{tech.specialty}</Text>
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Ionicons key={i} name={i <= Math.floor(tech.rating) ? 'star' : 'star-outline'} size={11} color="#F59E0B" />
                      ))}
                    </View>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.rating}</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.eta}</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: '800', color: theme.accent }}>${tech.price}</Text>
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
    paddingBottom: spacing.xxl,
    paddingTop: Platform.OS === 'web' ? 67 : spacing.lg,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greeting: { fontSize: 13, color: theme.textMuted },
  headerName: { fontSize: 26, fontWeight: '800', color: theme.text },
  notifBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.bgCard, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.danger },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelText: { fontSize: 13, color: theme.textMuted, marginBottom: 2 },
  healthScoreNumber: { fontSize: 42, fontWeight: '800', color: theme.accent },
  healthScoreMax: { fontSize: 16, color: theme.textMuted },
  quickAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: borderRadius.lg },
  quickActionText: { fontSize: 13, fontWeight: '700' },
  jobTitle: { fontSize: 14, fontWeight: '600', color: theme.text },
  jobFooter: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  techName: { fontSize: 13, fontWeight: '600', color: theme.text },
  techEta: { fontSize: 11, color: theme.textMuted },
  escrowAmount: { fontSize: 16, fontWeight: '800', color: theme.accent },
  escrowLabel: { fontSize: 10, color: theme.textMuted },
});
