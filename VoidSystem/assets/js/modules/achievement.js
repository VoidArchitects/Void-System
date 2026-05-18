// ============================================================
// VOID SYSTEM — achievements.js
// Achievement System | Unlock Logic | Badge Display
// ============================================================

import { Storage } from '../storage.js';
import { playAchievement } from '../utils/soundManager.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const AchievementState = {
    allAchievements: [],
    unlockedAchievements: [],
    lockedAchievements: [],
    loaded: false,
};

// ─────────────────────────────────────────────
// ACHIEVEMENT DEFINITIONS (FALLBACK)
// ─────────────────────────────────────────────

const FALLBACK_ACHIEVEMENTS = [
    {
        id: 'first_workout',
        name: 'First Steps',
        description: 'Complete your first workout',
        tier: 'bronze',
        icon: '🏋️',
        condition: { type: 'workouts', value: 1 },
    },
    {
        id: 'ten_workouts',
        name: 'Getting Started',
        description: 'Complete 10 workouts',
        tier: 'bronze',
        icon: '💪',
        condition: { type: 'workouts', value: 10 },
    },
    {
        id: 'fifty_workouts',
        name: 'Dedicated',
        description: 'Complete 50 workouts',
        tier: 'silver',
        icon: '⚡',
        condition: { type: 'workouts', value: 50 },
    },
    {
        id: 'hundred_workouts',
        name: 'Century',
        description: 'Complete 100 workouts',
        tier: 'gold',
        icon: '🔥',
        condition: { type: 'workouts', value: 100 },
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        tier: 'bronze',
        icon: '📅',
        condition: { type: 'streak', value: 7 },
    },
    {
        id: 'streak_30',
        name: 'Monthly Dedication',
        description: 'Maintain a 30-day streak',
        tier: 'silver',
        icon: '🗓️',
        condition: { type: 'streak', value: 30 },
    },
    {
        id: 'streak_100',
        name: 'Unstoppable',
        description: 'Maintain a 100-day streak',
        tier: 'gold',
        icon: '👑',
        condition: { type: 'streak', value: 100 },
    },
    {
        id: 'level_10',
        name: 'D-Rank Ascension',
        description: 'Reach level 10',
        tier: 'bronze',
        icon: '⬆️',
        condition: { type: 'level', value: 10 },
    },
    {
        id: 'level_25',
        name: 'C-Rank Hunter',
        description: 'Reach level 25',
        tier: 'silver',
        icon: '🎯',
        condition: { type: 'level', value: 25 },
    },
    {
        id: 'level_50',
        name: 'A-Rank Elite',
        description: 'Reach level 50',
        tier: 'gold',
        icon: '⭐',
        condition: { type: 'level', value: 50 },
    },
    {
        id: 'level_75',
        name: 'S-Rank Legend',
        description: 'Reach level 75',
        tier: 'platinum',
        icon: '✨',
        condition: { type: 'level', value: 75 },
    },
    {
        id: 'all_quests',
        name: 'Quest Master',
        description: 'Complete all available quests',
        tier: 'legendary',
        icon: '🏆',
        condition: { type: 'quests', value: 'all' },
    },
];

// ─────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────

async function loadAchievements() {
    try {
        const res = await fetch('../data/achievements.json');
        const data = await res.json();
        AchievementState.allAchievements = data.achievements || FALLBACK_ACHIEVEMENTS;
    } catch (err) {
        console.warn('[ACHIEVEMENTS] Failed to load achievements.json, using fallback');
        AchievementState.allAchievements = FALLBACK_ACHIEVEMENTS;
    }

    AchievementState.loaded = true;
    updateAchievementState();
}

function updateAchievementState() {
    const unlockedIds = Storage.getAchievements();

    AchievementState.unlockedAchievements = AchievementState.allAchievements.filter(a =>
        unlockedIds.includes(a.id)
    );

    AchievementState.lockedAchievements = AchievementState.allAchievements.filter(a =>
        !unlockedIds.includes(a.id)
    );
}

// ─────────────────────────────────────────────
// ACHIEVEMENT CHECKING
// ─────────────────────────────────────────────

function checkAchievements() {
    const player = Storage.getPlayer();
    const newUnlocks = [];

    AchievementState.lockedAchievements.forEach(achievement => {
        if (isAchievementUnlocked(achievement, player)) {
            const success = Storage.unlockAchievement(achievement.id);
            if (success) {
                newUnlocks.push(achievement);
            }
        }
    });

    if (newUnlocks.length > 0) {
        updateAchievementState();
        newUnlocks.forEach(a => showAchievementNotification(a));
    }

    return newUnlocks;
}

function isAchievementUnlocked(achievement, player) {
    const { type, value } = achievement.condition;

    switch (type) {
        case 'workouts':
            return player.totalWorkouts >= value;

        case 'streak':
            return player.streak >= value || player.longestStreak >= value;

        case 'level':
            return player.level >= value;

        case 'xp':
            return player.xp >= value;

        case 'quests':
            if (value === 'all') {
                // Check if all quests are completed (future implementation)
                return false;
            }
            return player.completedQuests.length >= value;

        default:
            return false;
    }
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderAchievementsPage() {
    const root = document.getElementById('achievements-root');
    if (!root) return;

    if (!AchievementState.loaded) {
        root.innerHTML = `
      <div class="loading-screen">
        <span class="loading-text">LOADING ACHIEVEMENTS...</span>
      </div>
    `;
        return;
    }

    const unlocked = AchievementState.unlockedAchievements;
    const locked = AchievementState.lockedAchievements;
    const total = AchievementState.allAchievements.length;
    const progress = Math.round((unlocked.length / total) * 100);

    root.innerHTML = `
    <div class="achievements-screen">

      <!-- Header -->
      <div class="achievements-header">
        <div class="achievements-screen-tag">// ACHIEVEMENT VAULT</div>
        <h1 class="achievements-screen-title">EARNED <span class="accent">BADGES</span></h1>
        <p class="achievements-screen-sub">Track your milestones and unlock rewards.</p>
      </div>

      <!-- Progress Overview -->
      <div class="achievements-progress-card">
        <div class="achievements-progress-header">
          <span class="progress-label">COMPLETION</span>
          <span class="progress-count">${unlocked.length} / ${total}</span>
        </div>
        <div class="achievements-progress-bar">
          <div class="achievements-progress-fill" style="width: ${progress}%"></div>
        </div>
        <span class="progress-percent">${progress}%</span>
      </div>

      <!-- Unlocked Achievements -->
      ${unlocked.length > 0 ? `
        <div class="achievements-section">
          <h2 class="section-title">UNLOCKED</h2>
          <div class="achievements-grid">
            ${unlocked.map(a => renderAchievementCard(a, true)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Locked Achievements -->
      ${locked.length > 0 ? `
        <div class="achievements-section">
          <h2 class="section-title">LOCKED</h2>
          <div class="achievements-grid">
            ${locked.map(a => renderAchievementCard(a, false)).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

function renderAchievementCard(achievement, unlocked) {
    const tierColors = {
        bronze: '#cd7f32',
        silver: '#c0c0c0',
        gold: '#ffd700',
        platinum: '#e5e4e2',
        legendary: '#aa44ff',
    };

    const tierColor = tierColors[achievement.tier] || tierColors.bronze;

    return `
    <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" style="--tier-color: ${tierColor}">
      <div class="achievement-icon ${unlocked ? '' : 'locked-icon'}">${unlocked ? achievement.icon : '🔒'}</div>
      <div class="achievement-info">
        <h3 class="achievement-name">${unlocked ? achievement.name : '???'}</h3>
        <p class="achievement-desc">${unlocked ? achievement.description : 'Complete the requirement to unlock'}</p>
      </div>
      <div class="achievement-tier" style="color: ${tierColor}">${achievement.tier.toUpperCase()}</div>
      ${unlocked ? '<div class="achievement-badge-shine"></div>' : ''}
    </div>
  `;
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

function showAchievementNotification(achievement) {
    playAchievement();

    const notification = document.createElement('div');
    notification.className = 'achievement-unlock-notification';
    notification.innerHTML = `
    <div class="achievement-unlock-box">
      <span class="unlock-tag">ACHIEVEMENT UNLOCKED</span>
      <div class="unlock-icon">${achievement.icon}</div>
      <h3 class="unlock-name">${achievement.name}</h3>
      <p class="unlock-desc">${achievement.description}</p>
    </div>
  `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 100);

    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

async function init() {
    await loadAchievements();
    renderAchievementsPage();

    // Auto-check achievements
    checkAchievements();
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    loadAchievements,
    checkAchievements,
    renderAchievementsPage,
    showAchievementNotification,
    AchievementState,
};

// Auto-init if on achievements page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}