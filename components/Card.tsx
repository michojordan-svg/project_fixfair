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
      activeOpacity={0.7}
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
  green: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  blue: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  yellow: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  purple: { bg: 'rgba(139,92,246,0.15)', text: '#8B5CF6' },
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
          borderRadius: size * 0.3,
          backgroundColor: color + '40',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.32 }]}>{initials}</Text>
    </View>
  );
}

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export function ProgressBar({ progress, color = theme.accent }: ProgressBarProps) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
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
    borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '800',
    color: theme.text,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.text,
  },
  sectionAction: {
    fontSize: 12,
    color: theme.accent,
    fontWeight: '600',
  },
});
