import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../../constants/theme';
import { useStore, parseNodeRange } from '../../store/useStore';
import NodeCard from '../../components/NodeCard';
import SafetyBadge from '../../components/SafetyBadge';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmployeeNodes() {
  const { t } = useTranslation();
  const { nodes, selectedNodeRange, setSelectedNodeRange, selectedNodeIds, setSelectedNodeIds } = useStore();
  const [inputValue, setInputValue] = useState(selectedNodeRange);

  const handleFetch = () => {
    const ids = parseNodeRange(inputValue);
    setSelectedNodeRange(inputValue);
    setSelectedNodeIds(ids);
  };

  const filteredNodes = nodes.filter((node) => selectedNodeIds.includes(node.id));

  // Summary counts
  const safeCount = filteredNodes.filter(n => n.status === 'safe').length;
  const warnCount = filteredNodes.filter(n => n.status === 'warning').length;
  const dangerCount = filteredNodes.filter(n => n.status === 'danger').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('nodes.title')}</Text>
      </View>

      {/* Node Range Input — Large for field use */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>{t('nodes.inputLabel')}</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="numeric" size={24} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder={t('nodes.inputPlaceholder')}
              placeholderTextColor={Colors.textTertiary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleFetch}
              keyboardType="default"
            />
          </View>
          <Pressable
            onPress={handleFetch}
            style={({ pressed }) => [styles.fetchBtn, { opacity: pressed ? 0.9 : 1 }]}
          >
            <MaterialCommunityIcons name="magnify" size={22} color={Colors.white} />
            <Text style={styles.fetchBtnText}>{t('nodes.fetchButton')}</Text>
          </Pressable>
        </View>

        {/* Quick Summary */}
        {filteredNodes.length > 0 && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.safe }]} />
              <Text style={styles.summaryText}>{safeCount} {t('nodes.safe')}</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.summaryText}>{warnCount} {t('nodes.warning')}</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.summaryText}>{dangerCount} {t('nodes.danger')}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Node Cards */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filteredNodes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="access-point-network-off" size={56} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>{t('nodes.noNodes')}</Text>
            <Text style={styles.emptyHint}>Enter a range like "1-5" and tap Fetch</Text>
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
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  inputSection: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
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
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    paddingVertical: Spacing.lg,
    fontWeight: FontWeight.semibold,
  },
  fetchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.safe,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
  },
  fetchBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  summaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
  },
  emptyHint: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
});
