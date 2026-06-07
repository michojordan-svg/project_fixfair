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
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge } from '@/components/Card';

const activeJobs = [
  {
    id: 'FX-2847',
    title: 'Plumbing - Leaky Faucet',
    tech: 'Marcus Webb',
    eta: '2:30 PM',
    amount: 185,
    status: 'in_progress' as const,
  },
];

const pastJobs = [
  {
    id: 'FX-2801',
    title: 'HVAC - Filter Replacement',
    tech: 'Sarah Chen',
    date: 'May 28, 2026',
    amount: 95,
    rating: 5,
    status: 'completed' as const,
  },
  {
    id: 'FX-2755',
    title: 'Electrical - Outlet Repair',
    tech: 'David Park',
    date: 'May 12, 2026',
    amount: 140,
    rating: 4,
    status: 'completed' as const,
  },
  {
    id: 'FX-2710',
    title: 'Appliance - Dishwasher Fix',
    tech: 'Maria Torres',
    date: 'Apr 30, 2026',
    amount: 220,
    rating: 5,
    status: 'completed' as const,
  },
];

export default function JobsScreen() {
  const [tab, setTab] = useState<'active' | 'past'>('active');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>My Jobs</Text>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'active' && styles.tabBtnActive]}
              onPress={() => setTab('active')}
            >
              <Text style={[styles.tabBtnText, tab === 'active' && styles.tabBtnTextActive]}>
                Active ({activeJobs.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'past' && styles.tabBtnActive]}
              onPress={() => setTab('past')}
            >
              <Text style={[styles.tabBtnText, tab === 'past' && styles.tabBtnTextActive]}>
                Past ({pastJobs.length})
              </Text>
            </TouchableOpacity>
          </View>

          {tab === 'active' && (
            <>
              {activeJobs.map((job) => (
                <Card key={job.id} borderColor="rgba(0,212,170,0.2)">
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.jobId}>{job.id}</Text>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                    </View>
                    <Badge variant="green">In Progress</Badge>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={styles.techAvatar}>
                        <Text style={styles.techAvatarText}>MW</Text>
                      </View>
                      <View>
                        <Text style={styles.techName}>{job.tech}</Text>
                        <Text style={styles.techEta}>ETA: {job.eta}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.amount}>${job.amount}</Text>
                      <Text style={styles.amountLabel}>in escrow</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: theme.accent }]}>
                      <Ionicons name="map" size={14} color={theme.bg} />
                      <Text style={[styles.actionBtnText, { color: theme.bg }]}>Track</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: theme.bgElevated }]}>
                      <Ionicons name="chatbubble" size={14} color={theme.text} />
                      <Text style={styles.actionBtnText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}

              {activeJobs.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="construct-outline" size={48} color={theme.textDim} />
                  <Text style={styles.emptyTitle}>No Active Jobs</Text>
                  <Text style={styles.emptyText}>Book a technician to get started</Text>
                </View>
              )}
            </>
          )}

          {tab === 'past' && (
            <>
              {pastJobs.map((job) => (
                <Card key={job.id}>
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.jobId}>{job.id}</Text>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                    </View>
                    <Badge variant="blue">Completed</Badge>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.techName}>{job.tech}</Text>
                      <Text style={styles.techEta}>{job.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.amount}>${job.amount}</Text>
                      <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Ionicons
                            key={i}
                            name={i <= job.rating ? 'star' : 'star-outline'}
                            size={11}
                            color="#F59E0B"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
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
  title: { fontSize: 28, fontWeight: '800', color: theme.text, marginBottom: spacing.xl },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: theme.bgElevated },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  tabBtnTextActive: { color: theme.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobId: { fontSize: 12, color: theme.textMuted, marginBottom: 2 },
  jobTitle: { fontSize: 14, fontWeight: '600', color: theme.text },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 12 },
  techAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.accentBlue + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techAvatarText: { fontSize: 11, fontWeight: '800', color: theme.text },
  techName: { fontSize: 13, fontWeight: '600', color: theme.text },
  techEta: { fontSize: 11, color: theme.textMuted },
  amount: { fontSize: 16, fontWeight: '800', color: theme.accent },
  amountLabel: { fontSize: 10, color: theme.textMuted },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: theme.text },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.textMuted },
  emptyText: { fontSize: 13, color: theme.textDim },
});
