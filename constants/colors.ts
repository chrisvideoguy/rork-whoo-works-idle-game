export const COLORS = {
  // Primary palette - Teal & warm neutrals (updated to spec)
  primary: '#1C8C86', // Primary Teal
  primaryDark: '#0F766E',
  primaryLight: '#5EEAD4',
  primaryPale: '#CCFBF1',
  mintCerulean: '#D6F4EF', // Mint Floor
  
  // Warm neutrals
  warmGray: '#E8E1DB', // Warm Greige Wall
  warmGrayLight: '#D6D3D1',
  warmGrayDark: '#44403C',
  cream: '#FEF3C7',
  beige: '#F5F5F4',
  
  // Accent colors
  gold: '#FCD34D',
  goldDark: '#F59E0B',
  coral: '#F26C6C', // Accent Coral from spec
  purple: '#C084FC',
  
  // Slate Shadow
  slateShadow: '#2B3A40',
  
  // UI colors
  background: '#FAFAF9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1C1917',
  textSecondary: '#78716C',
  textLight: '#A8A29E',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Sky gradient colors
  skyDay: '#87CEEB',
  skyDayLight: '#E0F2FE',
  skySunset: '#FED7AA',
  skySunsetDark: '#EA580C',
  skyNight: '#1E293B',
  skyNightLight: '#475569',
  
  // Shadows
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Mood colors
  moodMad: '#EF4444',
  moodMeh: '#F59E0B',
  moodOk: '#FCD34D',
  moodSmile: '#10B981',
  moodExcited: '#14B8A6',
  
  // Heart colors from spec
  heartGreen: '#4CCB8E',
  heartAmber: '#FFC45A',
  heartPink: '#FF8AB4',
};

export const GRADIENTS = {
  primary: [COLORS.primary, COLORS.primaryDark],
  warm: [COLORS.cream, COLORS.beige],
  sky: [COLORS.skyDay, COLORS.skyDayLight],
  sunset: [COLORS.skySunset, COLORS.skySunsetDark],
  night: [COLORS.skyNight, COLORS.skyNightLight],
  gold: [COLORS.gold, COLORS.goldDark],
};