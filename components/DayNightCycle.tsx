import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CYCLE_DURATION = 60000; // 1 minute full cycle

export const DayNightCycle: React.FC = () => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: CYCLE_DURATION,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      COLORS.skyDay,
      COLORS.skySunset,
      COLORS.skyNight,
      COLORS.skySunset,
      COLORS.skyDay,
    ],
  });

  const sunPosition = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-100, SCREEN_HEIGHT + 100, -100],
  });

  const moonPosition = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [SCREEN_HEIGHT + 100, -100, SCREEN_HEIGHT + 100],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.3, 0.5, 0.8, 0.5, 0.3],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.sun, { transform: [{ translateY: sunPosition }] }]} />
      <Animated.View style={[styles.moon, { transform: [{ translateY: moonPosition }] }]} />
      <Animated.View style={[styles.overlay, { opacity }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  sun: {
    position: 'absolute',
    right: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  moon: {
    position: 'absolute',
    left: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});