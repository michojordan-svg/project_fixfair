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

export default function CommunityScreen() {
  const [tab, setTab] = useState<CommunityTab>('solutions');
  const [likes, setLikes] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });
  const [saved, setSaved] = useState<Record<number, boolean>>({ 1: true, 4: true });
  const [search, setSearch] = useState('');
  const [sharing, setSharing] = useState(false);

  const filtered = solutions.filter(s =>
    search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['solutions', 'challenges', 'eco'] as CommunityTab[]).map(t => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Ionicons
              name={t === 'solutions' ? 'bulb' : t === 'challenges' ? 'trophy' : 'leaf'}
              size={14}
              color={tab === t ? theme.bg : theme.textMuted}
            />
            <Text style={[styles.tabBtnText, tab === t && { color: theme.bg }]}>
              {t === 'solutions' ? 'Solutions' : t === 'challenges' ? 'Challenges' : 'Eco Impact'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* ── COMMUNITY SOLUTIONS ── */}
          {tab === 'solutions' && (
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Community Solutions</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={() => setSharing(!sharing)}>
                  <Ionicons name="add" size={16} color={theme.bg} />
                  <Text style={styles.shareBtnText}>Share Fix</Text>
                </TouchableOpacity>
              </View>

              {sharing && (
                <Card borderColor="rgba(0,212,170,0.2)">
                  <Text style={styles.inputLabel}>Share a fix that worked for you</Text>
                  <TextInput style={styles.input} placeholder="Title (e.g. Fixed rattling dishwasher)" placeholderTextColor={theme.textDim} />
                  <TextInput style={[styles.input, { height: 80 }]} placeholder="Describe the fix in detail..." placeholderTextColor={theme.textDim} multiline />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={() => setSharing(false)}>
                      <Text style={styles.primaryBtnText}>Post Solution</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cancelBtn]} onPress={() => setSharing(false)}>
                      <Text style={{ color: theme.textMuted, fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}

              <View style={styles.searchRow}>
                <Ionicons name="search" size={16} color={theme.textDim} />
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
                    <Avatar initials={s.initials} color={s.color} size={36} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.solutionUser}>{s.user}</Text>
                      <Badge variant={s.category === 'HVAC' || s.category === 'Electrical' ? 'yellow' : s.category === 'Appliance' ? 'purple' : s.category === 'Roofing' ? 'green' : 'blue'}>{s.category}</Badge>
                    </View>
                  </View>
                  <Text style={styles.solutionTitle}>{s.title}</Text>
                  <Text style={styles.solutionDesc}>{s.desc}</Text>
                  <View style={[styles.row, { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setLikes(prev => ({ ...prev, [s.id]: !prev[s.id] }))}>
                      <Ionicons name={likes[s.id] ? 'heart' : 'heart-outline'} size={16} color={likes[s.id] ? theme.danger : theme.textMuted} />
                      <Text style={styles.actionBtnText}>{s.likes + (likes[s.id] ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="chatbubble-outline" size={16} color={theme.textMuted} />
                      <Text style={styles.actionBtnText}>{s.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setSaved(prev => ({ ...prev, [s.id]: !prev[s.id] }))}>
                      <Ionicons name={saved[s.id] ? 'bookmark' : 'bookmark-outline'} size={16} color={saved[s.id] ? theme.accent : theme.textMuted} />
                      <Text style={[styles.actionBtnText, saved[s.id] && { color: theme.accent }]}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* ── REPAIR CHALLENGES ── */}
          {tab === 'challenges' && (
            <>
              <Text style={styles.title}>Repair Challenges</Text>
              <Card style={{ backgroundColor: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)', marginBottom: spacing.xl }}>
                <View style={styles.row}>
                  <View>
                    <Text style={{ fontSize: 13, color: theme.textMuted }}>Your Challenge Points</Text>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: theme.accentPurple }}>250 pts</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Badge variant="purple">Rank #142</Badge>
                    <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Top 18%</Text>
                  </View>
                </View>
              </Card>

              {challenges.map(c => (
                <Card key={c.id} style={c.completed ? { borderColor: 'rgba(16,185,129,0.2)' } : {}}>
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View style={[styles.challengeIcon, { backgroundColor: c.color + '20' }]}>
                        <Ionicons name={c.icon as any} size={22} color={c.completed ? theme.success : c.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.row}>
                          <Text style={styles.challengeTitle}>{c.title}</Text>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: c.color }}>{c.reward}</Text>
                        </View>
                        <Text style={styles.challengeDesc}>{c.desc}</Text>
                        <View style={{ marginTop: 8 }}>
                          <View style={styles.row}>
                            <Text style={{ fontSize: 11, color: theme.textMuted }}>{c.progress}/{c.total} complete</Text>
                            {c.completed && <Badge variant="green">Done ✓</Badge>}
                          </View>
                          <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 4 }}>
                            <View style={{ height: 4, width: `${(c.progress / c.total) * 100}%`, backgroundColor: c.completed ? theme.success : c.color, borderRadius: 2 }} />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* ── ECO-SAVING CALCULATOR ── */}
          {tab === 'eco' && (
            <>
              <Text style={styles.title}>Eco-Saving Impact</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: spacing.xl }}>Your environmental savings by repairing instead of replacing</Text>

              {/* Big Stats */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: spacing.xl }}>
                <Card style={{ flex: 1, alignItems: 'center', margin: 0 }}>
                  <Ionicons name="cash" size={24} color={theme.success} />
                  <Text style={styles.ecoStatValue}>${ecoData.moneySaved}</Text>
                  <Text style={styles.ecoStatLabel}>Money Saved</Text>
                </Card>
                <Card style={{ flex: 1, alignItems: 'center', margin: 0 }}>
                  <Ionicons name="cloud" size={24} color={theme.accentBlue} />
                  <Text style={[styles.ecoStatValue, { color: theme.accentBlue }]}>{ecoData.co2Reduced} kg</Text>
                  <Text style={styles.ecoStatLabel}>CO₂ Reduced</Text>
                </Card>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: spacing.xl }}>
                <Card style={{ flex: 1, alignItems: 'center', margin: 0 }}>
                  <Ionicons name="construct" size={24} color={theme.accentPurple} />
                  <Text style={[styles.ecoStatValue, { color: theme.accentPurple }]}>{ecoData.repairsCount}</Text>
                  <Text style={styles.ecoStatLabel}>Items Repaired</Text>
                </Card>
                <Card style={{ flex: 1, alignItems: 'center', margin: 0 }}>
                  <Ionicons name="trash" size={24} color={theme.accent} />
                  <Text style={[styles.ecoStatValue, { color: theme.accent }]}>{ecoData.landfillAvoided}</Text>
                  <Text style={styles.ecoStatLabel}>Landfill Avoided</Text>
                </Card>
              </View>

              {/* Breakdown */}
              <SectionHeader title="Breakdown by Appliance" />
              {ecoData.breakdown.map(b => (
                <Card key={b.item}>
                  <View style={styles.row}>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{b.item}</Text>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{b.action}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: theme.success }}>${b.saved} saved</Text>
                      <Text style={{ fontSize: 11, color: theme.accentBlue }}>{b.co2} kg CO₂ avoided</Text>
                    </View>
                  </View>
                </Card>
              ))}

              {/* Calculator */}
              <SectionHeader title="💡 Before-and-After Savings" />
              <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 12 }}>Repair saves more than money</Text>
                {[
                  { label: 'Avg repair cost', value: '$148', color: theme.warning },
                  { label: 'Avg replacement cost', value: '$680', color: theme.danger },
                  { label: 'Avg savings per repair', value: '$532', color: theme.success },
                  { label: 'Lifetime savings (5 repairs)', value: '$1,240', color: theme.accent },
                ].map(row => (
                  <View key={row.label} style={[styles.row, { marginBottom: 8 }]}>
                    <Text style={{ fontSize: 13, color: theme.textMuted }}>{row.label}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: row.color }}>{row.value}</Text>
                  </View>
                ))}
              </Card>

              {/* Community Comparison */}
              <Card style={{ marginTop: spacing.md }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 8 }}>How you compare to the community</Text>
                <View style={{ gap: 10 }}>
                  {[
                    { label: 'Your savings', value: 78, color: theme.accent },
                    { label: 'Community avg', value: 45, color: theme.textMuted },
                    { label: 'Top 10%', value: 95, color: theme.success },
                  ].map(item => (
                    <View key={item.label}>
                      <View style={styles.row}>
                        <Text style={{ fontSize: 12, color: item.color, fontWeight: '600' }}>{item.label}</Text>
                        <Text style={{ fontSize: 12, color: item.color, fontWeight: '700' }}>{item.value}%</Text>
                      </View>
                      <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, marginTop: 4 }}>
                        <View style={{ height: 6, width: `${item.value}%`, backgroundColor: item.color, borderRadius: 3 }} />
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.bgCard,
    marginHorizontal: spacing.lg,
    marginTop: Platform.OS === 'web' ? 60 : spacing.lg,
    borderRadius: borderRadius.lg,
    padding: 4,
    gap: 4,
  },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: borderRadius.md },
  tabBtnActive: { backgroundColor: theme.accent },
  tabBtnText: { fontSize: 12, fontWeight: '700', color: theme.textMuted },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: theme.text, marginBottom: spacing.lg },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.lg },
  shareBtnText: { color: theme.bg, fontWeight: '700', fontSize: 13 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, paddingHorizontal: 14, paddingVertical: 10, marginBottom: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  searchInput: { flex: 1, color: theme.text, fontSize: 14 },
  solutionUser: { fontSize: 13, fontWeight: '700', color: theme.text },
  solutionTitle: { fontSize: 14, fontWeight: '700', color: theme.text, marginBottom: 6 },
  solutionDesc: { fontSize: 13, color: theme.textMuted, lineHeight: 19 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionBtnText: { fontSize: 13, color: theme.textMuted },
  inputLabel: { fontSize: 13, fontWeight: '600', color: theme.text, marginBottom: 10 },
  input: { backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, paddingHorizontal: 12, paddingVertical: 10, color: theme.text, fontSize: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  primaryBtn: { backgroundColor: theme.accent, paddingVertical: 12, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: theme.bg, fontWeight: '700', fontSize: 14 },
  cancelBtn: { backgroundColor: theme.bgElevated, paddingHorizontal: 16, paddingVertical: 12, borderRadius: borderRadius.lg, alignItems: 'center' },
  challengeIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  challengeTitle: { fontSize: 14, fontWeight: '700', color: theme.text },
  challengeDesc: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  ecoStatValue: { fontSize: 24, fontWeight: '800', color: theme.success, marginTop: 8 },
  ecoStatLabel: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
});
