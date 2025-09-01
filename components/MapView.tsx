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

// Individual island data for each building
const ISLAND_DATA = [
  {
    id: 'B1',
    center: { x: 0.2, y: 0.75 },
    size: 0.15,
    color: '#9ACD32',
    building: { x: 0.2, y: 0.75 },
    entertainmentCenters: [
      { x: 0.12, y: 0.68, name: 'Wing Arcade', icon: '🕹️', type: 'arcade' },
      { x: 0.28, y: 0.68, name: 'Feather Gym', icon: '💪', type: 'gym' },
      { x: 0.15, y: 0.82, name: 'Hoot Cinema', icon: '🎬', type: 'movies' },
      { x: 0.25, y: 0.82, name: 'Perch Bar', icon: '🍹', type: 'bar' },
    ],
    houses: [
      { x: 0.18, y: 0.7, name: 'Cozy Nest', icon: '🏠' },
      { x: 0.22, y: 0.7, name: 'Owl Villa', icon: '🏡' },
    ],
    services: [
      { x: 0.2, y: 0.8, name: 'Feather Bank', icon: '🏦' },
      { x: 0.24, y: 0.78, name: 'Hoot Motors', icon: '🚗' },
    ]
  },
  {
    id: 'B2',
    center: { x: 0.45, y: 0.55 },
    size: 0.18,
    color: '#8FBC8F',
    building: { x: 0.45, y: 0.55 },
    entertainmentCenters: [
      { x: 0.35, y: 0.48, name: 'Sky Lounge', icon: '🍸', type: 'bar' },
      { x: 0.55, y: 0.48, name: 'Flight Fitness', icon: '🏋️', type: 'gym' },
      { x: 0.38, y: 0.62, name: 'Talon Theater', icon: '🎭', type: 'movies' },
      { x: 0.52, y: 0.62, name: 'Nest Games', icon: '🎮', type: 'arcade' },
    ],
    houses: [
      { x: 0.42, y: 0.5, name: 'Eagle Heights', icon: '🏠' },
      { x: 0.48, y: 0.5, name: 'Falcon Manor', icon: '🏡' },
      { x: 0.4, y: 0.6, name: 'Hawk House', icon: '🏘️' },
    ],
    services: [
      { x: 0.45, y: 0.62, name: 'Talon Trust', icon: '🏦' },
      { x: 0.5, y: 0.58, name: 'Wing Wheels', icon: '🚙' },
    ]
  },
  {
    id: 'B3',
    center: { x: 0.75, y: 0.35 },
    size: 0.2,
    color: '#98FB98',
    building: { x: 0.75, y: 0.35 },
    entertainmentCenters: [
      { x: 0.65, y: 0.28, name: 'Soar Sports', icon: '⚽', type: 'gym' },
      { x: 0.85, y: 0.28, name: 'Roost Lounge', icon: '🥂', type: 'bar' },
      { x: 0.68, y: 0.42, name: 'Owl IMAX', icon: '🎥', type: 'movies' },
      { x: 0.82, y: 0.42, name: 'Feather Fun', icon: '🎯', type: 'arcade' },
    ],
    houses: [
      { x: 0.72, y: 0.3, name: 'Nest Valley', icon: '🏠' },
      { x: 0.78, y: 0.3, name: 'Roost Ridge', icon: '🏡' },
      { x: 0.7, y: 0.4, name: 'Perch Plaza', icon: '🏘️' },
      { x: 0.8, y: 0.4, name: 'Wing Woods', icon: '🏞️' },
    ],
    services: [
      { x: 0.75, y: 0.42, name: 'Hoot Holdings', icon: '🏦' },
      { x: 0.78, y: 0.38, name: 'Talon Motors', icon: '🚗' },
    ]
  },
  {
    id: 'B4',
    center: { x: 0.25, y: 0.25 },
    size: 0.22,
    color: '#90EE90',
    building: { x: 0.25, y: 0.25 },
    entertainmentCenters: [
      { x: 0.15, y: 0.18, name: 'Elite Fitness', icon: '🏆', type: 'gym' },
      { x: 0.35, y: 0.18, name: 'Sky Bar', icon: '🍾', type: 'bar' },
      { x: 0.18, y: 0.32, name: 'Grand Cinema', icon: '🎪', type: 'movies' },
      { x: 0.32, y: 0.32, name: 'Game Palace', icon: '👾', type: 'arcade' },
    ],
    houses: [
      { x: 0.22, y: 0.2, name: 'Summit Homes', icon: '🏠' },
      { x: 0.28, y: 0.2, name: 'Peak Villas', icon: '🏡' },
      { x: 0.2, y: 0.3, name: 'Cloud Nine', icon: '🏘️' },
      { x: 0.3, y: 0.3, name: 'Sky Estates', icon: '🏞️' },
      { x: 0.25, y: 0.32, name: 'Apex Towers', icon: '🏢' },
    ],
    services: [
      { x: 0.25, y: 0.32, name: 'Peak Bank', icon: '🏦' },
      { x: 0.28, y: 0.28, name: 'Summit Cars', icon: '🚘' },
    ]
  },
  {
    id: 'B5',
    center: { x: 0.75, y: 0.75 },
    size: 0.25,
    color: '#87CEEB',
    building: { x: 0.75, y: 0.75 },
    entertainmentCenters: [
      { x: 0.65, y: 0.68, name: 'Platinum Gym', icon: '💎', type: 'gym' },
      { x: 0.85, y: 0.68, name: 'Royal Lounge', icon: '👑', type: 'bar' },
      { x: 0.68, y: 0.82, name: 'IMAX Supreme', icon: '🎬', type: 'movies' },
      { x: 0.82, y: 0.82, name: 'VR World', icon: '🥽', type: 'arcade' },
    ],
    houses: [
      { x: 0.72, y: 0.7, name: 'Royal Estates', icon: '🏰' },
      { x: 0.78, y: 0.7, name: 'Crown Villas', icon: '🏡' },
      { x: 0.7, y: 0.8, name: 'Palace Heights', icon: '🏘️' },
      { x: 0.8, y: 0.8, name: 'Diamond District', icon: '🏞️' },
      { x: 0.75, y: 0.82, name: 'Luxury Towers', icon: '🏢' },
      { x: 0.73, y: 0.78, name: 'Elite Condos', icon: '🏬' },
    ],
    services: [
      { x: 0.75, y: 0.82, name: 'Royal Bank', icon: '🏦' },
      { x: 0.78, y: 0.78, name: 'Luxury Motors', icon: '🏎️' },
    ]
  }
];

// Building positions extracted from island data
const BUILDING_POSITIONS = ISLAND_DATA.map(island => island.building);

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
  venue: { x: number; y: number; name: string; icon: string; type?: string };
  isUnlocked: boolean;
  type?: string;
}

const IsometricVenue: React.FC<IsometricVenueProps> = ({ venue, isUnlocked, type = 'venue' }) => {
  const getVenueColor = (): [string, string] => {
    if (!venue.type) return ['#FFE4B5', '#DEB887'];
    
    switch (venue.type) {
      case 'arcade': return ['#FF69B4', '#FF1493'];
      case 'gym': return ['#32CD32', '#228B22'];
      case 'movies': return ['#8A2BE2', '#4B0082'];
      case 'bar': return ['#FF6347', '#DC143C'];
      default: return ['#FFE4B5', '#DEB887'];
    }
  };
  
  const colors = getVenueColor();
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
          type === 'entertainment' && {
            borderColor: colors[0],
            backgroundColor: `${colors[0]}20`,
          },
        ]}
        disabled={!isUnlocked}
      >
        <View style={[
          styles.venueIconContainer,
          type === 'entertainment' && {
            backgroundColor: colors[0],
          },
        ]}>
          <Text style={styles.venueIcon}>{venue.icon}</Text>
        </View>
        <Text style={[
          styles.venueName,
          !isUnlocked && styles.venueNameDisabled,
        ]}>
          {venue.name}
        </Text>
        {!isUnlocked && (
          <Text style={styles.venueLock}>Unlock Building</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

interface MiniIslandBuildingProps {
  building: { x: number; y: number; name: string; icon: string; type: string; size: string };
  isUnlocked: boolean;
}

const MiniIslandBuilding: React.FC<MiniIslandBuildingProps> = ({ building, isUnlocked }) => {
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
  
  const buildingSize = building.size === 'medium' ? 50 : 35;
  const buildingHeight = building.size === 'medium' ? 45 : 30;
  
  const getBuildingColor = (): [string, string] => {
    switch (building.type) {
      case 'house': return ['#FFE4B5', '#DEB887'];
      case 'bank': return ['#F0F8FF', '#E6E6FA'];
      case 'dealership': return ['#FF6347', '#DC143C'];
      case 'arcade': return ['#FF69B4', '#FF1493'];
      default: return ['#E8F4F8', '#D6EDF4'];
    }
  };
  
  const colors = getBuildingColor();
  
  return (
    <Animated.View
      style={[
        styles.miniIslandBuildingContainer,
        {
          left: building.x * SCREEN_WIDTH - buildingSize / 2,
          top: building.y * SCREEN_HEIGHT - buildingHeight,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isUnlocked}
        activeOpacity={0.8}
      >
        {/* Building Shadow */}
        <View
          style={[
            styles.miniBuildingShadow,
            {
              width: buildingSize + 6,
              height: 6,
              left: 3,
              top: buildingHeight - 3,
            },
          ]}
        />
        
        {/* Building Base */}
        <View
          style={[
            styles.miniBuildingBase,
            {
              width: buildingSize,
              height: 12,
              top: buildingHeight - 12,
            },
            !isUnlocked && styles.lockedBuilding,
          ]}
        />
        
        {/* Building Front */}
        <LinearGradient
          colors={isUnlocked ? colors : ['#D0D0D0', '#B8B8B8']}
          style={[
            styles.miniBuildingFront,
            {
              width: buildingSize,
              height: buildingHeight - 12,
              top: 0,
            },
          ]}
        >
          {/* Icon */}
          <View style={styles.miniBuildingIcon}>
            <Text style={styles.miniBuildingIconText}>{building.icon}</Text>
          </View>
        </LinearGradient>
        
        {/* Building Side */}
        <LinearGradient
          colors={isUnlocked ? [colors[1], colors[1]] : ['#B8B8B8', '#A0A0A0']}
          style={[
            styles.miniBuildingSide,
            {
              width: 12,
              height: buildingHeight - 12,
              left: buildingSize,
              top: 0,
            },
          ]}
        />
        
        {/* Building Top */}
        <View
          style={[
            styles.miniBuildingTop,
            {
              width: buildingSize + 12,
              height: 12,
              left: 0,
              top: -12,
            },
            !isUnlocked && styles.buildingTopLocked,
          ]}
        />
        
        {/* Building Label */}
        <View style={styles.miniBuildingLabel}>
          <Text style={[
            styles.miniBuildingName,
            !isUnlocked && styles.lockedText,
          ]}>
            {building.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
      
      {/* Individual Islands */}
      {ISLAND_DATA.map((island, index) => (
        <View
          key={island.id}
          style={[
            styles.individualIsland,
            {
              left: (island.center.x - island.size / 2) * SCREEN_WIDTH,
              top: (island.center.y - island.size / 2) * SCREEN_HEIGHT,
              width: island.size * SCREEN_WIDTH,
              height: island.size * SCREEN_HEIGHT,
              backgroundColor: island.color,
            },
          ]}
        />
      ))}
      
      {/* Connecting Bridges */}
      {ISLAND_DATA.slice(0, -1).map((island, index) => {
        const nextIsland = ISLAND_DATA[index + 1];
        const distance = Math.sqrt(
          Math.pow((nextIsland.center.x - island.center.x) * SCREEN_WIDTH, 2) +
          Math.pow((nextIsland.center.y - island.center.y) * SCREEN_HEIGHT, 2)
        );
        const angle = Math.atan2(
          (nextIsland.center.y - island.center.y) * SCREEN_HEIGHT,
          (nextIsland.center.x - island.center.x) * SCREEN_WIDTH
        );
        
        return (
          <View
            key={`bridge-${index}`}
            style={[
              styles.bridge,
              {
                left: island.center.x * SCREEN_WIDTH,
                top: island.center.y * SCREEN_HEIGHT,
                width: distance * 0.7,
                transform: [{ rotate: `${angle}rad` }],
              },
            ]}
          />
        );
      })}
      
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
        
        {/* Island Buildings and Entertainment Centers */}
        {ISLAND_DATA.map((island, islandIndex) => {
          const buildingUnlocked = player.level >= BUILDINGS_DATA[islandIndex]?.level!;
          
          return (
            <React.Fragment key={`island-${island.id}`}>
              {/* Entertainment Centers */}
              {island.entertainmentCenters.map((center, centerIndex) => (
                <IsometricVenue
                  key={`${island.id}-entertainment-${centerIndex}`}
                  venue={center}
                  isUnlocked={buildingUnlocked}
                  type="entertainment"
                />
              ))}
              
              {/* Houses */}
              {island.houses.map((house, houseIndex) => (
                <MiniIslandBuilding
                  key={`${island.id}-house-${houseIndex}`}
                  building={{ ...house, type: 'house', size: 'small' }}
                  isUnlocked={buildingUnlocked}
                />
              ))}
              
              {/* Services */}
              {island.services.map((service, serviceIndex) => (
                <MiniIslandBuilding
                  key={`${island.id}-service-${serviceIndex}`}
                  building={{ ...service, type: service.name.includes('Bank') ? 'bank' : 'dealership', size: 'medium' }}
                  isUnlocked={buildingUnlocked}
                />
              ))}
            </React.Fragment>
          );
        })}
      </Animated.View>
      
      {/* Map Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Owl Business Archipelago</Text>
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
  individualIsland: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bridge: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#8B4513',
    borderRadius: 3,
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    transformOrigin: '0 50%',
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.8)',
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
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gold,
    minWidth: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  venueIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  venueDisabled: {
    borderColor: COLORS.warmGrayLight,
    opacity: 0.6,
  },
  venueIcon: {
    fontSize: 14,
    color: 'white',
  },
  venueName: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 12,
  },
  venueNameDisabled: {
    color: COLORS.textLight,
  },
  venueLock: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  miniIslandBuildingContainer: {
    position: 'absolute',
  },
  miniBuildingShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 3,
    transform: [{ skewX: '-30deg' }],
  },
  miniBuildingBase: {
    position: 'absolute',
    backgroundColor: '#D2B48C',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  miniBuildingFront: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBuildingSide: {
    position: 'absolute',
    borderRadius: 3,
    transform: [{ skewY: '-30deg' }],
    transformOrigin: '0 100%',
  },
  miniBuildingTop: {
    position: 'absolute',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    transform: [{ skewX: '-30deg' }],
  },
  miniBuildingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBuildingIconText: {
    fontSize: 16,
  },
  miniBuildingLabel: {
    position: 'absolute',
    top: -30,
    left: -15,
    right: -15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 6,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  miniBuildingName: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: COLORS.text,
    textAlign: 'center',
  },
});