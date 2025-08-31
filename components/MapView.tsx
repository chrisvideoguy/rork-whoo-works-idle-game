import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  PanResponder,
  Dimensions,
  Platform
} from 'react-native';
import { Lock, Check, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';
import { BUILDINGS_DATA } from '@/constants/gameData';
import * as Haptics from 'expo-haptics';

interface MapViewProps {
  onBuildingSelect: (buildingId: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Isometric building positions (normalized coordinates)
const BUILDING_POSITIONS = [
  { x: 0.15, y: 0.7 },  // B1 - bottom left
  { x: 0.35, y: 0.55 }, // B2 - middle left
  { x: 0.55, y: 0.4 },  // B3 - center
  { x: 0.75, y: 0.25 }, // B4 - top right
  { x: 0.85, y: 0.15 }, // B5 - far top right
];

const VENUE_POSITIONS = [
  { x: 0.65, y: 0.75, name: 'Owl Dens', icon: '🏠' },
  { x: 0.45, y: 0.8, name: 'Luxury Cars', icon: '🚗' },
];

interface IsometricBuildingProps {
  building: any;
  position: { x: number; y: number };
  isUnlocked: boolean;
  isCurrent: boolean;
  onPress: () => void;
  index: number;
}

const IsometricBuilding: React.FC<IsometricBuildingProps> = ({
  building,
  position,
  isUnlocked,
  isCurrent,
  onPress,
  index
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };
  
  const buildingHeight = 60 + (index * 15); // Taller buildings for higher levels
  const buildingWidth = 80;
  
  return (
    <Animated.View
      style={[
        styles.isoBuildingContainer,
        {
          left: position.x * SCREEN_WIDTH - buildingWidth / 2,
          top: position.y * SCREEN_HEIGHT - buildingHeight,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isUnlocked}
        activeOpacity={0.8}
      >
        {/* Building Shadow */}
        <View
          style={[
            styles.buildingShadow,
            {
              width: buildingWidth + 10,
              height: 8,
              left: 5,
              top: buildingHeight - 5,
            },
          ]}
        />
        
        {/* Building Base (Floor) */}
        <View
          style={[
            styles.buildingBase,
            {
              width: buildingWidth,
              height: 20,
              top: buildingHeight - 20,
            },
            !isUnlocked && styles.lockedBuilding,
          ]}
        />
        
        {/* Building Front Face */}
        <LinearGradient
          colors={[
            isCurrent ? COLORS.primary : isUnlocked ? '#E8F4F8' : '#D0D0D0',
            isCurrent ? COLORS.primaryDark : isUnlocked ? '#D6EDF4' : '#B8B8B8',
          ]}
          style={[
            styles.buildingFront,
            {
              width: buildingWidth,
              height: buildingHeight - 20,
              top: 0,
            },
          ]}
        >
          {/* Windows */}
          <View style={styles.windowsContainer}>
            {Array.from({ length: Math.floor(buildingHeight / 25) }).map((_, i) => (
              <View key={i} style={styles.windowRow}>
                {Array.from({ length: 3 }).map((_, j) => (
                  <View
                    key={j}
                    style={[
                      styles.window,
                      !isUnlocked && styles.windowDark,
                      isCurrent && styles.windowActive,
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </LinearGradient>
        
        {/* Building Side Face */}
        <LinearGradient
          colors={[
            isCurrent ? COLORS.primaryDark : isUnlocked ? '#D6EDF4' : '#B8B8B8',
            isCurrent ? '#0F4A5C' : isUnlocked ? '#C2E3ED' : '#A0A0A0',
          ]}
          style={[
            styles.buildingSide,
            {
              width: 20,
              height: buildingHeight - 20,
              left: buildingWidth,
              top: 0,
            },
          ]}
        />
        
        {/* Building Top */}
        <View
          style={[
            styles.buildingTop,
            {
              width: buildingWidth + 20,
              height: 20,
              left: 0,
              top: -20,
            },
            isCurrent && styles.buildingTopActive,
            !isUnlocked && styles.buildingTopLocked,
          ]}
        />
        
        {/* Status Icon */}
        <View style={styles.statusIcon}>
          {!isUnlocked ? (
            <View style={styles.lockIconContainer}>
              <Lock size={16} color={COLORS.textLight} />
            </View>
          ) : isCurrent ? (
            <View style={styles.currentIconContainer}>
              <Check size={16} color={COLORS.surface} />
            </View>
          ) : (
            <View style={styles.unlockedIconContainer}>
              <Star size={16} color={COLORS.gold} fill={COLORS.gold} />
            </View>
          )}
        </View>
        
        {/* Building Label */}
        <View style={styles.buildingLabel}>
          <Text style={[
            styles.buildingName,
            !isUnlocked && styles.lockedText,
            isCurrent && styles.currentText,
          ]}>
            {building.name}
          </Text>
          {!isUnlocked && (
            <Text style={styles.lockRequirement}>Lv {building.level}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface IsometricVenueProps {
  venue: { x: number; y: number; name: string; icon: string };
  isUnlocked: boolean;
}

const IsometricVenue: React.FC<IsometricVenueProps> = ({ venue, isUnlocked }) => {
  return (
    <View
      style={[
        styles.venueContainer,
        {
          left: venue.x * SCREEN_WIDTH - 30,
          top: venue.y * SCREEN_HEIGHT - 40,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.venue,
          !isUnlocked && styles.venueDisabled,
        ]}
        disabled={!isUnlocked}
      >
        <Text style={styles.venueIcon}>{venue.icon}</Text>
        <Text style={[
          styles.venueName,
          !isUnlocked && styles.venueNameDisabled,
        ]}>
          {venue.name}
        </Text>
        {!isUnlocked && (
          <Text style={styles.venueLock}>Lv 18</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const MapView: React.FC<MapViewProps> = ({ onBuildingSelect }) => {
  const { gameState } = useGame();
  const { player, currentBuildingId } = gameState;
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
          // Pinch zoom
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (pinchDistance.current === 0) {
            pinchDistance.current = distance;
          } else {
            const newScale = Math.max(0.85, Math.min(1.6, lastScale.current * (distance / pinchDistance.current)));
            setScale(newScale);
            Animated.spring(scaleAnim, {
              toValue: newScale,
              useNativeDriver: true,
              friction: 5,
            }).start();
          }
        } else if (evt.nativeEvent.touches.length === 1) {
          // Pan
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
  
  return (
    <View style={styles.container}>
      {/* Sky Background */}
      <LinearGradient
        colors={['#87CEEB', '#E0F6FF', '#F0F8FF']}
        style={styles.skyBackground}
      />
      
      {/* Sea Background */}
      <LinearGradient
        colors={['#4A90E2', '#5BA3F5', '#6BB6FF']}
        style={styles.seaBackground}
      />
      
      {/* Island Base */}
      <View style={styles.islandBase} />
      
      {/* Interactive Map Content */}
      <Animated.View
        style={[
          styles.mapContent,
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
        {/* Path Lines */}
        {BUILDING_POSITIONS.slice(0, -1).map((pos, index) => {
          const nextPos = BUILDING_POSITIONS[index + 1];
          const isNextUnlocked = player.level >= BUILDINGS_DATA[index + 1].level!;
          
          return (
            <View
              key={`path-${index}`}
              style={[
                styles.pathLine,
                {
                  left: pos.x * SCREEN_WIDTH,
                  top: pos.y * SCREEN_HEIGHT,
                  width: Math.sqrt(
                    Math.pow((nextPos.x - pos.x) * SCREEN_WIDTH, 2) +
                    Math.pow((nextPos.y - pos.y) * SCREEN_HEIGHT, 2)
                  ),
                  transform: [
                    {
                      rotate: `${Math.atan2(
                        (nextPos.y - pos.y) * SCREEN_HEIGHT,
                        (nextPos.x - pos.x) * SCREEN_WIDTH
                      )}rad`,
                    },
                  ],
                },
                isNextUnlocked && styles.pathLineActive,
              ]}
            />
          );
        })}
        
        {/* Buildings */}
        {BUILDINGS_DATA.map((building, index) => {
          const isUnlocked = player.level >= building.level!;
          const isCurrent = building.id === currentBuildingId;
          const position = BUILDING_POSITIONS[index];
          
          return (
            <IsometricBuilding
              key={building.id}
              building={building}
              position={position}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              onPress={() => isUnlocked && onBuildingSelect(building.id!)}
              index={index}
            />
          );
        })}
        
        {/* Venues */}
        {VENUE_POSITIONS.map((venue, index) => (
          <IsometricVenue
            key={`venue-${index}`}
            venue={venue}
            isUnlocked={player.level >= 18}
          />
        ))}
      </Animated.View>
      
      {/* Map Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Corporate Heights Island</Text>
        <Text style={styles.subtitle}>Tap and drag to explore • Pinch to zoom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  skyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
  },
  seaBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.6,
  },
  islandBase: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    left: SCREEN_WIDTH * 0.1,
    right: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#8FBC8F',
    borderRadius: 200,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.8,
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  titleContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  pathLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 2,
    opacity: 0.6,
    transformOrigin: '0 50%',
  },
  pathLineActive: {
    backgroundColor: COLORS.gold,
    opacity: 0.8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  isoBuildingContainer: {
    position: 'absolute',
  },
  buildingShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    transform: [{ skewX: '-30deg' }],
  },
  buildingBase: {
    position: 'absolute',
    backgroundColor: '#D2B48C',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buildingFront: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buildingSide: {
    position: 'absolute',
    borderRadius: 4,
    transform: [{ skewY: '-30deg' }],
    transformOrigin: '0 100%',
  },
  buildingTop: {
    position: 'absolute',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    transform: [{ skewX: '-30deg' }],
  },
  buildingTopActive: {
    backgroundColor: COLORS.primaryLight,
  },
  buildingTopLocked: {
    backgroundColor: '#E0E0E0',
  },
  lockedBuilding: {
    backgroundColor: '#C0C0C0',
  },
  windowsContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-evenly',
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  window: {
    width: 12,
    height: 8,
    backgroundColor: '#87CEEB',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  windowDark: {
    backgroundColor: '#696969',
  },
  windowActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  lockIconContainer: {
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  currentIconContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockedIconContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  buildingLabel: {
    position: 'absolute',
    top: -45,
    left: -20,
    right: -20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buildingName: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: COLORS.text,
    textAlign: 'center',
  },
  currentText: {
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  lockedText: {
    color: COLORS.textLight,
  },
  lockRequirement: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  venueContainer: {
    position: 'absolute',
  },
  venue: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gold,
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueDisabled: {
    borderColor: COLORS.warmGrayLight,
    opacity: 0.6,
  },
  venueIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  venueName: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: COLORS.text,
    textAlign: 'center',
  },
  venueNameDisabled: {
    color: COLORS.textLight,
  },
  venueLock: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});