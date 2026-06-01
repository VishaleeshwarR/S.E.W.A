import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  bgColor: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, bgColor, subtitle }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={[styles.statIconBox, { backgroundColor: bgColor }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

interface SummaryPanelProps {
  totalNodes: number;
  activeNodes: number;
  unsafeNodes: number;
  activeWorkers: number;
}

export default function SummaryPanel({ totalNodes, activeNodes, unsafeNodes, activeWorkers }: SummaryPanelProps) {
  return (
    <View style={styles.container}>
      <StatCard
        title="Total Nodes"
        value={totalNodes}
        icon="access-point-network"
        color={Colors.accent}
        bgColor={Colors.accentLight}
      />
      <StatCard
        title="Active"
        value={activeNodes}
        icon="access-point-check"
        color={Colors.safe}
        bgColor={Colors.safeBg}
      />
      <StatCard
        title="Unsafe"
        value={unsafeNodes}
        icon="alert-octagon"
        color={unsafeNodes > 0 ? Colors.danger : Colors.safe}
        bgColor={unsafeNodes > 0 ? Colors.dangerBg : Colors.safeBg}
      />
      <StatCard
        title="Workers"
        value={activeWorkers}
        icon="account-hard-hat"
        color={Colors.primary}
        bgColor={Colors.surfaceAlt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderTopWidth: 3,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
  },
  statTitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
