import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';
import { apiGetTechnicians, TechnicianData } from '@/lib/api';

const filters = ['All', 'Plumbing', 'HVAC', 'Electrical', 'Appliance'];

export default function TechniciansScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [technicians, setTechnicians] = useState<TechnicianData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiGetTechnicians()
      .then(({ technicians: t }) => { setTechnicians(t); setError(null); })
      .catch(err => setError(err.message || 'Failed to load technicians'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? technicians
    : technicians.filter(t => t.specialty.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nearby Technicians</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <View style={styles.lockBanner}>
            <Ionicons name="lock-closed" size={14} color={theme.accent} />
            <Text style={styles.lockBannerText}>
              Fixed price locked until job completion — no hidden fees, ever
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 4 }}>
              {filters.map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {isLoading && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text style={{ color: theme.textMuted, marginTop: 12, fontSize: 13 }}>Loading technicians…</Text>
            </View>
          )}

          {!isLoading && error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={theme.danger} />
              <Text style={{ color: theme.danger, fontSize: 13, flex: 1 }}>{error}</Text>
              <TouchableOpacity onPress={() => {
                setIsLoading(true);
                apiGetTechnicians()
                  .then(({ technicians: t }) => { setTechnicians(t); setError(null); })
                  .catch(e => setError(e.message))
                  .finally(() => setIsLoading(false));
              }}>
                <Text style={{ color: theme.accent, fontSize: 12, fontWeight: '700' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isLoading && !error && filtered.map((tech) => (
            <TouchableOpacity
              key={tech.id}
              onPress={() => setSelected(selected === tech.id ? null : tech.id)}
              activeOpacity={0.85}
            >
              <Card style={[
                styles.techCard,
                selected === tech.id && { borderColor: theme.accent, backgroundColor: 'rgba(0,212,170,0.04)' },
              ]}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                  <Avatar initials={tech.initials} color={tech.color} size={52} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text style={styles.techName}>{tech.name}</Text>
                      {tech.verified && <Badge variant="green">✓</Badge>}
                    </View>
                    <Text style={styles.techSpec}>{tech.specialty}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.rating} · {tech.jobs} jobs</Text>
                    </View>

                    {tech.badges.length > 0 && (
                      <View style={{ flexDirection: 'row', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                        {tech.badges.map(b => (
                          <View key={b} style={styles.badgeChip}>
                            <Text style={styles.badgeChipText}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={styles.price}>${tech.price}</Text>
                    <Text style={{ fontSize: 9, color: theme.textMuted }}>fixed</Text>
                    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: 4 }}>
                      <Ionicons name="location" size={10} color={theme.textMuted} />
                      <Text style={{ fontSize: 10, color: theme.textMuted }}>{tech.distance}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.etaRow}>
                  <Ionicons name="time-outline" size={13} color={theme.success} />
                  <Text style={styles.etaText}>Available: {tech.eta}</Text>
                  {selected === tech.id && (
                    <Ionicons name="checkmark-circle" size={16} color={theme.accent} style={{ marginLeft: 'auto' }} />
                  )}
                </View>

                {selected === tech.id && (
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => router.push('/booking')}
                  >
                    <Ionicons name="calendar" size={16} color={theme.bg} />
                    <Text style={styles.bookBtnText}>Book {tech.name.split(' ')[0]} — ${tech.price}</Text>
                  </TouchableOpacity>
                )}
              </Card>
            </TouchableOpacity>
          ))}

          {!isLoading && !error && filtered.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>No technicians for "{activeFilter}"</Text>
            </View>
          )}

          <View style={styles.trustBanner}>
            <Text style={styles.trustTitle}>FixFair Guarantee</Text>
            {[
              '🔒 Fixed price locked before any work begins',
              '🛡️ 90-day warranty on all completed repairs',
              '💳 Payment released only after your approval',
              '⭐ All technicians background-checked & insured',
            ].map((item, i) => (
              <Text key={i} style={styles.trustItem}>{item}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 67 : spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn:  { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.bgCard, justifyContent: 'center', alignItems: 'center' },
  title:    { fontSize: 17, fontWeight: '700', color: theme.text },
  scrollView: { flex: 1 },
  content:  { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.lg },
  lockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,212,170,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,212,170,0.2)',
    borderRadius: borderRadius.lg, padding: 12, marginBottom: spacing.md,
  },
  lockBannerText: { flex: 1, fontSize: 12, color: theme.textMuted },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  filterChipActive: { backgroundColor: theme.accent, borderColor: theme.accent },
  filterChipText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  filterChipTextActive: { color: theme.bg },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: borderRadius.lg, padding: 12, marginBottom: spacing.md,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  techCard: { marginBottom: 10 },
  techName: { fontSize: 15, fontWeight: '700', color: theme.text },
  techSpec: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  price:    { fontSize: 20, fontWeight: '800', color: theme.accent },
  badgeChip: {
    backgroundColor: 'rgba(0,212,170,0.1)', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeChipText: { fontSize: 10, color: theme.accent, fontWeight: '600' },
  etaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  etaText: { fontSize: 12, color: theme.success, fontWeight: '500' },
  bookBtn: {
    backgroundColor: theme.accent, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingVertical: 13,
    borderRadius: borderRadius.xl, marginTop: 12,
  },
  bookBtnText: { color: theme.bg, fontSize: 14, fontWeight: '700' },
  trustBanner: {
    backgroundColor: theme.bgCard, borderRadius: borderRadius.xl,
    padding: spacing.lg, marginTop: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  trustTitle: { fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 10 },
  trustItem:  { fontSize: 12, color: theme.textMuted, marginBottom: 6, lineHeight: 17 },
});
