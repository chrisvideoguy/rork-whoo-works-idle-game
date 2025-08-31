import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Lock, Check } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';
import { BUILDINGS_DATA } from '@/constants/gameData';

interface MapViewProps {
  onBuildingSelect: (buildingId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ onBuildingSelect }) => {
  const { gameState } = useGame();
  const { player, currentBuildingId } = gameState;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Island 1 - Corporate Heights</Text>
      
      <View style={styles.buildingsPath}>
        {BUILDINGS_DATA.map((building, index) => {
          const isUnlocked = player.level >= building.level!;
          const isCurrent = building.id === currentBuildingId;
          
          return (
            <View key={building.id}>
              {index > 0 && <View style={styles.pathLine} />}
              
              <TouchableOpacity
                style={[
                  styles.buildingNode,
                  isCurrent && styles.currentNode,
                  !isUnlocked && styles.lockedNode,
                ]}
                onPress={() => isUnlocked && onBuildingSelect(building.id!)}
                disabled={!isUnlocked}
              >
                <View style={styles.buildingIcon}>
                  {!isUnlocked ? (
                    <Lock size={24} color={COLORS.textLight} />
                  ) : isCurrent ? (
                    <Check size={24} color={COLORS.surface} />
                  ) : (
                    <Text style={styles.buildingEmoji}>🏢</Text>
                  )}
                </View>
                
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
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={styles.venuesSection}>
        <Text style={styles.sectionTitle}>Special Venues</Text>
        
        <View style={styles.venueRow}>
          <TouchableOpacity
            style={[styles.venue, player.level < 18 && styles.venueDisabled]}
            disabled={player.level < 18}
          >
            <Text style={styles.venueIcon}>🏠</Text>
            <Text style={styles.venueName}>Owl Dens</Text>
            {player.level < 18 && <Text style={styles.venueLock}>Lv 18</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.venue, player.level < 18 && styles.venueDisabled]}
            disabled={player.level < 18}
          >
            <Text style={styles.venueIcon}>🚗</Text>
            <Text style={styles.venueName}>Luxury Cars</Text>
            {player.level < 18 && <Text style={styles.venueLock}>Lv 18</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  buildingsPath: {
    alignItems: 'center',
  },
  pathLine: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.warmGrayLight,
  },
  buildingNode: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    minWidth: 200,
  },
  currentNode: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  lockedNode: {
    borderColor: COLORS.warmGrayLight,
    opacity: 0.7,
  },
  buildingIcon: {
    marginBottom: 8,
  },
  buildingEmoji: {
    fontSize: 24,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    textAlign: 'center',
  },
  currentText: {
    color: COLORS.surface,
  },
  lockedText: {
    color: COLORS.textLight,
  },
  lockRequirement: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  venuesSection: {
    marginTop: 48,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 16,
  },
  venueRow: {
    flexDirection: 'row',
    gap: 12,
  },
  venue: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  venueDisabled: {
    borderColor: COLORS.warmGrayLight,
    opacity: 0.5,
  },
  venueIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  venueLock: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});