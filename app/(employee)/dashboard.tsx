import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows, getSafetyColor, SafetyStatus } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import NodeCard from '../../components/NodeCard';
import AlertItem from '../../components/AlertItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { parseNodeRange } from '../../store/useStore';
import { useState } from 'react';

export default function EmployeeDashboard() {
  const { t } = useTranslation();
  const { nodes, alerts, acknowledgeAlert, userId, logout, selectedNodeIds, selectedNodeRange, setSelectedNodeRange, setSelectedNodeIds } = useStore();
  const [inputValue, setInputValue] = useState(selectedNodeRange);

  const handleFetch = () => {
    const ids = parseNodeRange(inputValue);
    setSelectedNodeRange(inputValue);
    setSelectedNodeIds(ids);
  };

  // Start real-time updates
  useRealTimeData();

  // Employee's assigned nodes
  const assignedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));

  // Worst safety status across assigned nodes
  const personalStatus: SafetyStatus =
    assignedNodes.some((n) => n.status === 'danger') ? 'danger' :
    assignedNodes.some((n) => n.status === 'warning') ? 'warning' : 'safe';

  const safetyColors = getSafetyColor(personalStatus);

  // Relevant alerts for this employee's nodes
  const personalAlerts = alerts
    .filter((a) => !a.acknowledged && a.nodeId && selectedNodeIds.includes(a.nodeId))
    .slice(0, 5);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('employee.dashboard')}</Text>
          <Text style={styles.userId}>ID: {userId}</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <MaterialCommunityIcons name="logout" size={20} color={Colors.white} />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Safety Status — BIG & CLEAR */}
        <View style={[styles.safetyCard, { backgroundColor: safetyColors.bg as string, borderColor: safetyColors.border as string }]}>
          <View style={[styles.safetyIconBox, { backgroundColor: safetyColors.color as string }]}>
            <MaterialCommunityIcons
              name={personalStatus === 'safe' ? 'shield-check' : personalStatus === 'warning' ? 'shield-alert' : 'shield-off'}
              size={52}
              color={Colors.white}
            />
          </View>
          <Text style={[styles.safetyLabel, { color: safetyColors.color as string }]}>
            {personalStatus === 'safe'
              ? t('nodes.safe')
              : personalStatus === 'warning'
                ? t('nodes.warning')
                : t('nodes.danger')}
          </Text>
          <Text style={[styles.safetyMessage, { color: safetyColors.color as string }]}>
            {personalStatus === 'safe'
              ? t('employee.safeMessage')
              : personalStatus === 'warning'
                ? t('employee.warningMessage')
                : t('employee.dangerMessage')}
          </Text>
        </View>

        {/* Assigned Nodes Config */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('employee.assignedNodes')}</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="numeric" size={24} color={Colors.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder={"e.g. 1-5, 8"}
                placeholderTextColor={Colors.textTertiary}
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleFetch}
              />
            </View>
            <Pressable
              onPress={handleFetch}
              style={({ pressed }) => [styles.fetchBtn, { opacity: pressed ? 0.9 : 1, backgroundColor: Colors.safe }]}
            >
              <MaterialCommunityIcons name="magnify" size={22} color={Colors.white} />
            </Pressable>
          </View>

          {assignedNodes.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="access-point-network" size={32} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No nodes assigned. Enter a range above.</Text>
            </View>
          ) : (
            assignedNodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))
          )}
        </View>

        {/* Personal Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('employee.personalAlerts')}</Text>
          {personalAlerts.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="check-decagram" size={32} color={Colors.safe} />
              <Text style={styles.emptyText}>{t('dashboard.noAlerts')}</Text>
            </View>
          ) : (
            personalAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAcknowledge={() => acknowledgeAlert(alert.id)}
              />
            ))
          )}
        </View>

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
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  userId: {
    fontSize: FontSize.md,
    color: Colors.white,
    opacity: 0.8,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
    fontWeight: FontWeight.semibold,
  },
  fetchBtn: {
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    padding: Spacing.xl,
  },
  safetyCard: {
    borderRadius: Radius.xxl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: Spacing.xxl,
  },
  safetyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  safetyLabel: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  safetyMessage: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 24,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
