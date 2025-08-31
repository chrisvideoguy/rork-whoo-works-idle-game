export interface Currency {
  owlCash: number;
  diamonds: number;
  celebrityPoints: number;
}

export interface Player {
  level: number;
  experience: number;
  experienceToNext: number;
  currencies: Currency;
  incomePerSecond: number;
  powerUsed: number;
  powerCapacity: number;
}

export interface ItemLevel {
  desk: number;
  computer: number;
  plant: number;
  pictureFrames: number;
  clock: number;
  cabinet: number;
  extinguisher: number;
}

export interface ItemCaps {
  desk: number;
  computer: number;
  plant: number;
  pictureFrames: number;
  clock: number;
  cabinet: number;
  extinguisher: number;
}

export type EmployeeMood = 'mad' | 'meh' | 'ok' | 'smile' | 'excited';

export interface Employee {
  id: string;
  name: string;
  role: 'dev' | 'designer' | 'analyst' | 'manager' | 'sales';
  mood: EmployeeMood;
  baseEPS: number;
  position: { x: number; y: number };
  currentActivity: 'working' | 'bathroom' | 'breakroom' | 'meeting' | 'walking';
}

export interface Company {
  id: string;
  name: string;
  tier: 'easy' | 'medium' | 'hard';
  expectations: ItemLevel;
  employees: Employee[];
  currentHearts: number;
  heartTargets: [number, number, number];
  completed: boolean;
}

export interface Room {
  id: string;
  buildingId: string;
  name: string;
  unlocked: boolean;
  company: Company | null;
  items: ItemLevel;
  manager: Manager | null;
  eps: number;
  offlineEarnings: number;
  offlineCap: number;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  unlocked: boolean;
  rooms: Room[];
  employeeCap: number;
  powerCap: number;
  itemCaps: ItemCaps;
  sharedFacilities: {
    bathroom: number;
    breakroom: number;
    meeting: number;
    server: number;
  };
}

export interface Manager {
  id: string;
  name: string;
  type: 'profit' | 'xp';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  bonus: number;
  assigned: boolean;
}

export interface CelebrityOwl {
  id: string;
  name: string;
  category: 'film' | 'music' | 'sports' | 'tech' | 'creator' | 'legend';
  auraType: 'profit' | 'morale' | 'offline';
  auraBonus: number;
  unlocked: boolean;
  cpRequired: number;
}

export interface GameState {
  player: Player;
  buildings: Building[];
  currentBuildingId: string;
  managers: Manager[];
  celebrityOwls: CelebrityOwl[];
  lastSaveTime: number;
  gameStartTime: number;
  isDayTime: boolean;
  settings: GameSettings;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  reducedMotion: boolean;
  batterySaver: boolean;
  uiScale: number;
}