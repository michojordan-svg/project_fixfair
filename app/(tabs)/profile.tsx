import React from 'react';
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
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge, Avatar } from '@/components/Card';

const menuItems = [
  { icon: 'home-outline', label: 'My Properties', value: '2 homes' },
  { icon: 'shield-checkmark-outline', label: 'Insurance & Warranties', value: '3 active' },
  { icon: 'card-outline', label: 'Payment Methods', value: '••• 4242' },
  { icon: 'notifications-outline', label: 'Notifications', value: 'On' },
  { icon: 'star-outline', label: 'Reviews Given', value: '12' },
  { icon: 'help-circle-outline', label: 'Help & Support', value: '' },
  { icon: 'document-text-outline', label: 'Terms & Privacy', value: '' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>

          {/* User Card */}
          <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
            <Avatar initials="AJ" color={theme.accent} size={72} />
            <Text style={styles.userName}>Alex Johnson</Text>
            <Text style={styles.userEmail}>alex.johnson@email.com</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Badge variant="green">Verified</Badge>
              <Badge variant="purple">Top 15%</Badge>
            </View>
          </Card>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>847</Text>
              <Text style={styles.statLabel}>Trust Score</Text>
            </View>
            <View style={[styles.statCard, styles.statCardMiddle]}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>

          {/* Menu */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  i < menuItems.length - 1 && styles.menuItemBorder,
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={18} color={theme.accent} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                  <Ionicons name="chevron-forward" size={16} color={theme.textDim} />
                </View>
              </TouchableOpacity>
            ))}
          </Card>

          <TouchableOpacity style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={18} color={theme.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  title: { fontSize: 28, fontWeight: '800', color: theme.text, marginBottom: spacing.xl },
  userName: { fontSize: 20, fontWeight: '800', color: theme.text, marginTop: 12 },
  userEmail: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statCardMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: theme.accent },
  statLabel: { fontSize: 11, color: theme.textMuted, marginTop: 4 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0,212,170,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: { fontSize: 14, color: theme.text, fontWeight: '500' },
  menuValue: { fontSize: 13, color: theme.textMuted },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: theme.danger },
});
