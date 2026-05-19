// ============================================================
// VOID SYSTEM — achievementsData.js
// Achievement Data Loader | JSON Bridge | Fallback Handler
// ============================================================

// ─────────────────────────────────────────────
// FALLBACK ACHIEVEMENT DATA
// ─────────────────────────────────────────────

const FALLBACK_ACHIEVEMENTS = [
    // WORKOUT ACHIEVEMENTS
    {
        id: 'first_workout',
        name: 'First Steps Into the Void',
        description: 'Complete your first workout session',
        tier: 'bronze',
        icon: '🏋️',
        category: 'physical',
        condition: { type: 'workouts', value: 1 },
        xpReward: 50,
    },
    {
        id: 'ten_workouts',
        name: 'Getting Started',
        description: 'Complete 10 workout sessions',
        tier: 'bronze',
        icon: '💪',
        category: 'physical',
        condition: { type: 'workouts', value: 10 },
        xpReward: 100,
    },
    {
        id: 'twenty_five_workouts',
        name: 'Forged in Repetition',
        description: 'Complete 25 workout sessions',
        tier: 'silver',
        icon: '⚡',
        category: 'physical',
        condition: { type: 'workouts', value: 25 },
        xpReward: 250,
    },
    {
        id: 'fifty_workouts',
        name: 'Half-Century',
        description: 'Complete 50 workout sessions',
        tier: 'silver',
        icon: '🔥',
        category: 'physical',
        condition: { type: 'workouts', value: 50 },
        xpReward: 500,
    },
    {
        id: 'hundred_workouts',
        name: 'Century',
        description: 'Complete 100 workout sessions',
        tier: 'gold',
        icon: '💯',
        category: 'physical',
        condition: { type: 'workouts', value: 100 },
        xpReward: 1000,
    },
    {
        id: 'two_hundred_workouts',
        name: 'Grind Master',
        description: 'Complete 200 workout sessions',
        tier: 'platinum',
        icon: '👑',
        category: 'physical',
        condition: { type: 'workouts', value: 200 },
        xpReward: 2000,
    },

    // STREAK ACHIEVEMENTS
    {
        id: 'streak_3',
        name: 'Triple Threat',
        description: 'Maintain a 3-day workout streak',
        tier: 'bronze',
        icon: '📅',
        category: 'discipline',
        condition: { type: 'streak', value: 3 },
        xpReward: 75,
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day workout streak',
        tier: 'bronze',
        icon: '🗓️',
        category: 'discipline',
        condition: { type: 'streak', value: 7 },
        xpReward: 150,
    },
    {
        id: 'streak_14',
        name: 'Two Week Champion',
        description: 'Maintain a 14-day workout streak',
        tier: 'silver',
        icon: '📆',
        category: 'discipline',
        condition: { type: 'streak', value: 14 },
        xpReward: 300,
    },
    {
        id: 'streak_30',
        name: 'Monthly Dedication',
        description: 'Maintain a 30-day workout streak',
        tier: 'silver',
        icon: '🌙',
        category: 'discipline',
        condition: { type: 'streak', value: 30 },
        xpReward: 600,
    },
    {
        id: 'streak_60',
        name: 'Two Month Legend',
        description: 'Maintain a 60-day workout streak',
        tier: 'gold',
        icon: '⭐',
        category: 'discipline',
        condition: { type: 'streak', value: 60 },
        xpReward: 1200,
    },
    {
        id: 'streak_100',
        name: 'Unstoppable',
        description: 'Maintain a 100-day workout streak',
        tier: 'gold',
        icon: '🔱',
        category: 'discipline',
        condition: { type: 'streak', value: 100 },
        xpReward: 2000,
    },
    {
        id: 'streak_365',
        name: 'Year of Iron',
        description: 'Maintain a 365-day workout streak',
        tier: 'legendary',
        icon: '👑',
        category: 'discipline',
        condition: { type: 'streak', value: 365 },
        xpReward: 10000,
    },

    // LEVEL ACHIEVEMENTS
    {
        id: 'level_5',
        name: 'Awakened',
        description: 'Reach Level 5',
        tier: 'bronze',
        icon: '⬆️',
        category: 'progression',
        condition: { type: 'level', value: 5 },
        xpReward: 100,
    },
    {
        id: 'level_10',
        name: 'D-Rank Ascension',
        description: 'Reach Level 10 and achieve D-Rank',
        tier: 'bronze',
        icon: '△',
        category: 'progression',
        condition: { type: 'level', value: 10 },
        xpReward: 200,
    },
    {
        id: 'level_20',
        name: 'C-Rank Hunter',
        description: 'Reach Level 20 and achieve C-Rank',
        tier: 'silver',
        icon: '◇',
        category: 'progression',
        condition: { type: 'level', value: 20 },
        xpReward: 400,
    },
    {
        id: 'level_35',
        name: 'B-Rank Elite',
        description: 'Reach Level 35 and achieve B-Rank',
        tier: 'silver',
        icon: '◆',
        category: 'progression',
        condition: { type: 'level', value: 35 },
        xpReward: 700,
    },
    {
        id: 'level_50',
        name: 'A-Rank Master',
        description: 'Reach Level 50 and achieve A-Rank',
        tier: 'gold',
        icon: '★',
        category: 'progression',
        condition: { type: 'level', value: 50 },
        xpReward: 1000,
    },
    {
        id: 'level_75',
        name: 'S-Rank Legend',
        description: 'Reach Level 75 and achieve S-Rank',
        tier: 'platinum',
        icon: '✦',
        category: 'progression',
        condition: { type: 'level', value: 75 },
        xpReward: 2500,
    },
    {
        id: 'level_100',
        name: 'Peak Human',
        description: 'Reach Level 100 - The Apex',
        tier: 'legendary',
        icon: '✨',
        category: 'progression',
        condition: { type: 'level', value: 100 },
        xpReward: 5000,
    },

    // QUEST ACHIEVEMENTS
    {
        id: 'first_quest',
        name: 'Quest Accepted',
        description: 'Complete your first quest',
        tier: 'bronze',
        icon: '✓',
        category: 'quests',
        condition: { type: 'quests', value: 1 },
        xpReward: 100,
    },
    {
        id: 'ten_quests',
        name: 'Quest Hunter',
        description: 'Complete 10 quests',
        tier: 'silver',
        icon: '✦',
        category: 'quests',
        condition: { type: 'quests', value: 10 },
        xpReward: 500,
    },
    {
        id: 'all_quests',
        name: 'Quest Master',
        description: 'Complete all available quests',
        tier: 'legendary',
        icon: '🏆',
        category: 'quests',
        condition: { type: 'quests', value: 'all' },
        xpReward: 5000,
    },

    // SPECIAL ACHIEVEMENTS
    {
        id: 'first_title',
        name: 'Title Bearer',
        description: 'Unlock your first title',
        tier: 'bronze',
        icon: '🎖️',
        category: 'special',
        condition: { type: 'titles', value: 1 },
        xpReward: 50,
    },
    {
        id: 'five_titles',
        name: 'Collector',
        description: 'Unlock 5 different titles',
        tier: 'silver',
        icon: '📜',
        category: 'special',
        condition: { type: 'titles', value: 5 },
        xpReward: 250,
    },
    {
        id: 'all_titles',
        name: 'Title Completionist',
        description: 'Unlock all available titles',
        tier: 'legendary',
        icon: '👑',
        category: 'special',
        condition: { type: 'titles', value: 'all' },
        xpReward: 5000,
    },
];

// ─────────────────────────────────────────────
// DATA LOADER
// ─────────────────────────────────────────────

let cachedAchievements = null;

/**
 * Load achievements from JSON file
 * @returns {Promise<Array>} Array of achievement objects
 */
export async function loadAchievements() {
    // Return cached if available
    if (cachedAchievements) {
        return cachedAchievements;
    }

    try {
        const response = await fetch('../data/achievements.json');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        cachedAchievements = data.achievements || FALLBACK_ACHIEVEMENTS;

        console.log('[ACHIEVEMENTS DATA] Loaded from JSON:', cachedAchievements.length);
        return cachedAchievements;
    } catch (err) {
        console.warn('[ACHIEVEMENTS DATA] Failed to load JSON, using fallback:', err.message);
        cachedAchievements = FALLBACK_ACHIEVEMENTS;
        return FALLBACK_ACHIEVEMENTS;
    }
}

/**
 * Get achievement by ID
 * @param {string} id - Achievement ID
 * @returns {Promise<Object|null>} Achievement object or null
 */
export async function getAchievementById(id) {
    const achievements = await loadAchievements();
    return achievements.find(a => a.id === id) || null;
}

/**
 * Get achievements by tier
 * @param {string} tier - Tier (bronze, silver, gold, platinum, legendary)
 * @returns {Promise<Array>} Filtered achievements
 */
export async function getAchievementsByTier(tier) {
    const achievements = await loadAchievements();
    return achievements.filter(a => a.tier === tier);
}

/**
 * Get achievements by category
 * @param {string} category - Category (physical, discipline, progression, quests, special)
 * @returns {Promise<Array>} Filtered achievements
 */
export async function getAchievementsByCategory(category) {
    const achievements = await loadAchievements();
    return achievements.filter(a => a.category === category);
}

/**
 * Get all achievement IDs
 * @returns {Promise<Array<string>>} Array of achievement IDs
 */
export async function getAllAchievementIds() {
    const achievements = await loadAchievements();
    return achievements.map(a => a.id);
}

/**
 * Clear cache (useful for testing)
 */
export function clearCache() {
    cachedAchievements = null;
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
    loadAchievements,
    getAchievementById,
    getAchievementsByTier,
    getAchievementsByCategory,
    getAllAchievementIds,
    clearCache,
    FALLBACK_ACHIEVEMENTS,
};