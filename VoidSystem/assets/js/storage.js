// ============================================================
// VOID SYSTEM — storage.js
// SINGLE SOURCE OF TRUTH | Central State Manager
// ============================================================

const STORAGE_KEY = 'VOID_SYSTEM_PLAYER_DATA';

// ─────────────────────────────────────────────
// DEFAULT PLAYER DATA STRUCTURE
// ─────────────────────────────────────────────

const DEFAULT_PLAYER = {
  // CORE IDENTITY
  id: null,
  name: 'UNKNOWN PLAYER',
  acceptedSystem: false,
  rejectionCount: 0,
  banned: false,

  // PROGRESSION
  xp: 0,
  level: 1,
  rank: 'E',
  title: 'Novice Player',

  // STATS
  stats: {
    strength: 10,
    endurance: 10,
    agility: 10,
    intelligence: 10,
    willpower: 10,
  },

  // PHYSICAL ATTRIBUTES
  body: {
    height: null,        // in cm
    weight: null,        // in kg
    age: null,
    gender: null,
    bmi: null,
  },

  // RETENTION MECHANICS
  streak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,

  // PROGRESSION TRACKING
  totalWorkouts: 0,
  totalXPEarned: 0,

  // QUEST SYSTEM
  activeQuests: [],
  completedQuests: [],

  // WORKOUT HISTORY
  workoutHistory: [],

  // ACHIEVEMENTS
  unlockedAchievements: [],

  // TITLES COLLECTION
  unlockedTitles: ['Novice Player'],

  // SETTINGS
  settings: {
    soundEnabled: true,
    notificationsEnabled: true,
    theme: 'dark',
  },

  // TIMESTAMPS
  createdAt: null,
  lastLogin: null,
  lastUpdated: null,
};

// ─────────────────────────────────────────────
// RANK SYSTEM CONFIGURATION
// ─────────────────────────────────────────────

const RANK_THRESHOLDS = {
  E: { minLevel: 1, maxLevel: 9, color: '#888888', name: 'E-Rank' },
  D: { minLevel: 10, maxLevel: 19, color: '#88aa44', name: 'D-Rank' },
  C: { minLevel: 20, maxLevel: 34, color: '#44aaff', name: 'C-Rank' },
  B: { minLevel: 35, maxLevel: 49, color: '#aa44ff', name: 'B-Rank' },
  A: { minLevel: 50, maxLevel: 74, color: '#ff8844', name: 'A-Rank' },
  S: { minLevel: 75, maxLevel: 999, color: '#ff4466', name: 'S-Rank' },
};

// ─────────────────────────────────────────────
// XP CURVE CONFIGURATION
// ─────────────────────────────────────────────

// Progressive XP curve: each level requires more XP
// Formula: baseXP * (level ^ 1.5)
const XP_BASE = 100;
const XP_EXPONENT = 1.5;

function calculateXPForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}

function calculateLevelFromXP(xp) {
  let level = 1;
  let totalXP = 0;

  while (totalXP <= xp) {
    level++;
    totalXP = calculateXPForLevel(level);
  }

  return level - 1;
}

// ─────────────────────────────────────────────
// STORAGE CLASS
// ─────────────────────────────────────────────

class StorageManager {

  constructor() {
    this.playerData = this.loadPlayer();
  }

  // ─── CORE SAVE/LOAD ───

  loadPlayer() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return this.createNewPlayer();

      const player = JSON.parse(saved);

      // Validate and merge with defaults (in case structure changed)
      const merged = this.mergeWithDefaults(player);

      // Update last login
      merged.lastLogin = new Date().toISOString();

      return merged;
    } catch (err) {
      console.error('[VOID] Failed to load player data:', err);
      return this.createNewPlayer();
    }
  }

  savePlayer() {
    try {
      this.playerData.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.playerData));
      return true;
    } catch (err) {
      console.error('[VOID] Failed to save player data:', err);
      return false;
    }
  }

  createNewPlayer() {
    const newPlayer = {
      ...DEFAULT_PLAYER,
      id: this.generatePlayerID(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.playerData = newPlayer;
    this.savePlayer();
    return newPlayer;
  }

  mergeWithDefaults(player) {
    return {
      ...DEFAULT_PLAYER,
      ...player,
      stats: { ...DEFAULT_PLAYER.stats, ...player.stats },
      body: { ...DEFAULT_PLAYER.body, ...player.body },
      settings: { ...DEFAULT_PLAYER.settings, ...player.settings },
    };
  }

  generatePlayerID() {
    return `P${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // ─── DATA GETTERS ───

  getPlayer() {
    return this.playerData;
  }

  getXP() {
    return this.playerData.xp;
  }

  getLevel() {
    return this.playerData.level;
  }

  getRank() {
    return this.playerData.rank;
  }

  getTitle() {
    return this.playerData.title;
  }

  getStreak() {
    return this.playerData.streak;
  }

  getStats() {
    return this.playerData.stats;
  }

  getBody() {
    return this.playerData.body;
  }

  getWorkoutHistory() {
    return this.playerData.workoutHistory || [];
  }

  getActiveQuests() {
    return this.playerData.activeQuests || [];
  }

  getCompletedQuests() {
    return this.playerData.completedQuests || [];
  }

  getAchievements() {
    return this.playerData.unlockedAchievements || [];
  }

  getUnlockedTitles() {
    return this.playerData.unlockedTitles || [];
  }

  // ─── XP & LEVEL MANAGEMENT ───

  addXP(amount) {
    const oldLevel = this.playerData.level;

    this.playerData.xp += amount;
    this.playerData.totalXPEarned += amount;

    // Recalculate level from total XP
    const newLevel = calculateLevelFromXP(this.playerData.xp);

    if (newLevel > oldLevel) {
      this.playerData.level = newLevel;
      this.updateRank();
      this.onLevelUp(oldLevel, newLevel);
      this.savePlayer();
      return { leveledUp: true, oldLevel, newLevel };
    }

    this.savePlayer();
    return { leveledUp: false };
  }

  getXPForNextLevel(level) {
    return calculateXPForLevel(level + 1);
  }

  getXPProgress() {
    const currentLevel = this.playerData.level;
    const currentXP = this.playerData.xp;
    const xpForCurrent = calculateXPForLevel(currentLevel);
    const xpForNext = calculateXPForLevel(currentLevel + 1);
    const progress = currentXP - xpForCurrent;
    const needed = xpForNext - xpForCurrent;

    return {
      current: currentXP,
      progress,
      needed,
      percent: Math.min((progress / needed) * 100, 100),
    };
  }

  onLevelUp(oldLevel, newLevel) {
    console.log(`[VOID] LEVEL UP: ${oldLevel} → ${newLevel}`);

    // Award stat points (simple example: +1 to all stats every 5 levels)
    if (newLevel % 5 === 0) {
      Object.keys(this.playerData.stats).forEach(stat => {
        this.playerData.stats[stat] += 1;
      });
    }

    // [FIX] Missing notification flags implemented below
    // TODO: Trigger level-up notification/animation
    sessionStorage.setItem('VOID_JUST_LEVELED_UP', 'true');
    
    // TODO: Check for level-based achievements
    // TODO: Unlock level-gated quests
  }

  // ─── RANK MANAGEMENT ───

  updateRank() {
    const level = this.playerData.level;

    for (const [rankKey, config] of Object.entries(RANK_THRESHOLDS)) {
      if (level >= config.minLevel && level <= config.maxLevel) {
        const oldRank = this.playerData.rank;
        this.playerData.rank = rankKey;

        if (oldRank !== rankKey) {
          this.onRankPromotion(oldRank, rankKey);
        }
        break;
      }
    }
  }

  onRankPromotion(oldRank, newRank) {
    console.log(`[VOID] RANK PROMOTION: ${oldRank} → ${newRank}`);
    // [FIX] Missing notification flags implemented below
    // TODO: Trigger rank-up notification
    sessionStorage.setItem('VOID_JUST_RANKED_UP', 'true');
    // TODO: Award rank-based titles/achievements
  }

  getRankInfo(rank) {
    return RANK_THRESHOLDS[rank] || RANK_THRESHOLDS.E;
  }

  // ─── STREAK MANAGEMENT ───

  updateStreak() {
    const now = new Date();
    const today = this.getDateString(now);
    const lastDate = this.playerData.lastWorkoutDate;

    if (!lastDate) {
      // First workout ever
      this.playerData.streak = 1;
      this.playerData.longestStreak = 1;
      this.playerData.lastWorkoutDate = today;
      this.savePlayer();
      return { streakIncreased: true, currentStreak: 1 };
    }

    const daysSinceLastWorkout = this.getDaysBetween(lastDate, today);

    if (daysSinceLastWorkout === 0) {
      // Same day workout — streak unchanged
      return { streakIncreased: false, currentStreak: this.playerData.streak };
    } else if (daysSinceLastWorkout === 1) {
      // Consecutive day — increase streak
      this.playerData.streak += 1;
      this.playerData.lastWorkoutDate = today;

      if (this.playerData.streak > this.playerData.longestStreak) {
        this.playerData.longestStreak = this.playerData.streak;
      }

      this.savePlayer();
      return { streakIncreased: true, currentStreak: this.playerData.streak };
    } else {
      // Streak broken
      const oldStreak = this.playerData.streak;
      this.playerData.streak = 1;
      this.playerData.lastWorkoutDate = today;
      this.savePlayer();
      return { streakIncreased: false, streakBroken: true, oldStreak, currentStreak: 1 };
    }
  }

  getStreakStatus() {
    const now = new Date();
    const today = this.getDateString(now);
    const lastDate = this.playerData.lastWorkoutDate;

    if (!lastDate) return { status: 'none', daysUntilBreak: 0 };

    const daysSince = this.getDaysBetween(lastDate, today);

    if (daysSince === 0) return { status: 'safe', daysUntilBreak: 1 };
    if (daysSince === 1) return { status: 'warning', daysUntilBreak: 0 };
    return { status: 'broken', daysUntilBreak: 0 };
  }

  // ─── WORKOUT HISTORY ───

  addWorkoutSession(session) {
    if (!this.playerData.workoutHistory) {
      this.playerData.workoutHistory = [];
    }

    this.playerData.workoutHistory.push(session);
    this.playerData.totalWorkouts += 1;
    this.savePlayer();
  }

  // ─── QUEST MANAGEMENT ───

  acceptQuest(questId) {
    if (this.playerData.activeQuests.includes(questId)) return false;
    this.playerData.activeQuests.push(questId);
    this.savePlayer();
    return true;
  }

  completeQuest(questId, rewards) {
    const index = this.playerData.activeQuests.indexOf(questId);
    if (index === -1) return false;

    this.playerData.activeQuests.splice(index, 1);
    this.playerData.completedQuests.push({
      questId,
      completedAt: new Date().toISOString(),
    });

    // Award XP
    if (rewards?.xp) {
      this.addXP(rewards.xp);
    }

    // Award title
    if (rewards?.title) {
      this.unlockTitle(rewards.title);
    }

    this.savePlayer();
    return true;
  }

  isQuestActive(questId) {
    return this.playerData.activeQuests.includes(questId);
  }

  isQuestCompleted(questId) {
    return this.playerData.completedQuests.some(q => q.questId === questId);
  }

  // ─── ACHIEVEMENT SYSTEM ───

  unlockAchievement(achievementId) {
    if (this.playerData.unlockedAchievements.includes(achievementId)) return false;

    this.playerData.unlockedAchievements.push(achievementId);
    this.savePlayer();
    return true;
  }

  hasAchievement(achievementId) {
    return this.playerData.unlockedAchievements.includes(achievementId);
  }

  // ─── TITLE SYSTEM ───

  unlockTitle(title) {
    if (this.playerData.unlockedTitles.includes(title)) return false;

    this.playerData.unlockedTitles.push(title);
    this.savePlayer();
    return true;
  }

  setActiveTitle(title) {
    if (!this.playerData.unlockedTitles.includes(title)) return false;

    this.playerData.title = title;
    this.savePlayer();
    return true;
  }

  // ─── BODY & STATS ───

  updateBody(bodyData) {
    this.playerData.body = { ...this.playerData.body, ...bodyData };

    // Auto-calculate BMI if height and weight exist
    if (this.playerData.body.height && this.playerData.body.weight) {
      const heightM = this.playerData.body.height / 100;
      this.playerData.body.bmi = (this.playerData.body.weight / (heightM * heightM)).toFixed(1);
    }

    this.savePlayer();
  }

  updateStats(statUpdates) {
    this.playerData.stats = { ...this.playerData.stats, ...statUpdates };
    this.savePlayer();
  }

  // ─── SYSTEM ACCESS ───

  acceptSystem() {
    this.playerData.acceptedSystem = true;
    this.savePlayer();
  }

  rejectSystem() {
    this.playerData.rejectionCount += 1;

    if (this.playerData.rejectionCount >= 3) {
      this.playerData.banned = true;
    }

    this.savePlayer();
  }

  isBanned() {
    return this.playerData.banned === true;
  }

  hasAcceptedSystem() {
    return this.playerData.acceptedSystem === true;
  }

  getRejectionCount() {
    return this.playerData.rejectionCount;
  }

  // ─── SETTINGS ───

  updateSettings(settings) {
    this.playerData.settings = { ...this.playerData.settings, ...settings };
    this.savePlayer();
  }

  // [FIX] Added missing updateSplit method
  updateSplit(splitData) {
    this.playerData.currentSplit = splitData.id;
    this.playerData.weekSchedule = splitData.schedule;
    this.savePlayer();
  }

  // ─── UTILITY ───

  getDateString(date) {
    // [FIX] Bugged code commented out below: used toISOString() which converts local time to UTC, breaking streaks at midnight UTC
    // return date.toISOString().split('T')[0];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDaysBetween(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // ─── RESET / DANGER ZONE ───

  resetPlayer() {
    if (confirm('⚠️ RESET ALL PLAYER DATA? THIS CANNOT BE UNDONE.')) {
      localStorage.removeItem(STORAGE_KEY);
      this.playerData = this.createNewPlayer();
      window.location.reload();
    }
  }

  exportData() {
    const dataStr = JSON.stringify(this.playerData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `void_system_backup_${Date.now()}.json`;
    link.click();
  }

  importData(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      this.playerData = this.mergeWithDefaults(imported);
      this.savePlayer();
      window.location.reload();
      return true;
    } catch (err) {
      console.error('[VOID] Import failed:', err);
      return false;
    }
  }
}

// ─────────────────────────────────────────────
// EXPORT SINGLETON INSTANCE
// ─────────────────────────────────────────────

const Storage = new StorageManager();

export { Storage, RANK_THRESHOLDS, calculateXPForLevel, calculateLevelFromXP };