import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';
import { useUser } from '@/contexts/UserContext';

export default function JobsScreen() {
  const router = useRouter();
  const { jobs, isLoading } = useUser();
  const [tab, setTab] = useState<'active' | 'past'>('active');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const activeJobs = jobs.filter(j => j.status === 'in_progress' || j.status === 'scheduled');
  const pastJobs = jobs.filter(j => j.status === 'completed');
  const totalSpent = pastJobs.reduce((s, j) => s + j.amount, 0);
  const avgRating = pastJobs.length
    ? (pastJobs.reduce((s, j) => s + j.rating, 0) / pastJobs.length).toFixed(1)
    : '—';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>My Jobs</Text>

          {/* Tab Switcher */}
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
                Completed ({pastJobs.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── ACTIVE JOBS ── */}
          {tab === 'active' && (
            <>
              {activeJobs.map(job => (
                <Card key={job.id} borderColor="rgba(0,212,170,0.25)">
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.jobId}>{job.id}</Text>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                    </View>
                    <Badge variant={job.status === 'in_progress' ? 'green' : 'blue'}>
                      {job.status === 'in_progress' ? 'Live' : 'Scheduled'}
                    </Badge>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={job.techInitials} color={job.techColor} size={40} />
                      <View>
                        <Text style={styles.techName}>{job.tech}</Text>
                        <Text style={styles.techSub}>
                          {job.eta ? `ETA: ${job.eta}` : job.date}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.amount}>${job.amount}</Text>
                      <Text style={styles.amountSub}>fixed price</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { flex: 2, backgroundColor: theme.accent }]}
                      onPress={() => router.push('/tracking')}
                    >
                      <Ionicons name="navigate" size={14} color={theme.bg} />
                      <Text style={[styles.actionBtnText, { color: theme.bg }]}>Track Live</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: theme.bgElevated }]}>
                      <Ionicons name="chatbubble" size={14} color={theme.text} />
                      <Text style={styles.actionBtnText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: theme.bgElevated }]}>
                      <Ionicons name="call" size={14} color={theme.text} />
                      <Text style={styles.actionBtnText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}

              {activeJobs.length === 0 && (
                <View style={styles.empty}>
                  <Ionicons name="construct-outline" size={48} color={theme.textDim} />
                  <Text style={styles.emptyTitle}>No Active Jobs</Text>
                  <Text style={styles.emptyText}>Book a technician to get started</Text>
                  <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/technicians')}>
                    <Text style={styles.emptyBtnText}>Find Technicians</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* ── COMPLETED JOBS ── */}
          {tab === 'past' && (
            <>
              <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)', marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: theme.accent }}>{pastJobs.length}</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Completed</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text }}>${totalSpent}</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Total Spent</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#F59E0B' }}>{avgRating} ⭐</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Avg Rating</Text>
                  </View>
                </View>
              </Card>

              {pastJobs.map(job => (
                <Card key={job.id}>
                  <View style={styles.row}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={styles.jobId}>{job.id} · {job.date}</Text>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                    </View>
                    <Badge variant="blue">Done</Badge>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={job.techInitials} color={job.techColor} size={38} />
                      <Text style={styles.techName}>{job.tech}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.amount}>${job.amount}</Text>
                      <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                        {[1,2,3,4,5].map(i => (
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

                  {job.review && (
                    <TouchableOpacity
                      style={styles.reviewToggle}
                      onPress={() => setExpandedReview(expandedReview === job.id ? null : job.id)}
                    >
                      <Ionicons name="chatbubble-outline" size={14} color={theme.accent} />
                      <Text style={styles.reviewToggleText}>Your Review</Text>
                      <Ionicons
                        name={expandedReview === job.id ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={theme.textMuted}
                      />
                    </TouchableOpacity>
                  )}

                  {expandedReview === job.id && job.review && (
                    <View style={styles.reviewBox}>
                      <Text style={styles.reviewText}>"{job.review}"</Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { flex: 1, backgroundColor: theme.bgElevated }]}
                      onPress={() => router.push('/technicians')}
                    >
                      <Ionicons name="refresh" size={13} color={theme.accent} />
                      <Text style={[styles.actionBtnText, { color: theme.accent }]}>Rebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: theme.bgElevated }]}>
                      <Ionicons name="document-text" size={13} color={theme.textMuted} />
                      <Text style={styles.actionBtnText}>Receipt</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}

              {pastJobs.length === 0 && (
                <View style={styles.empty}>
                  <Ionicons name="checkmark-circle-outline" size={48} color={theme.textDim} />
                  <Text style={styles.emptyTitle}>No Completed Jobs Yet</Text>
                  <Text style={styles.emptyText}>Your repair history will appear here</Text>
                </View>
              )}
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
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: Platform.OS === 'web' ? 67 : spacing.lg },
  title: { fontSize: 26, fontWeight: '800', color: theme.text, marginBottom: spacing.xl },
  tabRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, padding: 4, marginBottom: spacing.xl, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  tabBtnActive: { backgroundColor: theme.bgElevated },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  tabBtnTextActive: { color: theme.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobId: { fontSize: 11, color: theme.textMuted, marginBottom: 2 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: theme.text },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 12 },
  techName: { fontSize: 13, fontWeight: '600', color: theme.text },
  techSub: { fontSize: 11, color: theme.textMuted },
  amount: { fontSize: 16, fontWeight: '800', color: theme.accent },
  amountSub: { fontSize: 10, color: theme.textMuted },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: borderRadius.md },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: theme.text },
  reviewToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  reviewToggleText: { flex: 1, fontSize: 12, color: theme.accent, fontWeight: '600' },
  reviewBox: { backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, padding: 12, marginTop: 8 },
  reviewText: { fontSize: 13, color: theme.textMuted, fontStyle: 'italic', lineHeight: 19 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.textMuted },
  emptyText: { fontSize: 13, color: theme.textDim },
  emptyBtn: { backgroundColor: theme.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: borderRadius.lg, marginTop: 8 },
  emptyBtnText: { color: theme.bg, fontWeight: '700' },
});
