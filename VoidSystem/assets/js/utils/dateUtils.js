// ============================================================
// VOID SYSTEM — dateUtils.js
// Date & Time Utilities | Streak Logic | Date Formatting
// ============================================================

// ─────────────────────────────────────────────
// DATE CREATION & PARSING
// ─────────────────────────────────────────────

/**
 * Get current date as Date object
 * @returns {Date}
 */
export function now() {
    return new Date();
}

/**
 * Get current date string (YYYY-MM-DD)
 * @returns {string}
 */
export function today() {
    return formatDateString(new Date());
}

/**
 * Get yesterday's date string (YYYY-MM-DD)
 * @returns {string}
 */
export function yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return formatDateString(date);
}

/**
 * Get tomorrow's date string (YYYY-MM-DD)
 * @returns {string}
 */
export function tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return formatDateString(date);
}

/**
 * Parse date from various formats
 * @param {string|Date|number} input - Date input
 * @returns {Date|null}
 */
export function parseDate(input) {
    if (input instanceof Date) return input;
    if (typeof input === 'number') return new Date(input);
    if (typeof input === 'string') {
        const date = new Date(input);
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
}

/**
 * Check if date is valid
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isValidDate(date) {
    const d = parseDate(date);
    return d !== null && !isNaN(d.getTime());
}

// ─────────────────────────────────────────────
// DATE FORMATTING
// ─────────────────────────────────────────────

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export function formatDateString(date) {
    const d = parseDate(date);
    if (!d) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Format date to ISO string
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export function formatISO(date) {
    const d = parseDate(date);
    if (!d) return '';
    return d.toISOString();
}

/**
 * Format time (HH:MM)
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export function formatTime(date) {
    const d = parseDate(date);
    if (!d) return '';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

/**
 * Format datetime (YYYY-MM-DD HH:MM)
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export function formatDateTime(date) {
    const d = parseDate(date);
    if (!d) return '';

    return `${formatDateString(d)} ${formatTime(d)}`;
}

// ─────────────────────────────────────────────
// DATE COMPARISON
// ─────────────────────────────────────────────

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);

    if (!d1 || !d2) return false;

    return formatDateString(d1) === formatDateString(d2);
}

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isToday(date) {
    return isSameDay(date, new Date());
}

/**
 * Check if date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
}

/**
 * Check if date is tomorrow
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isTomorrow(date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isSameDay(date, tomorrow);
}

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isPast(date) {
    const d = parseDate(date);
    if (!d) return false;
    return d < new Date();
}

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export function isFuture(date) {
    const d = parseDate(date);
    if (!d) return false;
    return d > new Date();
}

/**
 * Check if date is within last N days
 * @param {Date|string} date - Date to check
 * @param {number} days - Number of days
 * @returns {boolean}
 */
export function isWithinDays(date, days) {
    const d = parseDate(date);
    if (!d) return false;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return d >= cutoff && d <= new Date();
}

// ─────────────────────────────────────────────
// DATE DIFFERENCES
// ─────────────────────────────────────────────

/**
 * Get difference in milliseconds
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in ms
 */
export function diffInMs(date1, date2) {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);

    if (!d1 || !d2) return 0;

    return Math.abs(d2.getTime() - d1.getTime());
}

/**
 * Get difference in seconds
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in seconds
 */
export function diffInSeconds(date1, date2) {
    return Math.floor(diffInMs(date1, date2) / 1000);
}

/**
 * Get difference in minutes
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in minutes
 */
export function diffInMinutes(date1, date2) {
    return Math.floor(diffInMs(date1, date2) / (1000 * 60));
}

/**
 * Get difference in hours
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in hours
 */
export function diffInHours(date1, date2) {
    return Math.floor(diffInMs(date1, date2) / (1000 * 60 * 60));
}

/**
 * Get difference in days
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in days
 */
export function diffInDays(date1, date2) {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);

    if (!d1 || !d2) return 0;

    // Reset time to midnight for accurate day count
    const d1Midnight = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const d2Midnight = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

    const diffTime = Math.abs(d2Midnight - d1Midnight);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in weeks
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in weeks
 */
export function diffInWeeks(date1, date2) {
    return Math.floor(diffInDays(date1, date2) / 7);
}

/**
 * Get difference in months (approximate)
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in months
 */
export function diffInMonths(date1, date2) {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);

    if (!d1 || !d2) return 0;

    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();

    return Math.abs(yearDiff * 12 + monthDiff);
}

// ─────────────────────────────────────────────
// DATE MANIPULATION
// ─────────────────────────────────────────────

/**
 * Add days to date
 * @param {Date|string} date - Date
 * @param {number} days - Days to add
 * @returns {Date}
 */
export function addDays(date, days) {
    const d = parseDate(date);
    if (!d) return new Date();

    const result = new Date(d);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Add weeks to date
 * @param {Date|string} date - Date
 * @param {number} weeks - Weeks to add
 * @returns {Date}
 */
export function addWeeks(date, weeks) {
    return addDays(date, weeks * 7);
}

/**
 * Add months to date
 * @param {Date|string} date - Date
 * @param {number} months - Months to add
 * @returns {Date}
 */
export function addMonths(date, months) {
    const d = parseDate(date);
    if (!d) return new Date();

    const result = new Date(d);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Subtract days from date
 * @param {Date|string} date - Date
 * @param {number} days - Days to subtract
 * @returns {Date}
 */
export function subtractDays(date, days) {
    return addDays(date, -days);
}

/**
 * Get start of day (midnight)
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export function startOfDay(date) {
    const d = parseDate(date);
    if (!d) return new Date();

    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Get end of day (23:59:59.999)
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export function endOfDay(date) {
    const d = parseDate(date);
    if (!d) return new Date();

    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * Get start of week (Sunday)
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export function startOfWeek(date) {
    const d = parseDate(date);
    if (!d) return new Date();

    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0, 0);
}

/**
 * Get end of week (Saturday)
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export function endOfWeek(date) {
    const start = startOfWeek(date);
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
}

/**
 * Get start of month
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export function startOfMonth(date) {
    const d = parseDate(date);
    if (!d) return new Date();

    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Get end of month
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export function endOfMonth(date) {
    const d = parseDate(date);
    if (!d) return new Date();

    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

// ─────────────────────────────────────────────
// STREAK UTILITIES
// ─────────────────────────────────────────────

/**
 * Check if streak should continue
 * @param {string|Date} lastWorkoutDate - Last workout date
 * @returns {boolean}
 */
export function shouldContinueStreak(lastWorkoutDate) {
    if (!lastWorkoutDate) return false;

    const last = parseDate(lastWorkoutDate);
    if (!last) return false;

    const daysDiff = diffInDays(last, new Date());

    // Streak continues if last workout was today or yesterday
    return daysDiff <= 1;
}

/**
 * Check if streak is broken
 * @param {string|Date} lastWorkoutDate - Last workout date
 * @returns {boolean}
 */
export function isStreakBroken(lastWorkoutDate) {
    if (!lastWorkoutDate) return true;

    const last = parseDate(lastWorkoutDate);
    if (!last) return true;

    const daysDiff = diffInDays(last, new Date());

    // Streak is broken if more than 1 day has passed
    return daysDiff > 1;
}

/**
 * Get streak status
 * @param {string|Date} lastWorkoutDate - Last workout date
 * @returns {Object} { status: string, daysUntilBreak: number }
 */
export function getStreakStatus(lastWorkoutDate) {
    if (!lastWorkoutDate) {
        return { status: 'none', daysUntilBreak: 0 };
    }

    const last = parseDate(lastWorkoutDate);
    if (!last) {
        return { status: 'none', daysUntilBreak: 0 };
    }

    if (isToday(last)) {
        return { status: 'safe', daysUntilBreak: 1 };
    }

    if (isYesterday(last)) {
        return { status: 'warning', daysUntilBreak: 0 };
    }

    return { status: 'broken', daysUntilBreak: 0 };
}

// ─────────────────────────────────────────────
// DATE RANGES
// ─────────────────────────────────────────────

/**
 * Get array of dates between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Array<Date>}
 */
export function getDateRange(startDate, endDate) {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) return [];

    const dates = [];
    const current = new Date(start);

    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

/**
 * Get dates for current week
 * @returns {Array<Date>}
 */
export function getCurrentWeekDates() {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    return getDateRange(start, end);
}

/**
 * Get dates for current month
 * @returns {Array<Date>}
 */
export function getCurrentMonthDates() {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return getDateRange(start, end);
}

// ─────────────────────────────────────────────
// DAY OF WEEK
// ─────────────────────────────────────────────

/**
 * Get day of week name
 * @param {Date|string} date - Date
 * @param {string} format - 'long' or 'short'
 * @returns {string}
 */
export function getDayName(date, format = 'long') {
    const d = parseDate(date);
    if (!d) return '';

    const options = { weekday: format };
    return d.toLocaleDateString('en-US', options);
}

/**
 * Get day of week number (0 = Sunday, 6 = Saturday)
 * @param {Date|string} date - Date
 * @returns {number}
 */
export function getDayOfWeek(date) {
    const d = parseDate(date);
    if (!d) return 0;
    return d.getDay();
}

/**
 * Check if date is weekend
 * @param {Date|string} date - Date
 * @returns {boolean}
 */
export function isWeekend(date) {
    const day = getDayOfWeek(date);
    return day === 0 || day === 6;
}

/**
 * Check if date is weekday
 * @param {Date|string} date - Date
 * @returns {boolean}
 */
export function isWeekday(date) {
    return !isWeekend(date);
}

// ─────────────────────────────────────────────
// TIME OF DAY
// ─────────────────────────────────────────────

/**
 * Get time of day category
 * @param {Date|string} date - Date
 * @returns {string} 'morning', 'afternoon', 'evening', or 'night'
 */
export function getTimeOfDay(date) {
    const d = parseDate(date) || new Date();
    const hour = d.getHours();

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

/**
 * Get greeting based on time of day
 * @param {Date|string} date - Date
 * @returns {string}
 */
export function getGreeting(date) {
    const timeOfDay = getTimeOfDay(date);

    const greetings = {
        morning: 'Good Morning',
        afternoon: 'Good Afternoon',
        evening: 'Good Evening',
        night: 'Good Night',
    };

    return greetings[timeOfDay];
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
    now,
    today,
    yesterday,
    tomorrow,
    parseDate,
    isValidDate,
    formatDateString,
    formatISO,
    formatTime,
    formatDateTime,
    isSameDay,
    isToday,
    isYesterday,
    isTomorrow,
    isPast,
    isFuture,
    isWithinDays,
    diffInMs,
    diffInSeconds,
    diffInMinutes,
    diffInHours,
    diffInDays,
    diffInWeeks,
    diffInMonths,
    addDays,
    addWeeks,
    addMonths,
    subtractDays,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    shouldContinueStreak,
    isStreakBroken,
    getStreakStatus,
    getDateRange,
    getCurrentWeekDates,
    getCurrentMonthDates,
    getDayName,
    getDayOfWeek,
    isWeekend,
    isWeekday,
    getTimeOfDay,
    getGreeting,
};