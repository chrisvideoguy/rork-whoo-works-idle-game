import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, TrendingUp } from 'lucide-react-native';
import { useGame } from '@/providers/GameProvider';
import { COLORS } from '@/constants/colors';
import { formatNumber } from '@/utils/format';

export const TopBar: React.FC = () => {
  const { gameState } = useGame();
  const { player } = gameState;
  
  const xpProgress = (player.experience / player.experienceToNext) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Lv {player.level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.currencySection}>
        <View style={styles.currency}>
          <Text style={styles.currencyIcon}>🦉</Text>
          <Text style={styles.currencyText}>{formatNumber(player.currencies.owlCash)}</Text>
        </View>
        
        <TouchableOpacity style={styles.currency}>
          <Text style={styles.currencyIcon}>💎</Text>
          <Text style={styles.currencyText}>{formatNumber(player.currencies.diamonds)}</Text>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
        
        <View style={styles.currency}>
          <Text style={styles.currencyIcon}>⭐</Text>
          <Text style={styles.currencyText}>{player.currencies.celebrityPoints}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.incomeContainer}>
          <TrendingUp size={14} color={COLORS.success} />
          <Text style={styles.incomeText}>{formatNumber(player.incomePerSecond)}/s</Text>
        </View>
        
        <View style={styles.powerContainer}>
          <Zap size={14} color={player.powerUsed > player.powerCapacity ? COLORS.error : COLORS.warning} />
          <Text style={[
            styles.powerText,
            player.powerUsed > player.powerCapacity && styles.powerOverload
          ]}>
            {player.powerUsed}/{player.powerCapacity}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warmGrayLight,
  },
  leftSection: {
    flex: 1,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  xpBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  currencySection: {
    flexDirection: 'row',
    gap: 16,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
  },
  currencyIcon: {
    fontSize: 16,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  plusIcon: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  incomeText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600' as const,
  },
  powerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  powerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  powerOverload: {
    color: COLORS.error,
    fontWeight: '600' as const,
  },
});