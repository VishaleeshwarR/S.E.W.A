import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { Alert } from '../services/mockData';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AlertItemProps {
  alert: Alert;
  onAcknowledge?: () => void;
  onDismiss?: () => void;
}

const ALERT_CONFIG = {
  fall: { icon: 'human-male-height-variant' as const, color: Colors.danger },
  gas: { icon: 'cloud-alert' as const, color: Colors.danger },
  oxygen: { icon: 'lungs' as const, color: Colors.warning },
  temperature: { icon: 'thermometer-alert' as const, color: Colors.warning },
};

const PRIORITY_COLORS = {
  critical: Colors.danger,
  high: '#F97316',
  medium: Colors.warning,
  low: Colors.accent,
};

export default function AlertItem({ alert, onAcknowledge, onDismiss }: AlertItemProps) {
  const { t } = useTranslation();
  const config = ALERT_CONFIG[alert.type];
  const priorityColor = PRIORITY_COLORS[alert.priority];

  return (
    <View style={[styles.card, alert.acknowledged && styles.acknowledged]}>
      {/* Priority stripe */}
      <View style={[styles.priorityStripe, { backgroundColor: priorityColor }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
            <MaterialCommunityIcons name={config.icon} size={22} color={config.color} />
          </View>
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{alert.message}</Text>
            </View>
            <View style={styles.metaRow}>
              <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}20`, borderColor: priorityColor }]}>
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {t(`alerts.${alert.priority}`)}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {formatTimestamp(alert.timestamp)}
              </Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          {alert.workerId && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={13} color={Colors.textTertiary} />
              <Text style={styles.detailText}>{t('alerts.workerId')}: {alert.workerName || alert.workerId}</Text>
            </View>
          )}
          {alert.nodeId && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="access-point" size={13} color={Colors.textTertiary} />
              <Text style={styles.detailText}>{t('alerts.nodeId')}: {alert.nodeId}</Text>
            </View>
          )}
          {alert.gps && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker" size={13} color={Colors.textTertiary} />
              <Text style={styles.detailText}>{alert.gps.lat.toFixed(4)}, {alert.gps.lng.toFixed(4)}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {!alert.acknowledged && (
          <View style={styles.actions}>
            <Pressable onPress={onAcknowledge} style={[styles.actionBtn, styles.ackBtn]}>
              <MaterialCommunityIcons name="check-circle" size={16} color={Colors.white} />
              <Text style={styles.ackText}>{t('alerts.acknowledge')}</Text>
            </Pressable>
            <Pressable onPress={onDismiss} style={[styles.actionBtn, styles.dismissBtn]}>
              <Text style={styles.dismissText}>{t('alerts.dismiss')}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  acknowledged: {
    opacity: 0.5,
  },
  priorityStripe: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  details: {
    marginTop: Spacing.md,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  ackBtn: {
    backgroundColor: Colors.safe,
  },
  ackText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  dismissBtn: {
    backgroundColor: Colors.surfaceAlt,
  },
  dismissText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
