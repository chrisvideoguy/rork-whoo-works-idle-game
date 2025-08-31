import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { Room } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';
import { COMPANIES_EASY, COMPANIES_MEDIUM, COMPANIES_HARD } from '@/constants/gameData';

interface CompanySelectorProps {
  room: Room;
  onClose: () => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({ room, onClose }) => {
  const { assignCompany, currentBuilding } = useGame();
  const [selectedTier, setSelectedTier] = useState<'easy' | 'medium' | 'hard'>('easy');

  const getAvailableCompanies = () => {
    const buildingLevel = parseInt(currentBuilding.id.replace('b', ''));
    
    if (buildingLevel === 1) return { easy: COMPANIES_EASY, medium: [], hard: [] };
    if (buildingLevel === 2) return { easy: COMPANIES_EASY, medium: COMPANIES_MEDIUM, hard: [] };
    return { easy: COMPANIES_EASY, medium: COMPANIES_MEDIUM, hard: COMPANIES_HARD };
  };

  const availableCompanies = getAvailableCompanies();
  const currentCompanies = availableCompanies[selectedTier];

  const handleSelectCompany = (companyName: string) => {
    assignCompany(room.id, companyName);
    onClose();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'easy': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'hard': return COLORS.error;
      default: return COLORS.primary;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.panel} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Company</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.tierTabs}>
            {(['easy', 'medium', 'hard'] as const).map(tier => {
              const isAvailable = availableCompanies[tier].length > 0;
              const isSelected = selectedTier === tier;
              
              return (
                <TouchableOpacity
                  key={tier}
                  style={[
                    styles.tierTab,
                    isSelected && styles.tierTabActive,
                    !isAvailable && styles.tierTabDisabled,
                  ]}
                  onPress={() => isAvailable && setSelectedTier(tier)}
                  disabled={!isAvailable}
                >
                  <Text style={[
                    styles.tierTabText,
                    isSelected && styles.tierTabTextActive,
                    !isAvailable && styles.tierTabTextDisabled,
                  ]}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Text>
                  <View style={[styles.tierDot, { backgroundColor: getTierColor(tier) }]} />
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.companiesList} showsVerticalScrollIndicator={false}>
            {currentCompanies.map(company => (
              <TouchableOpacity
                key={company}
                style={styles.companyCard}
                onPress={() => handleSelectCompany(company)}
              >
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{company}</Text>
                  <View style={styles.companyStats}>
                    <View style={[styles.tierBadge, { backgroundColor: getTierColor(selectedTier) }]}>
                      <Text style={styles.tierBadgeText}>{selectedTier}</Text>
                    </View>
                    <Text style={styles.companyRequirements}>
                      {selectedTier === 'easy' ? '💻 Lv1 🪑 Lv1' :
                       selectedTier === 'medium' ? '💻 Lv2 🪑 Lv2 🌱 Lv1' :
                       '💻 Lv3+ 🪑 Lv3+ 🌱 Lv2+'}
                    </Text>
                  </View>
                </View>
                <View style={styles.rewardPreview}>
                  <Text style={styles.rewardText}>
                    {selectedTier === 'easy' ? '💎 1-3' :
                     selectedTier === 'medium' ? '💎 2-5 ⭐ 0-3' :
                     '💎 3-8 ⭐ 0-5'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warmGrayLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  tierTabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tierTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
  },
  tierTabActive: {
    backgroundColor: COLORS.primary,
  },
  tierTabDisabled: {
    opacity: 0.5,
  },
  tierTabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  tierTabTextActive: {
    color: COLORS.surface,
  },
  tierTabTextDisabled: {
    color: COLORS.textLight,
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  companiesList: {
    flex: 1,
    padding: 16,
  },
  companyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.beige,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  companyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: COLORS.surface,
    textTransform: 'uppercase',
  },
  companyRequirements: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rewardPreview: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 14,
    color: COLORS.text,
  },
});