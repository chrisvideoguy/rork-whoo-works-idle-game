import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { BuildingSchema, RoomCell } from '@/constants/buildings';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';
import { OwlSprite } from '@/components/OwlSprite';
import { formatNumber } from '@/utils/format';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design constants
const TILE_W = 128;
const TILE_H = 64;

function IsoPos(x: number, y: number) {
  // Convert grid coords to screen coords (isometric 2:1)
  const isoX = (x - y) * (TILE_W / 2);
  const isoY = (x + y) * (TILE_H / 2);
  return { left: isoX, top: isoY };
}

interface RoomTagProps {
  label?: string;
  eps?: string;
  hasCompany?: boolean;
}

function RoomTag({ label, eps = "0/s", hasCompany = false }: RoomTagProps) {
  return (
    <View style={styles.roomTag}>
      <Text style={styles.roomTagName}>{label ?? "Room"}</Text>
      {hasCompany && (
        <>
          <Text style={styles.roomTagEps}>💰 {eps}</Text>
          {/* Hearts strip */}
          <View style={styles.roomTagHearts}>
            <View style={[styles.miniHeart, { backgroundColor: COLORS.heartGreen }]} />
            <View style={[styles.miniHeart, { backgroundColor: COLORS.heartAmber }]} />
            <View style={[styles.miniHeart, { backgroundColor: COLORS.heartPink }]} />
          </View>
        </>
      )}
    </View>
  );
}

interface IsoRoomProps {
  cell: RoomCell;
  room?: any;
  onPress: () => void;
  onLongPress?: () => void;
}

function IsoRoom({ cell, room, onPress, onLongPress }: IsoRoomProps) {
  const pos = IsoPos(cell.x, cell.y);
  const pxW = cell.w * TILE_W;
  const pxH = cell.h * TILE_H;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLongPress?.();
  };

  return (
    <Pressable
      style={[
        styles.isoRoomContainer,
        {
          left: pos.left,
          top: pos.top,
          width: pxW,
          height: pxH,
        },
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      {/* Floor rhombus */}
      <View
        style={[
          styles.roomFloor,
          {
            width: pxW,
            height: pxH,
            backgroundColor: cell.type === 'constructionPad' ? COLORS.warmGrayLight : COLORS.mintCerulean,
          },
        ]}
      />
      
      {/* Back wall top cap */}
      <View style={[styles.roomWallCap, { width: pxW }]} />
      
      {/* Construction pad styling */}
      {cell.type === 'constructionPad' ? (
        <View style={styles.constructionPad}>
          <Text style={styles.constructionPadText}>＋ {cell.label ?? ""}</Text>
        </View>
      ) : (
        <>
          <RoomTag 
            label={cell.label} 
            eps={room ? formatNumber(room.eps) + "/s" : "0/s"}
            hasCompany={!!room?.company}
          />
          
          {/* Room furniture and owls */}
          {room?.company && (
            <View style={styles.roomContent}>
              {/* Desks */}
              {Array.from({ length: Math.min(room.items.desk, 4) }, (_, i) => {
                const positions = [
                  { left: 30, top: 40 },
                  { left: 80, top: 40 },
                  { left: 30, top: 60 },
                  { left: 80, top: 60 },
                ];
                const pos = positions[i];
                return pos ? (
                  <View key={i} style={[styles.desk, { left: pos.left, top: pos.top }]} />
                ) : null;
              })}
              
              {/* Computers */}
              {Array.from({ length: Math.min(room.items.computer, 4) }, (_, i) => {
                const positions = [
                  { left: 35, top: 35 },
                  { left: 85, top: 35 },
                  { left: 35, top: 55 },
                  { left: 85, top: 55 },
                ];
                const pos = positions[i];
                return pos ? (
                  <View key={i} style={[styles.computer, { left: pos.left, top: pos.top }]} />
                ) : null;
              })}
              
              {/* Plants */}
              {Array.from({ length: Math.min(room.items.plant, 3) }, (_, i) => {
                const positions = [
                  { left: 10, top: 60 },
                  { left: 140, top: 60 },
                  { left: 75, top: 20 },
                ];
                const pos = positions[i];
                return pos ? (
                  <View key={i} style={[styles.plant, { left: pos.left, top: pos.top }]} />
                ) : null;
              })}
              
              {/* Window */}
              <View style={styles.window} />
              
              {/* Owls */}
              {room.company.employees.slice(0, 4).map((emp: any, i: number) => {
                const positions = [
                  { left: 40, top: 50 },
                  { left: 90, top: 50 },
                  { left: 40, top: 70 },
                  { left: 90, top: 70 },
                ];
                const pos = positions[i] || positions[0];
                
                return (
                  <View
                    key={emp.id}
                    style={[
                      styles.owlInRoom,
                      { left: pos.left, top: pos.top }
                    ]}
                  >
                    <OwlSprite 
                      mood={emp.mood}
                      activity={emp.currentActivity}
                      size={20}
                    />
                  </View>
                );
              })}
            </View>
          )}
          
          {/* Door */}
          <View style={styles.roomDoor} />
        </>
      )}
    </Pressable>
  );
}

interface CutawayTowerViewProps {
  building: BuildingSchema;
}

export function CutawayTowerView({ building }: CutawayTowerViewProps) {
  const { currentBuilding, setSelectedRoom, unlockRoom } = useGame();
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
      onStartShouldSetPanResponder: () => true,
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
            const newScale = Math.max(0.85, Math.min(1.65, lastScale.current * (distance / pinchDistance.current)));
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

  const handleRoomPress = (cell: RoomCell) => {
    if (cell.type === 'constructionPad') {
      unlockRoom(currentBuilding.id);
      return;
    }
    
    // Find the actual room data
    const room = currentBuilding.rooms.find(r => 
      r.name.toLowerCase().includes(cell.label?.toLowerCase().split(' ')[1] || '')
    );
    
    if (room) {
      setSelectedRoom(room);
    }
  };

  // Check if we have rooms to render, if not show seeded grid after 200ms
  const [showSeedBanner, setShowSeedBanner] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (building.floors.length === 0 || building.floors.every(f => f.rooms.length === 0)) {
        setShowSeedBanner(true);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [building]);

  if (showSeedBanner) {
    return (
      <View style={styles.seedBanner}>
        <Text style={styles.seedBannerText}>Cutaway grid missing (seeded)</Text>
      </View>
    );
  }

  // Center the building on screen
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buildingContainer,
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
        <View style={styles.building}>
          {building.floors.map((floor, floorIndex) => (
            <View 
              key={floor.id} 
              style={[
                styles.floor,
                { bottom: floorIndex * building.floorHeight }
              ]}
            >
              {floor.rooms.map((cell) => {
                // Find matching room from game state
                const room = currentBuilding.rooms.find(r => 
                  r.name.toLowerCase().includes(cell.label?.toLowerCase().split(' ')[1] || '')
                );
                
                return (
                  <IsoRoom
                    key={cell.id}
                    cell={cell}
                    room={room}
                    onPress={() => handleRoomPress(cell)}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F2', // Warm paper background
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingContainer: {
    width: 1200,
    height: 800,
    position: 'relative',
  },
  building: {
    flex: 1,
    position: 'relative',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  isoRoomContainer: {
    position: 'absolute',
  },
  roomFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderColor: 'rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderRadius: 12,
  },
  roomWallCap: {
    position: 'absolute',
    top: -16,
    left: 0,
    height: 16,
    backgroundColor: COLORS.warmGray,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  constructionPad: {
    position: 'absolute',
    left: '35%',
    top: '35%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  constructionPadText: {
    fontWeight: '700' as const,
    fontSize: 12,
    color: COLORS.text,
  },
  roomTag: {
    position: 'absolute',
    top: -22,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roomTagName: {
    fontWeight: '600' as const,
    fontSize: 10,
    color: COLORS.text,
  },
  roomTagEps: {
    fontSize: 8,
    color: COLORS.success,
  },
  roomTagHearts: {
    flexDirection: 'row',
    gap: 2,
  },
  miniHeart: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roomContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  desk: {
    position: 'absolute',
    width: 20,
    height: 12,
    backgroundColor: COLORS.warmGray,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  computer: {
    position: 'absolute',
    width: 8,
    height: 6,
    backgroundColor: COLORS.slateShadow,
    borderRadius: 2,
  },
  plant: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  window: {
    position: 'absolute',
    right: 5,
    top: 15,
    width: 12,
    height: 20,
    backgroundColor: COLORS.skyDayLight,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  owlInRoom: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  roomDoor: {
    position: 'absolute',
    left: '45%',
    bottom: 0,
    width: 20,
    height: 30,
    backgroundColor: COLORS.warmGrayDark,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  seedBanner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    margin: 20,
    borderRadius: 12,
  },
  seedBannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});