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
  Switch,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar, SectionHeader } from '@/components/Card';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

const beforeAfterGallery = [
  { id: 1, appliance: 'Kitchen Fridge',   date: 'May 28', issue: 'Broken seal + mold',  saved: '$555', beforeColor: theme.danger,  afterColor: theme.success },
  { id: 2, appliance: 'Dishwasher',        date: 'Apr 12', issue: 'Broken pump motor',   saved: '$380', beforeColor: theme.warning, afterColor: theme.success },
  { id: 3, appliance: 'Washing Machine',   date: 'Mar 3',  issue: 'Worn drive belt',     saved: '$305', beforeColor: theme.danger,  afterColor: theme.success },
];

const REFERRAL_CODE = 'FIXFAIR-REF-2026';

const FAQ_ITEMS = [
  { q: 'How does fixed pricing work?', a: 'Our AI diagnoses your issue and sets a fixed price. You only pay what you see — no hidden fees, no surprises.' },
  { q: 'What if the repair costs more?', a: 'We absorb any cost overruns. Our fixed price guarantee means you never pay more than quoted.' },
  { q: 'How do I cancel a booking?', a: 'Cancel up to 2 hours before the scheduled time in the Jobs tab for a full refund.' },
  { q: 'Are technicians background-checked?', a: 'Yes. All FixFair technicians pass a background check, skills assessment, and identity verification.' },
  { q: 'What is the 90-day warranty?', a: 'Every repair comes with a 90-day parts & labour warranty. If the issue recurs, we fix it free.' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, jobs, ecoStats, diagnoses, appliances, reminders, dismissReminder, updateProfile } = useUser();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'gallery'>('overview');
  const [galleryDetail, setGalleryDetail] = useState<typeof beforeAfterGallery[0] | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editAddress, setEditAddress] = useState(profile.address);

  const [settingModal, setSettingModal] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const completedJobs = jobs.filter(j => j.status === 'completed');
  const totalSpent = completedJobs.reduce((s, j) => s + j.amount, 0);

  const saveProfile = () => {
    const nameParts = editName.trim().split(' ');
    updateProfile({
      name: editName.trim(),
      firstName: nameParts[0] ?? 'User',
      email: editEmail.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      initials: nameParts.map(p => p[0]).join('').slice(0, 2).toUpperCase(),
    });
    setEditModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Avatar initials={profile.initials} color={theme.accent} size={68} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
              <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{profile.address}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                <Badge variant="green">Verified</Badge>
                <Badge variant="purple">Top 15%</Badge>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => {
              setEditName(profile.name);
              setEditEmail(profile.email);
              setEditPhone(profile.phone);
              setEditAddress(profile.address);
              setEditModal(true);
            }}>
              <Ionicons name="pencil" size={16} color={theme.accent} />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Trust Score', value: '847',                    color: theme.accentPurple },
              { label: 'Jobs Done',   value: String(completedJobs.length), color: theme.accent },
              { label: 'Eco Saved',   value: `$${(ecoStats.moneySaved / 1000).toFixed(1)}K`, color: theme.success },
              { label: 'Points',      value: '250',                    color: theme.warning },
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
                <Text style={[styles.sectionTabText, activeSection === t && { color: theme.bg }]}>
                  {t === 'overview' ? 'Overview' : t === 'history' ? 'History' : 'Gallery'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── OVERVIEW ── */}
          {activeSection === 'overview' && (
            <>
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

              <SectionHeader title="🌿 Eco Impact" />
              <Card style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {[
                    { icon: 'cash',     value: `$${ecoStats.moneySaved.toLocaleString()}`, label: 'Money Saved' },
                    { icon: 'leaf',     value: `${ecoStats.co2Reduced} kg`,                label: 'CO₂ Reduced' },
                    { icon: 'construct',value: String(ecoStats.repairsCount),              label: 'Repaired' },
                  ].map(s => (
                    <View key={s.label} style={{ flex: 1, alignItems: 'center' }}>
                      <Ionicons name={s.icon as any} size={22} color={theme.success} />
                      <Text style={{ fontSize: 16, fontWeight: '800', color: theme.success, marginTop: 6 }}>{s.value}</Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted }}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              {diagnoses.length > 0 && (
                <>
                  <SectionHeader title="🔬 Recent Diagnoses" />
                  {diagnoses.slice(0, 3).map(d => (
                    <Card key={d.id}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 11, color: theme.textMuted }}>{d.id} · {d.date}</Text>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text, marginTop: 2 }}>{d.issue}</Text>
                          <Text style={{ fontSize: 12, color: theme.textMuted }}>{d.category} · {d.confidence}% confidence</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: theme.accent }}>${d.fixedPrice}</Text>
                          {d.videoUrl && <Ionicons name="videocam" size={12} color={theme.textDim} style={{ marginTop: 4 }} />}
                          {d.audioUrl && <Ionicons name="mic" size={12} color={theme.textDim} style={{ marginTop: 4 }} />}
                        </View>
                      </View>
                    </Card>
                  ))}
                </>
              )}

              <SectionHeader title="Settings" />
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {[
                  { icon: 'home-outline',             label: 'My Properties',         value: `${profile.address ? '1' : '0'} property`,  color: theme.accentBlue,   key: 'properties' },
                  { icon: 'shield-checkmark-outline', label: 'Warranty Plans',         value: `${appliances.filter(a => a.warrantyDaysLeft > 0).length} active`, color: theme.success, key: 'warranty' },
                  { icon: 'notifications-outline',    label: 'Maintenance Reminders',  value: `${reminders.filter(r => !r.dismissed).length} active`, color: theme.warning, key: 'reminders' },
                  { icon: 'card-outline',             label: 'Payment Methods',        value: 'Visa ••••4242',   color: theme.accentPurple, key: 'payment' },
                  { icon: 'star-outline',             label: 'Refer & Earn',           value: '$25/referral',    color: theme.accentWarm,   key: 'refer' },
                  { icon: 'help-circle-outline',      label: 'Help & Support',         value: '',                color: theme.accent,        key: 'help' },
                  { icon: 'document-text-outline',    label: 'Terms & Privacy',        value: '',                color: theme.textMuted,    key: 'terms' },
                ].map((item, i, arr) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}
                    onPress={() => setSettingModal(item.key)}
                  >
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

              <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={17} color={theme.danger} />
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── REPAIR HISTORY ── */}
          {activeSection === 'history' && (
            <>
              <SectionHeader title="Full Repair History" />
              <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: spacing.lg }}>
                Total spent: ${totalSpent} · {completedJobs.length} jobs completed
              </Text>
              {jobs.map(job => (
                <Card key={job.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={{ fontSize: 11, color: theme.textMuted }}>{job.id} · {job.date}</Text>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text, marginTop: 1 }}>{job.title}</Text>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{job.tech}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: job.status === 'in_progress' ? theme.accent : theme.text }}>${job.amount}</Text>
                      {job.status === 'in_progress'
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

          {/* ── GALLERY ── */}
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

      {/* ── Edit Profile Modal ── */}
      <Modal visible={editModal} animationType="slide" transparent onRequestClose={() => setEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setEditModal(false)}>
                  <Ionicons name="close" size={22} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              {[
                { label: 'Full Name',    value: editName,    setter: setEditName,    placeholder: 'Alex Johnson' },
                { label: 'Email',        value: editEmail,   setter: setEditEmail,   placeholder: 'email@example.com' },
                { label: 'Phone',        value: editPhone,   setter: setEditPhone,   placeholder: '+1 (555) 000-0000' },
                { label: 'Address',      value: editAddress, setter: setEditAddress, placeholder: '123 Main St, City, State' },
              ].map(field => (
                <View key={field.label} style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{field.label}</Text>
                  <TextInput
                    style={styles.editInput}
                    value={field.value}
                    onChangeText={field.setter}
                    placeholder={field.placeholder}
                    placeholderTextColor={theme.textDim}
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Gallery Detail Modal */}
      {galleryDetail && (
        <Modal visible animationType="fade" transparent onRequestClose={() => setGalleryDetail(null)}>
          <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
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

      {/* ── Settings Modals ── */}
      <Modal visible={!!settingModal} animationType="slide" transparent onRequestClose={() => setSettingModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '88%' }]}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalContent}>

                {/* Close row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>
                    {settingModal === 'properties' ? '🏠 My Properties'
                      : settingModal === 'warranty'   ? '🛡️ Warranty Plans'
                      : settingModal === 'reminders'  ? '🔔 Maintenance Reminders'
                      : settingModal === 'payment'    ? '💳 Payment Methods'
                      : settingModal === 'refer'      ? '⭐ Refer & Earn'
                      : settingModal === 'help'       ? '❓ Help & Support'
                      : '📄 Terms & Privacy'}
                  </Text>
                  <TouchableOpacity onPress={() => setSettingModal(null)}>
                    <Ionicons name="close" size={22} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* MY PROPERTIES */}
                {settingModal === 'properties' && (
                  <>
                    <View style={{ backgroundColor: 'rgba(59,130,246,0.08)', borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(59,130,246,0.25)', padding: spacing.lg, marginBottom: spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(59,130,246,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons name="home" size={22} color={theme.accentBlue} />
                        </View>
                        <View>
                          <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>Primary Residence</Text>
                          <Badge variant="blue">Verified</Badge>
                        </View>
                      </View>
                      <Text style={{ fontSize: 13, color: theme.textMuted }}>{profile.address || 'No address set'}</Text>
                      <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
                        {[
                          { label: 'Appliances', value: appliances.length },
                          { label: 'Repairs Done', value: jobs.filter(j => j.status === 'completed').length },
                          { label: 'Health Score', value: '82' },
                        ].map(s => (
                          <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, fontWeight: '800', color: theme.accentBlue }}>{s.value}</Text>
                            <Text style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{s.label}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, marginBottom: spacing.md }}
                      onPress={() => { setSettingModal(null); setEditModal(true); setEditName(profile.name); setEditEmail(profile.email); setEditPhone(profile.phone); setEditAddress(profile.address); }}
                    >
                      <Ionicons name="pencil" size={16} color={theme.accent} />
                      <Text style={{ fontSize: 14, color: theme.accent, fontWeight: '600' }}>Edit Property Address</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: 'rgba(0,212,170,0.06)', borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(0,212,170,0.2)', padding: spacing.md }}>
                      <Text style={{ fontSize: 12, color: theme.textMuted, lineHeight: 18 }}>
                        FixFair uses your address to match local verified technicians, calculate travel time estimates, and keep your home health report accurate.
                      </Text>
                    </View>
                  </>
                )}

                {/* WARRANTY PLANS */}
                {settingModal === 'warranty' && (
                  <>
                    <View style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)', padding: spacing.lg, marginBottom: spacing.lg }}>
                      <Text style={{ fontSize: 13, color: theme.textMuted }}>Your Plan</Text>
                      <Text style={{ fontSize: 20, fontWeight: '800', color: theme.text, marginTop: 2 }}>{profile.plan}</Text>
                      <Badge variant="green" style={{ marginTop: 8 }}>Active</Badge>
                      <View style={{ marginTop: 14, gap: 8 }}>
                        {['90-day repair warranty on every job', 'Priority technician matching', 'AI diagnosis included', 'Eco repair incentives'].map(f => (
                          <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                            <Text style={{ fontSize: 13, color: theme.text }}>{f}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <SectionHeader title="Appliance Warranties" />
                    {appliances.length === 0 && (
                      <Text style={{ fontSize: 13, color: theme.textMuted, textAlign: 'center', paddingVertical: 20 }}>
                        No appliances added yet. Add appliances in the Inventory tab to track warranties.
                      </Text>
                    )}
                    {appliances.slice(0, 5).map(a => (
                      <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Ionicons name={a.icon as any} size={18} color={a.color} />
                          <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>{a.name}</Text>
                            <Text style={{ fontSize: 11, color: theme.textMuted }}>{a.warrantyExpiry}</Text>
                          </View>
                        </View>
                        <Badge variant={a.warrantyDaysLeft > 90 ? 'green' : a.warrantyDaysLeft > 0 ? 'yellow' : 'purple'}>
                          {a.warrantyDaysLeft > 90 ? 'Active' : a.warrantyDaysLeft > 0 ? 'Soon' : 'Expired'}
                        </Badge>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={{ marginTop: spacing.lg, backgroundColor: theme.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: borderRadius.xl }}
                      onPress={() => { setSettingModal(null); router.push('/(tabs)/inventory'); }}
                    >
                      <Ionicons name="cube" size={16} color={theme.bg} />
                      <Text style={{ color: theme.bg, fontWeight: '700' }}>Manage in Inventory</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* MAINTENANCE REMINDERS */}
                {settingModal === 'reminders' && (
                  <>
                    <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: spacing.lg }}>
                      Manage your home maintenance alerts. Dismissed reminders won't show on your home screen.
                    </Text>
                    {reminders.map(r => (
                      <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, padding: 14, marginBottom: 10 }}>
                        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: r.color + '18', justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons name={r.icon as any} size={18} color={r.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: r.dismissed ? theme.textDim : theme.text }}>{r.label}</Text>
                          <Text style={{ fontSize: 12, color: theme.textMuted }}>{r.sub}</Text>
                        </View>
                        <Switch
                          value={!r.dismissed}
                          onValueChange={() => dismissReminder(r.id)}
                          trackColor={{ false: 'rgba(255,255,255,0.1)', true: theme.accent + '60' }}
                          thumbColor={!r.dismissed ? theme.accent : theme.textDim}
                        />
                      </View>
                    ))}
                    <Text style={{ fontSize: 11, color: theme.textDim, textAlign: 'center', marginTop: spacing.md }}>
                      Reminders are generated based on your home's service history and age of appliances.
                    </Text>
                  </>
                )}

                {/* PAYMENT METHODS */}
                {settingModal === 'payment' && (
                  <>
                    <View style={{ backgroundColor: 'rgba(139,92,246,0.07)', borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(139,92,246,0.25)', padding: spacing.lg, marginBottom: spacing.lg }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                          <Text style={{ fontSize: 13, color: theme.textMuted }}>Primary Card</Text>
                          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginTop: 2 }}>Visa ••••4242</Text>
                          <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Expires 09/28</Text>
                        </View>
                        <View style={{ width: 50, height: 34, backgroundColor: theme.accentPurple + '30', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: theme.accentPurple }}>VISA</Text>
                        </View>
                      </View>
                      <Badge variant="purple" style={{ marginTop: 10, alignSelf: 'flex-start' }}>Default</Badge>
                    </View>
                    <View style={{ backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.15)', padding: spacing.lg, alignItems: 'center', gap: 8 }}>
                      <Ionicons name="add-circle-outline" size={28} color={theme.textDim} />
                      <Text style={{ fontSize: 14, color: theme.textMuted, fontWeight: '600' }}>Add Payment Method</Text>
                      <Text style={{ fontSize: 12, color: theme.textDim }}>Cards, Apple Pay, Google Pay</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: theme.textDim, textAlign: 'center', marginTop: spacing.lg, lineHeight: 17 }}>
                      All payments are processed securely via Stripe. Your card details are never stored on FixFair servers.
                    </Text>
                  </>
                )}

                {/* REFER & EARN */}
                {settingModal === 'refer' && (
                  <>
                    <View style={{ backgroundColor: 'rgba(249,115,22,0.07)', borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(249,115,22,0.25)', padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg }}>
                      <Ionicons name="gift" size={40} color={theme.accentWarm} />
                      <Text style={{ fontSize: 26, fontWeight: '800', color: theme.text, marginTop: 10 }}>$25 per referral</Text>
                      <Text style={{ fontSize: 13, color: theme.textMuted, textAlign: 'center', marginTop: 6, lineHeight: 19 }}>
                        Share your code. When a friend completes their first repair, you both get $25 credit.
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>Your Referral Code</Text>
                    <TouchableOpacity
                      style={{ backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(0,212,170,0.3)', padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}
                      onPress={() => { try { Clipboard.setString(REFERRAL_CODE); Alert.alert('Copied!', 'Referral code copied to clipboard.'); } catch {} }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: '800', color: theme.accent, letterSpacing: 2 }}>{REFERRAL_CODE}</Text>
                      <Ionicons name="copy-outline" size={20} color={theme.accent} />
                    </TouchableOpacity>
                    {[
                      { icon: 'person-add', label: 'Friend signs up with your code' },
                      { icon: 'construct', label: 'They complete their first repair' },
                      { icon: 'cash', label: 'You both earn $25 credit instantly' },
                    ].map((step, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.accentWarm + '20', justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons name={step.icon as any} size={16} color={theme.accentWarm} />
                        </View>
                        <Text style={{ fontSize: 13, color: theme.text, flex: 1 }}>{step.label}</Text>
                      </View>
                    ))}
                    <Text style={{ fontSize: 12, color: theme.textDim, textAlign: 'center', marginTop: spacing.md }}>
                      0 referrals so far · $0 earned
                    </Text>
                  </>
                )}

                {/* HELP & SUPPORT */}
                {settingModal === 'help' && (
                  <>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: spacing.lg }}>
                      {[
                        { icon: 'chatbubble-ellipses', label: 'Live Chat', color: theme.accent },
                        { icon: 'mail', label: 'Email Us', color: theme.accentBlue },
                        { icon: 'call', label: 'Call', color: theme.success },
                      ].map(c => (
                        <TouchableOpacity key={c.label} style={{ flex: 1, backgroundColor: c.color + '15', borderRadius: borderRadius.lg, borderWidth: 1, borderColor: c.color + '30', padding: 14, alignItems: 'center', gap: 6 }}>
                          <Ionicons name={c.icon as any} size={22} color={c.color} />
                          <Text style={{ fontSize: 12, fontWeight: '600', color: c.color }}>{c.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <SectionHeader title="FAQ" />
                    {FAQ_ITEMS.map((item, i) => (
                      <TouchableOpacity
                        key={i}
                        style={{ backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, padding: 14, marginBottom: 8 }}
                        onPress={() => setFaqOpen(faqOpen === i ? null : i)}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text, flex: 1, paddingRight: 8 }}>{item.q}</Text>
                          <Ionicons name={faqOpen === i ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textMuted} />
                        </View>
                        {faqOpen === i && (
                          <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 10, lineHeight: 19 }}>{item.a}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* TERMS & PRIVACY */}
                {settingModal === 'terms' && (
                  <>
                    {[
                      { title: 'Terms of Service', icon: 'document-text', text: 'By using FixFair, you agree to our terms. We connect homeowners with vetted technicians and provide AI-powered diagnostics. Fixed pricing is guaranteed for all listed repairs. FixFair may update these terms with 30 days notice.' },
                      { title: 'Privacy Policy', icon: 'shield-checkmark', text: 'We collect only the data needed to provide our service: your name, address, contact details, and repair history. We never sell your data to third parties. Video recordings are used only for AI diagnosis and deleted after 30 days.' },
                      { title: 'Data Deletion', icon: 'trash', text: 'You can request deletion of all your personal data at any time by contacting support@fixfair.app. Account deletion is permanent and cannot be undone.' },
                    ].map(section => (
                      <View key={section.title} style={{ backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <Ionicons name={section.icon as any} size={16} color={theme.accent} />
                          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{section.title}</Text>
                        </View>
                        <Text style={{ fontSize: 13, color: theme.textMuted, lineHeight: 20 }}>{section.text}</Text>
                      </View>
                    ))}
                    <Text style={{ fontSize: 11, color: theme.textDim, textAlign: 'center', marginTop: spacing.md }}>
                      Last updated: June 2026 · Version 2.1
                    </Text>
                  </>
                )}

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
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: Platform.OS === 'web' ? 60 : spacing.lg },
  profileHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: spacing.xl },
  userName: { fontSize: 20, fontWeight: '800', color: theme.text },
  userEmail: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,212,170,0.1)', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.xl, overflow: 'hidden' },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: theme.textMuted, marginTop: 2, textAlign: 'center' },
  sectionTabRow: { flexDirection: 'row', backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, padding: 4, marginBottom: spacing.xl, gap: 4 },
  sectionTab: { flex: 1, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  sectionTabActive: { backgroundColor: theme.accent },
  sectionTabText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, color: theme.text, fontWeight: '500' },
  menuValue: { fontSize: 13, color: theme.textMuted },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.07)' },
  logoutText: { fontSize: 15, fontWeight: '600', color: theme.danger },
  galleryPhoto: { flex: 1, height: 90, borderRadius: borderRadius.md, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: theme.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalBox: { backgroundColor: theme.bgCard, borderRadius: 20, padding: spacing.xl, margin: spacing.lg, position: 'relative' },
  modalClose: { position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 8, backgroundColor: theme.bgElevated, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  galleryFull: { flex: 1, height: 140, borderRadius: borderRadius.lg, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  editInput: { backgroundColor: theme.bgElevated, borderRadius: borderRadius.lg, paddingHorizontal: 14, paddingVertical: 12, color: theme.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  saveBtn: { backgroundColor: theme.accent, paddingVertical: 14, borderRadius: borderRadius.xl, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: theme.bg, fontWeight: '700', fontSize: 15 },
  modalContent: { padding: spacing.lg, paddingBottom: 40 },
});
