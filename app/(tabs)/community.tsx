import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar, SectionHeader } from '@/components/Card';

type CommunityTab = 'solutions' | 'challenges' | 'eco';

const solutions = [
  { id: 1, user: 'James T.', initials: 'JT', color: theme.accentBlue, category: 'Plumbing', title: 'Silenced a noisy pipe in 10 min', desc: 'Wrapped the pipe with foam insulation tape — completely eliminated the banging. Cost: $8.', likes: 142, comments: 23, saved: true },
  { id: 2, user: 'Maria L.', initials: 'ML', color: theme.accentWarm, category: 'HVAC', title: 'HVAC running but not cooling fix', desc: 'Turns out it was just a dirty condenser coil. Cleaned it with a garden hose and it cooled perfectly. Saved $300 service call.', likes: 98, comments: 17, saved: false },
  { id: 3, user: 'Devon K.', initials: 'DK', color: theme.accentPurple, category: 'Electrical', title: 'Flickering lights — loose neutral fix', desc: 'Turn off breaker, tighten all neutral wire connections at the panel. Fixed instantly. Always call an electrician if unsure!', likes: 76, comments: 31, saved: false },
  { id: 4, user: 'Sarah P.', initials: 'SP', color: theme.success, category: 'Appliance', title: 'Washing machine vibrating badly', desc: 'Machine wasn\'t level! Adjusted the front feet with a wrench — perfect balance. Check this first before anything else.', likes: 201, comments: 44, saved: true },
];

const challenges = [
  { id: 1, title: 'Spring Maintenance Hero', desc: 'Complete 5 maintenance tasks before July', icon: 'trophy', color: '#F59E0B', progress: 3, total: 5, reward: '150 pts', completed: false },
  { id: 2, title: 'First Video Diagnosis', desc: 'Use AI video scan to diagnose an issue', icon: 'videocam', color: theme.accent, progress: 1, total: 1, reward: '50 pts', completed: true },
  { id: 3, title: 'Eco Warrior', desc: 'Repair 3 appliances instead of replacing', icon: 'leaf', color: theme.success, progress: 2, total: 3, reward: '200 pts', completed: false },
  { id: 4, title: 'Community Helper', desc: 'Share a solution that gets 10+ likes', icon: 'people', color: theme.accentPurple, progress: 0, total: 1, reward: '100 pts', completed: false },
  { id: 5, title: 'Perfect Record', desc: 'Go 6 months with zero urgent issues', icon: 'shield-checkmark', color: theme.accentBlue, progress: 4, total: 6, reward: '300 pts', completed: false },
];

const ecoData = {
  repairsCount: 5,
  moneySaved: 1240,
  co2Reduced: 58,
  landfillAvoided: 3,
  breakdown: [
    { item: 'Kitchen Fridge', saved: 555, co2: 22, action: 'Repaired gasket' },
    { item: 'Dishwasher', saved: 380, co2: 18, action: 'Fixed pump motor' },
    { item: 'Washing Machine', saved: 305, co2: 12, action: 'Replaced belt' },
  ],
};

const TABS: { key: CommunityTab; label: string; icon: string }[] = [
  { key: 'solutions',  label: 'Solutions',  icon: 'bulb' },
  { key: 'challenges', label: 'Challenges', icon: 'trophy' },
  { key: 'eco',        label: 'Eco Impact', icon: 'leaf' },
];

export default function CommunityScreen() {
  const [tab, setTab] = useState<CommunityTab>('solutions');
  const [likes, setLikes] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });
  const [saved, setSaved] = useState<Record<number, boolean>>({ 1: true, 4: true });
  const [search, setSearch] = useState('');
  const [sharing, setSharing] = useState(false);

  const filtered = solutions.filter(s =>
    search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryVariant = (cat: string): 'blue' | 'yellow' | 'purple' | 'green' => {
    if (cat === 'HVAC' || cat === 'Electrical') return 'yellow';
    if (cat === 'Appliance') return 'purple';
    if (cat === 'Roofing') return 'green';
    return 'blue';
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Fixed page header ── */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Community</Text>
          <Text style={styles.pageSubtitle}>Fixes, challenges & eco impact</Text>
        </View>
        {tab === 'solutions' && (
          <TouchableOpacity style={styles.shareBtn} onPress={() => setSharing(!sharing)}>
            <Ionicons name="add" size={15} color={theme.bg} />
            <Text style={styles.shareBtnText}>Share Fix</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Underline tab switcher ── */}
      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
            <View style={styles.tabInner}>
              <Ionicons name={t.icon as any} size={13} color={tab === t.key ? theme.accent : theme.textDim} />
              <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
            </View>
            {tab === t.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── SOLUTIONS ── */}
        {tab === 'solutions' && (
          <>
            {sharing && (
              <Card borderColor="rgba(0,212,170,0.2)" style={{ marginBottom: 12 }}>
                <Text style={styles.inputLabel}>Share a fix that worked for you</Text>
                <TextInput style={styles.input} placeholder="Title (e.g. Fixed rattling dishwasher)" placeholderTextColor={theme.textDim} />
                <TextInput style={[styles.input, { height: 72 }]} placeholder="Describe the fix in detail..." placeholderTextColor={theme.textDim} multiline />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={() => setSharing(false)}>
                    <Text style={styles.primaryBtnText}>Post Solution</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setSharing(false)}>
                    <Text style={{ color: theme.textMuted, fontWeight: '600' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            )}

            {/* Search bar */}
            <View style={styles.searchRow}>
              <Ionicons name="search" size={15} color={theme.textDim} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search solutions..."
                placeholderTextColor={theme.textDim}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {filtered.map(s => (
              <Card key={s.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar initials={s.initials} color={s.color} size={34} />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.solutionUser}>{s.user}</Text>
                    <Badge variant={categoryVariant(s.category)}>{s.category}</Badge>
                  </View>
                </View>
                <Text style={styles.solutionTitle}>{s.title}</Text>
                <Text style={styles.solutionDesc}>{s.desc}</Text>
                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setLikes(prev => ({ ...prev, [s.id]: !prev[s.id] }))}>
                    <Ionicons name={likes[s.id] ? 'heart' : 'heart-outline'} size={15} color={likes[s.id] ? theme.danger : theme.textMuted} />
                    <Text style={styles.actionText}>{s.likes + (likes[s.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={15} color={theme.textMuted} />
                    <Text style={styles.actionText}>{s.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setSaved(prev => ({ ...prev, [s.id]: !prev[s.id] }))}>
                    <Ionicons name={saved[s.id] ? 'bookmark' : 'bookmark-outline'} size={15} color={saved[s.id] ? theme.accent : theme.textMuted} />
                    <Text style={[styles.actionText, saved[s.id] && { color: theme.accent }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* ── CHALLENGES ── */}
        {tab === 'challenges' && (
          <>
            {/* Points banner */}
            <View style={styles.pointsBanner}>
              <View>
                <Text style={{ fontSize: 12, color: theme.textMuted }}>Challenge Points</Text>
                <Text style={{ fontSize: 30, fontWeight: '800', color: theme.accentPurple, marginTop: 2 }}>250 pts</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Badge variant="purple">Rank #142</Badge>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Top 18%</Text>
              </View>
            </View>

            {challenges.map(c => (
              <Card key={c.id} style={c.completed ? { borderColor: 'rgba(16,185,129,0.2)' } : {}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.challengeIcon, { backgroundColor: c.color + '20' }]}>
                    <Ionicons name={c.icon as any} size={20} color={c.completed ? theme.success : c.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.challengeTitle}>{c.title}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: c.color }}>{c.reward}</Text>
                    </View>
                    <Text style={styles.challengeDesc}>{c.desc}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <Text style={{ fontSize: 10, color: theme.textMuted }}>{c.progress}/{c.total} done</Text>
                      {c.completed && <Badge variant="green">✓ Done</Badge>}
                    </View>
                    <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 4 }}>
                      <View style={{ height: 3, width: `${(c.progress / c.total) * 100}%` as any, backgroundColor: c.completed ? theme.success : c.color, borderRadius: 2 }} />
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* ── ECO IMPACT ── */}
        {tab === 'eco' && (
          <>
            <Text style={styles.tabIntro}>Your environmental savings by repairing instead of replacing</Text>

            {/* 4 eco stats — 2×2 grid */}
            <View style={styles.ecoGrid}>
              {[
                { icon: 'cash',     value: `$${ecoData.moneySaved}`,        label: 'Money Saved',      color: theme.success },
                { icon: 'cloud',    value: `${ecoData.co2Reduced} kg`,       label: 'CO₂ Reduced',     color: theme.accentBlue },
                { icon: 'construct',value: `${ecoData.repairsCount}`,         label: 'Items Repaired',  color: theme.accentPurple },
                { icon: 'trash',    value: `${ecoData.landfillAvoided}`,      label: 'Landfill Avoided',color: theme.accent },
              ].map(s => (
                <View key={s.label} style={styles.ecoCell}>
                  <Ionicons name={s.icon as any} size={20} color={s.color} />
                  <Text style={[styles.ecoValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.ecoLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <SectionHeader title="Breakdown by Appliance" />
            {ecoData.breakdown.map(b => (
              <Card key={b.item}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>{b.item}</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{b.action}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: theme.success }}>${b.saved} saved</Text>
                    <Text style={{ fontSize: 11, color: theme.accentBlue }}>{b.co2} kg CO₂</Text>
                  </View>
                </View>
              </Card>
            ))}

            <SectionHeader title="💡 Savings Comparison" />
            <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)' }}>
              {[
                { label: 'Avg repair cost',            value: '$148',   color: theme.warning },
                { label: 'Avg replacement cost',       value: '$680',   color: theme.danger },
                { label: 'Avg savings per repair',     value: '$532',   color: theme.success },
                { label: 'Lifetime savings (5 repairs)', value: '$1,240', color: theme.accent },
              ].map(row => (
                <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{row.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: row.color }}>{row.value}</Text>
                </View>
              ))}
            </Card>

            <Card style={{ marginTop: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 10 }}>vs. the community</Text>
              {[
                { label: 'Your savings', value: 78, color: theme.accent },
                { label: 'Community avg', value: 45, color: theme.textMuted },
                { label: 'Top 10%', value: 95, color: theme.success },
              ].map(item => (
                <View key={item.label} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={{ fontSize: 11, color: item.color, fontWeight: '600' }}>{item.label}</Text>
                    <Text style={{ fontSize: 11, color: item.color, fontWeight: '700' }}>{item.value}%</Text>
                  </View>
                  <View style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <View style={{ height: 5, width: `${item.value}%` as any, backgroundColor: item.color, borderRadius: 3 }} />
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },

  /* Page header */
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 56 : spacing.lg,
    paddingBottom: 12,
  },
  pageTitle: { fontSize: 22, fontWeight: '800', color: theme.text },
  pageSubtitle: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.accent,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: borderRadius.lg,
  },
  shareBtnText: { color: theme.bg, fontWeight: '700', fontSize: 12 },

  /* Underline tab switcher */
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: spacing.lg,
  },
  tabItem: { flex: 1, alignItems: 'center', position: 'relative' },
  tabInner: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 10 },
  tabLabel: { fontSize: 13, fontWeight: '600', color: theme.textDim },
  tabLabelActive: { color: theme.accent },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.accent,
    borderRadius: 2,
  },

  /* Scroll content */
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 48 },

  /* Solutions */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchInput: { flex: 1, color: theme.text, fontSize: 13 },
  solutionUser: { fontSize: 13, fontWeight: '700', color: theme.text },
  solutionTitle: { fontSize: 14, fontWeight: '700', color: theme.text, marginBottom: 5 },
  solutionDesc: { fontSize: 12, color: theme.textMuted, lineHeight: 18 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 12, color: theme.textMuted },

  /* Share form */
  inputLabel: { fontSize: 13, fontWeight: '600', color: theme.text, marginBottom: 10 },
  input: { backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, paddingHorizontal: 12, paddingVertical: 9, color: theme.text, fontSize: 13, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  primaryBtn: { backgroundColor: theme.accent, paddingVertical: 11, borderRadius: borderRadius.lg, alignItems: 'center' },
  primaryBtnText: { color: theme.bg, fontWeight: '700', fontSize: 13 },
  cancelBtn: { backgroundColor: theme.bgElevated, paddingHorizontal: 14, paddingVertical: 11, borderRadius: borderRadius.lg, alignItems: 'center' },

  /* Challenges */
  pointsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(139,92,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  challengeIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  challengeTitle: { fontSize: 13, fontWeight: '700', color: theme.text, flex: 1, paddingRight: 8 },
  challengeDesc: { fontSize: 11, color: theme.textMuted, marginTop: 2 },

  /* Eco */
  tabIntro: { fontSize: 12, color: theme.textMuted, marginBottom: 14, lineHeight: 18 },
  ecoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  ecoCell: {
    width: '47%',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  ecoValue: { fontSize: 20, fontWeight: '800', color: theme.success },
  ecoLabel: { fontSize: 10, color: theme.textMuted, textAlign: 'center' },
});
