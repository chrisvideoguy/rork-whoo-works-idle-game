import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShoppingBag, Sparkles, Key, Palette, Zap, Gift } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export const ShopView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('featured');

  const tabs = [
    { id: 'featured', label: 'Featured', icon: Sparkles },
    { id: 'diamonds', label: 'Diamonds', icon: ShoppingBag },
    { id: 'keys', label: 'Keys', icon: Key },
    { id: 'cosmetics', label: 'Cosmetics', icon: Palette },
    { id: 'boosts', label: 'Boosts', icon: Zap },
    { id: 'starter', label: 'Starter', icon: Gift },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.tabBar} showsHorizontalScrollIndicator={false}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon size={16} color={activeTab === tab.id ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dailyFreebie}>
          <Text style={styles.freebieTitle}>Daily Freebie!</Text>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim 🦉 500 + 🌱</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsGrid}>
          {activeTab === 'diamonds' && (
            <>
              <TouchableOpacity style={styles.shopItem}>
                <Text style={styles.itemIcon}>💎</Text>
                <Text style={styles.itemAmount}>100</Text>
                <Text style={styles.itemPrice}>$0.99</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shopItem}>
                <Text style={styles.itemIcon}>💎</Text>
                <Text style={styles.itemAmount}>550</Text>
                <Text style={styles.itemPrice}>$4.99</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>+10%</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shopItem}>
                <Text style={styles.itemIcon}>💎</Text>
                <Text style={styles.itemAmount}>1200</Text>
                <Text style={styles.itemPrice}>$9.99</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>+20%</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shopItem}>
                <Text style={styles.itemIcon}>💎</Text>
                <Text style={styles.itemAmount}>2600</Text>
                <Text style={styles.itemPrice}>$19.99</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>+30%</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'featured' && (
            <>
              <TouchableOpacity style={[styles.shopItem, styles.featuredItem]}>
                <Text style={styles.itemTitle}>Remove Ads</Text>
                <Text style={styles.itemDescription}>Auto-claim all ad rewards</Text>
                <Text style={styles.itemPrice}>$4.99</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shopItem, styles.featuredItem]}>
                <Text style={styles.itemTitle}>Feather Pass</Text>
                <Text style={styles.itemDescription}>Premium rewards track</Text>
                <Text style={styles.itemPrice}>$9.99</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warmGrayLight,
    maxHeight: 60,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dailyFreebie: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  freebieTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  claimButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  claimButtonText: {
    color: COLORS.surface,
    fontWeight: '600' as const,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shopItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  featuredItem: {
    minWidth: '100%',
  },
  itemIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
});