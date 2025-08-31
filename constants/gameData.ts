import { Company, Building, ItemCaps, CelebrityOwl } from '@/types/game';

export const MOOD_MULTIPLIERS = {
  mad: 0.5,
  meh: 1.0,
  ok: 1.2,
  smile: 1.4,
  excited: 1.6,
};

export const BASE_EPS = {
  easy: 4,
  medium: 7,
  hard: 12,
};

export const AREA_MULTIPLIERS = {
  b1: 1.00,
  b2: 1.15,
  b3: 1.35,
  b4: 1.60,
  b5: 1.90,
};

export const BUILDINGS_DATA: Partial<Building>[] = [
  {
    id: 'b1',
    name: 'Starter Perch Plaza',
    level: 1,
    unlocked: true,
    employeeCap: 2,
    powerCap: 30,
    itemCaps: {
      desk: 2,
      computer: 2,
      plant: 2,
      clock: 1,
      cabinet: 1,
      extinguisher: 1,
      pictureFrames: 1,
    },
    sharedFacilities: {
      bathroom: 1,
      breakroom: 0,
      meeting: 0,
      server: 0,
    },
  },
  {
    id: 'b2',
    name: 'Open Nest Annex',
    level: 8,
    unlocked: false,
    employeeCap: 3,
    powerCap: 80,
    itemCaps: {
      desk: 3,
      computer: 3,
      plant: 3,
      clock: 2,
      cabinet: 2,
      extinguisher: 1,
      pictureFrames: 2,
    },
    sharedFacilities: {
      bathroom: 2,
      breakroom: 0,
      meeting: 1,
      server: 0,
    },
  },
  {
    id: 'b3',
    name: 'Glass Hollow Tower',
    level: 18,
    unlocked: false,
    employeeCap: 4,
    powerCap: 180,
    itemCaps: {
      desk: 4,
      computer: 4,
      plant: 4,
      clock: 3,
      cabinet: 3,
      extinguisher: 2,
      pictureFrames: 3,
    },
    sharedFacilities: {
      bathroom: 3,
      breakroom: 1,
      meeting: 2,
      server: 1,
    },
  },
  {
    id: 'b4',
    name: 'Skyline Aerie Hub',
    level: 30,
    unlocked: false,
    employeeCap: 5,
    powerCap: 400,
    itemCaps: {
      desk: 5,
      computer: 5,
      plant: 5,
      clock: 4,
      cabinet: 4,
      extinguisher: 3,
      pictureFrames: 4,
    },
    sharedFacilities: {
      bathroom: 4,
      breakroom: 2,
      meeting: 3,
      server: 2,
    },
  },
  {
    id: 'b5',
    name: 'Cloud Spire HQ',
    level: 45,
    unlocked: false,
    employeeCap: 6,
    powerCap: 800,
    itemCaps: {
      desk: 6,
      computer: 6,
      plant: 6,
      clock: 5,
      cabinet: 5,
      extinguisher: 4,
      pictureFrames: 5,
    },
    sharedFacilities: {
      bathroom: 5,
      breakroom: 3,
      meeting: 4,
      server: 3,
    },
  },
];

export const COMPANIES_EASY = [
  'Gloogle Nest', 'Feathrbook', 'HootTube', 'AmaNest', 'SnapHoot',
  'WingTok', 'StreamPrime', 'CozyFlix', 'Chirpr', 'Cloudpuff',
  'HootBucks', 'OwlFoods', 'NestDash', 'Pizz-Owl-Go', 'Scrollify',
  'PlayPerch', 'ByteNook', 'OwlDepot', 'PetPerch', 'FitFeather',
  'SleepyNest', 'RideAlong Owls', 'SunnyStay', 'PicPlume', 'Maplet',
  'SafeNest', 'QuickQuill', 'OwlAir', 'BudgetBeak', 'GreenWing Energy',
];

export const COMPANIES_MEDIUM = [
  'Owldobe', 'MetaWing Labs', 'Hootflix Studios', 'Prime Pantry Perch', 'Owlbnb',
  'NorthWing', 'Silver Sparrow', 'Urban Burrow', 'AeroFeather', 'Owlta',
  'Owlgreens', 'FeatherFresh', 'TruNest Insurance', 'OwlayPal', 'BeakBook Capital',
  'WingComm', 'NestCloud', 'Owlfinity Ward', 'Riot Roost', 'CozyCart',
  'HyperHollow', 'BrightBeak Solar', 'SwiftMeals', 'Owlhouse Cinema', 'PlushPerch',
  'Owl AutoMart', 'Feather Freight', 'PaperPlane Labs', 'QuietQuarry', 'BeaconBank',
];

export const COMPANIES_HARD = [
  'Owlsla', 'Hootermelon', 'AerieLink', 'TitanWing Motors', 'PlumeX',
  'OwlyFans Pro', 'NestNet Ultra', 'WardenFeather', 'Quill & Sachs', 'Bronzed Beak',
  'SkyVault', 'HootStreet', 'Apex Owls', 'NightWatch AI', 'TalonWorks',
  'Owlsoft Azurea', 'Resonest Studios', 'PlumeGate', 'VantaFeather', 'MonoliNest',
  'NeroNest', 'ZephyrWing', 'FableFeather', 'NovaNest', 'OmniPerch',
  'GoldLeaf Group', 'Quasar Quill', 'Orium Owls', 'HarborHollow', 'Summit & Talon',
];

export const CELEBRITY_OWLS_DATA: Partial<CelebrityOwl>[] = [
  { name: 'Hoot Jackman', category: 'film', auraType: 'profit', auraBonus: 5, cpRequired: 10 },
  { name: 'Meryl Hootreep', category: 'film', auraType: 'morale', auraBonus: 6, cpRequired: 15 },
  { name: 'Zend-owl-ya', category: 'film', auraType: 'offline', auraBonus: 4, cpRequired: 8 },
  { name: 'Tay-Hoot Swift', category: 'music', auraType: 'profit', auraBonus: 8, cpRequired: 20 },
  { name: 'Rih-owl-na', category: 'music', auraType: 'morale', auraBonus: 7, cpRequired: 18 },
  { name: 'LeHoot James', category: 'sports', auraType: 'profit', auraBonus: 10, cpRequired: 25 },
  { name: 'Owlen Musk', category: 'tech', auraType: 'offline', auraBonus: 9, cpRequired: 30 },
  { name: 'Mr. Beast-owl', category: 'creator', auraType: 'profit', auraBonus: 7, cpRequired: 12 },
];

export const ITEM_UPGRADE_COSTS = {
  desk: [100, 250, 500, 1000, 2500, 5000],
  computer: [150, 350, 750, 1500, 3500, 7500],
  plant: [50, 125, 250, 500, 1250, 2500],
  clock: [200, 500, 1000, 2000, 5000, 10000],
  cabinet: [175, 425, 850, 1700, 4250, 8500],
  extinguisher: [300, 750, 1500, 3000, 7500, 15000],
  pictureFrames: [10, 25, 50, 100, 250, 500], // Diamonds
};

export const ROOM_UNLOCK_COSTS = {
  b1: [0, 0, 1000, 2500],
  b2: [0, 0, 5000, 10000, 15000, 25000],
  b3: [0, 0, 30000, 45000, 60000, 85000, 120000, 160000],
  b4: [0, 0, 220000, 300000, 400000, 520000, 680000, 880000, 1100000, 1400000],
  b5: [0, 0, 1800000, 2400000, 3200000, 4200000, 5600000, 7400000, 9800000, 12800000, 16600000, 21600000],
};