import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { useStore } from '../store/useStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'en' as const, name: 'English', nativeName: 'English', icon: '🇬🇧' },
  { code: 'ta' as const, name: 'Tamil', nativeName: 'தமிழ்', icon: '🇮🇳' },
  { code: 'hi' as const, name: 'Hindi', nativeName: 'हिन्दी', icon: '🇮🇳' },
];

export default function LanguageScreen() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useStore();

  const selectLanguage = (code: 'en' | 'ta' | 'hi') => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleContinue = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="translate" size={32} color={Colors.white} />
        </View>
        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>{t('language.subtitle')}</Text>
      </View>

      {/* Language Options */}
      <View style={styles.options}>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => selectLanguage(lang.code)}
            style={({ pressed }) => [
              styles.langCard,
              language === lang.code && styles.langCardSelected,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Text style={styles.langIcon}>{lang.icon}</Text>
            <View style={styles.langText}>
              <Text style={[styles.langNative, language === lang.code && styles.langNativeSelected]}>
                {lang.nativeName}
              </Text>
              <Text style={styles.langEnglish}>{lang.name}</Text>
            </View>
            {language === lang.code && (
              <MaterialCommunityIcons name="check-circle" size={24} color={Colors.safe} />
            )}
          </Pressable>
        ))}
      </View>

      {/* Continue Button */}
      <Pressable
        onPress={handleContinue}
        style={({ pressed }) => [
          styles.continueBtn,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Text style={styles.continueBtnText}>{t('language.continue')}</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color={Colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  options: {
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  langCardSelected: {
    borderColor: Colors.safe,
    backgroundColor: Colors.safeBg,
  },
  langIcon: {
    fontSize: 32,
  },
  langText: {
    flex: 1,
  },
  langNative: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  langNativeSelected: {
    color: Colors.safe,
  },
  langEnglish: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
  },
  continueBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
