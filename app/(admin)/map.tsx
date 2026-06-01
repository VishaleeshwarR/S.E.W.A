import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontWeight } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import NetworkGraph from '../../components/NetworkGraph';

export default function AdminMap() {
  const { t } = useTranslation();
  const { nodes, selectedNodeIds } = useStore();

  const displayNodes = selectedNodeIds.length > 0
    ? nodes.filter((n) => selectedNodeIds.includes(n.id))
    : nodes;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('map.title')}</Text>
        <Text style={styles.subtitle}>{t('map.subtitle')}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <NetworkGraph
          nodes={displayNodes}
          height={520}
        />
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
    paddingBottom: Spacing.lg,
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
  scroll: {
    flex: 1,
    padding: Spacing.xl,
  },
});
