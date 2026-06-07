import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';

const technicians = [
  { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber', rating: 4.9, jobs: 847, price: 185, initials: 'MW', color: theme.accentBlue, eta: 'Today 2-4pm', verified: true, distance: '1.2 mi' },
  { id: 2, name: 'Sarah Chen', specialty: 'HVAC Specialist', rating: 4.8, jobs: 623, price: 165, initials: 'SC', color: theme.accentWarm, eta: 'Today 4-6pm', verified: true, distance: '2.1 mi' },
  { id: 3, name: 'David Park', specialty: 'Licensed Electrician', rating: 4.7, jobs: 512, price: 145, initials: 'DP', color: theme.warning, eta: 'Tomorrow 9am', verified: true, distance: '3.4 mi' },
  { id: 4, name: 'Maria Torres', specialty: 'Appliance Expert', rating: 4.9, jobs: 398, price: 125, initials: 'MT', color: theme.accentPurple, eta: 'Tomorrow 11am', verified: true, distance: '4.0 mi' },
];

export default function TechniciansScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

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
          {technicians.map((tech) => (
            <TouchableOpacity
              key={tech.id}
              onPress={() => setSelected(tech.id === selected ? null : tech.id)}
            >
              <Card
                borderColor={selected === tech.id ? 'rgba(0,212,170,0.4)' : undefined}
                style={selected === tech.id ? { backgroundColor: 'rgba(0,212,170,0.04)' } : undefined}
              >
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Avatar initials={tech.initials} color={tech.color} size={52} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={styles.techName}>{tech.name}</Text>
                      {tech.verified && <Badge variant="green">Verified</Badge>}
                    </View>
                    <Text style={styles.techSpec}>{tech.specialty}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Ionicons key={i} name={i <= Math.floor(tech.rating) ? 'star' : 'star-outline'} size={11} color="#F59E0B" />
                        ))}
                      </View>
                      <Text style={styles.rating}>{tech.rating}</Text>
                      <Text style={styles.ratingMeta}>({tech.jobs} jobs)</Text>
                      <Text style={styles.distance}>{tech.distance}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.eta}>{tech.eta}</Text>
                      <Text style={styles.price}>${tech.price} fixed</Text>
                    </View>
                  </View>
                </View>

                {selected === tech.id && (
                  <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', gap: 8 }}>
                    <TouchableOpacity style={styles.bookBtn}>
                      <Ionicons name="calendar" size={16} color={theme.bg} />
                      <Text style={styles.bookBtnText}>Book {tech.name.split(' ')[0]} for ${tech.price}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.msgBtn}>
                      <Ionicons name="chatbubble-outline" size={16} color={theme.text} />
                      <Text style={styles.msgBtnText}>Send Message</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  techName: { fontSize: 15, fontWeight: '700', color: theme.text },
  techSpec: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  rating: { fontSize: 12, color: theme.textMuted, fontWeight: '600' },
  ratingMeta: { fontSize: 11, color: theme.textDim },
  distance: { marginLeft: 'auto', fontSize: 11, color: theme.textMuted },
  eta: { fontSize: 12, color: theme.textMuted, marginTop: 6 },
  price: { fontSize: 15, fontWeight: '800', color: theme.accent, marginTop: 6 },
  bookBtn: {
    backgroundColor: theme.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
  },
  bookBtnText: { color: theme.bg, fontWeight: '700', fontSize: 14 },
  msgBtn: {
    backgroundColor: theme.bgElevated,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
  },
  msgBtnText: { color: theme.text, fontWeight: '600', fontSize: 14 },
});
