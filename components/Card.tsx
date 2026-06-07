import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, borderRadius, spacing } from '@/constants/theme';

type BadgeVariant = 'green' | 'blue' | 'yellow' | 'purple';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  borderColor?: string;
}

export function Card({ children, style, onPress, borderColor }: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[
        styles.card,
        borderColor ? { borderColor } : undefined,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {children}
    </Wrapper>
  );
}

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const badgeColors: Record<BadgeVariant, { bg: string; text: string }> = {
  green:  { bg: 'rgba(16,185,129,0.15)',  text: '#10B981' },
  blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#3B82F6' },
  yellow: { bg: 'rgba(245,158,11,0.15)',  text: '#F59E0B' },
  purple: { bg: 'rgba(139,92,246,0.15)',  text: '#8B5CF6' },
};

export function Badge({ variant, children }: BadgeProps) {
  const colors = badgeColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
}

export function Avatar({ initials, color = theme.accentBlue, size = 48 }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: color + '30',
          borderWidth: 1,
          borderColor: color + '50',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.30, color: color }]}>{initials}</Text>
    </View>
  );
}

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = theme.accent, height = 5 }: ProgressBarProps) {
  return (
    <View style={[styles.progressTrack, { height }]}>
      <View style={[styles.progressFill, { width: `${progress}%` as any, backgroundColor: color }]} />
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: spacing.lg,
    marginBottom: 12,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '800',
  },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.text,
  },
  sectionAction: {
    fontSize: 12,
    color: theme.accent,
    fontWeight: '600',
  },
});
