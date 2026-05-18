// ============================================================
// VOID SYSTEM — progress.js
// Workout History | Progression Tracking | Timeline Display
// ============================================================

import { Storage } from '../storage.js';
import { formatDate, formatDuration, formatXP, formatWorkoutType } from '../utils/formatters.js';
import { WORKOUT_TYPES } from '../utils/constants.js';
import { diffInDays } from '../utils/dateUtils.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const ProgressState = {
    workoutHistory: [],
    filteredHistory: [],
    currentFilter: 'all',
    currentSort: 'recent',
    statsLoaded: false,
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
    loadProgressData();
    renderProgressPage();
}

// ─────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────

function loadProgressData() {
    ProgressState.workoutHistory = Storage.getWorkoutHistory() || [];
    ProgressState.filteredHistory = [...ProgressState.workoutHistory];
    ProgressState.statsLoaded = true;

    applyFilters();
}

function applyFilters() {
    let filtered = [...ProgressState.workoutHistory];

    // Apply type filter
    if (ProgressState.currentFilter !== 'all') {
        filtered = filtered.filter(w => w.type === ProgressState.currentFilter);
    }

    // Apply sort
    switch (ProgressState.currentSort) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'xp':
            filtered.sort((a, b) => b.xpEarned - a.xpEarned);
            break;
        case 'duration':
            filtered.sort((a, b) => b.duration - a.duration);
            break;
    }

    ProgressState.filteredHistory = filtered;
}

// ─────────────────────────────────────────────
// STATISTICS CALCULATIONS
// ─────────────────────────────────────────────

function calculateStats() {
    const workouts = ProgressState.workoutHistory;

    if (workouts.length === 0) {
        return {
            totalWorkouts: 0,
            totalXP: 0,
            totalDuration: 0,
            avgDuration: 0,
            avgXP: 0,
            mostFrequentType: 'None',
            totalExercises: 0,
        };
    }

    const totalWorkouts = workouts.length;
    const totalXP = workouts.reduce((sum, w) => sum + (w.xpEarned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgDuration = Math.round(totalDuration / totalWorkouts);
    const avgXP = Math.round(totalXP / totalWorkouts);
    const totalExercises = workouts.reduce((sum, w) => sum + (w.exercisesCompleted || 0), 0);

    // Find most frequent workout type
    const typeCounts = {};
    workouts.forEach(w => {
        typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
    });

    const mostFrequentType = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
        totalWorkouts,
        totalXP,
        totalDuration,
        avgDuration,
        avgXP,
        mostFrequentType,
        totalExercises,
    };
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderProgressPage() {
    const root = document.getElementById('progress-root');
    if (!root) return;

    const stats = calculateStats();

    root.innerHTML = `
    <div class="progress-screen">

      <!-- Header -->
      <div class="progress-header">
        <div class="progress-screen-tag">// PROGRESSION ANALYTICS</div>
        <h1 class="progress-screen-title">TRAINING <span class="accent">HISTORY</span></h1>
        <p class="progress-screen-sub">Review your workout sessions and track progression.</p>
      </div>

      <!-- Stats Summary -->
      <div class="progress-stats-grid">
        <div class="progress-stat-card">
          <span class="stat-label">TOTAL WORKOUTS</span>
          <span class="stat-value accent">${stats.totalWorkouts}</span>
        </div>
        <div class="progress-stat-card">
          <span class="stat-label">TOTAL XP EARNED</span>
          <span class="stat-value">${formatXP(stats.totalXP)}</span>
        </div>
        <div class="progress-stat-card">
          <span class="stat-label">AVG DURATION</span>
          <span class="stat-value">${formatDuration(stats.avgDuration)}</span>
        </div>
        <div class="progress-stat-card">
          <span class="stat-label">AVG XP/WORKOUT</span>
          <span class="stat-value">${formatXP(stats.avgXP)}</span>
        </div>
        <div class="progress-stat-card">
          <span class="stat-label">MOST FREQUENT</span>
          <span class="stat-value">${formatWorkoutType(stats.mostFrequentType)}</span>
        </div>
        <div class="progress-stat-card">
          <span class="stat-label">TOTAL EXERCISES</span>
          <span class="stat-value">${stats.totalExercises}</span>
        </div>
      </div>

      <!-- Filters & Sort -->
      <div class="progress-controls">
        <div class="filter-controls">
          <label class="control-label">FILTER BY TYPE</label>
          <select id="filter-type" class="filter-select">
            <option value="all">All Types</option>
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="legs">Legs</option>
            <option value="fullBody">Full Body</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>
        <div class="sort-controls">
          <label class="control-label">SORT BY</label>
          <select id="sort-by" class="sort-select">
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="xp">Highest XP</option>
            <option value="duration">Longest Duration</option>
          </select>
        </div>
      </div>

      <!-- Workout Timeline -->
      <div class="progress-timeline-section">
        <h2 class="section-title">WORKOUT TIMELINE</h2>
        ${ProgressState.filteredHistory.length > 0
            ? renderWorkoutTimeline()
            : renderEmptyState()
        }
      </div>

    </div>
  `;

    bindProgressEvents();
}

function renderWorkoutTimeline() {
    return `
    <div class="workout-timeline">
      ${ProgressState.filteredHistory.map((workout, index) => renderWorkoutCard(workout, index)).join('')}
    </div>
  `;
}

function renderWorkoutCard(workout, index) {
    const date = new Date(workout.date);
    const dateStr = formatDate(date, 'short');
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const daysAgo = diffInDays(date, new Date());
    const relativeDate = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

    const typeInfo = WORKOUT_TYPES[workout.type?.toUpperCase()] || WORKOUT_TYPES.CUSTOM;
    const durationMins = Math.floor(workout.duration / 60);
    const durationSecs = workout.duration % 60;

    return `
    <div class="workout-timeline-card" style="--workout-color: ${typeInfo.color}; --delay: ${index * 0.05}s">
      
      <!-- Timeline Connector -->
      <div class="timeline-connector"></div>
      
      <!-- Card Content -->
      <div class="workout-card-content">
        
        <!-- Header -->
        <div class="workout-card-header">
          <div class="workout-type-badge" style="background: ${typeInfo.color}">
            <span class="type-glyph">${typeInfo.glyph}</span>
            <span class="type-label">${typeInfo.label}</span>
          </div>
          <div class="workout-date-info">
            <span class="workout-date">${dateStr}</span>
            <span class="workout-time">${timeStr}</span>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="workout-card-stats">
          <div class="workout-stat">
            <span class="stat-icon">⏱️</span>
            <span class="stat-text">${durationMins}:${String(durationSecs).padStart(2, '0')}</span>
          </div>
          <div class="workout-stat">
            <span class="stat-icon">💪</span>
            <span class="stat-text">${workout.exercisesCompleted}/${workout.totalExercises} exercises</span>
          </div>
          <div class="workout-stat">
            <span class="stat-icon">✦</span>
            <span class="stat-text accent">+${workout.xpEarned} XP</span>
          </div>
        </div>

        <!-- Exercises Breakdown (Expandable) -->
        ${workout.exercises && workout.exercises.length > 0 ? `
          <details class="workout-details">
            <summary class="workout-details-summary">
              <span>View Exercise Details</span>
              <span class="details-arrow">▼</span>
            </summary>
            <div class="workout-exercises-list">
              ${renderExercisesList(workout.exercises)}
            </div>
          </details>
        ` : ''}

        <!-- Relative Date -->
        <div class="workout-relative-date">${relativeDate}</div>
      
      </div>
    </div>
  `;
}

function renderExercisesList(exercises) {
    return exercises.map(ex => `
    <div class="exercise-item ${ex.skipped ? 'skipped' : ex.isComplete ? 'completed' : ''}">
      <span class="exercise-name">${ex.name}</span>
      <span class="exercise-sets">
        ${ex.skipped
            ? 'SKIPPED'
            : `${ex.completedSets}/${ex.totalSets} sets`
        }
      </span>
    </div>
  `).join('');
}

function renderEmptyState() {
    return `
    <div class="progress-empty-state">
      <span class="empty-icon">📊</span>
      <h3 class="empty-title">No Workout History</h3>
      <p class="empty-text">Complete your first workout to start tracking progression.</p>
      <a href="workout.html" class="btn-empty-action">START WORKOUT</a>
    </div>
  `;
}

// ─────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────

function bindProgressEvents() {
    const filterSelect = document.getElementById('filter-type');
    const sortSelect = document.getElementById('sort-by');

    if (filterSelect) {
        filterSelect.value = ProgressState.currentFilter;
        filterSelect.addEventListener('change', (e) => {
            ProgressState.currentFilter = e.target.value;
            applyFilters();
            renderProgressPage();
        });
    }

    if (sortSelect) {
        sortSelect.value = ProgressState.currentSort;
        sortSelect.addEventListener('change', (e) => {
            ProgressState.currentSort = e.target.value;
            applyFilters();
            renderProgressPage();
        });
    }
}

// ─────────────────────────────────────────────
// EXPORT DATA (FUTURE)
// ─────────────────────────────────────────────

function exportWorkoutHistory() {
    const data = JSON.stringify(ProgressState.workoutHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `void_workout_history_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    loadProgressData,
    renderProgressPage,
    calculateStats,
    exportWorkoutHistory,
    ProgressState,
};

// Auto-init if on progress page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}