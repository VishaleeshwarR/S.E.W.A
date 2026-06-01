import React from 'react';
import { Tabs } from 'expo-router';
import { Colors, FontSize, FontWeight } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

export default function AdminLayout() {
  const { t } = useTranslation();
  const alerts = useStore((s) => s.alerts);
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nodes"
        options={{
          title: t('nodes.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="access-point-network" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('map.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-path" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: t('workers.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-hard-hat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t('alerts.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-alert" size={size} color={color} />
          ),
          tabBarBadge: unacknowledgedCount > 0 ? unacknowledgedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.danger,
            fontSize: 10,
            fontWeight: FontWeight.bold,
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
        }}
      />
    </Tabs>
  );
}
