import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { BuildingView } from '@/components/BuildingView';
import { RoomPanel } from '@/components/RoomPanel';
import { MapView } from '@/components/MapView';
import { ShopView } from '@/components/ShopView';
import { PhoneView } from '@/components/PhoneView';
import { ManagersView } from '@/components/ManagersView';
import { SettingsView } from '@/components/SettingsView';
import { DayNightCycle } from '@/components/DayNightCycle';
import { useGame } from '@/providers/GameProvider';
import { COLORS } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GameScreen() {
  const { currentBuilding, selectedRoom } = useGame();
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'phone' | 'map' | 'managers' | 'settings'>('home');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const offsetXAnim = useRef(new Animated.Value(0)).current;
  const offsetYAnim = useRef(new Animated.Value(0)).current;
  
  const lastScale = useRef(1);
  const lastOffset = useRef({ x: 0, y: 0 });
  const pinchDistance = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        lastOffset.current = offset;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (pinchDistance.current === 0) {
            pinchDistance.current = distance;
          } else {
            const newScale = Math.max(0.5, Math.min(2, lastScale.current * (distance / pinchDistance.current)));
            setScale(newScale);
            Animated.spring(scaleAnim, {
              toValue: newScale,
              useNativeDriver: true,
              friction: 5,
            }).start();
          }
        } else if (evt.nativeEvent.touches.length === 1) {
          const newX = lastOffset.current.x + gestureState.dx / scale;
          const newY = lastOffset.current.y + gestureState.dy / scale;
          
          const maxX = (SCREEN_WIDTH * scale - SCREEN_WIDTH) / 2 / scale;
          const maxY = (SCREEN_HEIGHT * scale - SCREEN_HEIGHT) / 2 / scale;
          
          const clampedX = Math.max(-maxX, Math.min(maxX, newX));
          const clampedY = Math.max(-maxY, Math.min(maxY, newY));
          
          setOffset({ x: clampedX, y: clampedY });
          Animated.parallel([
            Animated.spring(offsetXAnim, {
              toValue: clampedX,
              useNativeDriver: true,
              friction: 7,
            }),
            Animated.spring(offsetYAnim, {
              toValue: clampedY,
              useNativeDriver: true,
              friction: 7,
            }),
          ]).start();
        }
      },
      onPanResponderRelease: () => {
        lastScale.current = scale;
        lastOffset.current = offset;
        pinchDistance.current = 0;
      },
    })
  ).current;

  const handleNavPress = (view: typeof activeView) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'shop':
        return <ShopView />;
      case 'phone':
        return <PhoneView />;
      case 'map':
        return <MapView onBuildingSelect={() => setActiveView('home')} />;
      case 'managers':
        return <ManagersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <Animated.View
            style={[
              styles.gameContainer,
              {
                transform: [
                  { translateX: offsetXAnim },
                  { translateY: offsetYAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <BuildingView building={currentBuilding} />
          </Animated.View>
        );
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.skyDay, COLORS.skyDayLight]}
      style={styles.container}
    >
      <DayNightCycle />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <TopBar />
        
        <View style={styles.content}>
          {renderContent()}
        </View>

        <BottomNav activeView={activeView} onPress={handleNavPress} />
        
        {selectedRoom && activeView === 'home' && (
          <RoomPanel room={selectedRoom} />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});