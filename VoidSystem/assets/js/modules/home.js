// ============================================================
// VOID SYSTEM — home.js
// Dashboard System | Main Hub | Quick Stats Display
// ============================================================

import { Storage } from '../storage.js';
import { formatXP, formatLevel, formatRank, formatTitle, formatStreak } from '../utils/formatters.js';
import { calculateXPProgress, getRankInfo, calculateXPToNextLevel } from '../utils/calculations.js';
import { getGreeting } from '../utils/dateUtils.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const DashboardState = {
    player: null,
    activeQuests: [],
    recentWorkouts: [],
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
    DashboardState.player = Storage.getPlayer();
    DashboardState.activeQuests = Storage.getActiveQuests();
    DashboardState.recentWorkouts = Storage.getWorkoutHistory().slice(-3).reverse();

    renderDashboard();
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderDashboard() {
    const root = document.getElementById('dashboard-root');
    if (!root) return;

    const player = DashboardState.player;
    const greeting = getGreeting(new Date());
    const xpProgress = calculateXPProgress(player.xp, player.level);
    const xpToNext = calculateXPToNextLevel(player.xp, player.level);
    const rankInfo = getRankInfo(player.rank);

    root.innerHTML = `
    <div class="dashboard-screen">

      <!-- Greeting Header -->
      <div class="dashboard-greeting">
        <h1 class="greeting-title">${greeting}, <span class="accent">${player.name || 'Player'}</span></h1>
        <p class="greeting-sub">VOID SYSTEM ONLINE — READY FOR PROGRESSION</p>
      </div>

      <!-- Main Stats Card -->
      <div class="dashboard-stats-card">
        <div class="stats-row">
          <div class="stat-block">
            <span class="stat-label">LEVEL</span>
            <span class="stat-value accent">${player.level}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label">RANK</span>
            <div class="rank-badge-mini" style="--rank-color: ${rankInfo.color}">
              <span class="rank-glyph">${rankInfo.glyph}</span>
              <span class="rank-text">${player.rank}</span>
            </div>
          </div>
          <div class="stat-block">
            <span class="stat-label">TOTAL XP</span>
            <span class="stat-value">${formatXP(player.xp)}</span>
          </div>
          <div class="stat-block">
            <span class="stat-label">STREAK</span>
            <span class="stat-value streak-value">${player.streak} 🔥</span>
          </div>
        </div>

        <!-- XP Progress -->
        <div class="xp-progress-section">
          <div class="xp-progress-header">
            <span class="xp-progress-label">LEVEL PROGRESS</span>
            <span class="xp-progress-percent">${Math.round(xpProgress)}%</span>
          </div>
          <div class="xp-progress-bar-track">
            <div class="xp-progress-bar-fill" style="width: ${xpProgress}%"></div>
          </div>
          <div class="xp-progress-info">
            <span>${formatXP(xpToNext)} to next level</span>
          </div>
        </div>
      </div>

      <!-- Title Display -->
      <div class="dashboard-title-card">
        <span class="title-tag">CURRENT TITLE</span>
        <h2 class="title-display">"${player.title}"</h2>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-section">
        <h3 class="section-title">QUICK ACTIONS</h3>
        <div class="quick-actions-grid">
          <a href="workout.html" class="action-card action-workout">
            <span class="action-icon">💪</span>
            <span class="action-label">START WORKOUT</span>
            <span class="action-desc">Begin training session</span>
          </a>
          <a href="quests.html" class="action-card action-quests">
            <span class="action-icon">✦</span>
            <span class="action-label">VIEW QUESTS</span>
            <span class="action-desc">${DashboardState.activeQuests.length} active</span>
          </a>
          <a href="progress.html" class="action-card action-progress">
            <span class="action-icon">📊</span>
            <span class="action-label">TRACK PROGRESS</span>
            <span class="action-desc">View history</span>
          </a>
          <a href="profile.html" class="action-card action-profile">
            <span class="action-icon">👤</span>
            <span class="action-label">VIEW PROFILE</span>
            <span class="action-desc">Stats & achievements</span>
          </a>
        </div>
      </div>

      <!-- Active Quests Preview -->
      ${DashboardState.activeQuests.length > 0 ? `
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">ACTIVE QUESTS</h3>
            <a href="quests.html" class="section-link">VIEW ALL →</a>
          </div>
          <div class="quests-preview">
            ${renderActiveQuestsPreview()}
          </div>
        </div>
      ` : ''}

      <!-- Recent Workouts Preview -->
      ${DashboardState.recentWorkouts.length > 0 ? `
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">RECENT SESSIONS</h3>
            <a href="progress.html" class="section-link">VIEW ALL →</a>
          </div>
          <div class="workouts-preview">
            ${renderRecentWorkoutsPreview()}
          </div>
        </div>
      ` : ''}

      <!-- System Message -->
      <div class="dashboard-system-message">
        <span class="system-msg-icon">▸</span>
        <span class="system-msg-text">${getSystemMessage()}</span>
      </div>

    </div>
  `;
}

// ─────────────────────────────────────────────
// COMPONENT RENDERERS
// ─────────────────────────────────────────────

function renderActiveQuestsPreview() {
    const preview = DashboardState.activeQuests.slice(0, 3);

    return preview.map(questId => {
        // This is simplified - in real implementation, fetch quest details from quests.json
        return `
      <div class="quest-preview-card">
        <span class="quest-preview-title">Quest: ${questId}</span>
        <span class="quest-preview-status">IN PROGRESS</span>
      </div>
    `;
    }).join('');
}

function renderRecentWorkoutsPreview() {
    return DashboardState.recentWorkouts.map(workout => {
        const date = new Date(workout.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const duration = Math.floor(workout.duration / 60);

        return `
      <div class="workout-preview-card">
        <div class="workout-preview-header">
          <span class="workout-preview-type">${workout.type.toUpperCase()}</span>
          <span class="workout-preview-date">${dateStr}</span>
        </div>
        <div class="workout-preview-stats">
          <span>${workout.exercisesCompleted}/${workout.totalExercises} exercises</span>
          <span>${duration}m</span>
          <span class="workout-preview-xp">+${workout.xpEarned} XP</span>
        </div>
      </div>
    `;
    }).join('');
}

// ─────────────────────────────────────────────
// SYSTEM MESSAGES
// ─────────────────────────────────────────────

function getSystemMessage() {
    const player = DashboardState.player;
    const messages = [];

    // Streak-based messages
    if (player.streak === 0) {
        messages.push('Start your first workout to begin a streak.');
    } else if (player.streak >= 7) {
        messages.push(`Impressive ${player.streak}-day streak! Keep the momentum.`);
    } else if (player.streak >= 3) {
        messages.push('Streak active. Maintain consistency.');
    }

    // Level-based messages
    if (player.level < 5) {
        messages.push('Complete workouts to gain XP and level up.');
    } else if (player.level >= 10 && player.level < 20) {
        messages.push('D-Rank progression unlocked. Continue training.');
    } else if (player.level >= 50) {
        messages.push('A-Rank hunter detected. Elite tier achieved.');
    }

    // Quest-based messages
    if (DashboardState.activeQuests.length === 0) {
        messages.push('No active quests. Visit the quest board to accept new challenges.');
    }

    // Default message
    if (messages.length === 0) {
        messages.push('System operational. Ready for progression.');
    }

    // Return random message
    return messages[Math.floor(Math.random() * messages.length)];
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    renderDashboard,
};

// Auto-init if on dashboard page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}