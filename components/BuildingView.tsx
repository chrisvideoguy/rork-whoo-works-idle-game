import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { Building, Room } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';
import { OwlSprite } from '@/components/OwlSprite';
import { Plus } from 'lucide-react-native';
import { formatNumber } from '@/utils/format';
import { ROOM_UNLOCK_COSTS } from '@/constants/gameData';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BuildingViewProps {
  building: Building;
}

export const BuildingView: React.FC<BuildingViewProps> = ({ building }) => {
  const { setSelectedRoom, unlockRoom, gameState } = useGame();
  // Force cutaway view as default
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Always create all refs and animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const offsetXAnim = useRef(new Animated.Value(0)).current;
  const offsetYAnim = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastOffset = useRef({ x: 0, y: 0 });
  const pinchDistance = useRef(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [building.id]);

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
            const newScale = Math.max(0.85, Math.min(1.6, lastScale.current * (distance / pinchDistance.current)));
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
          const maxY = (600 * scale - 600) / 2 / scale;
          
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

  const handleRoomPress = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleUnlockRoom = () => {
    unlockRoom(building.id);
  };

  const getNextRoomCost = () => {
    const costs = ROOM_UNLOCK_COSTS[building.id as keyof typeof ROOM_UNLOCK_COSTS];
    return costs?.[building.rooms.length] || 0;
  };

  const canAffordNextRoom = () => {
    return gameState.player.currencies.owlCash >= getNextRoomCost();
  };

  const maxRooms = building.id === 'b1' ? 4 : 
                  building.id === 'b2' ? 6 :
                  building.id === 'b3' ? 8 :
                  building.id === 'b4' ? 10 : 12;

  // List view removed - cutaway is now the default

  const renderCutawayView = () => (
    <Animated.View
      style={[
        styles.cutawayContainer,
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
      <View style={styles.buildingCutaway}>
        {/* Building Shell */}
        <View style={styles.buildingShell}>
          <View style={styles.buildingWall} />
          <View style={styles.buildingRoof} />
        </View>
        
        {/* Floors */}
        <View style={styles.floorsGrid}>
          {building.rooms.map((room, index) => {
            const floorIndex = Math.floor(index / 2);
            const roomIndex = index % 2;
            const isLeft = roomIndex === 0;
            
            return (
              <View
                key={room.id}
                style={[
                  styles.isometricRoom,
                  {
                    bottom: floorIndex * 120,
                    left: isLeft ? 20 : 200,
                    zIndex: 100 - index,
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.roomTouchable}
                  onPress={() => handleRoomPress(room)}
                  activeOpacity={0.9}
                >
                  {/* Room Floor */}
                  <View style={styles.roomFloor} />
                  
                  {/* Room Walls */}
                  <View style={styles.roomWallLeft} />
                  <View style={styles.roomWallRight} />
                  
                  {/* Room Tag */}
                  <View style={styles.roomTag}>
                    <Text style={styles.roomTagName}>{room.name}</Text>
                    {room.company && (
                      <>
                        <Text style={styles.roomTagEps}>💰 {formatNumber(room.eps)}/s</Text>
                        <View style={styles.roomTagHearts}>
                          {[1, 2, 3].map(heart => {
                            const target = room.company!.heartTargets[heart - 1];
                            const isComplete = room.company!.currentHearts >= target;
                            const heartColor = heart === 1 ? COLORS.heartGreen : 
                                             heart === 2 ? COLORS.heartAmber : COLORS.heartPink;
                            return (
                              <View key={heart} style={[styles.miniHeartContainer, { backgroundColor: isComplete ? heartColor : COLORS.warmGrayLight }]} />
                            );
                          })}
                        </View>
                      </>
                    )}
                  </View>
                  
                  {/* Furniture */}
                  {room.company && (
                    <View style={styles.roomFurniture}>
                      {/* Desks - show based on desk level */}
                      {Array.from({ length: Math.min(room.items.desk, 4) }, (_, deskIndex) => {
                        const deskPositions = [
                          { left: 30, top: 40 },
                          { left: 80, top: 40 },
                          { left: 30, top: 60 },
                          { left: 80, top: 60 },
                        ];
                        const pos = deskPositions[deskIndex];
                        return pos ? (
                          <View key={deskIndex} style={[styles.desk, { left: pos.left, top: pos.top }]} />
                        ) : null;
                      })}
                      
                      {/* Computers - show based on computer level */}
                      {Array.from({ length: Math.min(room.items.computer, 4) }, (_, compIndex) => {
                        const compPositions = [
                          { left: 35, top: 35 },
                          { left: 85, top: 35 },
                          { left: 35, top: 55 },
                          { left: 85, top: 55 },
                        ];
                        const pos = compPositions[compIndex];
                        return pos ? (
                          <View key={compIndex} style={[styles.computer, { left: pos.left, top: pos.top }]} />
                        ) : null;
                      })}
                      
                      {/* Plants - show based on plant level */}
                      {Array.from({ length: Math.min(room.items.plant, 3) }, (_, plantIndex) => {
                        const plantPositions = [
                          { left: 10, top: 60 },
                          { left: 140, top: 60 },
                          { left: 75, top: 20 },
                        ];
                        const pos = plantPositions[plantIndex];
                        return pos ? (
                          <View key={plantIndex} style={[styles.plant, { left: pos.left, top: pos.top }]} />
                        ) : null;
                      })}
                      
                      {/* Clock - show if level > 0 */}
                      {room.items.clock > 0 && (
                        <View style={[styles.clock, { left: 5, top: 15 }]} />
                      )}
                      
                      {/* Cabinet - show if level > 0 */}
                      {room.items.cabinet > 0 && (
                        <View style={[styles.cabinet, { left: 120, top: 20 }]} />
                      )}
                      
                      {/* Picture Frames - show if level > 0 */}
                      {room.items.pictureFrames > 0 && (
                        <View style={[styles.pictureFrame, { left: 50, top: 10 }]} />
                      )}
                      
                      {/* Extinguisher - show if level > 0 */}
                      {room.items.extinguisher > 0 && (
                        <View style={[styles.extinguisher, { left: 130, top: 70 }]} />
                      )}
                      
                      {/* Window */}
                      <View style={styles.window} />
                    </View>
                  )}
                  
                  {/* Owls */}
                  <View style={styles.roomOwls}>
                    {room.company?.employees.slice(0, 4).map((emp, i) => {
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
                  
                  {/* Door */}
                  <View style={styles.roomDoor} />
                </TouchableOpacity>
              </View>
            );
          })}
          
          {/* Add Room Button */}
          {building.rooms.length < maxRooms && (
            <View
              style={[
                styles.isometricRoom,
                {
                  bottom: Math.floor(building.rooms.length / 2) * 120,
                  left: building.rooms.length % 2 === 0 ? 20 : 200,
                  zIndex: 100 - building.rooms.length,
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.addRoomIsometric,
                  !canAffordNextRoom() && styles.addRoomIsometricDisabled
                ]}
                onPress={handleUnlockRoom}
                disabled={!canAffordNextRoom()}
              >
                <Plus size={32} color={canAffordNextRoom() ? COLORS.primary : COLORS.textLight} />
                <Text style={[
                  styles.addRoomIsometricText,
                  !canAffordNextRoom() && styles.addRoomTextDisabled
                ]}>
                  🦉 {formatNumber(getNextRoomCost())}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Shared Facilities */}
        <View style={styles.sharedFacilitiesIsometric}>
          {building.sharedFacilities.meeting > 0 && (
            <View style={[styles.meetingPerch, { bottom: -20, left: 120 }]}>
              {/* Meeting Perch Floor */}
              <View style={styles.meetingPerchFloor} />
              
              {/* Meeting Perch Walls */}
              <View style={styles.meetingPerchWallLeft} />
              <View style={styles.meetingPerchWallRight} />
              
              {/* Long Perch Table */}
              <View style={styles.perchTable} />
              
              {/* Chairs around table */}
              <View style={[styles.perchChair, { left: 10, top: 25 }]} />
              <View style={[styles.perchChair, { left: 25, top: 25 }]} />
              <View style={[styles.perchChair, { left: 40, top: 25 }]} />
              <View style={[styles.perchChair, { left: 55, top: 25 }]} />
              <View style={[styles.perchChair, { left: 70, top: 25 }]} />
              
              <View style={[styles.perchChair, { left: 10, top: 45 }]} />
              <View style={[styles.perchChair, { left: 25, top: 45 }]} />
              <View style={[styles.perchChair, { left: 40, top: 45 }]} />
              <View style={[styles.perchChair, { left: 55, top: 45 }]} />
              <View style={[styles.perchChair, { left: 70, top: 45 }]} />
              
              {/* Whiteboard */}
              <View style={styles.whiteboard} />
              
              {/* Window */}
              <View style={styles.meetingWindow} />
              
              {/* Coffee Station */}
              <View style={styles.coffeeStation} />
              
              {/* Plants */}
              <View style={[styles.meetingPlant, { left: 5, top: 50 }]} />
              <View style={[styles.meetingPlant, { right: 5, top: 50 }]} />
              
              {/* Owls in meeting */}
              {Array.from({ length: Math.min(6, 10) }, (_, i) => {
                const chairPositions = [
                  { left: 12, top: 27 },
                  { left: 27, top: 27 },
                  { left: 42, top: 27 },
                  { left: 57, top: 27 },
                  { left: 12, top: 47 },
                  { left: 27, top: 47 },
                ];
                const pos = chairPositions[i];
                
                return pos ? (
                  <View
                    key={i}
                    style={[
                      styles.meetingOwl,
                      { left: pos.left, top: pos.top }
                    ]}
                  >
                    <OwlSprite 
                      mood="smile"
                      activity="working"
                      size={12}
                    />
                  </View>
                ) : null;
              })}
              
              {/* Door */}
              <View style={styles.meetingDoor} />
              
              <Text style={styles.facilityLabel}>Meeting Perch</Text>
            </View>
          )}
          
          {building.sharedFacilities.bathroom > 0 && (
            <View style={[styles.bathroomRoom, { bottom: -20, right: 120 }]}>
              <View style={styles.bathroomFloor} />
              <Text style={styles.facilityLabel}>🚻</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.buildingHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.buildingName}>{building.name}</Text>
          <Text style={styles.buildingInfo}>
            Rooms: {building.rooms.length}/{maxRooms} • Power: {building.powerCap}
          </Text>
        </View>
        
        {/* View toggle removed - cutaway is now the default */}
      </View>

      {renderCutawayView()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  buildingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warmGrayLight,
  },
  buildingName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  buildingInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  buildingScroll: {
    flex: 1,
  },
  buildingContent: {
    paddingVertical: 20,
  },
  floorsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  floor: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 100,
  },
  firstFloor: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  floorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  companyName: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  roomEps: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
  },
  emptyRoom: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: 4,
  },
  owlsContainer: {
    width: 120,
    height: 40,
    position: 'relative',
  },
  owlPosition: {
    position: 'absolute',
    top: 0,
  },
  heartsBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  heartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartProgress: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  heartFill: {
    height: '100%',
    backgroundColor: COLORS.coral,
    borderRadius: 4,
  },
  heartComplete: {
    backgroundColor: COLORS.success,
  },
  heartIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  addRoomButton: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addRoomButtonDisabled: {
    backgroundColor: COLORS.warmGrayLight,
    borderColor: COLORS.textLight,
  },
  addRoomText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.primary,
  },
  addRoomTextDisabled: {
    color: COLORS.textLight,
  },
  addRoomCost: {
    fontSize: 14,
    color: COLORS.primary,
  },
  facilitiesContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  facilitiesTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  facilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.beige,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  facilityIcon: {
    fontSize: 16,
  },
  facilityText: {
    fontSize: 12,
    color: COLORS.text,
  },
  
  // Header styles
  headerLeft: {
    flex: 1,
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 8,
  },
  viewToggleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  
  // Cutaway view styles
  cutawayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F5F2',
  },
  buildingCutaway: {
    width: 400,
    height: 600,
    position: 'relative',
  },
  buildingShell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buildingWall: {
    position: 'absolute',
    top: 50,
    left: 50,
    right: 50,
    bottom: 100,
    backgroundColor: COLORS.warmGray,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.warmGrayDark,
  },
  buildingRoof: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    height: 40,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    transform: [{ perspective: 1000 }, { rotateX: '45deg' }],
  },
  floorsGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Isometric room styles
  isometricRoom: {
    position: 'absolute',
    width: 160,
    height: 100,
  },
  roomTouchable: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  roomFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.mintCerulean,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    transform: [{ perspective: 1000 }, { rotateX: '60deg' }],
  },
  roomWallLeft: {
    position: 'absolute',
    left: 0,
    top: 10,
    width: 8,
    height: 70,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.warmGrayLight,
  },
  roomWallRight: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 8,
    height: 70,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.warmGrayLight,
  },
  
  // Room tag styles
  roomTag: {
    position: 'absolute',
    top: -10,
    left: 5,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roomTagName: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  roomTagEps: {
    fontSize: 8,
    color: COLORS.success,
    marginTop: 2,
  },
  roomTagHearts: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  miniHeartContainer: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  
  // Furniture styles
  roomFurniture: {
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
    backgroundColor: COLORS.shadowDark,
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
  clock: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  cabinet: {
    position: 'absolute',
    width: 12,
    height: 8,
    backgroundColor: COLORS.warmGrayDark,
    borderRadius: 2,
  },
  pictureFrame: {
    position: 'absolute',
    width: 10,
    height: 6,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.goldDark,
  },
  extinguisher: {
    position: 'absolute',
    width: 4,
    height: 8,
    backgroundColor: COLORS.error,
    borderRadius: 2,
  },
  
  // Owl positioning in rooms
  roomOwls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  owlInRoom: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  
  // Room door
  roomDoor: {
    position: 'absolute',
    left: 70,
    bottom: 0,
    width: 20,
    height: 30,
    backgroundColor: COLORS.warmGrayDark,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  
  // Add room isometric styles
  addRoomIsometric: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryPale,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addRoomIsometricDisabled: {
    backgroundColor: COLORS.warmGrayLight,
    borderColor: COLORS.textLight,
  },
  addRoomIsometricText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: COLORS.primary,
  },
  
  // Shared facilities isometric
  sharedFacilitiesIsometric: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  meetingRoom: {
    position: 'absolute',
    width: 80,
    height: 60,
    backgroundColor: COLORS.beige,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  meetingRoomFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: COLORS.mintCerulean,
    borderRadius: 6,
  },
  meetingTable: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    height: 8,
    backgroundColor: COLORS.warmGray,
    borderRadius: 4,
  },
  bathroomRoom: {
    position: 'absolute',
    width: 60,
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bathroomFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 6,
  },
  facilityLabel: {
    fontSize: 8,
    color: COLORS.text,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  
  // Meeting Perch styles
  meetingPerch: {
    position: 'absolute',
    width: 120,
    height: 80,
    backgroundColor: COLORS.beige,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  meetingPerchFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.mintCerulean,
    borderRadius: 6,
  },
  meetingPerchWallLeft: {
    position: 'absolute',
    left: 0,
    top: 5,
    width: 4,
    height: 50,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.warmGrayLight,
  },
  meetingPerchWallRight: {
    position: 'absolute',
    right: 0,
    top: 5,
    width: 4,
    height: 50,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.warmGrayLight,
  },
  perchTable: {
    position: 'absolute',
    bottom: 20,
    left: 8,
    right: 8,
    height: 12,
    backgroundColor: COLORS.warmGray,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  perchChair: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  whiteboard: {
    position: 'absolute',
    right: 8,
    top: 10,
    width: 16,
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  meetingWindow: {
    position: 'absolute',
    left: 8,
    top: 10,
    width: 12,
    height: 16,
    backgroundColor: COLORS.skyDayLight,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.warmGrayDark,
  },
  coffeeStation: {
    position: 'absolute',
    right: 5,
    bottom: 35,
    width: 8,
    height: 8,
    backgroundColor: COLORS.warmGrayDark,
    borderRadius: 2,
  },
  meetingPlant: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  meetingOwl: {
    position: 'absolute',
    width: 12,
    height: 12,
  },
  meetingDoor: {
    position: 'absolute',
    left: 50,
    bottom: 0,
    width: 20,
    height: 25,
    backgroundColor: COLORS.warmGrayDark,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});