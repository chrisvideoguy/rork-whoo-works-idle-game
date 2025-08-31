import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { 
  GameState, 
  Player, 
  Building, 
  Room, 
  Company,
  Manager,
  CelebrityOwl,
  Employee,
  ItemLevel,
  EmployeeMood,
} from '@/types/game';
import { 
  BUILDINGS_DATA, 
  COMPANIES_EASY,
  COMPANIES_MEDIUM,
  COMPANIES_HARD,
  BASE_EPS,
  MOOD_MULTIPLIERS,
  AREA_MULTIPLIERS,
  CELEBRITY_OWLS_DATA,
  ITEM_UPGRADE_COSTS,
  ROOM_UNLOCK_COSTS,
} from '@/constants/gameData';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const STORAGE_KEY = 'whoo_works_save';
const TICK_RATE = 1000; // ms - Slow down to 1 second

const generateEmployees = (count: number, tier: 'easy' | 'medium' | 'hard'): Employee[] => {
  const roles: Employee['role'][] = ['dev', 'designer', 'analyst', 'manager', 'sales'];
  const names = ['Hootbert', 'Owlivia', 'Featherston', 'Beaky', 'Wingston', 'Pluma'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `emp_${Date.now()}_${i}`,
    name: names[Math.floor(Math.random() * names.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    mood: 'ok' as EmployeeMood,
    baseEPS: BASE_EPS[tier],
    position: { x: Math.random() * 200, y: Math.random() * 100 },
    currentActivity: 'working' as const,
  }));
};

const calculateMood = (expectations: ItemLevel, current: ItemLevel, role: Employee['role']): EmployeeMood => {
  const weights = {
    dev: { computer: 3, desk: 2, plant: 1 },
    designer: { pictureFrames: 3, plant: 2, desk: 1 },
    analyst: { desk: 3, computer: 2, clock: 1 },
    manager: { cabinet: 3, desk: 2, computer: 1 },
    sales: { plant: 3, desk: 2, pictureFrames: 1 },
  };
  
  const roleWeights = weights[role] || weights.dev;
  let satisfaction = 0;
  let totalWeight = 0;
  
  Object.entries(roleWeights).forEach(([item, weight]) => {
    const expected = expectations[item as keyof ItemLevel] || 0;
    const actual = current[item as keyof ItemLevel] || 0;
    satisfaction += (actual >= expected ? 1 : actual / expected) * weight;
    totalWeight += weight;
  });
  
  const score = satisfaction / totalWeight;
  
  if (score >= 0.95) return 'excited';
  if (score >= 0.8) return 'smile';
  if (score >= 0.6) return 'ok';
  if (score >= 0.4) return 'meh';
  return 'mad';
};

const createInitialState = (): GameState => {
  const buildings: Building[] = BUILDINGS_DATA.map((data, index) => {
    const roomCount = index === 0 ? 2 : 0; // B1 starts with 2 rooms
    const rooms: Room[] = Array.from({ length: roomCount }, (_, i) => {
      // Add companies to the first building's rooms for demo
      let company = null;
      if (index === 0) {
        const companyNames = ['Gloogle Nest', 'Feathrbook'];
        if (i < companyNames.length) {
          company = {
            id: `company_${Date.now()}_${i}`,
            name: companyNames[i],
            tier: 'easy' as const,
            expectations: {
              desk: 1,
              computer: 1,
              plant: 0,
              pictureFrames: 0,
              clock: 0,
              cabinet: 0,
              extinguisher: 0,
            },
            employees: generateEmployees(2, 'easy'),
            currentHearts: 0,
            heartTargets: [60, 360, 2880] as [number, number, number],
            completed: false,
          };
        }
      }
      
      return {
        id: `${data.id}_room_${i}`,
        buildingId: data.id!,
        name: `Office ${i + 1}`,
        unlocked: true,
        company,
        items: {
          desk: 1,
          computer: 1,
          plant: 0,
          pictureFrames: 0,
          clock: 0,
          cabinet: 0,
          extinguisher: 0,
        },
        manager: null,
        eps: 0,
        offlineEarnings: 0,
        offlineCap: 600, // 10 minutes base
      };
    });
    
    return {
      ...data,
      rooms,
    } as Building;
  });

  return {
    player: {
      level: 1,
      experience: 0,
      experienceToNext: 100,
      currencies: {
        owlCash: 1000,
        diamonds: 50,
        celebrityPoints: 0,
      },
      incomePerSecond: 0,
      powerUsed: 0,
      powerCapacity: 30,
    },
    buildings,
    currentBuildingId: 'b1',
    managers: [],
    celebrityOwls: CELEBRITY_OWLS_DATA.map((data, i) => ({
      ...data,
      id: `celeb_${i}`,
      unlocked: false,
    } as CelebrityOwl)),
    lastSaveTime: Date.now(),
    gameStartTime: Date.now(),
    isDayTime: true,
    settings: {
      musicEnabled: true,
      sfxEnabled: true,
      reducedMotion: false,
      batterySaver: false,
      uiScale: 1,
    },
  };
};

export const [GameProvider, useGame] = createContextHook(() => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [tickCounter, setTickCounter] = useState(0);

  // Load saved game
  useEffect(() => {
    const loadGame = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as GameState;
          const timeDiff = Date.now() - parsed.lastSaveTime;
          const offlineSeconds = Math.min(timeDiff / 1000, 7200); // Max 2 hours offline
          
          // Calculate offline earnings
          let totalOfflineEarnings = 0;
          parsed.buildings.forEach(building => {
            building.rooms.forEach(room => {
              if (room.company) {
                const offlineEarned = Math.min(
                  room.eps * offlineSeconds,
                  room.offlineCap
                );
                totalOfflineEarnings += offlineEarned;
              }
            });
          });
          
          parsed.player.currencies.owlCash += Math.floor(totalOfflineEarnings);
          parsed.lastSaveTime = Date.now();
          setGameState(parsed);
        }
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    };
    loadGame();
  }, []);

  // Auto-save
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameStateRef.current));
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    }, 5000);
    
    return () => clearInterval(saveInterval);
  }, []);

  // Game tick
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTickCounter(prev => prev + 1);
    }, TICK_RATE);
    
    return () => clearInterval(tickInterval);
  }, []);

  // Update income and earnings
  useEffect(() => {
    if (tickCounter === 0) return; // Skip first tick
    
    console.log('Game tick:', tickCounter);
    
    setGameState(prev => {
      // Quick check - if no rooms have companies, skip processing
      const hasActiveRooms = prev.buildings.some(b => b.rooms.some(r => r.company));
      if (!hasActiveRooms) {
        console.log('No active rooms, skipping tick');
        return prev;
      }
      
      let totalIncome = 0;
      let totalPower = 0;
      let needsUpdate = false;
      
      // Calculate totals and check for changes
      const updatedBuildings = prev.buildings.map(building => {
        const updatedRooms = building.rooms.map(room => {
          if (!room.company) return room;
          
          let roomEPS = 0;
          const updatedEmployees = room.company.employees.map(emp => {
            const newMood = calculateMood(room.company!.expectations, room.items, emp.role);
            const moodMultiplier = MOOD_MULTIPLIERS[newMood];
            const areaMultiplier = AREA_MULTIPLIERS[building.id as keyof typeof AREA_MULTIPLIERS] || 1;
            const managerBonus = room.manager ? (1 + room.manager.bonus / 100) : 1;
            roomEPS += emp.baseEPS * moodMultiplier * areaMultiplier * managerBonus;
            
            if (newMood !== emp.mood) {
              needsUpdate = true;
              return { ...emp, mood: newMood };
            }
            return emp;
          });
          
          totalIncome += roomEPS;
          totalPower += room.company.employees.length * 2 + room.items.computer;
          
          const heartsEarned = room.company.currentHearts + (roomEPS * TICK_RATE / 1000);
          
          // Check if room needs update (use larger threshold to prevent micro-updates)
          if (Math.abs(room.eps - roomEPS) > 0.1 || 
              Math.abs(room.company.currentHearts - heartsEarned) > 0.1) {
            needsUpdate = true;
          }
          
          return {
            ...room,
            eps: Math.round(roomEPS * 10) / 10, // Round to prevent floating point issues
            company: {
              ...room.company,
              employees: updatedEmployees,
              currentHearts: Math.round(heartsEarned * 10) / 10,
            },
          };
        });
        
        return {
          ...building,
          rooms: updatedRooms,
        };
      });
      
      // Check for player changes (use larger thresholds)
      const cashEarned = totalIncome * TICK_RATE / 1000;
      const incomeChanged = Math.abs(prev.player.incomePerSecond - totalIncome) > 0.1;
      const powerChanged = prev.player.powerUsed !== totalPower;
      const cashChanged = cashEarned >= 0.1;
      
      if (incomeChanged || powerChanged || cashChanged) {
        needsUpdate = true;
      }
      
      // Only update state if there are actual changes
      if (!needsUpdate) {
        return prev;
      }
      
      console.log('Changes detected, updating state');
      
      return {
        ...prev,
        buildings: updatedBuildings,
        player: {
          ...prev.player,
          currencies: {
            ...prev.player.currencies,
            owlCash: Math.round((prev.player.currencies.owlCash + cashEarned) * 10) / 10,
          },
          incomePerSecond: Math.round(totalIncome * 10) / 10,
          powerUsed: totalPower,
        },
      };
    });
  }, [tickCounter]);

  const currentBuilding = useMemo(
    () => gameState.buildings.find(b => b.id === gameState.currentBuildingId)!,
    [gameState.buildings, gameState.currentBuildingId]
  );

  const assignCompany = useCallback((roomId: string, companyName: string) => {
    setGameState(prev => {
      const tier = COMPANIES_EASY.includes(companyName) ? 'easy' :
                   COMPANIES_MEDIUM.includes(companyName) ? 'medium' : 'hard';
      
      const building = prev.buildings.find(b => b.id === prev.currentBuildingId);
      if (!building) return prev;
      
      const newCompany: Company = {
        id: `company_${Date.now()}`,
        name: companyName,
        tier,
        expectations: {
          desk: tier === 'easy' ? 1 : tier === 'medium' ? 2 : 3,
          computer: tier === 'easy' ? 1 : tier === 'medium' ? 2 : 3,
          plant: tier === 'easy' ? 0 : tier === 'medium' ? 1 : 2,
          pictureFrames: 0,
          clock: tier === 'hard' ? 1 : 0,
          cabinet: tier === 'hard' ? 1 : 0,
          extinguisher: tier === 'hard' ? 1 : 0,
        },
        employees: generateEmployees(building.employeeCap, tier),
        currentHearts: 0,
        heartTargets: [60, 360, 2880] as [number, number, number], // Simplified for now
        completed: false,
      };
      
      const updatedBuildings = prev.buildings.map(building => ({
        ...building,
        rooms: building.rooms.map(room =>
          room.id === roomId ? { ...room, company: newCompany } : room
        ),
      }));
      
      return {
        ...prev,
        buildings: updatedBuildings,
      };
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const upgradeItem = useCallback((roomId: string, itemType: keyof ItemLevel) => {
    setGameState(prev => {
      const room = prev.buildings
        .flatMap(b => b.rooms)
        .find(r => r.id === roomId);
      
      if (!room) return prev;
      
      const building = prev.buildings.find(b => b.id === prev.currentBuildingId);
      if (!building) return prev;
      
      const currentLevel = room.items[itemType];
      const maxLevel = building.itemCaps[itemType];
      
      if (currentLevel >= maxLevel) return prev;
      
      const cost = ITEM_UPGRADE_COSTS[itemType]?.[currentLevel] || 0;
      const isDiamondItem = itemType === 'pictureFrames';
      
      if (isDiamondItem) {
        if (prev.player.currencies.diamonds < cost) return prev;
      } else {
        if (prev.player.currencies.owlCash < cost) return prev;
      }
      
      const updatedBuildings = prev.buildings.map(building => ({
        ...building,
        rooms: building.rooms.map(r =>
          r.id === roomId
            ? {
                ...r,
                items: {
                  ...r.items,
                  [itemType]: currentLevel + 1,
                },
              }
            : r
        ),
      }));
      
      return {
        ...prev,
        buildings: updatedBuildings,
        player: {
          ...prev.player,
          currencies: {
            ...prev.player.currencies,
            [isDiamondItem ? 'diamonds' : 'owlCash']:
              prev.player.currencies[isDiamondItem ? 'diamonds' : 'owlCash'] - cost,
          },
        },
      };
    });
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const unlockRoom = useCallback((buildingId: string) => {
    setGameState(prev => {
      const building = prev.buildings.find(b => b.id === buildingId);
      if (!building) return prev;
      
      const unlockedCount = building.rooms.length;
      const costs = ROOM_UNLOCK_COSTS[buildingId as keyof typeof ROOM_UNLOCK_COSTS];
      const cost = costs?.[unlockedCount] || 0;
      
      if (prev.player.currencies.owlCash < cost) return prev;
      
      const newRoom: Room = {
        id: `${buildingId}_room_${unlockedCount}`,
        buildingId,
        name: `Office ${unlockedCount + 1}`,
        unlocked: true,
        company: null,
        items: {
          desk: 1,
          computer: 1,
          plant: 0,
          pictureFrames: 0,
          clock: 0,
          cabinet: 0,
          extinguisher: 0,
        },
        manager: null,
        eps: 0,
        offlineEarnings: 0,
        offlineCap: 600,
      };
      
      const updatedBuildings = prev.buildings.map(b =>
        b.id === buildingId
          ? { ...b, rooms: [...b.rooms, newRoom] }
          : b
      );
      
      return {
        ...prev,
        buildings: updatedBuildings,
        player: {
          ...prev.player,
          currencies: {
            ...prev.player.currencies,
            owlCash: prev.player.currencies.owlCash - cost,
          },
        },
      };
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const claimHearts = useCallback((roomId: string, heartLevel: 1 | 2 | 3) => {
    setGameState(prev => {
      const room = prev.buildings
        .flatMap(b => b.rooms)
        .find(r => r.id === roomId);
      
      if (!room?.company) return prev;
      
      const rewards = {
        easy: { 1: { diamonds: 1, cp: 0 }, 2: { diamonds: 2, cp: 1 }, 3: { diamonds: 3, cp: 2 } },
        medium: { 1: { diamonds: 2, cp: 0 }, 2: { diamonds: 3, cp: 2 }, 3: { diamonds: 5, cp: 3 } },
        hard: { 1: { diamonds: 3, cp: 0 }, 2: { diamonds: 5, cp: 3 }, 3: { diamonds: 8, cp: 5 } },
      };
      
      const reward = rewards[room.company.tier][heartLevel];
      
      const updatedBuildings = prev.buildings.map(building => ({
        ...building,
        rooms: building.rooms.map(r =>
          r.id === roomId && r.company
            ? {
                ...r,
                company: {
                  ...r.company,
                  completed: heartLevel === 3,
                },
              }
            : r
        ),
      }));
      
      return {
        ...prev,
        buildings: updatedBuildings,
        player: {
          ...prev.player,
          currencies: {
            ...prev.player.currencies,
            diamonds: prev.player.currencies.diamonds + reward.diamonds,
            celebrityPoints: prev.player.currencies.celebrityPoints + reward.cp,
          },
          experience: prev.player.experience + heartLevel * 10,
        },
      };
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  return {
    gameState,
    currentBuilding,
    selectedRoom,
    setSelectedRoom,
    assignCompany,
    upgradeItem,
    unlockRoom,
    claimHearts,
  };
});