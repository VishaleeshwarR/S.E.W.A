import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../i18n';
import { useStore } from '../store/useStore';
import FallAlertModal from '../components/FallAlertModal';

export default function RootLayout() {
  const { showFallAlert, fallAlertData, dismissFallAlert, acknowledgeAlert } = useStore();

  const handleAcknowledge = () => {
    if (fallAlertData) {
      acknowledgeAlert(fallAlertData.id);
    }
    dismissFallAlert();
  };

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="language" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(employee)" options={{ gestureEnabled: false }} />
      </Stack>

      {/* Global Fall Alert Modal */}
      <FallAlertModal
        visible={showFallAlert}
        alert={fallAlertData}
        onDismiss={dismissFallAlert}
        onAcknowledge={handleAcknowledge}
      />
    </>
  );
}
