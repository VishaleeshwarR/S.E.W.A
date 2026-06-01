import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/language');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <Text style={styles.bannerText}>S.E.W.A</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Blue Glow in Top Right */}
        <Animated.View style={[styles.glowBlob, { opacity: fadeAnim }]} />

        {/* Text Area */}
        <Animated.View style={[styles.textArea, { opacity: fadeAnim }]}>
          <Text style={styles.mainTitle}>S.E.W.A</Text>
          <Text style={styles.subtitle}>Sewer Environment Worker Assistance</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBanner: {
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
  content: {
    flex: 1,
    paddingLeft: 60,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
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
    // Note: web-only filter for soft glow
    filter: 'blur(80px)',
  },
  textArea: {
    zIndex: 5,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 84,
    fontWeight: '900',
    color: '#333333',
    letterSpacing: -2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
  },
});
