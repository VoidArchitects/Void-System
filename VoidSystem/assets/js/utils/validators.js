// ============================================================
// VOID SYSTEM — validators.js
// Input Validation | Data Integrity | Error Checking
// ============================================================

import { REGEX, LIMITS } from './constants.js';

// ─────────────────────────────────────────────
// BASIC VALIDATORS
// ─────────────────────────────────────────────

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if value is a positive number
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  return isNumber(value) && value > 0;
}

/**
 * Check if value is a valid integer
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isInteger(value) {
  return Number.isInteger(value);
}

/**
 * Check if value is within range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  return isNumber(value) && value >= min && value <= max;
}

/**
 * Check if string length is within range
 * @param {string} str - String to check
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean}
 */
export function isLengthInRange(str, min, max) {
  if (typeof str !== 'string') return false;
  const len = str.trim().length;
  return len >= min && len <= max;
}

// ─────────────────────────────────────────────
// STRING VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return REGEX.EMAIL.test(email.trim());
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {boolean}
 */
export function isValidUsername(username) {
  if (typeof username !== 'string') return false;
  return REGEX.USERNAME.test(username.trim());
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean}
 */
export function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  return REGEX.PASSWORD.test(password);
}

/**
 * Validate player name
 * @param {string} name - Name to validate
 * @returns {boolean}
 */
export function isValidPlayerName(name) {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 30;
}

// ─────────────────────────────────────────────
// PHYSICAL ATTRIBUTE VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate height in cm
 * @param {number} height - Height in cm
 * @returns {boolean}
 */
export function isValidHeight(height) {
  return isNumber(height) && height >= 50 && height <= 300;
}

/**
 * Validate weight in kg
 * @param {number} weight - Weight in kg
 * @returns {boolean}
 */
export function isValidWeight(weight) {
  return isNumber(weight) && weight >= 20 && weight <= 500;
}

/**
 * Validate age
 * @param {number} age - Age in years
 * @returns {boolean}
 */
export function isValidAge(age) {
  return isInteger(age) && age >= 13 && age <= 120;
}

/**
 * Validate gender
 * @param {string} gender - Gender
 * @returns {boolean}
 */
export function isValidGender(gender) {
  if (typeof gender !== 'string') return false;
  const valid = ['male', 'female', 'other', 'prefer-not-to-say'];
  return valid.includes(gender.toLowerCase());
}

/**
 * Validate BMI
 * @param {number} bmi - BMI value
 * @returns {boolean}
 */
export function isValidBMI(bmi) {
  return isNumber(bmi) && bmi >= 10 && bmi <= 100;
}

// ─────────────────────────────────────────────
// WORKOUT VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate workout type
 * @param {string} type - Workout type
 * @returns {boolean}
 */
export function isValidWorkoutType(type) {
  const validTypes = ['push', 'pull', 'legs', 'fullBody', 'cardio', 'custom'];
  return validTypes.includes(type);
}

/**
 * Validate sets count
 * @param {number} sets - Number of sets
 * @returns {boolean}
 */
export function isValidSets(sets) {
  return isInteger(sets) && sets >= 1 && sets <= LIMITS.MAX_SETS_PER_EXERCISE;
}

/**
 * Validate reps
 * @param {number|string} reps - Number of reps or range (e.g., "8-10")
 * @returns {boolean}
 */
export function isValidReps(reps) {
  if (typeof reps === 'number') {
    return isInteger(reps) && reps >= 1 && reps <= 100;
  }
  if (typeof reps === 'string') {
    // Allow ranges like "8-10" or single numbers
    const rangePattern = /^\d+(-\d+)?$/;
    return rangePattern.test(reps.trim());
  }
  return false;
}

/**
 * Validate workout duration in seconds
 * @param {number} duration - Duration in seconds
 * @returns {boolean}
 */
export function isValidWorkoutDuration(duration) {
  return isInteger(duration) &&
    duration >= LIMITS.MIN_WORKOUT_DURATION &&
    duration <= LIMITS.MAX_WORKOUT_DURATION;
}

/**
 * Validate exercise count
 * @param {number} count - Number of exercises
 * @returns {boolean}
 */
export function isValidExerciseCount(count) {
  return isInteger(count) && count >= 1 && count <= LIMITS.MAX_EXERCISES_PER_WORKOUT;
}

/**
 * Validate workout session object
 * @param {Object} session - Workout session
 * @returns {Object} { valid: boolean, errors: Array }
 */
export function validateWorkoutSession(session) {
  const errors = [];

  if (!session || typeof session !== 'object') {
    return { valid: false, errors: ['Invalid session object'] };
  }

  if (!isValidWorkoutType(session.type)) {
    errors.push('Invalid workout type');
  }

  if (!isValidWorkoutDuration(session.duration)) {
    errors.push('Invalid workout duration');
  }

  if (!isNumber(session.xpEarned) || session.xpEarned < 0) {
    errors.push('Invalid XP value');
  }

  if (!Array.isArray(session.exercises) || session.exercises.length === 0) {
    errors.push('No exercises in session');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─────────────────────────────────────────────
// QUEST VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate quest difficulty
 * @param {string} difficulty - Quest difficulty
 * @returns {boolean}
 */
export function isValidDifficulty(difficulty) {
  const valid = ['easy', 'medium', 'hard', 'brutal', 'legendary'];
  return valid.includes(difficulty?.toLowerCase());
}

/**
 * Validate quest category
 * @param {string} category - Quest category
 * @returns {boolean}
 */
export function isValidQuestCategory(category) {
  const valid = ['physical', 'endurance', 'discipline', 'progression', 'hidden', 'special'];
  return valid.includes(category?.toLowerCase());
}

/**
 * Validate quest requirement
 * @param {Object} requirement - Quest requirement
 * @returns {boolean}
 */
export function isValidQuestRequirement(requirement) {
  if (!requirement || typeof requirement !== 'object') return false;

  const validTypes = ['workouts', 'streak', 'level', 'xp'];
  if (!validTypes.includes(requirement.type)) return false;

  if (!isPositiveNumber(requirement.target)) return false;

  return true;
}

/**
 * Validate quest object
 * @param {Object} quest - Quest object
 * @returns {Object} { valid: boolean, errors: Array }
 */
export function validateQuest(quest) {
  const errors = [];

  if (!quest || typeof quest !== 'object') {
    return { valid: false, errors: ['Invalid quest object'] };
  }

  if (!quest.id || typeof quest.id !== 'string') {
    errors.push('Missing or invalid quest ID');
  }

  if (!quest.title || typeof quest.title !== 'string') {
    errors.push('Missing or invalid quest title');
  }

  if (!isValidDifficulty(quest.difficulty)) {
    errors.push('Invalid quest difficulty');
  }

  if (!isValidQuestCategory(quest.category)) {
    errors.push('Invalid quest category');
  }

  if (!isValidQuestRequirement(quest.requirements)) {
    errors.push('Invalid quest requirements');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─────────────────────────────────────────────
// PROGRESSION VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate XP value
 * @param {number} xp - XP value
 * @returns {boolean}
 */
export function isValidXP(xp) {
  return isNumber(xp) && xp >= 0;
}

/**
 * Validate level
 * @param {number} level - Level value
 * @returns {boolean}
 */
export function isValidLevel(level) {
  return isInteger(level) && level >= 1 && level <= LIMITS.MAX_LEVEL;
}

/**
 * Validate rank
 * @param {string} rank - Rank value
 * @returns {boolean}
 */
export function isValidRank(rank) {
  const validRanks = ['E', 'D', 'C', 'B', 'A', 'S'];
  return validRanks.includes(rank?.toUpperCase());
}

/**
 * Validate stat value
 * @param {number} stat - Stat value
 * @returns {boolean}
 */
export function isValidStat(stat) {
  return isNumber(stat) && stat >= 0 && stat <= LIMITS.MAX_STAT_VALUE;
}

/**
 * Validate streak count
 * @param {number} streak - Streak count
 * @returns {boolean}
 */
export function isValidStreak(streak) {
  return isInteger(streak) && streak >= 0 && streak <= LIMITS.MAX_STREAK_DAYS;
}

// ─────────────────────────────────────────────
// DATE VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate date string (ISO format)
 * @param {string} dateStr - Date string
 * @returns {boolean}
 */
export function isValidDateString(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate date is not in future
 * @param {string|Date} date - Date to check
 * @returns {boolean}
 */
export function isNotFutureDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj <= new Date();
}

/**
 * Validate date is within range
 * @param {string|Date} date - Date to check
 * @param {number} daysBack - Maximum days in the past
 * @returns {boolean}
 */
export function isDateWithinRange(date, daysBack) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const minDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  return dateObj >= minDate && dateObj <= now;
}

// ─────────────────────────────────────────────
// PLAYER DATA VALIDATORS
// ─────────────────────────────────────────────

/**
 * Validate entire player object
 * @param {Object} player - Player object
 * @returns {Object} { valid: boolean, errors: Array }
 */
export function validatePlayerData(player) {
  const errors = [];

  if (!player || typeof player !== 'object') {
    return { valid: false, errors: ['Invalid player object'] };
  }

  // Core fields
  if (!player.id || typeof player.id !== 'string') {
    errors.push('Missing or invalid player ID');
  }

  // Progression
  if (!isValidXP(player.xp)) {
    errors.push('Invalid XP value');
  }

  if (!isValidLevel(player.level)) {
    errors.push('Invalid level');
  }

  if (!isValidRank(player.rank)) {
    errors.push('Invalid rank');
  }

  // Stats
  if (player.stats) {
    Object.values(player.stats).forEach((stat, index) => {
      if (!isValidStat(stat)) {
        errors.push(`Invalid stat value at index ${index}`);
      }
    });
  }

  // Streak
  if (!isValidStreak(player.streak)) {
    errors.push('Invalid streak count');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate body data
 * @param {Object} body - Body data object
 * @returns {Object} { valid: boolean, errors: Array }
 */
export function validateBodyData(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid body object'] };
  }

  if (body.height !== null && !isValidHeight(body.height)) {
    errors.push('Invalid height');
  }

  if (body.weight !== null && !isValidWeight(body.weight)) {
    errors.push('Invalid weight');
  }

  if (body.age !== null && !isValidAge(body.age)) {
    errors.push('Invalid age');
  }

  if (body.gender !== null && !isValidGender(body.gender)) {
    errors.push('Invalid gender');
  }

  if (body.bmi !== null && !isValidBMI(body.bmi)) {
    errors.push('Invalid BMI');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─────────────────────────────────────────────
// UTILITY VALIDATORS
// ─────────────────────────────────────────────

/**
 * Sanitize string input
 * @param {string} input - Input string
 * @returns {string}
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Sanitize number input
 * @param {*} input - Input value
 * @param {number} defaultValue - Default value if invalid
 * @returns {number}
 */
export function sanitizeNumber(input, defaultValue = 0) {
  const num = Number(input);
  return isNumber(num) ? num : defaultValue;
}

/**
 * Validate and sanitize input object
 * @param {Object} input - Input object
 * @param {Object} schema - Validation schema
 * @returns {Object} { valid: boolean, sanitized: Object, errors: Array }
 */
export function validateAndSanitize(input, schema) {
  const errors = [];
  const sanitized = {};

  for (const [key, validator] of Object.entries(schema)) {
    const value = input[key];

    if (validator.required && isEmpty(value)) {
      errors.push(`${key} is required`);
      continue;
    }

    if (!isEmpty(value) && validator.validate && !validator.validate(value)) {
      errors.push(`Invalid ${key}`);
      continue;
    }

    sanitized[key] = validator.sanitize ? validator.sanitize(value) : value;
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
  isEmpty,
  isNumber,
  isPositiveNumber,
  isInteger,
  isInRange,
  isLengthInRange,
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidPlayerName,
  isValidHeight,
  isValidWeight,
  isValidAge,
  isValidGender,
  isValidBMI,
  isValidWorkoutType,
  isValidSets,
  isValidReps,
  isValidWorkoutDuration,
  isValidExerciseCount,
  validateWorkoutSession,
  isValidDifficulty,
  isValidQuestCategory,
  isValidQuestRequirement,
  validateQuest,
  isValidXP,
  isValidLevel,
  isValidRank,
  isValidStat,
  isValidStreak,
  isValidDateString,
  isNotFutureDate,
  isDateWithinRange,
  validatePlayerData,
  validateBodyData,
  sanitizeString,
  sanitizeNumber,
  validateAndSanitize,
};