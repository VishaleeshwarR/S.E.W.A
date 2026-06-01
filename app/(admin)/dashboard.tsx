import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import SummaryPanel from '../../components/SummaryPanel';
import NodeCard from '../../components/NodeCard';
import AlertItem from '../../components/AlertItem';
import SafetyBadge from '../../components/SafetyBadge';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafetyStatus } from '../../constants/theme';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { nodes, workers, alerts, acknowledgeAlert, userId, logout } = useStore();

  // Start real-time data updates
  useRealTimeData();

  const unsafeNodes = nodes.filter((n) => n.status !== 'safe');
  const activeWorkers = workers.filter((w) => w.status !== 'idle');
  const criticalAlerts = alerts.filter((a) => !a.acknowledged);

  // Overall system status
  const systemStatus: SafetyStatus =
    nodes.some((n) => n.status === 'danger') ? 'danger' :
    nodes.some((n) => n.status === 'warning') ? 'warning' : 'safe';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('dashboard.greeting')}</Text>
          <Text style={styles.userId}>Admin: {userId}</Text>
        </View>
        <View style={styles.headerActions}>
          <SafetyBadge status={systemStatus} size="md" />
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <MaterialCommunityIcons name="logout" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* System Status Banner */}
        <View style={[
          styles.statusBanner,
          systemStatus === 'safe' && styles.statusSafe,
          systemStatus === 'warning' && styles.statusWarning,
          systemStatus === 'danger' && styles.statusDanger,
        ]}>
          <MaterialCommunityIcons
            name={systemStatus === 'safe' ? 'check-circle' : systemStatus === 'warning' ? 'alert' : 'alert-octagon'}
            size={22}
            color={Colors[systemStatus]}
          />
          <Text style={[styles.statusText, { color: Colors[systemStatus] }]}>
            {systemStatus === 'safe'
              ? t('dashboard.allClear')
              : systemStatus === 'warning'
                ? t('dashboard.warnings', { count: unsafeNodes.length })
                : t('dashboard.danger')}
          </Text>
        </View>

        {/* Summary Cards */}
        <SummaryPanel
          totalNodes={nodes.length}
          activeNodes={nodes.length}
          unsafeNodes={unsafeNodes.length}
          activeWorkers={activeWorkers.length}
        />

        {/* Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.recentAlerts')}</Text>
            <Pressable onPress={() => router.push('/(admin)/alerts')}>
              <Text style={styles.viewAll}>{t('dashboard.viewAll')}</Text>
            </Pressable>
          </View>
          {criticalAlerts.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="check-decagram" size={40} color={Colors.safe} />
              <Text style={styles.emptyText}>{t('dashboard.noAlerts')}</Text>
            </View>
          ) : (
            criticalAlerts.slice(0, 3).map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAcknowledge={() => acknowledgeAlert(alert.id)}
              />
            ))
          )}
        </View>

        {/* Node Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.nodeOverview')}</Text>
            <Pressable onPress={() => router.push('/(admin)/nodes')}>
              <Text style={styles.viewAll}>{t('dashboard.viewAll')}</Text>
            </Pressable>
          </View>
          {nodes.slice(0, 4).map((node) => (
            <NodeCard key={node.id} node={node} compact />
          ))}
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          {t('dashboard.lastUpdated')}: {new Date().toLocaleTimeString()}
        </Text>

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
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.primary, // PPT layout
  },
  greeting: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  userId: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent for dark bg
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    padding: Spacing.xl,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  statusSafe: {
    backgroundColor: Colors.safeBg,
    borderColor: Colors.safeBorder,
  },
  statusWarning: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warningBorder,
  },
  statusDanger: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.dangerBorder,
  },
  statusText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  viewAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  lastUpdated: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
