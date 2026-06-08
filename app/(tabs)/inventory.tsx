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
import { Card, Badge, ProgressBar, SectionHeader } from '@/components/Card';

type HealthLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

interface Appliance {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  age: string;
  health: number;
  healthLabel: HealthLevel;
  purchased: string;
  warrantyExpiry: string;
  warrantyDaysLeft: number;
  faults: number;
  lastService: string;
  repairCost: number;
  replaceCost: number;
  qrCode: string;
}

const appliances: Appliance[] = [
  { id: 'A001', name: 'Kitchen Fridge', category: 'Appliance', icon: 'cube', color: theme.accentBlue, age: '4 yrs', health: 62, healthLabel: 'Fair', purchased: 'Jun 2021', warrantyExpiry: 'Jun 2026', warrantyDaysLeft: 23, faults: 2, lastService: 'Mar 2026', repairCost: 95, replaceCost: 650, qrCode: 'FX-A001' },
  { id: 'A002', name: 'HVAC System', category: 'HVAC', icon: 'snow', color: theme.accentWarm, age: '6 yrs', health: 48, healthLabel: 'Poor', purchased: 'Jan 2019', warrantyExpiry: 'Jan 2024', warrantyDaysLeft: -500, faults: 4, lastService: 'Jan 2026', repairCost: 350, replaceCost: 3200, qrCode: 'FX-A002' },
  { id: 'A003', name: 'Washing Machine', category: 'Appliance', icon: 'refresh-circle', color: theme.accentPurple, age: '2 yrs', health: 88, healthLabel: 'Good', purchased: 'May 2023', warrantyExpiry: 'May 2028', warrantyDaysLeft: 720, faults: 0, lastService: 'Never', repairCost: 0, replaceCost: 580, qrCode: 'FX-A003' },
  { id: 'A004', name: 'Water Heater', category: 'Plumbing', icon: 'flame', color: theme.danger, age: '8 yrs', health: 70, healthLabel: 'Good', purchased: 'Mar 2017', warrantyExpiry: 'Mar 2027', warrantyDaysLeft: 270, faults: 1, lastService: 'Jun 2025', repairCost: 180, replaceCost: 900, qrCode: 'FX-A004' },
  { id: 'A005', name: 'Dishwasher', category: 'Appliance', icon: 'water', color: theme.success, age: '3 yrs', health: 91, healthLabel: 'Excellent', purchased: 'Aug 2022', warrantyExpiry: 'Aug 2027', warrantyDaysLeft: 420, faults: 0, lastService: 'Never', repairCost: 0, replaceCost: 480, qrCode: 'FX-A005' },
];

const healthColor = (h: number) => {
  if (h >= 80) return theme.success;
  if (h >= 60) return theme.warning;
  return theme.danger;
};

const healthBadge = (label: HealthLevel): 'green' | 'yellow' | 'blue' | 'purple' => {
  const map: Record<HealthLevel, 'green' | 'yellow' | 'blue' | 'purple'> = { Excellent: 'green', Good: 'blue', Fair: 'yellow', Poor: 'purple' };
  return map[label];
};

export default function InventoryScreen() {
  const [selected, setSelected] = useState<Appliance | null>(null);
  const [tab, setTab] = useState<'all' | 'warranty'>('all');

  const expiringSoon = appliances.filter(a => a.warrantyDaysLeft > 0 && a.warrantyDaysLeft < 90);
  const expired = appliances.filter(a => a.warrantyDaysLeft <= 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Appliance Inventory</Text>
              <Text style={styles.subtitle}>{appliances.length} appliances tracked</Text>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={22} color={theme.accent} />
            </TouchableOpacity>
          </View>

          {/* Summary Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Total', value: appliances.length, color: theme.accent },
              { label: 'Needs Attention', value: appliances.filter(a => a.health < 60).length, color: theme.danger },
              { label: 'Warranty Expiring', value: expiringSoon.length, color: theme.warning },
              { label: 'Faults This Year', value: appliances.reduce((s, a) => s + a.faults, 0), color: theme.accentPurple },
            ].map(s => (
              <View key={s.label} style={styles.statCard}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tabBtn, tab === 'all' && styles.tabBtnActive]} onPress={() => setTab('all')}>
              <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>All Appliances</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'warranty' && styles.tabBtnActive]} onPress={() => setTab('warranty')}>
              <Text style={[styles.tabText, tab === 'warranty' && styles.tabTextActive]}>Warranty Tracker</Text>
            </TouchableOpacity>
          </View>

          {/* All Appliances */}
          {tab === 'all' && (
            <>
              {appliances.map(a => (
                <TouchableOpacity key={a.id} onPress={() => setSelected(a)}>
                  <Card>
                    <View style={styles.row}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                        <View style={[styles.appIcon, { backgroundColor: a.color + '20' }]}>
                          <Ionicons name={a.icon as any} size={22} color={a.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.row}>
                            <Text style={styles.appName}>{a.name}</Text>
                            <Badge variant={healthBadge(a.healthLabel)}>{a.healthLabel}</Badge>
                          </View>
                          <Text style={styles.appSub}>{a.category} · {a.age} old · {a.faults} fault{a.faults !== 1 ? 's' : ''}</Text>
                          <View style={{ marginTop: 8 }}>
                            <ProgressBar progress={a.health} color={healthColor(a.health)} />
                          </View>
                          <View style={styles.row}>
                            <Text style={{ fontSize: 11, color: theme.textMuted }}>Health: {a.health}/100</Text>
                            <Text style={{ fontSize: 11, color: theme.textMuted }}>QR: {a.qrCode}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Warranty Tracker */}
          {tab === 'warranty' && (
            <>
              {/* Summary row */}
              <View style={styles.warrantyStats}>
                <View style={styles.warrantyStatCell}>
                  <Text style={[styles.warrantyStatNum, { color: theme.danger }]}>{expired.length}</Text>
                  <Text style={styles.warrantyStatLabel}>Expired</Text>
                </View>
                <View style={styles.warrantyStatDivider} />
                <View style={styles.warrantyStatCell}>
                  <Text style={[styles.warrantyStatNum, { color: theme.warning }]}>{expiringSoon.length}</Text>
                  <Text style={styles.warrantyStatLabel}>Expiring Soon</Text>
                </View>
                <View style={styles.warrantyStatDivider} />
                <View style={styles.warrantyStatCell}>
                  <Text style={[styles.warrantyStatNum, { color: theme.success }]}>{appliances.filter(a => a.warrantyDaysLeft > 90).length}</Text>
                  <Text style={styles.warrantyStatLabel}>Active</Text>
                </View>
              </View>

              {expired.length > 0 && (
                <>
                  <SectionHeader title="⚠️ Expired" />
                  {expired.map(a => (
                    <Card key={a.id} borderColor="rgba(239,68,68,0.25)">
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={[styles.appIcon, { backgroundColor: theme.danger + '18' }]}>
                          <Ionicons name={a.icon as any} size={20} color={theme.danger} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.appName}>{a.name}</Text>
                          <Text style={styles.appSub}>Expired {a.warrantyExpiry} · No coverage</Text>
                        </View>
                        <Badge variant="purple">Expired</Badge>
                      </View>
                    </Card>
                  ))}
                </>
              )}

              {expiringSoon.length > 0 && (
                <>
                  <SectionHeader title="🔔 Expiring Soon" />
                  {expiringSoon.map(a => (
                    <Card key={a.id} borderColor="rgba(245,158,11,0.25)">
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={[styles.appIcon, { backgroundColor: theme.warning + '18' }]}>
                          <Ionicons name={a.icon as any} size={20} color={theme.warning} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.appName}>{a.name}</Text>
                          <Text style={styles.appSub}>Expires {a.warrantyExpiry}</Text>
                          <View style={{ marginTop: 6 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                              <Text style={{ fontSize: 10, color: theme.warning }}>{a.warrantyDaysLeft} days left</Text>
                            </View>
                            <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                              <View style={{ height: 3, width: `${Math.min((a.warrantyDaysLeft / 90) * 100, 100)}%` as any, backgroundColor: theme.warning, borderRadius: 2 }} />
                            </View>
                          </View>
                        </View>
                        <Badge variant="yellow">Soon</Badge>
                      </View>
                    </Card>
                  ))}
                </>
              )}

              <SectionHeader title="✅ Active" />
              {appliances.filter(a => a.warrantyDaysLeft > 90).map(a => (
                <Card key={a.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.appIcon, { backgroundColor: a.color + '18' }]}>
                      <Ionicons name={a.icon as any} size={20} color={a.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appName}>{a.name}</Text>
                      <Text style={styles.appSub}>Expires {a.warrantyExpiry} · {a.warrantyDaysLeft} days left</Text>
                    </View>
                    <Badge variant="green">Active</Badge>
                  </View>
                </Card>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      {selected && (
        <Modal visible animationType="slide" transparent onRequestClose={() => setSelected(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalContent}>
                  <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={[styles.appIcon, { backgroundColor: selected.color + '20', width: 52, height: 52 }]}>
                        <Ionicons name={selected.icon as any} size={26} color={selected.color} />
                      </View>
                      <View>
                        <Text style={styles.modalTitle}>{selected.name}</Text>
                        <Text style={styles.appSub}>{selected.category} · {selected.age} old</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setSelected(null)}>
                      <Ionicons name="close" size={22} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>

                  {/* Health Score */}
                  <View style={{ marginTop: spacing.xl }}>
                    <Text style={styles.sectionLabel}>Appliance Health Score</Text>
                    <View style={styles.row}>
                      <Text style={{ fontSize: 42, fontWeight: '800', color: healthColor(selected.health) }}>{selected.health}</Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Badge variant={healthBadge(selected.healthLabel)}>{selected.healthLabel}</Badge>
                        <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{selected.faults} faults recorded</Text>
                      </View>
                    </View>
                    <ProgressBar progress={selected.health} color={healthColor(selected.health)} />
                  </View>

                  {/* Details Grid */}
                  <View style={styles.detailGrid}>
                    {[
                      { label: 'Purchased', value: selected.purchased },
                      { label: 'Warranty', value: selected.warrantyExpiry },
                      { label: 'Last Service', value: selected.lastService },
                      { label: 'QR Code', value: selected.qrCode },
                    ].map(d => (
                      <View key={d.label} style={styles.detailCell}>
                        <Text style={styles.detailLabel}>{d.label}</Text>
                        <Text style={styles.detailValue}>{d.value}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Repair vs Replace */}
                  <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Repair vs Replace Analysis</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                    <View style={[styles.rvrBox, { borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'rgba(16,185,129,0.05)' }]}>
                      <Ionicons name="build" size={20} color={theme.success} />
                      <Text style={{ fontSize: 12, color: theme.success, fontWeight: '700', marginTop: 4 }}>Repair</Text>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>${selected.repairCost}</Text>
                    </View>
                    <View style={styles.rvrBox}>
                      <Ionicons name="cart" size={20} color={theme.textMuted} />
                      <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: '700', marginTop: 4 }}>Replace</Text>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>${selected.replaceCost}</Text>
                    </View>
                    <View style={[styles.rvrBox, { borderColor: 'rgba(0,212,170,0.3)', backgroundColor: 'rgba(0,212,170,0.05)' }]}>
                      <Ionicons name="leaf" size={20} color={theme.accent} />
                      <Text style={{ fontSize: 12, color: theme.accent, fontWeight: '700', marginTop: 4 }}>Eco Save</Text>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>${selected.replaceCost - selected.repairCost}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: selected.repairCost < selected.replaceCost * 0.4 ? theme.success : theme.warning, marginTop: 8 }}>
                    {selected.repairCost < selected.replaceCost * 0.4
                      ? '✅ Repairing is recommended — cost is well below replacement.'
                      : '⚠️ Consider replacement if issues recur — repair cost is significant.'}
                  </Text>

                  {/* QR Code display */}
                  <View style={styles.qrSection}>
                    <Ionicons name="qr-code" size={48} color={theme.accent} />
                    <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>QR Label: {selected.qrCode}</Text>
                    <Text style={{ fontSize: 11, color: theme.textDim }}>Scan to open repair history</Text>
                  </View>

                  <TouchableOpacity style={styles.primaryBtn}>
                    <Ionicons name="document-text" size={16} color={theme.bg} />
                    <Text style={styles.primaryBtnText}>View Full Repair History</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
    paddingTop: Platform.OS === 'web' ? 60 : spacing.lg,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: 26, fontWeight: '800', color: theme.text },
  subtitle: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0,212,170,0.1)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.2)', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.xl, overflow: 'hidden' },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: theme.textMuted, marginTop: 2, textAlign: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, padding: 4, marginBottom: spacing.xl, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  tabBtnActive: { backgroundColor: theme.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  tabTextActive: { color: theme.bg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warrantyStats: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: spacing.lg },
  warrantyStatCell: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  warrantyStatNum: { fontSize: 22, fontWeight: '800' },
  warrantyStatLabel: { fontSize: 10, color: theme.textMuted, marginTop: 2, textAlign: 'center' },
  warrantyStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 8 },
  appIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: 14, fontWeight: '700', color: theme.text },
  appSub: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  sectionLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.lg },
  detailCell: { width: '48%', backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, padding: 12 },
  detailLabel: { fontSize: 11, color: theme.textMuted },
  detailValue: { fontSize: 13, fontWeight: '700', color: theme.text, marginTop: 2 },
  rvrBox: { flex: 1, backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  qrSection: { alignItems: 'center', paddingVertical: spacing.xl, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', marginTop: spacing.lg },
  primaryBtn: { backgroundColor: theme.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: borderRadius.xl, marginTop: spacing.md },
  primaryBtnText: { color: theme.bg, fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: theme.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginTop: 12 },
  modalContent: { padding: spacing.lg, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: theme.text },
});
