import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ShoppingBag, Phone, Map, Palette, Users, Settings } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface BottomNavProps {
  activeView: string;
  onPress: (view: 'home' | 'shop' | 'phone' | 'map' | 'managers' | 'settings') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onPress }) => {
  const items = [
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'phone', icon: Phone, label: 'Tasks' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'managers', icon: Users, label: 'Managers' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => onPress(item.id as any)}
          >
            <Icon
              size={24}
              color={isActive ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[
              styles.label,
              isActive && styles.activeLabel
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.warmGrayLight,
    paddingBottom: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
});