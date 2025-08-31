import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { EmployeeMood } from '@/types/game';
import { COLORS } from '@/constants/colors';

interface OwlSpriteProps {
  mood: EmployeeMood;
  activity: 'working' | 'bathroom' | 'breakroom' | 'meeting' | 'walking';
  size?: number;
}

export const OwlSprite: React.FC<OwlSpriteProps> = ({ mood, activity, size = 40 }) => {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Blink animation
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000 + Math.random() * 2000);

    // Activity-based animation
    let activityAnimation: Animated.CompositeAnimation | null = null;
    
    if (activity === 'working') {
      activityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(wingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(wingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
    } else if (activity === 'walking') {
      activityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      );
    }

    activityAnimation?.start();

    return () => {
      clearInterval(blinkInterval);
      activityAnimation?.stop();
    };
  }, [activity]);

  const getMoodColor = () => {
    switch (mood) {
      case 'mad': return COLORS.moodMad;
      case 'meh': return COLORS.moodMeh;
      case 'ok': return COLORS.moodOk;
      case 'smile': return COLORS.moodSmile;
      case 'excited': return COLORS.moodExcited;
      default: return COLORS.primary;
    }
  };

  const getMoodExpression = () => {
    switch (mood) {
      case 'mad': return '😠';
      case 'meh': return '😐';
      case 'ok': return '🙂';
      case 'smile': return '😊';
      case 'excited': return '🤩';
      default: return '🦉';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: bounceAnim }],
        },
      ]}
    >
      <View style={[styles.body, { backgroundColor: getMoodColor() }]}>
        <Animated.View style={[styles.eyes, { opacity: blinkAnim }]}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </Animated.View>
        <View style={styles.beak} />
        <Animated.View
          style={[
            styles.wing,
            styles.leftWing,
            {
              transform: [
                {
                  rotate: wingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-15deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.wing,
            styles.rightWing,
            {
              transform: [
                {
                  rotate: wingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '15deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <View style={styles.moodIndicator}>
        <View style={[styles.moodBubble, { backgroundColor: getMoodColor() }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  body: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  eye: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.text,
    borderRadius: 3,
  },
  beak: {
    width: 8,
    height: 6,
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  wing: {
    position: 'absolute',
    width: 12,
    height: 20,
    backgroundColor: 'inherit',
    borderRadius: 6,
  },
  leftWing: {
    left: -4,
    top: '30%',
  },
  rightWing: {
    right: -4,
    top: '30%',
  },
  moodIndicator: {
    position: 'absolute',
    top: -8,
    right: -4,
  },
  moodBubble: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});