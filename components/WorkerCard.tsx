import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { Worker } from '../services/mockData';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WorkerCardProps {
  worker: Worker;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  active: { color: Colors.safe, icon: 'account-check' as const, bg: Colors.safeBg },
  idle: { color: Colors.warning, icon: 'account-clock' as const, bg: Colors.warningBg },
  fall: { color: Colors.danger, icon: 'account-alert' as const, bg: Colors.dangerBg },
};

import { Linking } from 'react-native';

export default function WorkerCard({ worker, onPress }: WorkerCardProps) {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[worker.status];

  const openMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${worker.gps.lat},${worker.gps.lng}`;
    Linking.openURL(url);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        worker.status === 'fall' && styles.fallCard,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      {/* Avatar + Info */}
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: config.bg }]}>
          <MaterialCommunityIcons name={config.icon} size={28} color={config.color} />
        </View>
        <View style={styles.info}>
          <Pressable onPress={openMap}>
            <Text style={[styles.name, { textDecorationLine: 'underline', color: Colors.primary }]}>
              {worker.name}
            </Text>
          </Pressable>
          <Text style={styles.workerId}>{worker.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg, borderColor: config.color }]}>
          <View style={[styles.statusDot, { backgroundColor: config.color }]} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {worker.status === 'active' ? t('workers.statusActive') :
             worker.status === 'idle' ? t('workers.statusIdle') :
             t('workers.statusFall')}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        {/* Location & Nearest Node */}
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color={Colors.textTertiary} />
          <Text style={styles.detailLabel}>{t('workers.gpsLocation')}:</Text>
          <Text style={styles.detailValue}>
            {worker.gps.lat.toFixed(4)}, {worker.gps.lng.toFixed(4)}
          </Text>
          {worker.nearestNode && (
            <>
              <Text style={{ marginHorizontal: 4, color: Colors.textTertiary }}>|</Text>
              <MaterialCommunityIcons name="router-wireless" size={14} color={Colors.textTertiary} />
              <Text style={styles.detailLabel}>Node:</Text>
              <Text style={styles.detailValue}>{worker.nearestNode}</Text>
            </>
          )}
        </View>

        {/* IMU */}
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="axis-arrow" size={14} color={Colors.textTertiary} />
          <Text style={styles.detailLabel}>{t('workers.acceleration')}:</Text>
          <Text style={[styles.detailValue, worker.status === 'fall' && { color: Colors.danger, fontWeight: FontWeight.bold }]}>
            X:{worker.imu.accelerationX} Y:{worker.imu.accelerationY} Z:{worker.imu.accelerationZ}
          </Text>
        </View>

        {/* Wristband */}
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name={worker.wristbandConnected ? 'watch-vibrate' : 'watch-vibrate-off'}
            size={14}
            color={worker.wristbandConnected ? Colors.safe : Colors.danger}
          />
          <Text style={[styles.detailValue, { color: worker.wristbandConnected ? Colors.safe : Colors.danger }]}>
            {worker.wristbandConnected ? t('workers.wristbandConnected') : t('workers.wristbandDisconnected')}
          </Text>
        </View>
      </View>

      {/* Fall Alert Banner */}
      {worker.status === 'fall' && (
        <View style={styles.fallBanner}>
          <MaterialCommunityIcons name="alert-circle" size={16} color={Colors.white} />
          <Text style={styles.fallBannerText}>{t('workers.fallDetected')}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  fallCard: {
    borderWidth: 2,
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerBg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  workerId: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  details: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  detailValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  fallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
  },
  fallBannerText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
