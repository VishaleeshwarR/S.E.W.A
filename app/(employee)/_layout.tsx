import React from 'react';
import { Tabs } from 'expo-router';
import { Colors, FontSize, FontWeight } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function EmployeeLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.safe,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.sm,
          fontWeight: FontWeight.bold,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-check" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nodes"
        options={{
          title: t('nodes.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="access-point-network" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('map.title'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-path" size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
