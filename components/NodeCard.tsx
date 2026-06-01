import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows, getSafetyColor } from '../constants/theme';
import { SensorNode } from '../services/mockData';
import SafetyBadge from './SafetyBadge';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NodeCardProps {
  node: SensorNode;
  onPress?: () => void;
  compact?: boolean;
}

export default function NodeCard({ node, onPress, compact = false }: NodeCardProps) {
  const { t } = useTranslation();
  const isOffline = node.status === 'offline';
  const safetyColors = isOffline 
    ? { color: Colors.textTertiary, bg: Colors.surfaceAlt, border: Colors.border } 
    : getSafetyColor(node.status as any);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: safetyColors.color, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons 
            name={isOffline ? "access-point-off" : "access-point"} 
            size={20} 
            color={safetyColors.color} 
          />
          <View>
            <Text style={styles.nodeTitle}>{t('nodes.nodeId', { id: node.id })}</Text>
            {node.isPrototype && (
              <View style={[
                styles.statusPill, 
                { backgroundColor: isOffline ? Colors.surfaceAlt : Colors.safeBg }
              ]}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: isOffline ? Colors.textTertiary : Colors.safe }
                ]} />
                <Text style={[
                  styles.statusPillText, 
                  { color: isOffline ? Colors.textSecondary : Colors.safe }
                ]}>
                  {isOffline ? 'DISCONNECTED' : 'CONNECTED'}
                </Text>
              </View>
            )}
          </View>
        </View>
        {!isOffline && (
          <SafetyBadge 
            status={node.status as any} 
            size="sm" 
            showLabel={true} 
          />
        )}
      </View>

      {!compact && (
        <>
          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            {/* Oxygen */}
            <View style={styles.metric}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="lungs" size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.metricLabel}>{t('nodes.oxygen')}</Text>
                <Text style={[
                  styles.metricValue, 
                  node.oxygen !== null && node.oxygen < 19 && { color: node.oxygen < 16 ? Colors.danger : Colors.warning },
                  isOffline && { color: Colors.textTertiary }
                ]}>
                  {node.oxygen !== null ? `${node.oxygen}${t('common.percent')}` : (node.isPrototype ? 'NIL' : '--')}
                </Text>
              </View>
            </View>

            {/* Toxic Gas */}
            <View style={styles.metric}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="cloud-alert" size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.metricLabel}>{t('nodes.toxicGas')}</Text>
                <Text style={[
                  styles.metricValue, 
                  node.toxicGas !== null && node.toxicGas > 25 && { color: node.toxicGas > 50 ? Colors.danger : Colors.warning },
                  isOffline && { color: Colors.textTertiary }
                ]}>
                  {node.toxicGas !== null ? `${node.toxicGas} ${t('common.ppm')}` : (node.isPrototype ? 'NIL' : '--')}
                </Text>
              </View>
            </View>

            {/* Temperature */}
            <View style={styles.metric}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="thermometer" size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.metricLabel}>{t('nodes.temperature')}</Text>
                <Text style={[
                  styles.metricValue, 
                  node.temperature !== null && node.temperature > 40 && { color: node.temperature > 50 ? Colors.danger : Colors.warning },
                  isOffline && { color: Colors.textTertiary }
                ]}>
                  {node.temperature !== null ? `${node.temperature}${t('common.celsius')}` : (node.isPrototype ? 'NIL' : '--')}
                </Text>
              </View>
            </View>

            {/* Humidity */}
            <View style={styles.metric}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="water-percent" size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.metricLabel}>{t('nodes.humidity')}</Text>
                <Text style={[styles.metricValue, isOffline && { color: Colors.textTertiary }]}>
                  {node.humidity !== null ? `${node.humidity}${t('common.percent')}` : (node.isPrototype ? 'NIL' : '--')}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('nodes.lastReading')}: {formatTime(node.lastUpdated)}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nodeTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    marginTop: 2,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '45%',
    minWidth: 130,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  metricValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  footer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});
