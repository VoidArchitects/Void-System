// ============================================================
// VOID SYSTEM — streaks.js
// Streak Tracking | Retention System | Warning Logic
// ============================================================

import { Storage } from '../storage.js';
import { formatStreak, formatDate } from '../utils/formatters.js';
import { getStreakStatus, diffInDays, isToday, isYesterday } from '../utils/dateUtils.js';
import { playWarning } from '../utils/soundManager.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const StreakState = {
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    status: 'none',
    daysUntilBreak: 0,
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
    loadStreakData();
    renderStreakPage();
    checkStreakWarnings();
}

// ─────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────

function loadStreakData() {
    const player = Storage.getPlayer();

    StreakState.currentStreak = player.streak || 0;
    StreakState.longestStreak = player.longestStreak || 0;
    StreakState.lastWorkoutDate = player.lastWorkoutDate;

    const streakStatus = getStreakStatus(player.lastWorkoutDate);
    StreakState.status = streakStatus.status;
    StreakState.daysUntilBreak = streakStatus.daysUntilBreak;
}

// ─────────────────────────────────────────────
// STREAK WARNINGS
// ─────────────────────────────────────────────

function checkStreakWarnings() {
    if (StreakState.status === 'warning') {
        showStreakWarning();
    } else if (StreakState.status === 'broken') {
        showStreakBroken();
    }
}

function showStreakWarning() {
    playWarning();

    const notification = document.createElement('div');
    notification.className = 'streak-warning-notification';
    notification.innerHTML = `
    <div class="streak-warning-box">
      <span class="warning-icon">⚠️</span>
      <h3 class="warning-title">STREAK AT RISK</h3>
      <p class="warning-text">Complete a workout today to maintain your ${StreakState.currentStreak}-day streak!</p>
      <button class="btn-warning-dismiss" onclick="this.parentElement.parentElement.remove()">ACKNOWLEDGED</button>
    </div>
  `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 100);
}

function showStreakBroken() {
    const notification = document.createElement('div');
    notification.className = 'streak-broken-notification';
    notification.innerHTML = `
    <div class="streak-broken-box">
      <span class="broken-icon">💔</span>
      <h3 class="broken-title">STREAK BROKEN</h3>
      <p class="broken-text">Your streak has been reset. Start a new one today!</p>
      <button class="btn-broken-dismiss" onclick="this.parentElement.parentElement.remove()">CONTINUE</button>
    </div>
  `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 100);
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderStreakPage() {
    const root = document.getElementById('streaks-root');
    if (!root) return;

    const lastWorkoutText = StreakState.lastWorkoutDate
        ? formatDate(StreakState.lastWorkoutDate, 'relative')
        : 'Never';

    root.innerHTML = `
    <div class="streaks-screen">

      <!-- Header -->
      <div class="streaks-header">
        <div class="streaks-screen-tag">// CONSISTENCY TRACKER</div>
        <h1 class="streaks-screen-title">STREAK <span class="accent">SYSTEM</span></h1>
        <p class="streaks-screen-sub">Track your consistency and build discipline.</p>
      </div>

      <!-- Current Streak Card -->
      <div class="streak-main-card ${getStreakStatusClass()}">
        <div class="streak-flame-icon">${getStreakFlameIcon()}</div>
        <div class="streak-main-info">
          <span class="streak-label">CURRENT STREAK</span>
          <h2 class="streak-value">${StreakState.currentStreak}</h2>
          <span class="streak-unit">${StreakState.currentStreak === 1 ? 'DAY' : 'DAYS'}</span>
        </div>
        <div class="streak-status-badge ${StreakState.status}">
          ${getStreakStatusText()}
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="streak-stats-grid">
        <div class="streak-stat-card">
          <span class="stat-label">LONGEST STREAK</span>
          <span class="stat-value">${StreakState.longestStreak} days</span>
        </div>
        <div class="streak-stat-card">
          <span class="stat-label">LAST WORKOUT</span>
          <span class="stat-value">${lastWorkoutText}</span>
        </div>
        <div class="streak-stat-card">
          <span class="stat-label">STATUS</span>
          <span class="stat-value ${StreakState.status}">${StreakState.status.toUpperCase()}</span>
        </div>
      </div>

      <!-- Streak Calendar (Future) -->
      <div class="streak-section">
        <h2 class="section-title">STREAK CALENDAR</h2>
        <div class="streak-calendar-placeholder">
          <span class="placeholder-text">Calendar view coming soon</span>
          <p class="placeholder-sub">Track your workout days visually</p>
        </div>
      </div>

      <!-- Streak Milestones -->
      <div class="streak-section">
        <h2 class="section-title">MILESTONES</h2>
        <div class="streak-milestones">
          ${renderStreakMilestones()}
        </div>
      </div>

      <!-- Motivation -->
      <div class="streak-motivation">
        <span class="motivation-icon">💪</span>
        <p class="motivation-text">${getMotivationMessage()}</p>
      </div>

    </div>
  `;
}

function getStreakStatusClass() {
    switch (StreakState.status) {
        case 'safe':
            return 'streak-safe';
        case 'warning':
            return 'streak-warning';
        case 'broken':
            return 'streak-broken';
        default:
            return 'streak-none';
    }
}

function getStreakFlameIcon() {
    if (StreakState.currentStreak === 0) return '🔥';
    if (StreakState.currentStreak >= 100) return '🔥🔥🔥';
    if (StreakState.currentStreak >= 30) return '🔥🔥';
    return '🔥';
}

function getStreakStatusText() {
    switch (StreakState.status) {
        case 'safe':
            return '✓ SAFE';
        case 'warning':
            return '⚠ AT RISK';
        case 'broken':
            return '✗ BROKEN';
        case 'none':
            return '— INACTIVE';
        default:
            return '—';
    }
}

function renderStreakMilestones() {
    const milestones = [
        { days: 7, label: 'Week Warrior', achieved: StreakState.longestStreak >= 7 },
        { days: 14, label: 'Two Week Champion', achieved: StreakState.longestStreak >= 14 },
        { days: 30, label: 'Monthly Master', achieved: StreakState.longestStreak >= 30 },
        { days: 60, label: 'Two Month Legend', achieved: StreakState.longestStreak >= 60 },
        { days: 100, label: 'Century', achieved: StreakState.longestStreak >= 100 },
        { days: 365, label: 'Year of Discipline', achieved: StreakState.longestStreak >= 365 },
    ];

    return milestones.map(m => `
    <div class="milestone-card ${m.achieved ? 'achieved' : 'locked'}">
      <div class="milestone-icon">${m.achieved ? '✓' : '🔒'}</div>
      <div class="milestone-info">
        <span class="milestone-label">${m.label}</span>
        <span class="milestone-days">${m.days} days</span>
      </div>
    </div>
  `).join('');
}

function getMotivationMessage() {
    const messages = {
        none: 'Start your first workout to begin a streak.',
        safe: 'Great work! Keep the momentum going.',
        warning: 'Today is critical. Complete a workout to maintain your streak!',
        broken: 'Every master was once a beginner. Start again today.',
    };

    return messages[StreakState.status] || messages.none;
}

// ─────────────────────────────────────────────
// STREAK CALCULATION HELPERS
// ─────────────────────────────────────────────

// [FIX] Commented out duplicated streak logic to prevent desyncs (use Storage.updateStreak() natively)
/*
function calculateStreakFromHistory(workoutHistory) {
    if (!workoutHistory || workoutHistory.length === 0) return 0;

    // Sort workouts by date (most recent first)
    const sorted = [...workoutHistory].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    let checkDate = new Date();

    for (const workout of sorted) {
        const workoutDate = new Date(workout.date);
        const daysDiff = diffInDays(workoutDate, checkDate);

        if (daysDiff === 0 || daysDiff === 1) {
            streak++;
            checkDate = workoutDate;
        } else {
            break;
        }
    }

    return streak;
}
*/

function getStreakBonus(streakDays) {
    // 10% bonus per day, capped at 50%
    const bonus = Math.min(streakDays * 0.1, 0.5);
    return Math.round(bonus * 100);
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    loadStreakData,
    renderStreakPage,
    checkStreakWarnings,
    // [FIX] Commented out duplicated export
    // calculateStreakFromHistory,
    getStreakBonus,
    StreakState,
};

// Auto-init if on streaks page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}