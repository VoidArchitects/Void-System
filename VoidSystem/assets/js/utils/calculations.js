// ============================================================
// VOID SYSTEM — calculations.js
// Mathematical Formulas | Progression Math | Stat Calculations
// ============================================================

import { XP_CONSTANTS, RANKS, BMI_CATEGORIES } from './constants.js';

// ─────────────────────────────────────────────
// XP & LEVEL CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate XP required for a specific level
 * Formula: baseXP * (level ^ exponent)
 * @param {number} level - Target level
 * @returns {number} Total XP required to reach that level
 */
export function calculateXPForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor(XP_CONSTANTS.BASE_XP * Math.pow(level, XP_CONSTANTS.XP_EXPONENT));
}

/**
 * Calculate level from total XP
 * @param {number} xp - Total XP
 * @returns {number} Current level
 */
export function calculateLevelFromXP(xp) {
  let level = 1;
  let totalXP = 0;
  
  while (totalXP <= xp) {
    level++;
    totalXP = calculateXPForLevel(level);
  }
  
  return level - 1;
}

/**
 * Calculate XP needed to reach next level
 * @param {number} currentXP - Current total XP
 * @param {number} currentLevel - Current level
 * @returns {number} XP needed for next level
 */
export function calculateXPToNextLevel(currentXP, currentLevel) {
  const xpForNext = calculateXPForLevel(currentLevel + 1);
  const xpForCurrent = calculateXPForLevel(currentLevel);
  const progress = currentXP - xpForCurrent;
  const needed = xpForNext - xpForCurrent;
  
  return Math.max(0, needed - progress);
}

/**
 * Calculate XP progress percentage for current level
 * @param {number} currentXP - Current total XP
 * @param {number} currentLevel - Current level
 * @returns {number} Percentage (0-100)
 */
export function calculateXPProgress(currentXP, currentLevel) {
  const xpForNext = calculateXPForLevel(currentLevel + 1);
  const xpForCurrent = calculateXPForLevel(currentLevel);
  const progress = currentXP - xpForCurrent;
  const needed = xpForNext - xpForCurrent;
  
  if (needed === 0) return 100;
  
  const percent = (progress / needed) * 100;
  return Math.min(Math.max(percent, 0), 100);
}

/**
 * Calculate XP with streak multiplier
 * @param {number} baseXP - Base XP amount
 * @param {number} streakDays - Current streak
 * @returns {number} Total XP with bonus
 */
export function calculateXPWithStreak(baseXP, streakDays) {
  const multiplier = Math.min(
    streakDays * XP_CONSTANTS.STREAK_MULTIPLIER,
    XP_CONSTANTS.MAX_STREAK_BONUS
  );
  
  const bonus = Math.floor(baseXP * multiplier);
  return baseXP + bonus;
}

/**
 * Calculate XP reward for quest difficulty
 * @param {string} difficulty - Quest difficulty (easy, medium, hard, brutal, legendary)
 * @returns {number} Base XP reward
 */
export function calculateQuestXP(difficulty) {
  const xpMap = {
    easy: XP_CONSTANTS.QUEST_EASY,
    medium: XP_CONSTANTS.QUEST_MEDIUM,
    hard: XP_CONSTANTS.QUEST_HARD,
    brutal: XP_CONSTANTS.QUEST_BRUTAL,
    legendary: XP_CONSTANTS.QUEST_LEGENDARY,
  };
  
  return xpMap[difficulty?.toLowerCase()] || XP_CONSTANTS.QUEST_EASY;
}

// ─────────────────────────────────────────────
// RANK CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Get rank from level
 * @param {number} level - Player level
 * @returns {string} Rank letter (E, D, C, B, A, S)
 */
export function getRankFromLevel(level) {
  for (const [rankKey, config] of Object.entries(RANKS)) {
    if (level >= config.minLevel && level <= config.maxLevel) {
      return rankKey;
    }
  }
  return 'E';
}

/**
 * Get rank info
 * @param {string} rank - Rank letter
 * @returns {Object} Rank configuration
 */
export function getRankInfo(rank) {
  return RANKS[rank?.toUpperCase()] || RANKS.E;
}

/**
 * Calculate progress within current rank
 * @param {number} level - Current level
 * @returns {number} Percentage (0-100)
 */
export function calculateRankProgress(level) {
  const rank = getRankFromLevel(level);
  const rankInfo = getRankInfo(rank);
  
  const progress = level - rankInfo.minLevel;
  const total = rankInfo.maxLevel - rankInfo.minLevel + 1;
  
  return Math.round((progress / total) * 100);
}

/**
 * Calculate levels until next rank
 * @param {number} level - Current level
 * @returns {number} Levels remaining
 */
export function levelsUntilNextRank(level) {
  const rank = getRankFromLevel(level);
  const rankInfo = getRankInfo(rank);
  
  if (rank === 'S') return 0; // Already max rank
  
  return rankInfo.maxLevel - level;
}

// ─────────────────────────────────────────────
// STAT CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate total stats value
 * @param {Object} stats - Stats object { strength, endurance, agility, intelligence, willpower }
 * @returns {number} Total stat points
 */
export function calculateTotalStats(stats) {
  if (!stats || typeof stats !== 'object') return 0;
  return Object.values(stats).reduce((sum, val) => sum + (val || 0), 0);
}

/**
 * Calculate average stat value
 * @param {Object} stats - Stats object
 * @returns {number} Average stat value
 */
export function calculateAverageStats(stats) {
  if (!stats || typeof stats !== 'object') return 0;
  const values = Object.values(stats).filter(v => typeof v === 'number');
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate stat increase from level ups
 * @param {number} level - Current level
 * @returns {number} Total stat points earned
 */
export function calculateStatPointsFromLevel(level) {
  // +1 to all stats every 5 levels
  const milestones = Math.floor(level / 5);
  const statsPerMilestone = 5; // 5 stats
  return milestones * statsPerMilestone;
}

// ─────────────────────────────────────────────
// STREAK CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate days between dates
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Days difference
 */
export function calculateDaysBetween(date1, date2) {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if streak should continue
 * @param {string} lastWorkoutDate - Last workout date (ISO string)
 * @returns {boolean} True if streak is maintained
 */
export function shouldContinueStreak(lastWorkoutDate) {
  if (!lastWorkoutDate) return false;
  
  const today = new Date();
  const lastDate = new Date(lastWorkoutDate);
  const daysSince = calculateDaysBetween(lastDate, today);
  
  // Streak continues if workout was today or yesterday
  return daysSince <= 1;
}

/**
 * Calculate streak bonus multiplier
 * @param {number} streakDays - Current streak
 * @returns {number} Multiplier (e.g., 0.3 for 30%)
 */
export function calculateStreakBonus(streakDays) {
  const bonus = streakDays * XP_CONSTANTS.STREAK_MULTIPLIER;
  return Math.min(bonus, XP_CONSTANTS.MAX_STREAK_BONUS);
}

// ─────────────────────────────────────────────
// BODY METRICS CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate BMI
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number} BMI value
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm === 0) return 0;
  
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  
  return Math.round(bmi * 10) / 10; // Round to 1 decimal
}

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {Object} Category info
 */
export function getBMICategory(bmi) {
  if (bmi < BMI_CATEGORIES.UNDERWEIGHT.max) {
    return BMI_CATEGORIES.UNDERWEIGHT;
  }
  if (bmi < BMI_CATEGORIES.NORMAL.max) {
    return BMI_CATEGORIES.NORMAL;
  }
  if (bmi < BMI_CATEGORIES.OVERWEIGHT.max) {
    return BMI_CATEGORIES.OVERWEIGHT;
  }
  return BMI_CATEGORIES.OBESE;
}

/**
 * Convert height cm to feet/inches
 * @param {number} cm - Height in cm
 * @returns {Object} { feet, inches }
 */
export function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Convert feet/inches to cm
 * @param {number} feet - Feet
 * @param {number} inches - Inches
 * @returns {number} Height in cm
 */
export function feetInchesToCm(feet, inches) {
  const totalInches = (feet * 12) + inches;
  return Math.round(totalInches * 2.54);
}

/**
 * Convert kg to lbs
 * @param {number} kg - Weight in kg
 * @returns {number} Weight in lbs
 */
export function kgToLbs(kg) {
  return Math.round(kg * 2.20462);
}

/**
 * Convert lbs to kg
 * @param {number} lbs - Weight in lbs
 * @returns {number} Weight in kg
 */
export function lbsToKg(lbs) {
  return Math.round(lbs / 2.20462);
}

/**
 * Calculate ideal weight range (based on BMI 18.5-24.9)
 * @param {number} heightCm - Height in cm
 * @returns {Object} { min, max } in kg
 */
export function calculateIdealWeightRange(heightCm) {
  const heightM = heightCm / 100;
  const heightSq = heightM * heightM;
  
  const minWeight = Math.round(18.5 * heightSq);
  const maxWeight = Math.round(24.9 * heightSq);
  
  return { min: minWeight, max: maxWeight };
}

// ─────────────────────────────────────────────
// WORKOUT CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate total sets completed in session
 * @param {Array} exercises - Exercise array
 * @returns {number} Total sets
 */
export function calculateTotalSets(exercises) {
  if (!Array.isArray(exercises)) return 0;
  return exercises.reduce((sum, ex) => sum + (ex.completedSets || 0), 0);
}

/**
 * Calculate workout completion percentage
 * @param {Array} exercises - Exercise array
 * @returns {number} Percentage (0-100)
 */
export function calculateWorkoutCompletion(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) return 0;
  
  const completedCount = exercises.filter(ex => ex.isComplete).length;
  return Math.round((completedCount / exercises.length) * 100);
}

/**
 * Calculate average workout duration
 * @param {Array} workoutHistory - Workout history array
 * @returns {number} Average duration in seconds
 */
export function calculateAverageWorkoutDuration(workoutHistory) {
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) return 0;
  
  const totalDuration = workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0);
  return Math.round(totalDuration / workoutHistory.length);
}

/**
 * Calculate total workout time
 * @param {Array} workoutHistory - Workout history array
 * @returns {number} Total duration in seconds
 */
export function calculateTotalWorkoutTime(workoutHistory) {
  if (!Array.isArray(workoutHistory)) return 0;
  return workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0);
}

/**
 * Calculate workout frequency (workouts per week)
 * @param {Array} workoutHistory - Workout history array
 * @param {number} weeks - Number of weeks to analyze
 * @returns {number} Average workouts per week
 */
export function calculateWorkoutFrequency(workoutHistory, weeks = 4) {
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) return 0;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
  
  const recentWorkouts = workoutHistory.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= cutoffDate;
  });
  
  return Math.round(recentWorkouts.length / weeks * 10) / 10;
}

// ─────────────────────────────────────────────
// QUEST CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate quest progress percentage
 * @param {number} current - Current progress
 * @param {number} target - Target value
 * @returns {number} Percentage (0-100)
 */
export function calculateQuestProgress(current, target) {
  if (!target || target === 0) return 0;
  const percent = (current / target) * 100;
  return Math.min(Math.max(percent, 0), 100);
}

/**
 * Check if quest is complete
 * @param {number} current - Current progress
 * @param {number} target - Target value
 * @returns {boolean} True if complete
 */
export function isQuestComplete(current, target) {
  return current >= target;
}

/**
 * Calculate total XP from completed quests
 * @param {Array} completedQuests - Array of completed quests
 * @returns {number} Total XP earned
 */
export function calculateTotalQuestXP(completedQuests) {
  if (!Array.isArray(completedQuests)) return 0;
  return completedQuests.reduce((sum, q) => sum + (q.xpReward || 0), 0);
}

// ─────────────────────────────────────────────
// ACHIEVEMENT CALCULATIONS
// ─────────────────────────────────────────────

/**
 * Calculate achievement completion rate
 * @param {Array} unlockedAchievements - Unlocked achievements
 * @param {number} totalAchievements - Total available achievements
 * @returns {number} Percentage (0-100)
 */
export function calculateAchievementRate(unlockedAchievements, totalAchievements) {
  if (!totalAchievements || totalAchievements === 0) return 0;
  const unlocked = Array.isArray(unlockedAchievements) ? unlockedAchievements.length : 0;
  return Math.round((unlocked / totalAchievements) * 100);
}

// ─────────────────────────────────────────────
// GENERAL MATH UTILITIES
// ─────────────────────────────────────────────

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Progress (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input minimum
 * @param {number} inMax - Input maximum
 * @param {number} outMin - Output minimum
 * @param {number} outMax - Output maximum
 * @returns {number} Mapped value
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Round to decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Decimal places
 * @returns {number} Rounded value
 */
export function roundTo(value, decimals = 0) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
  calculateXPForLevel,
  calculateLevelFromXP,
  calculateXPToNextLevel,
  calculateXPProgress,
  calculateXPWithStreak,
  calculateQuestXP,
  getRankFromLevel,
  getRankInfo,
  calculateRankProgress,
  levelsUntilNextRank,
  calculateTotalStats,
  calculateAverageStats,
  calculateStatPointsFromLevel,
  calculateDaysBetween,
  shouldContinueStreak,
  calculateStreakBonus,
  calculateBMI,
  getBMICategory,
  cmToFeetInches,
  feetInchesToCm,
  kgToLbs,
  lbsToKg,
  calculateIdealWeightRange,
  calculateTotalSets,
  calculateWorkoutCompletion,
  calculateAverageWorkoutDuration,
  calculateTotalWorkoutTime,
  calculateWorkoutFrequency,
  calculateQuestProgress,
  isQuestComplete,
  calculateTotalQuestXP,
  calculateAchievementRate,
  clamp,
  lerp,
  mapRange,
  calculatePercentage,
  roundTo,
};