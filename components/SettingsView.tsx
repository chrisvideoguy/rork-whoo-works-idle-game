import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';

import { Volume2, Music, Battery, Smartphone, Globe, Cloud, HelpCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useSettings } from '@/providers/SettingsProvider';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Music size={20} color={COLORS.text} />
            <Text style={styles.settingLabel}>Music</Text>
          </View>
          <Switch
            value={settings.musicEnabled}
            onValueChange={(value) => updateSettings({ musicEnabled: value })}
            trackColor={{ false: COLORS.warmGrayLight, true: COLORS.primary }}
            thumbColor={COLORS.surface}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Volume2 size={20} color={COLORS.text} />
            <Text style={styles.settingLabel}>Sound Effects</Text>
          </View>
          <Switch
            value={settings.sfxEnabled}
            onValueChange={(value) => updateSettings({ sfxEnabled: value })}
            trackColor={{ false: COLORS.warmGrayLight, true: COLORS.primary }}
            thumbColor={COLORS.surface}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        
        <View style={styles.settingColumn}>
          <View style={styles.settingInfo}>
            <Smartphone size={20} color={COLORS.text} />
            <Text style={styles.settingLabel}>UI Scale</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>Small</Text>
            <View style={styles.customSlider}>
              <View 
                style={[
                  styles.sliderTrack,
                  { width: `${((settings.uiScale - 0.8) / (1.2 - 0.8)) * 100}%` }
                ]} 
              />
              <TouchableOpacity 
                style={[
                  styles.sliderThumb,
                  { left: `${((settings.uiScale - 0.8) / (1.2 - 0.8)) * 100}%` }
                ]}
                onPress={() => {
                  // Cycle between small, medium, large
                  const newValue = settings.uiScale <= 0.9 ? 1.0 : settings.uiScale <= 1.0 ? 1.2 : 0.8;
                  updateSettings({ uiScale: newValue });
                }}
              />
            </View>
            <Text style={styles.sliderValue}>Large</Text>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Battery size={20} color={COLORS.text} />
            <Text style={styles.settingLabel}>Battery Saver (30fps)</Text>
          </View>
          <Switch
            value={settings.batterySaver}
            onValueChange={(value) => updateSettings({ batterySaver: value })}
            trackColor={{ false: COLORS.warmGrayLight, true: COLORS.primary }}
            thumbColor={COLORS.surface}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Globe size={20} color={COLORS.text} />
            <Text style={styles.settingLabel}>Reduced Motion</Text>
          </View>
          <Switch
            value={settings.reducedMotion}
            onValueChange={(value) => updateSettings({ reducedMotion: value })}
            trackColor={{ false: COLORS.warmGrayLight, true: COLORS.primary }}
            thumbColor={COLORS.surface}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.button}>
          <Cloud size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>Cloud Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <HelpCircle size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>Support</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Whoo Works v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 Owl Studios</Text>
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
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingColumn: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  customSlider: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.warmGrayLight,
    borderRadius: 10,
    marginHorizontal: 8,
    position: 'relative',
  },
  sliderTrack: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  sliderThumb: {
    position: 'absolute',
    top: -2,
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginLeft: -12,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  sliderValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },

});