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
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, ProgressBar, SectionHeader } from '@/components/Card';
import { useUser, Appliance } from '@/contexts/UserContext';

type HealthLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

const healthColor = (h: number) => {
  if (h >= 85) return theme.success;
  if (h >= 70) return theme.warning;
  return theme.danger;
};

const healthBadge = (label: HealthLevel): 'green' | 'yellow' | 'blue' | 'purple' => {
  const map: Record<HealthLevel, 'green' | 'yellow' | 'blue' | 'purple'> = { Excellent: 'green', Good: 'blue', Fair: 'yellow', Poor: 'purple' };
  return map[label];
};

const CATEGORIES = ['Appliance', 'HVAC', 'Plumbing', 'Electrical', 'Roofing', 'General'];

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  Appliance: { icon: 'cube', color: theme.accent },
  HVAC: { icon: 'snow', color: theme.accentWarm },
  Plumbing: { icon: 'water', color: theme.accentBlue },
  Electrical: { icon: 'flash', color: theme.warning },
  Roofing: { icon: 'home', color: theme.success },
  General: { icon: 'hammer', color: theme.accentPurple },
};

export default function InventoryScreen() {
  const { appliances, addAppliance, deleteAppliance } = useUser();
  const [selected, setSelected] = useState<Appliance | null>(null);
  const [tab, setTab] = useState<'all' | 'warranty'>('all');
  const [addModal, setAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    name: '', category: 'Appliance', brand: '', model: '',
    purchased_date: '', warranty_expiry: '', notes: '', replace_cost: '',
  });

  const expiringSoon = appliances.filter(a => a.warrantyDaysLeft > 0 && a.warrantyDaysLeft < 90);
  const expired = appliances.filter(a => a.warrantyDaysLeft <= 0 && a.warrantyExpiry !== 'No warranty');

  const resetForm = () => setForm({
    name: '', category: 'Appliance', brand: '', model: '',
    purchased_date: '', warranty_expiry: '', notes: '', replace_cost: '',
  });

  const handleAdd = async () => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Please enter an appliance name.');
      return;
    }
    setAdding(true);
    try {
      await addAppliance({
        name: form.name.trim(),
        category: form.category,
        brand: form.brand || undefined,
        model: form.model || undefined,
        purchased_date: form.purchased_date || undefined,
        warranty_expiry: form.warranty_expiry || undefined,
        notes: form.notes || undefined,
        replace_cost: form.replace_cost ? parseInt(form.replace_cost) : undefined,
      });
      setAddModal(false);
      resetForm();
    } catch {
      Alert.alert('Error', 'Failed to add appliance. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (a: Appliance) => {
    Alert.alert('Remove Appliance', `Remove "${a.name}" from your inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try { await deleteAppliance(a.dbId); setSelected(null); }
        catch { Alert.alert('Error', 'Failed to remove appliance.'); }
      }},
    ]);
  };

  const catMeta = (cat: string) => CATEGORY_ICONS[cat] ?? CATEGORY_ICONS.General;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Appliance Inventory</Text>
              <Text style={styles.subtitle}>{appliances.length} appliance{appliances.length !== 1 ? 's' : ''} tracked</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
              <Ionicons name="add" size={22} color={theme.accent} />
            </TouchableOpacity>
          </View>

          {/* Summary Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Total', value: appliances.length, color: theme.accent },
              { label: 'Needs Attention', value: appliances.filter(a => a.health < 60).length, color: theme.danger },
              { label: 'Warranty Expiring', value: expiringSoon.length, color: theme.warning },
              { label: 'Faults', value: appliances.reduce((s, a) => s + a.faults, 0), color: theme.accentPurple },
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
              {appliances.length === 0 && (
                <View style={styles.empty}>
                  <Ionicons name="cube-outline" size={52} color={theme.textDim} />
                  <Text style={styles.emptyTitle}>No Appliances Yet</Text>
                  <Text style={styles.emptyText}>Tap + to add your first appliance and track its warranty and health.</Text>
                  <TouchableOpacity style={styles.emptyBtn} onPress={() => setAddModal(true)}>
                    <Ionicons name="add" size={16} color={theme.bg} />
                    <Text style={styles.emptyBtnText}>Add Appliance</Text>
                  </TouchableOpacity>
                </View>
              )}
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
                          <Text style={styles.appSub}>
                            {a.category}{a.brand ? ` · ${a.brand}` : ''} · {a.age} · {a.faults} fault{a.faults !== 1 ? 's' : ''}
                          </Text>
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

              {appliances.length === 0 && (
                <View style={styles.empty}>
                  <Ionicons name="shield-outline" size={52} color={theme.textDim} />
                  <Text style={styles.emptyTitle}>No Appliances Added</Text>
                  <Text style={styles.emptyText}>Add appliances with warranty dates to track coverage.</Text>
                </View>
              )}

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
                          <Text style={styles.appSub}>Expires {a.warrantyExpiry} · {a.warrantyDaysLeft} days left</Text>
                          <View style={{ marginTop: 6, height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                            <View style={{ height: 3, width: `${Math.min((a.warrantyDaysLeft / 90) * 100, 100)}%` as any, backgroundColor: theme.warning, borderRadius: 2 }} />
                          </View>
                        </View>
                        <Badge variant="yellow">Soon</Badge>
                      </View>
                    </Card>
                  ))}
                </>
              )}

              {appliances.filter(a => a.warrantyDaysLeft > 90).length > 0 && (
                <>
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
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Detail Modal ── */}
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
                        <Text style={styles.appSub}>
                          {selected.category}{selected.brand ? ` · ${selected.brand}` : ''} · {selected.age}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setSelected(null)}>
                      <Ionicons name="close" size={22} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: spacing.xl }}>
                    <Text style={styles.sectionLabel}>Appliance Health Score</Text>
                    <View style={styles.row}>
                      <Text style={{ fontSize: 42, fontWeight: '800', color: healthColor(selected.health) }}>{selected.health}</Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Badge variant={healthBadge(selected.healthLabel)}>{selected.healthLabel}</Badge>
                        <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{selected.faults} fault{selected.faults !== 1 ? 's' : ''} recorded</Text>
                      </View>
                    </View>
                    <ProgressBar progress={selected.health} color={healthColor(selected.health)} />
                  </View>

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

                  {selected.notes ? (
                    <View style={{ backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, padding: 12, marginTop: spacing.md }}>
                      <Text style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4 }}>Notes</Text>
                      <Text style={{ fontSize: 13, color: theme.text }}>{selected.notes}</Text>
                    </View>
                  ) : null}

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
                      <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>${Math.max(0, selected.replaceCost - selected.repairCost)}</Text>
                    </View>
                  </View>

                  <View style={styles.qrSection}>
                    <Ionicons name="qr-code" size={48} color={theme.accent} />
                    <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>QR Label: {selected.qrCode}</Text>
                    <Text style={{ fontSize: 11, color: theme.textDim }}>Scan to open repair history</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: theme.danger, marginTop: 8 }]}
                    onPress={() => handleDelete(selected)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>Remove Appliance</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* ── Add Appliance Modal ── */}
      <Modal visible={addModal} animationType="slide" transparent onRequestClose={() => { setAddModal(false); resetForm(); }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                  <Text style={styles.modalTitle}>Add Appliance</Text>
                  <TouchableOpacity onPress={() => { setAddModal(false); resetForm(); }}>
                    <Ionicons name="close" size={22} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.fieldLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Kitchen Fridge"
                  placeholderTextColor={theme.textDim}
                  value={form.name}
                  onChangeText={v => setForm(f => ({ ...f, name: v }))}
                />

                <Text style={styles.fieldLabel}>Category</Text>
                <View style={styles.catGrid}>
                  {CATEGORIES.map(cat => {
                    const meta = catMeta(cat);
                    const active = form.category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, active && { borderColor: meta.color, backgroundColor: meta.color + '18' }]}
                        onPress={() => setForm(f => ({ ...f, category: cat }))}
                      >
                        <Ionicons name={meta.icon as any} size={13} color={active ? meta.color : theme.textMuted} />
                        <Text style={[styles.catChipText, active && { color: meta.color }]}>{cat}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Brand (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Samsung, LG, Bosch"
                  placeholderTextColor={theme.textDim}
                  value={form.brand}
                  onChangeText={v => setForm(f => ({ ...f, brand: v }))}
                />

                <Text style={styles.fieldLabel}>Model (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. WF45T6000AW"
                  placeholderTextColor={theme.textDim}
                  value={form.model}
                  onChangeText={v => setForm(f => ({ ...f, model: v }))}
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Purchase Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={theme.textDim}
                      value={form.purchased_date}
                      onChangeText={v => setForm(f => ({ ...f, purchased_date: v }))}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Warranty Expiry</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={theme.textDim}
                      value={form.warranty_expiry}
                      onChangeText={v => setForm(f => ({ ...f, warranty_expiry: v }))}
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Est. Replacement Cost ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 800"
                  placeholderTextColor={theme.textDim}
                  keyboardType="numeric"
                  value={form.replace_cost}
                  onChangeText={v => setForm(f => ({ ...f, replace_cost: v }))}
                />

                <Text style={styles.fieldLabel}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
                  placeholder="Any notes about this appliance…"
                  placeholderTextColor={theme.textDim}
                  multiline
                  value={form.notes}
                  onChangeText={v => setForm(f => ({ ...f, notes: v }))}
                />

                <TouchableOpacity
                  style={[styles.primaryBtn, adding && { opacity: 0.6 }]}
                  onPress={handleAdd}
                  disabled={adding}
                >
                  {adding
                    ? <ActivityIndicator size="small" color={theme.bg} />
                    : <Ionicons name="checkmark" size={16} color={theme.bg} />
                  }
                  <Text style={styles.primaryBtnText}>{adding ? 'Saving…' : 'Add Appliance'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalSheet: { backgroundColor: theme.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginTop: 12 },
  modalContent: { padding: spacing.lg, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: theme.text },
  fieldLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 6, marginTop: spacing.md },
  input: { backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, paddingHorizontal: 14, paddingVertical: 12, color: theme.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.bgElevated, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  catChipText: { fontSize: 12, fontWeight: '600', color: theme.textMuted },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: theme.text, marginTop: 14 },
  emptyText: { fontSize: 13, color: theme.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: 20 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginTop: 20 },
  emptyBtnText: { color: theme.bg, fontWeight: '700', fontSize: 14 },
});
