import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { X, TrendingUp, Users, Package } from 'lucide-react-native';
import { Room } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/providers/GameProvider';
import { formatNumber } from '@/utils/format';
import { ITEM_UPGRADE_COSTS } from '@/constants/gameData';
import { CompanySelector } from '@/components/CompanySelector';

interface RoomPanelProps {
  room: Room;
}

export const RoomPanel: React.FC<RoomPanelProps> = ({ room }) => {
  const { setSelectedRoom, upgradeItem, claimHearts, currentBuilding } = useGame();
  const [showCompanySelector, setShowCompanySelector] = React.useState(false);

  const handleClose = () => {
    setSelectedRoom(null);
  };

  const getMoodIcon = (mood: string) => {
    const icons = {
      mad: '😠',
      meh: '😐',
      ok: '🙂',
      smile: '😊',
      excited: '🤩',
    };
    return icons[mood as keyof typeof icons] || '🙂';
  };

  const getAverageMood = () => {
    if (!room.company) return 'ok';
    const moods = room.company.employees.map(e => e.mood);
    const moodValues = { mad: 0, meh: 1, ok: 2, smile: 3, excited: 4 };
    const avg = moods.reduce((sum, mood) => sum + moodValues[mood], 0) / moods.length;
    const moodKeys = Object.keys(moodValues) as Array<keyof typeof moodValues>;
    return moodKeys[Math.round(avg)];
  };

  const renderItem = (itemKey: string, label: string, icon: string) => {
    const current = room.items[itemKey as keyof typeof room.items];
    const max = currentBuilding.itemCaps[itemKey as keyof typeof currentBuilding.itemCaps];
    const expected = room.company?.expectations[itemKey as keyof typeof room.company.expectations] || 0;
    const cost = ITEM_UPGRADE_COSTS[itemKey as keyof typeof ITEM_UPGRADE_COSTS]?.[current] || 0;
    const isDiamondItem = itemKey === 'pictureFrames';
    
    return (
      <View style={styles.itemRow} key={itemKey}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemIcon}>{icon}</Text>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={[
            styles.itemLevel,
            current < expected && styles.itemLevelLow
          ]}>
            {current}/{max}
          </Text>
          {expected > 0 && (
            <Text style={styles.itemExpected}>(need {expected})</Text>
          )}
        </View>
        {current < max && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => upgradeItem(room.id, itemKey as any)}
          >
            <Text style={styles.upgradeButtonText}>
              {isDiamondItem ? '💎' : '🦉'} {formatNumber(cost)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.panel} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{room.name}</Text>
              {room.company && (
                <Text style={styles.companyName}>{room.company.name}</Text>
              )}
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {room.company ? (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <TrendingUp size={16} color={COLORS.success} />
                  <Text style={styles.statLabel}>EPS</Text>
                  <Text style={styles.statValue}>{formatNumber(room.eps)}/s</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.moodIcon}>{getMoodIcon(getAverageMood())}</Text>
                  <Text style={styles.statLabel}>Mood</Text>
                  <Text style={styles.statValue}>{getAverageMood()}</Text>
                </View>
                <View style={styles.stat}>
                  <Users size={16} color={COLORS.primary} />
                  <Text style={styles.statLabel}>Employees</Text>
                  <Text style={styles.statValue}>{room.company.employees.length}</Text>
                </View>
              </View>

              <View style={styles.heartsSection}>
                <Text style={styles.sectionTitle}>Hearts Progress</Text>
                {room.company.heartTargets.map((target, index) => {
                  const heartLevel = index + 1;
                  const progress = Math.min(100, (room.company!.currentHearts / target) * 100);
                  const canClaim = room.company!.currentHearts >= target && !room.company!.completed;
                  
                  return (
                    <View key={heartLevel} style={styles.heartRow}>
                      <View style={styles.heartInfo}>
                        <Text style={styles.heartLabel}>Heart {heartLevel}</Text>
                        <Text style={styles.heartTarget}>
                          {formatNumber(Math.min(room.company!.currentHearts, target))}/{formatNumber(target)}
                        </Text>
                      </View>
                      <View style={styles.heartBarContainer}>
                        <View style={styles.heartBar}>
                          <View style={[styles.heartFill, { width: `${progress}%` }]} />
                        </View>
                        {canClaim && (
                          <TouchableOpacity
                            style={styles.claimButton}
                            onPress={() => claimHearts(room.id, heartLevel as any)}
                          >
                            <Text style={styles.claimButtonText}>Claim</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>Office Items</Text>
                {renderItem('desk', 'Desk', '🪑')}
                {renderItem('computer', 'Computer', '💻')}
                {renderItem('plant', 'Plant', '🌱')}
                {renderItem('pictureFrames', 'Frames', '🖼️')}
                {renderItem('clock', 'Clock', '🕐')}
                {renderItem('cabinet', 'Cabinet', '🗄️')}
                {renderItem('extinguisher', 'Extinguisher', '🧯')}
              </View>

              <TouchableOpacity
                style={styles.terminateButton}
                onPress={() => setShowCompanySelector(true)}
              >
                <Text style={styles.terminateButtonText}>Change Company</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.emptyContent}>
              <Package size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No company assigned</Text>
              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => setShowCompanySelector(true)}
              >
                <Text style={styles.assignButtonText}>Assign Company</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Pressable>

      {showCompanySelector && (
        <CompanySelector
          room={room}
          onClose={() => setShowCompanySelector(false)}
        />
      )}
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
    maxHeight: '80%',
    paddingBottom: 20,
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
  companyName: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  moodIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  heartsSection: {
    marginBottom: 24,
  },
  heartRow: {
    marginBottom: 12,
  },
  heartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  heartLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  heartTarget: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  heartBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartBar: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  heartFill: {
    height: '100%',
    backgroundColor: COLORS.coral,
    borderRadius: 6,
  },
  claimButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  claimButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  itemsSection: {
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemIcon: {
    fontSize: 20,
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  itemLevel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  itemLevelLow: {
    color: COLORS.error,
  },
  itemExpected: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  upgradeButton: {
    backgroundColor: COLORS.primaryPale,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: COLORS.primary,
  },
  terminateButton: {
    backgroundColor: COLORS.warmGrayLight,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  terminateButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 24,
  },
  assignButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  assignButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});