import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar, SectionHeader } from '@/components/Card';

const beforeAfterGallery = [
  { id: 1, appliance: 'Kitchen Fridge', date: 'May 28', issue: 'Broken seal + mold', saved: '$555', beforeColor: theme.danger, afterColor: theme.success },
  { id: 2, appliance: 'Dishwasher', date: 'Apr 12', issue: 'Broken pump motor', saved: '$380', beforeColor: theme.warning, afterColor: theme.success },
  { id: 3, appliance: 'Washing Machine', date: 'Mar 3', issue: 'Worn drive belt', saved: '$305', beforeColor: theme.danger, afterColor: theme.success },
];

const repairHistory = [
  { id: 'FX-2847', title: 'Plumbing – Leaky Faucet', tech: 'Marcus Webb', date: 'Jun 7, 2026', amount: 185, status: 'active', rating: 0 },
  { id: 'FX-2801', title: 'HVAC – Filter Replacement', tech: 'Sarah Chen', date: 'May 28', amount: 95, status: 'done', rating: 5 },
  { id: 'FX-2755', title: 'Electrical – Outlet Repair', tech: 'David Park', date: 'May 12', amount: 140, status: 'done', rating: 4 },
  { id: 'FX-2710', title: 'Appliance – Dishwasher', tech: 'Maria Torres', date: 'Apr 30', amount: 220, status: 'done', rating: 5 },
  { id: 'FX-2655', title: 'Plumbing – Drain Cleaning', tech: 'Marcus Webb', date: 'Mar 15', amount: 110, status: 'done', rating: 5 },
];

const menuItems = [
  { icon: 'home-outline', label: 'My Properties', value: '1 property', color: theme.accentBlue },
  { icon: 'shield-checkmark-outline', label: 'Warranty Plans', value: '1 active', color: theme.success },
  { icon: 'notifications-outline', label: 'Maintenance Reminders', value: '3 active', color: theme.warning },
  { icon: 'card-outline', label: 'Payment Methods', value: 'Visa ••••4242', color: theme.accentPurple },
  { icon: 'star-outline', label: 'Refer & Earn', value: '$25/referral', color: theme.accentWarm },
  { icon: 'help-circle-outline', label: 'Help & Support', value: '', color: theme.accent },
  { icon: 'document-text-outline', label: 'Terms & Privacy', value: '', color: theme.textMuted },
];

export default function ProfileScreen() {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'gallery'>('overview');
  const [galleryDetail, setGalleryDetail] = useState<typeof beforeAfterGallery[0] | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Avatar initials="AJ" color={theme.accent} size={68} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex.johnson@email.com</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                <Badge variant="green">Verified</Badge>
                <Badge variant="purple">Top 15%</Badge>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={16} color={theme.accent} />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Trust Score', value: '847', color: theme.accentPurple },
              { label: 'Jobs Done', value: '5', color: theme.accent },
              { label: 'Eco Saved', value: '$1.2K', color: theme.success },
              { label: 'Points', value: '250', color: theme.warning },
            ].map((s, i) => (
              <View key={s.label} style={[styles.statCell, i < 3 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.06)' }]}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Section Tabs */}
          <View style={styles.sectionTabRow}>
            {(['overview', 'history', 'gallery'] as const).map(t => (
              <TouchableOpacity key={t} style={[styles.sectionTab, activeSection === t && styles.sectionTabActive]} onPress={() => setActiveSection(t)}>
                <Text style={[styles.sectionTabText, activeSection === t && { color: theme.accent }]}>
                  {t === 'overview' ? 'Overview' : t === 'history' ? 'History' : 'Gallery'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── OVERVIEW ── */}
          {activeSection === 'overview' && (
            <>
              {/* Repair Challenges Progress */}
              <SectionHeader title="🏆 Repair Challenges" action="See All" onAction={() => {}} />
              <Card style={{ backgroundColor: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.2)' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <View>
                    <Text style={{ fontSize: 13, color: theme.textMuted }}>Challenge Points</Text>
                    <Text style={{ fontSize: 28, fontWeight: '800', color: theme.accentPurple }}>250 pts</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Badge variant="purple">Rank #142</Badge>
                    <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>2 of 5 challenges done</Text>
                  </View>
                </View>
                <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                  <View style={{ height: 6, width: '40%', backgroundColor: theme.accentPurple, borderRadius: 3 }} />
                </View>
              </Card>

              {/* Eco Impact Summary */}
              <SectionHeader title="🌿 Eco Impact" />
              <Card style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Ionicons name="cash" size={22} color={theme.success} />
                    <Text style={{ fontSize: 18, fontWeight: '800', color: theme.success, marginTop: 6 }}>$1,240</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Money Saved</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Ionicons name="leaf" size={22} color={theme.success} />
                    <Text style={{ fontSize: 18, fontWeight: '800', color: theme.success, marginTop: 6 }}>58 kg</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>CO₂ Reduced</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Ionicons name="construct" size={22} color={theme.success} />
                    <Text style={{ fontSize: 18, fontWeight: '800', color: theme.success, marginTop: 6 }}>5</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }}>Items Repaired</Text>
                  </View>
                </View>
              </Card>

              {/* Settings Menu */}
              <SectionHeader title="Settings" />
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {menuItems.map((item, i) => (
                  <TouchableOpacity key={item.label} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                        <Ionicons name={item.icon as any} size={17} color={item.color} />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                      <Ionicons name="chevron-forward" size={15} color={theme.textDim} />
                    </View>
                  </TouchableOpacity>
                ))}
              </Card>

              <TouchableOpacity style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={17} color={theme.danger} />
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── REPAIR HISTORY ── */}
          {activeSection === 'history' && (
            <>
              <SectionHeader title="Full Repair History" />
              <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: spacing.lg }}>Total spent: ${repairHistory.reduce((s, j) => s + (j.status === 'done' ? j.amount : 0), 0)} · 5 jobs completed</Text>
              {repairHistory.map(job => (
                <Card key={job.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View>
                      <Text style={{ fontSize: 11, color: theme.textMuted }}>{job.id} · {job.date}</Text>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{job.title}</Text>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{job.tech}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: job.status === 'active' ? theme.accent : theme.text }}>${job.amount}</Text>
                      {job.status === 'active'
                        ? <Badge variant="green">Active</Badge>
                        : (
                          <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                            {[1,2,3,4,5].map(i => (
                              <Ionicons key={i} name={i <= job.rating ? 'star' : 'star-outline'} size={11} color="#F59E0B" />
                            ))}
                          </View>
                        )}
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* ── BEFORE & AFTER GALLERY ── */}
          {activeSection === 'gallery' && (
            <>
              <SectionHeader title="Before & After Gallery" />
              <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: spacing.lg }}>Visual proof of successful repairs</Text>
              {beforeAfterGallery.map(item => (
                <TouchableOpacity key={item.id} onPress={() => setGalleryDetail(item)}>
                  <Card>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                      <View style={[styles.galleryPhoto, { backgroundColor: item.beforeColor + '20', borderColor: item.beforeColor + '44' }]}>
                        <Ionicons name="warning" size={24} color={item.beforeColor} />
                        <Text style={{ fontSize: 10, color: item.beforeColor, marginTop: 4, fontWeight: '700' }}>BEFORE</Text>
                      </View>
                      <View style={{ justifyContent: 'center', alignItems: 'center', width: 24 }}>
                        <Ionicons name="arrow-forward" size={18} color={theme.textDim} />
                      </View>
                      <View style={[styles.galleryPhoto, { backgroundColor: item.afterColor + '20', borderColor: item.afterColor + '44', flex: 1 }]}>
                        <Ionicons name="checkmark-circle" size={24} color={item.afterColor} />
                        <Text style={{ fontSize: 10, color: item.afterColor, marginTop: 4, fontWeight: '700' }}>AFTER</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{item.appliance}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{item.issue} · {item.date}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: theme.success }}>{item.saved} saved</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Gallery Detail Modal */}
      {galleryDetail && (
        <Modal visible animationType="fade" transparent onRequestClose={() => setGalleryDetail(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setGalleryDetail(null)}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginBottom: 4 }}>{galleryDetail.appliance}</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: spacing.lg }}>{galleryDetail.issue}</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.galleryFull, { backgroundColor: galleryDetail.beforeColor + '15', borderColor: galleryDetail.beforeColor + '44' }]}>
                  <Ionicons name="warning" size={36} color={galleryDetail.beforeColor} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: galleryDetail.beforeColor, marginTop: 10 }}>BEFORE</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Damaged / faulty</Text>
                </View>
                <View style={[styles.galleryFull, { backgroundColor: galleryDetail.afterColor + '15', borderColor: galleryDetail.afterColor + '44' }]}>
                  <Ionicons name="checkmark-circle" size={36} color={galleryDetail.afterColor} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: galleryDetail.afterColor, marginTop: 10 }}>AFTER</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Repaired ✓</Text>
                </View>
              </View>
              <View style={{ marginTop: spacing.xl, alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: theme.success }}>{galleryDetail.saved}</Text>
                <Text style={{ fontSize: 13, color: theme.textMuted }}>saved by repairing</Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: spacing.xl },
  userName: { fontSize: 20, fontWeight: '800', color: theme.text },
  userEmail: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,212,170,0.1)', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.xl, overflow: 'hidden' },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: theme.textMuted, marginTop: 2, textAlign: 'center' },
  sectionTabRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, padding: 4, marginBottom: spacing.xl, gap: 4 },
  sectionTab: { flex: 1, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  sectionTabActive: { backgroundColor: theme.bgElevated },
  sectionTabText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, color: theme.text, fontWeight: '500' },
  menuValue: { fontSize: 13, color: theme.textMuted },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.07)' },
  logoutText: { fontSize: 15, fontWeight: '600', color: theme.danger },
  galleryPhoto: { flex: 1, height: 90, borderRadius: borderRadius.md, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modalBox: { backgroundColor: theme.bgCard, borderRadius: 20, padding: spacing.xl, width: '100%', position: 'relative' },
  modalClose: { position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 8, backgroundColor: theme.bgElevated, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  galleryFull: { flex: 1, height: 140, borderRadius: borderRadius.lg, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});
