import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../constants/theme';
import { Alert as AlertType } from '../services/mockData';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FallAlertModalProps {
  visible: boolean;
  alert: AlertType | null;
  onDismiss: () => void;
  onAcknowledge: () => void;
}

export default function FallAlertModal({ visible, alert, onDismiss, onAcknowledge }: FallAlertModalProps) {
  const { t } = useTranslation();

  if (!alert) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Danger Header */}
          <View style={styles.header}>
            <View style={styles.alertIconBox}>
              <MaterialCommunityIcons name="alert-circle" size={48} color={Colors.white} />
            </View>
            <Text style={styles.headerTitle}>🚨 {t('alerts.fallAlert')}</Text>
            <Text style={styles.headerSubtitle}>{t('workers.statusFall')}</Text>
          </View>

          {/* Details */}
          <View style={styles.body}>
            {/* Worker */}
            <View style={styles.detailBlock}>
              <View style={styles.detailIcon}>
                <MaterialCommunityIcons name="account" size={20} color={Colors.danger} />
              </View>
              <View>
                <Text style={styles.detailLabel}>{t('alerts.workerId')}</Text>
                <Text style={styles.detailValue}>{alert.workerName || alert.workerId}</Text>
                {alert.workerId && <Text style={styles.detailSub}>{alert.workerId}</Text>}
              </View>
            </View>

            {/* GPS */}
            {alert.gps && (
              <View style={styles.detailBlock}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons name="map-marker" size={20} color={Colors.danger} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>{t('alerts.location')}</Text>
                  <Text style={styles.detailValue}>
                    {alert.gps.lat.toFixed(4)}°N, {alert.gps.lng.toFixed(4)}°E
                  </Text>
                </View>
              </View>
            )}

            {/* Timestamp */}
            <View style={styles.detailBlock}>
              <View style={styles.detailIcon}>
                <MaterialCommunityIcons name="clock-alert" size={20} color={Colors.danger} />
              </View>
              <View>
                <Text style={styles.detailLabel}>{t('alerts.timestamp')}</Text>
                <Text style={styles.detailValue}>
                  {alert.timestamp.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable onPress={onAcknowledge} style={styles.ackButton}>
              <MaterialCommunityIcons name="check-bold" size={18} color={Colors.white} />
              <Text style={styles.ackText}>{t('alerts.acknowledge')}</Text>
            </Pressable>
            <Pressable onPress={onDismiss} style={styles.dismissButton}>
              <Text style={styles.dismissText}>{t('alerts.dismiss')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.danger,
  },
  header: {
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  alertIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: FontWeight.semibold,
    marginTop: 4,
  },
  body: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  detailBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  detailValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  detailSub: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  actions: {
    padding: Spacing.xl,
    paddingTop: 0,
    gap: Spacing.md,
  },
  ackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
  },
  ackText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  dismissButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  dismissText: {
    color: Colors.textTertiary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
