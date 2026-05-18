// ============================================================
// VOID SYSTEM — constants.js
// System Constants | Configuration Values | Fixed Data
// ============================================================

// ─────────────────────────────────────────────
// XP & PROGRESSION CONSTANTS
// ─────────────────────────────────────────────

export const XP_CONSTANTS = {
  // Base XP values for actions
  SET_COMPLETE: 10,
  EXERCISE_COMPLETE: 25,
  WORKOUT_COMPLETE: 100,
  BONUS_ALL_SETS: 15,

  // Quest rewards (base multipliers)
  QUEST_EASY: 100,
  QUEST_MEDIUM: 250,
  QUEST_HARD: 500,
  QUEST_BRUTAL: 1000,
  QUEST_LEGENDARY: 2500,

  // Streak bonuses
  STREAK_MULTIPLIER: 0.1,  // 10% per day
  MAX_STREAK_BONUS: 0.5,   // Cap at 50%

  // Level curve
  BASE_XP: 100,
  XP_EXPONENT: 1.5,
};

// ─────────────────────────────────────────────
// RANK SYSTEM
// ─────────────────────────────────────────────

export const RANKS = {
  E: {
    name: 'E-Rank',
    label: 'E',
    minLevel: 1,
    maxLevel: 9,
    color: '#888888',
    glyph: '○',
    description: 'Novice hunter. The beginning of your journey.',
  },
  D: {
    name: 'D-Rank',
    label: 'D',
    minLevel: 10,
    maxLevel: 19,
    color: '#88aa44',
    glyph: '△',
    description: 'Competent hunter. You have proven basic capability.',
  },
  C: {
    name: 'C-Rank',
    label: 'C',
    minLevel: 20,
    maxLevel: 34,
    color: '#44aaff',
    glyph: '◇',
    description: 'Skilled hunter. Above average strength.',
  },
  B: {
    name: 'B-Rank',
    label: 'B',
    minLevel: 35,
    maxLevel: 49,
    color: '#aa44ff',
    glyph: '◆',
    description: 'Elite hunter. Exceptional combat ability.',
  },
  A: {
    name: 'A-Rank',
    label: 'A',
    minLevel: 50,
    maxLevel: 74,
    color: '#ff8844',
    glyph: '★',
    description: 'Master hunter. Among the strongest.',
  },
  S: {
    name: 'S-Rank',
    label: 'S',
    minLevel: 75,
    maxLevel: 999,
    color: '#ff4466',
    glyph: '✦',
    description: 'Legendary hunter. Peak of human capability.',
  },
};

// ─────────────────────────────────────────────
// DIFFICULTY LEVELS
// ─────────────────────────────────────────────

export const DIFFICULTY = {
  EASY: {
    label: 'EASY',
    color: '#44ffaa',
    glyph: '●',
    multiplier: 1,
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: '#44aaff',
    glyph: '◆',
    multiplier: 1.5,
  },
  HARD: {
    label: 'HARD',
    color: '#ffaa44',
    glyph: '▲',
    multiplier: 2,
  },
  BRUTAL: {
    label: 'BRUTAL',
    color: '#ff4466',
    glyph: '✦',
    multiplier: 3,
  },
  LEGENDARY: {
    label: 'LEGENDARY',
    color: '#aa44ff',
    glyph: '★',
    multiplier: 5,
  },
};

// ─────────────────────────────────────────────
// WORKOUT TYPES
// ─────────────────────────────────────────────

export const WORKOUT_TYPES = {
  PUSH: {
    id: 'push',
    label: 'PUSH',
    color: '#ff4444',
    glyph: '▲',
    description: 'Chest · Shoulders · Triceps',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
  },
  PULL: {
    id: 'pull',
    label: 'PULL',
    color: '#4488ff',
    glyph: '▼',
    description: 'Back · Biceps · Rear Delts',
    muscleGroups: ['back', 'biceps', 'rear-delts'],
  },
  LEGS: {
    id: 'legs',
    label: 'LEGS',
    color: '#aa44ff',
    glyph: '◆',
    description: 'Quads · Hamstrings · Glutes · Calves',
    muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
  },
  FULL_BODY: {
    id: 'fullBody',
    label: 'FULL BODY',
    color: '#44ffaa',
    glyph: '✦',
    description: 'Compound · Multi-Muscle',
    muscleGroups: ['full-body'],
  },
  CARDIO: {
    id: 'cardio',
    label: 'CARDIO',
    color: '#ffaa44',
    glyph: '◉',
    description: 'Endurance · Heart Rate · Burn',
    muscleGroups: ['cardiovascular'],
  },
  CUSTOM: {
    id: 'custom',
    label: 'CUSTOM',
    color: '#ffffff',
    glyph: '★',
    description: 'Your own protocol',
    muscleGroups: ['custom'],
  },
};

// ─────────────────────────────────────────────
// QUEST CATEGORIES
// ─────────────────────────────────────────────

export const QUEST_CATEGORIES = {
  PHYSICAL: {
    id: 'physical',
    label: 'PHYSICAL',
    color: '#ff4444',
    description: 'Strength and physical prowess',
  },
  ENDURANCE: {
    id: 'endurance',
    label: 'ENDURANCE',
    color: '#44aaff',
    description: 'Long-term commitment and stamina',
  },
  DISCIPLINE: {
    id: 'discipline',
    label: 'DISCIPLINE',
    color: '#aa44ff',
    description: 'Consistency and willpower',
  },
  PROGRESSION: {
    id: 'progression',
    label: 'PROGRESSION',
    color: '#44ffaa',
    description: 'Level and rank advancement',
  },
  HIDDEN: {
    id: 'hidden',
    label: 'HIDDEN',
    color: '#ffaa44',
    description: 'Secret challenges',
  },
  SPECIAL: {
    id: 'special',
    label: 'SPECIAL',
    color: '#ffffff',
    description: 'Unique and time-limited events',
  },
};

// ─────────────────────────────────────────────
// ACHIEVEMENT TIERS
// ─────────────────────────────────────────────

export const ACHIEVEMENT_TIERS = {
  BRONZE: {
    label: 'BRONZE',
    color: '#cd7f32',
    glyph: '●',
  },
  SILVER: {
    label: 'SILVER',
    color: '#c0c0c0',
    glyph: '◆',
  },
  GOLD: {
    label: 'GOLD',
    color: '#ffd700',
    glyph: '★',
  },
  PLATINUM: {
    label: 'PLATINUM',
    color: '#e5e4e2',
    glyph: '✦',
  },
  LEGENDARY: {
    label: 'LEGENDARY',
    color: '#aa44ff',
    glyph: '✪',
  },
};

// ─────────────────────────────────────────────
// STAT TYPES
// ─────────────────────────────────────────────

export const STATS = {
  STRENGTH: {
    id: 'strength',
    label: 'Strength',
    shortLabel: 'STR',
    icon: '💪',
    description: 'Raw physical power',
  },
  ENDURANCE: {
    id: 'endurance',
    label: 'Endurance',
    shortLabel: 'END',
    icon: '🏃',
    description: 'Stamina and resilience',
  },
  AGILITY: {
    id: 'agility',
    label: 'Agility',
    shortLabel: 'AGI',
    icon: '⚡',
    description: 'Speed and flexibility',
  },
  INTELLIGENCE: {
    id: 'intelligence',
    label: 'Intelligence',
    shortLabel: 'INT',
    icon: '🧠',
    description: 'Mental acuity and strategy',
  },
  WILLPOWER: {
    id: 'willpower',
    label: 'Willpower',
    shortLabel: 'WILL',
    icon: '🔥',
    description: 'Discipline and determination',
  },
};

// ─────────────────────────────────────────────
// NOTIFICATION TYPES
// ─────────────────────────────────────────────

export const NOTIFICATION_TYPES = {
  SUCCESS: {
    type: 'success',
    color: '#44ffaa',
    icon: '✓',
  },
  ERROR: {
    type: 'error',
    color: '#ff4466',
    icon: '✗',
  },
  WARNING: {
    type: 'warning',
    color: '#ffaa44',
    icon: '⚠',
  },
  INFO: {
    type: 'info',
    color: '#44aaff',
    icon: 'ℹ',
  },
  LEVEL_UP: {
    type: 'level-up',
    color: '#7b5cfa',
    icon: '↑',
  },
  QUEST_COMPLETE: {
    type: 'quest-complete',
    color: '#44ffaa',
    icon: '✦',
  },
  ACHIEVEMENT: {
    type: 'achievement',
    color: '#ffd700',
    icon: '★',
  },
  STREAK_WARNING: {
    type: 'streak-warning',
    color: '#ff8844',
    icon: '🔥',
  },
};

// ─────────────────────────────────────────────
// TIME CONSTANTS
// ─────────────────────────────────────────────

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// ─────────────────────────────────────────────
// UI ANIMATION DURATIONS
// ─────────────────────────────────────────────

export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
  TYPING_SPEED: 40,
};

// ─────────────────────────────────────────────
// LIMITS & THRESHOLDS
// ─────────────────────────────────────────────

export const LIMITS = {
  MAX_ACTIVE_QUESTS: 10,
  MAX_STREAK_DAYS: 365,
  MAX_LEVEL: 100,
  MAX_STAT_VALUE: 100,
  MAX_WORKOUT_DURATION: 4 * 60 * 60, // 4 hours in seconds
  MIN_WORKOUT_DURATION: 60, // 1 minute
  MAX_EXERCISES_PER_WORKOUT: 20,
  MAX_SETS_PER_EXERCISE: 10,
};

// ─────────────────────────────────────────────
// REJECTION & BAN CONFIG
// ─────────────────────────────────────────────

export const SYSTEM_ACCESS = {
  MAX_REJECTIONS: 3,
  REJECTION_WARNING_AT: 2,
  BAN_ON_REJECTION: 3,
};

// ─────────────────────────────────────────────
// DEFAULT PLAYER STATS
// ─────────────────────────────────────────────

export const DEFAULT_STATS = {
  STARTING_STAT_VALUE: 10,
  STAT_INCREASE_PER_5_LEVELS: 1,
};

// ─────────────────────────────────────────────
// BMI CATEGORIES
// ─────────────────────────────────────────────

export const BMI_CATEGORIES = {
  UNDERWEIGHT: {
    label: 'Underweight',
    min: 0,
    max: 18.5,
    color: '#44aaff',
  },
  NORMAL: {
    label: 'Normal Weight',
    min: 18.5,
    max: 24.9,
    color: '#44ffaa',
  },
  OVERWEIGHT: {
    label: 'Overweight',
    min: 25,
    max: 29.9,
    color: '#ffaa44',
  },
  OBESE: {
    label: 'Obese',
    min: 30,
    max: 999,
    color: '#ff4466',
  },
};

// ─────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────

export const STORAGE_KEYS = {
  PLAYER_DATA: 'VOID_SYSTEM_PLAYER_DATA',
  SETTINGS: 'VOID_SYSTEM_SETTINGS',
  TEMP_DATA: 'VOID_SYSTEM_TEMP',
};

// ─────────────────────────────────────────────
// API ENDPOINTS (FUTURE)
// ─────────────────────────────────────────────

export const API_ENDPOINTS = {
  BASE_URL: '/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PLAYER: {
    GET: '/player',
    UPDATE: '/player/update',
    STATS: '/player/stats',
  },
  WORKOUTS: {
    LIST: '/workouts',
    CREATE: '/workouts/create',
    GET: '/workouts/:id',
  },
  QUESTS: {
    LIST: '/quests',
    ACCEPT: '/quests/accept',
    COMPLETE: '/quests/complete',
  },
  LEADERBOARD: {
    GLOBAL: '/leaderboard/global',
    FRIENDS: '/leaderboard/friends',
  },
};

// ─────────────────────────────────────────────
// ERROR MESSAGES
// ─────────────────────────────────────────────

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please try again.',
  SAVE_FAILED: 'Failed to save progress. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please refresh the page.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  QUEST_NOT_FOUND: 'Quest not found.',
  WORKOUT_NOT_FOUND: 'Workout not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  LEVEL_REQUIREMENT: 'Level requirement not met.',
  ALREADY_COMPLETED: 'Already completed.',
};

// ─────────────────────────────────────────────
// SUCCESS MESSAGES
// ─────────────────────────────────────────────

export const SUCCESS_MESSAGES = {
  WORKOUT_COMPLETE: 'WORKOUT COMPLETE — XP AWARDED',
  QUEST_ACCEPTED: 'QUEST ACCEPTED',
  QUEST_COMPLETE: 'QUEST COMPLETE',
  LEVEL_UP: 'LEVEL UP',
  RANK_UP: 'RANK PROMOTION',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT UNLOCKED',
  TITLE_UNLOCKED: 'TITLE UNLOCKED',
  SAVE_SUCCESS: 'Progress saved successfully.',
};

// ─────────────────────────────────────────────
// SOUND EFFECTS (FUTURE)
// ─────────────────────────────────────────────

export const SOUNDS = {
  LEVEL_UP: '/sounds/levelup.mp3',
  QUEST_COMPLETE: '/sounds/quest-complete.mp3',
  ACHIEVEMENT: '/sounds/achievement.mp3',
  NOTIFICATION: '/sounds/notification.mp3',
  WARNING: '/sounds/warning.mp3',
  BUTTON_CLICK: '/sounds/click.mp3',
  ERROR: '/sounds/error.mp3',
};

// ─────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────

export const COLORS = {
  // Core
  VOID_BLACK: '#040408',
  VOID_DARK: '#0a0a12',
  VOID_PANEL: '#0e0e1a',

  // Accent
  ACCENT: '#7b5cfa',
  ACCENT_GLOW: 'rgba(123, 92, 250, 0.35)',
  ACCENT_DIM: 'rgba(123, 92, 250, 0.15)',

  // Text
  TEXT_PRIMARY: '#e8e8f0',
  TEXT_DIM: '#6b6b88',
  TEXT_MUTED: '#3a3a55',

  // Status
  SUCCESS: '#44ffaa',
  WARNING: '#ffaa44',
  DANGER: '#ff4466',
  INFO: '#44aaff',

  // Borders
  BORDER: 'rgba(255,255,255,0.07)',
  BORDER_STRONG: 'rgba(255,255,255,0.12)',
};

// ─────────────────────────────────────────────
// REGEX PATTERNS
// ─────────────────────────────────────────────

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,16}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+\.?\d*$/,
};

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
  XP_CONSTANTS,
  RANKS,
  DIFFICULTY,
  WORKOUT_TYPES,
  QUEST_CATEGORIES,
  ACHIEVEMENT_TIERS,
  STATS,
  NOTIFICATION_TYPES,
  TIME,
  ANIMATION,
  LIMITS,
  SYSTEM_ACCESS,
  DEFAULT_STATS,
  BMI_CATEGORIES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SOUNDS,
  COLORS,
  REGEX,
};