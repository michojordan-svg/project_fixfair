import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';
import { Stars } from '@/components/Stars';
import { useUser } from '@/contexts/UserContext';
import { apiCreateBooking } from '@/lib/api';

const timeSlots = [
  { id: 'today1', label: 'Today 2–4 PM',       available: true  },
  { id: 'today2', label: 'Today 4–6 PM',        available: true  },
  { id: 'tom1',   label: 'Tomorrow 9–11 AM',    available: true  },
  { id: 'tom2',   label: 'Tomorrow 11 AM–1 PM', available: false },
  { id: 'tom3',   label: 'Tomorrow 2–4 PM',     available: true  },
];

function StepIndicator({ step }: { step: number }) {
  const steps = ['Schedule', 'Confirm', 'Pay'];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={label}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={[stepStyles.dot, done && stepStyles.dotDone, active && stepStyles.dotActive]}>
                {done
                  ? <Ionicons name="checkmark" size={14} color={theme.bg} />
                  : <Text style={[stepStyles.dotNum, active && { color: theme.bg }]}>{idx}</Text>}
              </View>
              <Text style={[stepStyles.dotLabel, active && { color: theme.text }]}>{label}</Text>
            </View>
            {i < steps.length - 1 && (
              <View style={[stepStyles.line, done && stepStyles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  dotActive: { backgroundColor: theme.accent, borderColor: theme.accent },
  dotDone:   { backgroundColor: theme.success, borderColor: theme.success },
  dotNum: { fontSize: 12, fontWeight: '700', color: theme.textMuted },
  dotLabel: { fontSize: 10, color: theme.textMuted, fontWeight: '600' },
  line: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: -16 },
  lineDone: { backgroundColor: theme.success },
});

export default function BookingScreen() {
  const router = useRouter();
  const { profile, refreshJobs } = useUser();

  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>('today1');
  const [address, setAddress] = useState(profile.address);
  const [instructions, setInstructions] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const slotLabel = timeSlots.find(s => s.id === selectedSlot)?.label ?? 'Today 2–4 PM';

  function validateAndNext() {
    if (!address.trim()) {
      setAddressError('Please enter your address');
      return;
    }
    if (address.trim().length < 8) {
      setAddressError('Please enter a complete address');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Select a time', 'Please choose an available time slot to continue.');
      return;
    }
    setAddressError('');
    setStep(2);
  }

  async function confirmBooking() {
    setIsSubmitting(true);
    setBookingError(null);
    try {
      await apiCreateBooking({
        techName: 'Marcus Webb',
        techInitials: 'MW',
        techColor: theme.accentBlue,
        scheduledSlot: slotLabel,
        address: address.trim(),
        instructions: instructions.trim() || undefined,
        amount: 170,
        category: 'Plumbing',
      });
      await refreshJobs();
      setStep(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Booking failed. Please try again.';
      setBookingError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <StepIndicator step={step} />

          {/* Technician summary — always visible */}
          <Card>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Avatar initials="MW" color={theme.accentBlue} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={styles.techName}>Marcus Webb</Text>
                <Text style={styles.techSpec}>Master Plumber</Text>
                <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <Ionicons key={i} name="star" size={11} color="#F59E0B" />
                  ))}
                  <Text style={{ fontSize: 11, color: theme.textMuted, marginLeft: 4 }}>4.9 · 847 jobs</Text>
                </View>
              </View>
              <Badge variant="green">Verified</Badge>
            </View>
          </Card>

          {/* STEP 1 — Schedule */}
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>Service Address</Text>
              {!!profile.address && (
                <View style={styles.savedAddressRow}>
                  <Ionicons name="home" size={13} color={theme.accent} />
                  <Text style={styles.savedAddressText}>Saved: {profile.address}</Text>
                  <TouchableOpacity onPress={() => setAddress(profile.address)}>
                    <Text style={styles.useBtn}>Use</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                style={[styles.input, addressError ? styles.inputError : null]}
                placeholder="123 Main St, City, State"
                placeholderTextColor={theme.textDim}
                value={address}
                onChangeText={t => { setAddress(t); setAddressError(''); }}
                autoCapitalize="words"
              />
              {!!addressError && <Text style={styles.errorText}>{addressError}</Text>}

              <Text style={styles.sectionTitle}>Select Time Slot</Text>
              <View style={{ gap: 8, marginBottom: spacing.xl }}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    disabled={!slot.available}
                    onPress={() => setSelectedSlot(slot.id)}
                    style={[
                      styles.slotBtn,
                      !slot.available && styles.slotBtnDisabled,
                      selectedSlot === slot.id && styles.slotBtnSelected,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={!slot.available ? theme.textDim : selectedSlot === slot.id ? theme.bg : theme.accent}
                      />
                      <Text style={[
                        styles.slotText,
                        !slot.available && { color: theme.textDim },
                        selectedSlot === slot.id && { color: theme.bg },
                      ]}>
                        {slot.label}
                      </Text>
                    </View>
                    {!slot.available && <Text style={styles.slotUnavailable}>Unavailable</Text>}
                    {selectedSlot === slot.id && <Ionicons name="checkmark-circle" size={18} color={theme.bg} />}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top', marginBottom: spacing.xl }]}
                placeholder="Any access notes, gate codes, or details about the issue…"
                placeholderTextColor={theme.textDim}
                multiline
                numberOfLines={3}
                value={instructions}
                onChangeText={setInstructions}
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={validateAndNext}>
                <Text style={styles.primaryBtnText}>Continue to Review</Text>
                <Ionicons name="arrow-forward" size={18} color={theme.bg} />
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2 — Confirm */}
          {step === 2 && (
            <>
              <Card>
                <Text style={styles.sectionLabel}>Issue Detected</Text>
                <Text style={styles.issueName}>Leaking Faucet Cartridge</Text>
                <Text style={styles.issueDesc}>Plumbing · Moderate Urgency</Text>
                <View style={styles.divider} />
                {[
                  { label: 'Labour',            value: '$120' },
                  { label: 'Parts',             value: '$28'  },
                  { label: 'FixFair Fee (15%)', value: '$22'  },
                ].map(row => (
                  <View key={row.label} style={[styles.summaryRow, { marginBottom: 6 }]}>
                    <Text style={styles.summaryLabel}>{row.label}</Text>
                    <Text style={styles.summaryValue}>{row.value}</Text>
                  </View>
                ))}
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>Total Fixed Price</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: theme.accent }}>$170</Text>
                </View>
              </Card>

              <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)' }}>
                <Text style={styles.sectionLabel}>Booking Summary</Text>
                {[
                  { label: 'Technician', value: 'Marcus Webb'         },
                  { label: 'Time',       value: slotLabel             },
                  { label: 'Address',    value: address || '—'        },
                  { label: 'Customer',   value: profile.name          },
                  { label: 'Fixed Price',value: '$170'                },
                ].map((row) => (
                  <View key={row.label} style={[styles.summaryRow, { marginBottom: 8 }]}>
                    <Text style={styles.summaryLabel}>{row.label}</Text>
                    <Text style={[styles.summaryValue, { flex: 1, textAlign: 'right', marginLeft: 12 }]} numberOfLines={1}>
                      {row.value}
                    </Text>
                  </View>
                ))}
              </Card>

              <Card style={{ backgroundColor: 'rgba(13,31,53,0.6)', borderColor: 'rgba(0,212,170,0.15)' }}>
                <Text style={{ fontSize: 12, color: theme.textMuted, lineHeight: 18 }}>
                  🛡️ Payment is held in escrow and released{' '}
                  <Text style={{ color: theme.text, fontWeight: '600' }}>only after you approve</Text>
                  {' '}the completed work. 90-day warranty included on all repairs.
                </Text>
              </Card>

              {!!bookingError && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8,
                  backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12,
                  padding: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' }}>
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text style={{ color: '#EF4444', fontSize: 13, flex: 1 }}>{bookingError}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryBtn, isSubmitting && { opacity: 0.6 }]}
                onPress={confirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? <ActivityIndicator color={theme.bg} size="small" />
                  : <>
                      <Ionicons name="lock-closed" size={18} color={theme.bg} />
                      <Text style={styles.primaryBtnText}>Confirm & Escrow $170</Text>
                    </>
                }
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setStep(1)}>
                <Text style={styles.secondaryBtnText}>← Edit Details</Text>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 3 — Confirmed */}
          {step === 3 && (
            <>
              <View style={styles.successCard}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={32} color={theme.bg} />
                </View>
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successSub}>Marcus Webb will arrive {slotLabel}</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 8, textAlign: 'center' }}>
                  Job #FX-2847 · $170 in escrow · {profile.name}
                </Text>
              </View>

              <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)' }}>
                {[
                  { icon: '📍', text: "Technician en route — you'll get SMS updates" },
                  { icon: '🔒', text: 'Your $170 is safe in escrow until you approve' },
                  { icon: '🛡️', text: '90-day warranty on all work completed' },
                ].map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    <Text style={{ fontSize: 13, color: theme.textMuted, flex: 1, lineHeight: 18 }}>{item.text}</Text>
                  </View>
                ))}
              </Card>

              <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/tracking')}>
                <Ionicons name="navigate" size={18} color={theme.bg} />
                <Text style={styles.primaryBtnText}>Go to Live Tracking</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/')}>
                <Text style={styles.secondaryBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 67 : spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.bgCard, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: theme.text },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  techName: { fontSize: 16, fontWeight: '700', color: theme.text },
  techSpec: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  sectionLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 12, marginTop: 4 },
  issueName: { fontSize: 16, fontWeight: '700', color: theme.text },
  issueDesc: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 12 },
  savedAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,212,170,0.06)', borderRadius: borderRadius.md, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,212,170,0.15)' },
  savedAddressText: { flex: 1, fontSize: 12, color: theme.textMuted },
  useBtn: { fontSize: 12, fontWeight: '700', color: theme.accent },
  input: { backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: 12, color: theme.text, fontSize: 14, marginBottom: spacing.md },
  inputError: { borderColor: '#EF4444' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: -8, marginBottom: 12 },
  slotBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 14, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: theme.bgCard },
  slotBtnSelected: { backgroundColor: theme.accent, borderColor: theme.accent },
  slotBtnDisabled: { opacity: 0.4 },
  slotText: { fontSize: 14, fontWeight: '600', color: theme.text },
  slotUnavailable: { fontSize: 11, color: theme.textDim },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: theme.textMuted },
  summaryValue: { fontSize: 13, fontWeight: '600', color: theme.text },
  primaryBtn: { backgroundColor: theme.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: borderRadius.xl, marginTop: spacing.md },
  primaryBtnText: { color: theme.bg, fontSize: 16, fontWeight: '700' },
  secondaryBtn: { backgroundColor: theme.bgElevated, alignItems: 'center', paddingVertical: 14, borderRadius: borderRadius.xl, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  secondaryBtnText: { color: theme.text, fontSize: 14, fontWeight: '600' },
  successCard: { backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)', borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.success, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: '800', color: theme.text, marginBottom: 6 },
  successSub: { fontSize: 14, color: theme.textMuted, textAlign: 'center' },
});
