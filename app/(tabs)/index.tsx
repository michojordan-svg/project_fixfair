import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar, ProgressBar, SectionHeader } from '@/components/Card';

const categories = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water', color: theme.accentBlue },
  { id: 'hvac', label: 'HVAC', icon: 'snow', color: theme.accentWarm },
  { id: 'electrical', label: 'Electrical', icon: 'flash', color: theme.warning },
  { id: 'appliance', label: 'Appliance', icon: 'settings', color: theme.accentPurple },
  { id: 'roofing', label: 'Roofing', icon: 'home', color: theme.success },
  { id: 'general', label: 'General', icon: 'hammer', color: theme.accent },
];

const nearbyTechs = [
  { id: 1, name: 'Marcus Webb', specialty: 'Master Plumber', rating: 4.9, jobs: 847, price: 185, initials: 'MW', color: theme.accentBlue, eta: 'Today 2-4pm' },
  { id: 2, name: 'Sarah Chen', specialty: 'HVAC Specialist', rating: 4.8, jobs: 623, price: 165, initials: 'SC', color: theme.accentWarm, eta: 'Today 4-6pm' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={{ marginBottom: spacing.xxl }}>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.headerName}>Alex Johnson</Text>
          </View>

          {/* Health Score Card */}
          <Card style={{ backgroundColor: 'rgba(13,31,53,0.8)', borderColor: 'rgba(0,212,170,0.2)' }}>
            <View style={styles.row}>
              <View>
                <Text style={styles.labelText}>Home Health Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={styles.healthScoreNumber}>78</Text>
                  <Text style={styles.healthScoreMax}>/100</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Badge variant="yellow">HVAC Attention</Badge>
              </View>
            </View>
            <ProgressBar progress={78} />
            <Text style={styles.healthNote}>Good overall - HVAC system needs inspection</Text>
          </Card>

          {/* Quick Action */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)/diagnose')}
          >
            <Ionicons name="videocam" size={20} color={theme.bg} />
            <Text style={styles.primaryButtonText}>Record & Diagnose Issue</Text>
          </TouchableOpacity>

          {/* Categories */}
          <SectionHeader title="Service Categories" />
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Active Job */}
          <SectionHeader title="Active Job" />
          <Card
            borderColor="rgba(0,212,170,0.2)"
            onPress={() => router.push('/tracking')}
          >
            <View style={styles.row}>
              <View>
                <Text style={styles.labelText}>FX-2847</Text>
                <Text style={styles.jobTitle}>Plumbing - Leaky Faucet</Text>
              </View>
              <Badge variant="green">In Progress</Badge>
            </View>
            <View style={styles.jobFooter}>
              <View>
                <Text style={styles.techName}>Marcus Webb</Text>
                <Text style={styles.techEta}>ETA: 2:30 PM</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.escrowAmount}>$185</Text>
                <Text style={styles.escrowLabel}>in escrow</Text>
              </View>
            </View>
          </Card>

          {/* Trust Score */}
          <Card style={{ backgroundColor: 'rgba(26,10,46,0.6)', borderColor: 'rgba(139,92,246,0.2)' }}>
            <View style={styles.row}>
              <View>
                <Text style={styles.labelText}>Your Trust Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.trustScoreNumber}>847</Text>
                  <Badge variant="purple">Top 15%</Badge>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: theme.success }}>+12 this month</Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>5 jobs - 0 disputes</Text>
              </View>
            </View>
          </Card>

          {/* Nearby Pros */}
          <SectionHeader
            title="Nearby Pros"
            action="See All"
            onAction={() => router.push('/technicians')}
          />
          {nearbyTechs.map((tech) => (
            <Card key={tech.id} onPress={() => router.push('/technicians')}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Avatar initials={tech.initials} color={tech.color} size={48} />
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={{ fontWeight: '600', fontSize: 15, color: theme.text }}>{tech.name}</Text>
                    <Badge variant="green">Verified</Badge>
                  </View>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{tech.specialty}</Text>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons
                          key={i}
                          name={i <= Math.floor(tech.rating) ? 'star' : 'star-outline'}
                          size={11}
                          color="#F59E0B"
                        />
                      ))}
                    </View>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.rating}</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{tech.eta}</Text>
                    <Text style={{ marginLeft: 'auto', fontWeight: '800', color: theme.text }}>${tech.price}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  greeting: {
    fontSize: 13,
    color: theme.textMuted,
  },
  headerName: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 13,
    color: theme.textMuted,
    marginBottom: 2,
  },
  healthScoreNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: theme.accent,
  },
  healthScoreMax: {
    fontSize: 16,
    color: theme.textMuted,
  },
  healthNote: {
    fontSize: 12,
    color: theme.textMuted,
  },
  primaryButton: {
    backgroundColor: theme.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.xl,
  },
  primaryButtonText: {
    color: theme.bg,
    fontSize: 15,
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.xl,
  },
  categoryItem: {
    flex: 1,
    minWidth: '31%',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.lg,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  jobFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
  },
  techEta: {
    fontSize: 11,
    color: theme.textMuted,
  },
  escrowAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.accent,
  },
  escrowLabel: {
    fontSize: 10,
    color: theme.textMuted,
  },
  trustScoreNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.accentPurple,
  },
});
