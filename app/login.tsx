import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { useStore } from '../store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Role = 'admin' | 'employee';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useStore();
  const [role, setRole] = useState<Role>('admin');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (role === 'admin') {
      if (!adminId.trim() || !password.trim()) {
        setError(t('login.adminHint'));
        return;
      }
      login('admin', adminId.trim());
      router.replace('/(admin)/dashboard');
    } else {
      if (!employeeId.trim()) {
        setError(t('login.employeeHint'));
        return;
      }
      login('employee', employeeId.trim());
      router.replace('/(employee)/dashboard');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Top Banner overlay */}
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>S.E.W.A</Text>
        </View>

        {/* Glow Blob */}
        <View style={styles.glowBlob} />

        {/* PPT Header Area */}
        <View style={styles.pptHeader}>
          <Text style={styles.pptMainTitle}>S.E.W.A</Text>
          <Text style={styles.pptSubtitle}>Sewer Environment Worker Assistance</Text>
        </View>

        {/* Role Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => { setRole('admin'); setError(''); }}
            style={[styles.toggleBtn, role === 'admin' && styles.toggleBtnActive]}
          >
            <MaterialCommunityIcons
              name="shield-account"
              size={18}
              color={role === 'admin' ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.toggleText, role === 'admin' && styles.toggleTextActive]}>
              {t('login.adminTab')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { setRole('employee'); setError(''); }}
            style={[styles.toggleBtn, role === 'employee' && styles.toggleBtnActive]}
          >
            <MaterialCommunityIcons
              name="hard-hat"
              size={18}
              color={role === 'employee' ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.toggleText, role === 'employee' && styles.toggleTextActive]}>
              {t('login.employeeTab')}
            </Text>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {role === 'admin' ? (
            <>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account" size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.adminId')}
                  placeholderTextColor={Colors.textTertiary}
                  value={adminId}
                  onChangeText={setAdminId}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock" size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.password')}
                  placeholderTextColor={Colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </>
          ) : (
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="badge-account" size={20} color={Colors.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder={t('login.employeeId')}
                placeholderTextColor={Colors.textTertiary}
                value={employeeId}
                onChangeText={setEmployeeId}
                autoCapitalize="characters"
              />
            </View>
          )}

          {/* Error */}
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={16} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginBtn,
              role === 'admin' ? styles.loginBtnAdmin : styles.loginBtnEmployee,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.loginBtnText}>{t('login.loginButton')}</Text>
            <MaterialCommunityIcons name="login" size={20} color={Colors.white} />
          </Pressable>
        </View>

        {/* Hint */}
        <Text style={styles.hint}>
          {role === 'admin' ? t('login.adminHint') : t('login.employeeHint')}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.xxl,
    paddingTop: 100, // accommodate the top banner
  },
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0D11F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    zIndex: 10,
  },
  bannerText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
  bannerDash: {
    color: '#FFFFFF',
    opacity: 0.5,
    fontSize: 16,
  },
  glowBlob: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: '#6C5CE7',
    opacity: 0.15,
    filter: 'blur(80px)', // Web only
    zIndex: 0,
  },
  pptHeader: {
    alignItems: 'center', // Center on mobile, can adjust for desktop
    marginBottom: Spacing.xxxl,
    zIndex: 5,
    marginTop: 40,
  },
  pptMainTitle: {
    fontSize: 72,
    fontWeight: '900',
    color: '#333333',
    letterSpacing: -2,
    marginBottom: 4,
    textAlign: 'center',
  },
  pptSubtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.xxl,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    fontWeight: FontWeight.medium,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    marginTop: Spacing.sm,
  },
  loginBtnAdmin: {
    backgroundColor: Colors.primary,
  },
  loginBtnEmployee: {
    backgroundColor: Colors.safe,
  },
  loginBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
