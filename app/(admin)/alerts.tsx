import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import AlertItem from '../../components/AlertItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TabType = 'all' | 'falls' | 'hazards';

export default function AdminAlerts() {
  const { t } = useTranslation();
  const { alerts, acknowledgeAlert, clearAlerts } = useStore();
  const [tab, setTab] = useState<TabType>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (tab === 'all') return true;
    if (tab === 'falls') return a.type === 'fall';
    return a.type !== 'fall';
  });

  const unacked = alerts.filter(a => !a.acknowledged).length;
  const fallCount = alerts.filter(a => a.type === 'fall').length;
  const hazardCount = alerts.filter(a => a.type !== 'fall').length;

  const TABS: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: t('alerts.tabAll'), count: alerts.length },
    { key: 'falls', label: t('alerts.tabFalls'), count: fallCount },
    { key: 'hazards', label: t('alerts.tabHazards'), count: hazardCount },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('alerts.title')}</Text>
          <Text style={styles.subtitle}>{t('alerts.subtitle')}</Text>
        </View>
        {unacked > 0 && (
          <Pressable onPress={clearAlerts} style={styles.clearBtn}>
            <MaterialCommunityIcons name="notification-clear-all" size={18} color={Colors.white} />
            <Text style={styles.clearText}>{t('alerts.clearAll')}</Text>
          </Pressable>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tabItem) => (
          <Pressable
            key={tabItem.key}
            onPress={() => setTab(tabItem.key)}
            style={[
              styles.tab,
              tab === tabItem.key && styles.tabActive,
            ]}
          >
            <Text style={[styles.tabText, tab === tabItem.key && styles.tabTextActive]}>
              {tabItem.label}
            </Text>
            <View style={[
              styles.tabBadge,
              tab === tabItem.key ? { backgroundColor: Colors.white } : { backgroundColor: Colors.surfaceAlt },
            ]}>
              <Text style={[styles.tabBadgeText, tab === tabItem.key && { color: Colors.primary }]}>
                {tabItem.count}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Alert List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-check" size={56} color={Colors.safe} />
            <Text style={styles.emptyTitle}>{t('alerts.noAlerts')}</Text>
          </View>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
            />
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.primary, // PPT layout
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent for dark bg
    marginTop: 4,
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: FontWeight.medium,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
    marginTop: Spacing.md,
  },
});
