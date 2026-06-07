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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';

const timeSlots = [
  { id: 'today1', label: 'Today 2-4 PM', available: true },
  { id: 'today2', label: 'Today 4-6 PM', available: true },
  { id: 'tom1', label: 'Tomorrow 9-11 AM', available: true },
  { id: 'tom2', label: 'Tomorrow 11 AM-1 PM', available: false },
  { id: 'tom3', label: 'Tomorrow 2-4 PM', available: true },
];

export default function BookingScreen() {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>('today1');
  const [notes, setNotes] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Tech summary */}
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
                  <Text style={{ fontSize: 11, color: theme.textMuted, marginLeft: 4 }}>4.9 (847 jobs)</Text>
                </View>
              </View>
              <Badge variant="green">Verified</Badge>
            </View>
          </Card>

          {/* Issue */}
          <Card>
            <Text style={styles.sectionLabel}>Issue Detected</Text>
            <Text style={styles.issueName}>Leaking P-Trap Joint</Text>
            <Text style={styles.issueDesc}>Plumbing · Moderate Urgency</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Fixed Price</Text>
              <Text style={styles.priceValue}>$185.00</Text>
            </View>
          </Card>

          {/* Time slots */}
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

          {/* Notes */}
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe the issue in more detail..."
            placeholderTextColor={theme.textDim}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />

          {/* Summary */}
          <Card style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.2)' }}>
            <Text style={styles.sectionLabel}>Booking Summary</Text>
            {[
              { label: 'Service', value: 'Plumbing Repair' },
              { label: 'Technician', value: 'Marcus Webb' },
              { label: 'Slot', value: 'Today 2-4 PM' },
              { label: 'Fixed Price', value: '$185.00' },
            ].map((row) => (
              <View key={row.label} style={[styles.summaryRow, { marginBottom: 6 }]}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
          </Card>

          <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/tracking')}>
            <Ionicons name="lock-closed" size={18} color={theme.bg} />
            <Text style={styles.bookBtnText}>Confirm & Escrow $185</Text>
          </TouchableOpacity>
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 17, fontWeight: '700', color: theme.text },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  techName: { fontSize: 16, fontWeight: '700', color: theme.text },
  techSpec: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  sectionLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 6 },
  issueName: { fontSize: 16, fontWeight: '700', color: theme.text },
  issueDesc: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  priceLabel: { fontSize: 13, color: theme.textMuted },
  priceValue: { fontSize: 20, fontWeight: '800', color: theme.accent },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 12 },
  slotBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: theme.bgCard,
  },
  slotBtnSelected: { backgroundColor: theme.accent, borderColor: theme.accent },
  slotBtnDisabled: { opacity: 0.4 },
  slotText: { fontSize: 14, fontWeight: '600', color: theme.text },
  slotUnavailable: { fontSize: 11, color: theme.textDim },
  input: {
    backgroundColor: theme.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: theme.text,
    fontSize: 14,
    marginBottom: spacing.xl,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: theme.textMuted },
  summaryValue: { fontSize: 13, fontWeight: '600', color: theme.text },
  bookBtn: {
    backgroundColor: theme.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
  },
  bookBtnText: { color: theme.bg, fontSize: 16, fontWeight: '700' },
});
