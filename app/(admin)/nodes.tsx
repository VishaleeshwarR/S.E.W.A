import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows, SafetyStatus } from '../../constants/theme';
import { useStore, parseNodeRange } from '../../store/useStore';
import NodeCard from '../../components/NodeCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FilterType = 'all' | 'safe' | 'warning' | 'danger';

export default function AdminNodes() {
  const { t } = useTranslation();
  const { nodes, selectedNodeRange, setSelectedNodeRange, selectedNodeIds, setSelectedNodeIds } = useStore();
  const [inputValue, setInputValue] = useState(selectedNodeRange);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleFetch = () => {
    const ids = parseNodeRange(inputValue);
    setSelectedNodeRange(inputValue);
    setSelectedNodeIds(ids);
  };

  // Filter nodes by selected range and safety filter
  const filteredNodes = nodes
    .filter((node) => selectedNodeIds.includes(node.id))
    .filter((node) => filter === 'all' || node.status === filter);

  const FILTERS: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: t('nodes.filterAll'), color: Colors.primary },
    { key: 'safe', label: t('nodes.filterSafe'), color: Colors.safe },
    { key: 'warning', label: t('nodes.filterWarning'), color: Colors.warning },
    { key: 'danger', label: t('nodes.filterDanger'), color: Colors.danger },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('nodes.title')}</Text>
        <Text style={styles.subtitle}>
          {filteredNodes.length} / {nodes.length} nodes
        </Text>
      </View>

      {/* Node Range Input */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>{t('nodes.inputLabel')}</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="access-point-network" size={20} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder={t('nodes.inputPlaceholder')}
              placeholderTextColor={Colors.textTertiary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleFetch}
            />
          </View>
          <Pressable
            onPress={handleFetch}
            style={({ pressed }) => [styles.fetchBtn, { opacity: pressed ? 0.9 : 1 }]}
          >
            <MaterialCommunityIcons name="magnify" size={20} color={Colors.white} />
            <Text style={styles.fetchBtnText}>{t('nodes.fetchButton')}</Text>
          </Pressable>
        </View>
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
          </Pressable>
        ))}
      </View>

      {/* Node Cards */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filteredNodes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="access-point-network-off" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>{t('nodes.noNodes')}</Text>
          </View>
        ) : (
          filteredNodes.map((node) => (
            <NodeCard key={node.id} node={node} />
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
  inputSection: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  fetchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
  },
  fetchBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  filterTab: {
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
