import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { Building } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { CutawayTowerView } from '@/components/CutawayTowerView';
import { BUILDING_SCHEMAS } from '@/constants/buildings';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BuildingViewProps {
  building: Building;
}

export const BuildingView: React.FC<BuildingViewProps> = ({ building }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [building.id, fadeAnim]);

  // Get the building schema for cutaway view
  const buildingSchema = BUILDING_SCHEMAS[building.id] || BUILDING_SCHEMAS.b1;
  
  const maxRooms = building.id === 'b1' ? 4 : 
                  building.id === 'b2' ? 6 :
                  building.id === 'b3' ? 8 :
                  building.id === 'b4' ? 10 : 12;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.buildingHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.buildingName}>{building.name}</Text>
          <Text style={styles.buildingInfo}>
            Rooms: {building.rooms.length}/{maxRooms} • Power: {building.powerCap}
          </Text>
        </View>
      </View>

      <CutawayTowerView building={buildingSchema} />
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