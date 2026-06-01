import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, SafetyStatus, getSafetyColor } from '../constants/theme';

interface SafetyBadgeProps {
  status: SafetyStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const STATUS_LABELS: Record<SafetyStatus, string> = {
  safe: 'Safe',
  warning: 'Warning',
  danger: 'Danger',
};

const STATUS_EMOJIS: Record<SafetyStatus, string> = {
  safe: '🟢',
  warning: '🟡',
  danger: '🔴',
};

export default function SafetyBadge({ status, size = 'md', showLabel = true }: SafetyBadgeProps) {
  const colors = getSafetyColor(status);
  const sizeMap = {
    sm: { dot: 8, font: FontSize.xs, pad: Spacing.xs, padH: Spacing.sm },
    md: { dot: 10, font: FontSize.sm, pad: Spacing.sm, padH: Spacing.md },
    lg: { dot: 14, font: FontSize.md, pad: Spacing.md, padH: Spacing.lg },
  };
  const s = sizeMap[size];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border, paddingVertical: s.pad, paddingHorizontal: s.padH }]}>
      <View style={[styles.dot, { width: s.dot, height: s.dot, backgroundColor: colors.color }]} />
      {showLabel && (
        <Text style={[styles.label, { color: colors.color, fontSize: s.font }]}>
          {STATUS_LABELS[status]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  dot: {
    borderRadius: Radius.full,
  },
  label: {
    fontWeight: FontWeight.semibold,
  },
});
