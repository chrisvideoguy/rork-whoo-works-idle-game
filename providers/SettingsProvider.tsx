import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { GameSettings } from '@/types/game';

const SETTINGS_KEY = 'whoo_works_settings';

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<GameSettings>({
    musicEnabled: true,
    sfxEnabled: true,
    reducedMotion: false,
    batterySaver: false,
    uiScale: 1,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<GameSettings>) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettings };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)).catch(error => {
        console.error('Failed to save settings:', error);
      });
      return updated;
    });
  }, []);

  return {
    settings,
    updateSettings,
  };
});