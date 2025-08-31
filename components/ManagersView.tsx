import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Users, Star, TrendingUp, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';

export const ManagersView: React.FC = () => {
  const { gameState } = useGame();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Managers & Celebrity Owls</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Managers</Text>
        <Text style={styles.sectionSubtitle}>Unlock at Level 10</Text>
        
        {gameState.player.level < 10 ? (
          <View style={styles.lockedMessage}>
            <Users size={48} color={COLORS.textLight} />
            <Text style={styles.lockedText}>Reach Level 10 to unlock managers</Text>
          </View>
        ) : (
          <View style={styles.managersList}>
            <TouchableOpacity style={styles.managerCard}>
              <View style={[styles.rarityIndicator, { backgroundColor: COLORS.success }]} />
              <Text style={styles.managerName}>Efficiency Expert</Text>
              <View style={styles.managerStats}>
                <TrendingUp size={14} color={COLORS.success} />
                <Text style={styles.managerBonus}>+10% Profit</Text>
              </View>
              <Text style={styles.managerCost}>🦉 5,000</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Celebrity Owls</Text>
        <Text style={styles.sectionSubtitle}>Unlock with Celebrity Points</Text>
        
        <View style={styles.celebritiesList}>
          {gameState.celebrityOwls.slice(0, 6).map(celeb => (
            <TouchableOpacity
              key={celeb.id}
              style={[styles.celebrityCard, !celeb.unlocked && styles.lockedCard]}
            >
              <Star size={24} color={celeb.unlocked ? COLORS.gold : COLORS.textLight} />
              <Text style={styles.celebrityName}>{celeb.name}</Text>
              <Text style={styles.celebrityCategory}>{celeb.category}</Text>
              <Text style={styles.celebrityBonus}>
                {celeb.auraType === 'profit' && '💰'}
                {celeb.auraType === 'morale' && '😊'}
                {celeb.auraType === 'offline' && '🕐'}
                {' +' + celeb.auraBonus + '%'}
              </Text>
              {!celeb.unlocked && (
                <Text style={styles.celebrityRequirement}>⭐ {celeb.cpRequired}</Text>
              )}
            </TouchableOpacity>
          ))}
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  lockedMessage: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
  },
  lockedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  managersList: {
    gap: 12,
  },
  managerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  rarityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  managerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  managerBonus: {
    fontSize: 14,
    color: COLORS.success,
  },
  managerCost: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  celebritiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  celebrityCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  lockedCard: {
    opacity: 0.6,
  },
  celebrityName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  celebrityCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  celebrityBonus: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  celebrityRequirement: {
    fontSize: 12,
    color: COLORS.warning,
    marginTop: 4,
  },
});