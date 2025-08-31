import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MessageCircle, CheckCircle, Trophy, BookOpen, Target } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export const PhoneView: React.FC = () => {
  const [activeApp, setActiveApp] = useState('tasks');

  const apps = [
    { id: 'chats', label: 'Story', icon: MessageCircle },
    { id: 'tasks', label: 'To-Dos', icon: CheckCircle },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'achievements', label: 'Achieve', icon: Trophy },
    { id: 'index', label: 'Index', icon: BookOpen },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneScreen}>
          <View style={styles.appGrid}>
            {apps.map(app => {
              const Icon = app.icon;
              return (
                <TouchableOpacity
                  key={app.id}
                  style={[styles.appIcon, activeApp === app.id && styles.activeApp]}
                  onPress={() => setActiveApp(app.id)}
                >
                  <Icon size={32} color={activeApp === app.id ? COLORS.primary : COLORS.text} />
                  <Text style={styles.appLabel}>{app.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeApp === 'tasks' && (
            <ScrollView style={styles.appContent}>
              <Text style={styles.contentTitle}>Daily To-Dos</Text>
              <View style={styles.tasksList}>
                <View style={styles.task}>
                  <CheckCircle size={20} color={COLORS.success} />
                  <Text style={styles.taskText}>Complete 3 contracts</Text>
                  <Text style={styles.taskReward}>🦉 100</Text>
                </View>
                <View style={styles.task}>
                  <CheckCircle size={20} color={COLORS.textLight} />
                  <Text style={styles.taskText}>Upgrade 5 items</Text>
                  <Text style={styles.taskReward}>💎 5</Text>
                </View>
                <View style={styles.task}>
                  <CheckCircle size={20} color={COLORS.textLight} />
                  <Text style={styles.taskText}>Reach 1000 EPS</Text>
                  <Text style={styles.taskReward}>⭐ 1</Text>
                </View>
              </View>
              
              <Text style={styles.progressText}>Daily Progress: 10/100 badges</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '10%' }]} />
              </View>
            </ScrollView>
          )}

          {activeApp === 'goals' && (
            <ScrollView style={styles.appContent}>
              <Text style={styles.contentTitle}>Weekly Goals</Text>
              <Text style={styles.progressText}>Weekly Progress: 50/350 badges</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '14%' }]} />
              </View>
              <Text style={styles.rewardText}>Next: 🌱 Décor Plant at 350 badges</Text>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: '90%',
    maxWidth: 360,
    height: '80%',
    backgroundColor: COLORS.text,
    borderRadius: 32,
    padding: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  appIcon: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.beige,
    borderRadius: 16,
  },
  activeApp: {
    backgroundColor: COLORS.primaryPale,
  },
  appLabel: {
    fontSize: 10,
    color: COLORS.text,
    marginTop: 4,
  },
  appContent: {
    flex: 1,
    padding: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 16,
  },
  tasksList: {
    gap: 12,
    marginBottom: 24,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  taskReward: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 12,
  },
});