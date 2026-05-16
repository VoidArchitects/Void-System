// ============================================================
// VOID SYSTEM — formatters.js
// Data Formatting | Display Helpers | Text Transformation
// ============================================================

import { RANKS } from './constants.js';

// ─────────────────────────────────────────────
// NUMBER FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string}
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

/**
 * Format number with K, M, B suffix
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export function formatCompactNumber(num, decimals = 1) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (abs >= 1e9) {
    return sign + (abs / 1e9).toFixed(decimals) + 'B';
  }
  if (abs >= 1e6) {
    return sign + (abs / 1e6).toFixed(decimals) + 'M';
  }
  if (abs >= 1e3) {
    return sign + (abs / 1e3).toFixed(decimals) + 'K';
  }
  
  return sign + abs.toString();
}

/**
 * Format XP with proper suffix
 * @param {number} xp - XP value
 * @returns {string}
 */
export function formatXP(xp) {
  return formatCompactNumber(xp, 0) + ' XP';
}

/**
 * Format percentage
 * @param {number} value - Value (0-100)
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export function formatPercent(value, decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return value.toFixed(decimals) + '%';
}

/**
 * Pad number with leading zeros
 * @param {number} num - Number to pad
 * @param {number} length - Target length
 * @returns {string}
 */
export function padNumber(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * Format decimal to fixed places
 * @param {number} num - Number
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export function formatDecimal(num, decimals = 1) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toFixed(decimals);
}

// ─────────────────────────────────────────────
// TIME & DATE FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format seconds to MM:SS
 * @param {number} seconds - Total seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${padNumber(mins)}:${padNumber(secs)}`;
}

/**
 * Format seconds to HH:MM:SS
 * @param {number} seconds - Total seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${padNumber(hours)}:${padNumber(mins)}:${padNumber(secs)}`;
  }
  
  return `${padNumber(mins)}:${padNumber(secs)}`;
}

/**
 * Format seconds to human-readable duration
 * @param {number} seconds - Total seconds
 * @returns {string}
 */
export function formatHumanDuration(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format type ('short', 'long', 'relative')
 * @returns {string}
 */
export function formatDate(date, format = 'short') {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  if (format === 'relative') {
    return formatRelativeDate(d);
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Short format (default)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string}
 */
export function formatRelativeDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Format time of day (e.g., "2:30 PM")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string}
 */
export function formatTimeOfDay(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return 'Invalid Time';
  }
  
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ─────────────────────────────────────────────
// PROGRESSION FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format level with prefix
 * @param {number} level - Level number
 * @returns {string}
 */
export function formatLevel(level) {
  if (typeof level !== 'number') return 'LVL 1';
  return `LVL ${level}`;
}

/**
 * Format rank with full name
 * @param {string} rank - Rank letter
 * @returns {string}
 */
export function formatRank(rank) {
  const rankInfo = RANKS[rank?.toUpperCase()];
  return rankInfo ? rankInfo.name : 'E-Rank';
}

/**
 * Format rank badge
 * @param {string} rank - Rank letter
 * @returns {string}
 */
export function formatRankBadge(rank) {
  const rankInfo = RANKS[rank?.toUpperCase()];
  return rankInfo ? `${rankInfo.glyph} ${rankInfo.label}` : '○ E';
}

/**
 * Format title with quotes
 * @param {string} title - Title name
 * @returns {string}
 */
export function formatTitle(title) {
  if (!title || typeof title !== 'string') return 'No Title';
  return `"${title}"`;
}

/**
 * Format streak count
 * @param {number} streak - Streak count
 * @returns {string}
 */
export function formatStreak(streak) {
  if (typeof streak !== 'number') return '0-day streak';
  return `${streak}-day streak`;
}

/**
 * Format stat value with label
 * @param {string} statName - Stat name
 * @param {number} value - Stat value
 * @returns {string}
 */
export function formatStat(statName, value) {
  if (typeof value !== 'number') return `${statName}: 0`;
  return `${statName}: ${value}`;
}

// ─────────────────────────────────────────────
// BODY METRICS FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format height
 * @param {number} cm - Height in cm
 * @param {string} unit - Unit system ('metric' or 'imperial')
 * @returns {string}
 */
export function formatHeight(cm, unit = 'metric') {
  if (typeof cm !== 'number' || isNaN(cm)) return '—';
  
  if (unit === 'imperial') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  
  return `${cm} cm`;
}

/**
 * Format weight
 * @param {number} kg - Weight in kg
 * @param {string} unit - Unit system ('metric' or 'imperial')
 * @returns {string}
 */
export function formatWeight(kg, unit = 'metric') {
  if (typeof kg !== 'number' || isNaN(kg)) return '—';
  
  if (unit === 'imperial') {
    const lbs = Math.round(kg * 2.20462);
    return `${lbs} lbs`;
  }
  
  return `${kg} kg`;
}

/**
 * Format BMI
 * @param {number} bmi - BMI value
 * @returns {string}
 */
export function formatBMI(bmi) {
  if (typeof bmi !== 'number' || isNaN(bmi)) return '—';
  return bmi.toFixed(1);
}

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string}
 */
export function getBMICategory(bmi) {
  if (typeof bmi !== 'number' || isNaN(bmi)) return 'Unknown';
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// ─────────────────────────────────────────────
// TEXT FORMATTERS
// ─────────────────────────────────────────────

/**
 * Capitalize first letter
 * @param {string} str - String
 * @returns {string}
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Title case (capitalize each word)
 * @param {string} str - String
 * @returns {string}
 */
export function titleCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str.split(' ').map(capitalize).join(' ');
}

/**
 * Convert to uppercase
 * @param {string} str - String
 * @returns {string}
 */
export function uppercase(str) {
  if (!str || typeof str !== 'string') return '';
  return str.toUpperCase();
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export function truncate(str, maxLength = 50) {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string}
 */
export function pluralize(count, singular, plural = null) {
  const pluralForm = plural || singular + 's';
  return count === 1 ? singular : pluralForm;
}

/**
 * Format list of items
 * @param {Array<string>} items - List of items
 * @param {string} conjunction - Conjunction ('and' or 'or')
 * @returns {string}
 */
export function formatList(items, conjunction = 'and') {
  if (!Array.isArray(items) || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(', ')}, ${conjunction} ${lastItem}`;
}

// ─────────────────────────────────────────────
// WORKOUT FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format sets and reps
 * @param {number} sets - Number of sets
 * @param {string|number} reps - Reps or rep range
 * @returns {string}
 */
export function formatSetsReps(sets, reps) {
  return `${sets} × ${reps}`;
}

/**
 * Format workout type
 * @param {string} type - Workout type
 * @returns {string}
 */
export function formatWorkoutType(type) {
  if (!type || typeof type !== 'string') return 'Unknown';
  
  const typeMap = {
    push: 'PUSH',
    pull: 'PULL',
    legs: 'LEGS',
    fullBody: 'FULL BODY',
    cardio: 'CARDIO',
    custom: 'CUSTOM',
  };
  
  return typeMap[type] || titleCase(type);
}

/**
 * Format exercise name
 * @param {string} name - Exercise name
 * @returns {string}
 */
export function formatExerciseName(name) {
  if (!name || typeof name !== 'string') return 'Unknown Exercise';
  return titleCase(name);
}

// ─────────────────────────────────────────────
// DIFFICULTY FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format difficulty with glyph
 * @param {string} difficulty - Difficulty level
 * @returns {string}
 */
export function formatDifficulty(difficulty) {
  const diffMap = {
    easy: '● EASY',
    medium: '◆ MEDIUM',
    hard: '▲ HARD',
    brutal: '✦ BRUTAL',
    legendary: '★ LEGENDARY',
  };
  
  return diffMap[difficulty?.toLowerCase()] || '● EASY';
}

// ─────────────────────────────────────────────
// ORDINAL NUMBERS
// ─────────────────────────────────────────────

/**
 * Get ordinal suffix for number (1st, 2nd, 3rd, etc.)
 * @param {number} num - Number
 * @returns {string}
 */
export function getOrdinalSuffix(num) {
  if (typeof num !== 'number') return 'th';
  
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th';
  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';
  return 'th';
}

/**
 * Format number as ordinal
 * @param {number} num - Number
 * @returns {string}
 */
export function formatOrdinal(num) {
  if (typeof num !== 'number') return '0th';
  return num + getOrdinalSuffix(num);
}

// ─────────────────────────────────────────────
// MISC FORMATTERS
// ─────────────────────────────────────────────

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes)) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format progress bar text
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @returns {string}
 */
export function formatProgress(current, target) {
  if (typeof current !== 'number' || typeof target !== 'number') {
    return '0 / 0';
  }
  return `${formatNumber(current)} / ${formatNumber(target)}`;
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
  formatNumber,
  formatCompactNumber,
  formatXP,
  formatPercent,
  padNumber,
  formatDecimal,
  formatTime,
  formatDuration,
  formatHumanDuration,
  formatDate,
  formatRelativeDate,
  formatTimeOfDay,
  formatLevel,
  formatRank,
  formatRankBadge,
  formatTitle,
  formatStreak,
  formatStat,
  formatHeight,
  formatWeight,
  formatBMI,
  getBMICategory,
  capitalize,
  titleCase,
  uppercase,
  truncate,
  pluralize,
  formatList,
  formatSetsReps,
  formatWorkoutType,
  formatExerciseName,
  formatDifficulty,
  getOrdinalSuffix,
  formatOrdinal,
  formatFileSize,
  formatProgress,
};