import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import WorkerCard from '../../components/WorkerCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FilterType = 'all' | 'active' | 'fall';

export default function AdminWorkers() {
  const { t } = useTranslation();
  const { workers } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredWorkers = workers.filter((w) => {
    if (filter === 'all') return true;
    if (filter === 'active') return w.status === 'active' || w.status === 'idle';
    if (filter === 'fall') return w.status === 'fall';
    return true;
  });

  const fallCount = workers.filter(w => w.status === 'fall').length;
  const activeCount = workers.filter(w => w.status === 'active').length;

  const FILTERS: { key: FilterType; label: string; count: number; color: string }[] = [
    { key: 'all', label: t('workers.filterAll'), count: workers.length, color: Colors.primary },
    { key: 'active', label: t('workers.filterActive'), count: activeCount, color: Colors.safe },
    { key: 'fall', label: t('workers.filterFall'), count: fallCount, color: Colors.danger },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('workers.title')}</Text>
        <Text style={styles.subtitle}>
          {workers.length} workers • {activeCount} active
          {fallCount > 0 && ` • ${fallCount} emergency`}
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              styles.filterTab,
              filter === f.key && { backgroundColor: f.color, borderColor: f.color },
            ]}
          >
            <Text style={[styles.filterText, filter === f.key && { color: Colors.white }]}>
              {f.label}
            </Text>
            <View style={[
              styles.filterBadge,
              filter === f.key ? { backgroundColor: 'rgba(255,255,255,0.3)' } : { backgroundColor: Colors.surfaceAlt }
            ]}>
              <Text style={[styles.filterBadgeText, filter === f.key && { color: Colors.white }]}>
                {f.count}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Worker List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filteredWorkers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-search" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No workers match this filter</Text>
          </View>
        ) : (
          filteredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
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
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  filterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
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
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginTop: Spacing.md,
  },
});
