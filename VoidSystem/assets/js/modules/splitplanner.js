// ============================================================
// VOID SYSTEM — splitPlanner.js
// Workout Scheduling | Split Management | Weekly Planning
// ============================================================

import { Storage } from '../storage.js';
import { WORKOUT_TYPES } from '../utils/constants.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const SplitState = {
    currentSplit: null,
    weekSchedule: {},
    presetSplits: {},
    loaded: false,
};

// ─────────────────────────────────────────────
// PRESET SPLIT TEMPLATES
// ─────────────────────────────────────────────

const PRESET_SPLITS = {
    ppl: {
        id: 'ppl',
        name: 'Push/Pull/Legs',
        description: '6-day split focusing on movement patterns',
        schedule: {
            monday: 'push',
            tuesday: 'pull',
            wednesday: 'legs',
            thursday: 'push',
            friday: 'pull',
            saturday: 'legs',
            sunday: 'rest',
        },
    },
    upperLower: {
        id: 'upperLower',
        name: 'Upper/Lower',
        description: '4-day split alternating upper and lower body',
        schedule: {
            monday: 'push',
            tuesday: 'legs',
            wednesday: 'rest',
            thursday: 'pull',
            friday: 'legs',
            saturday: 'rest',
            sunday: 'rest',
        },
    },
    fullBody: {
        id: 'fullBody',
        name: 'Full Body',
        description: '3-day full body workouts',
        schedule: {
            monday: 'fullBody',
            tuesday: 'rest',
            wednesday: 'fullBody',
            thursday: 'rest',
            friday: 'fullBody',
            saturday: 'rest',
            sunday: 'rest',
        },
    },
    bro: {
        id: 'bro',
        name: 'Bro Split',
        description: '5-day split by muscle group',
        schedule: {
            monday: 'push',
            tuesday: 'pull',
            wednesday: 'legs',
            thursday: 'push',
            friday: 'pull',
            saturday: 'rest',
            sunday: 'rest',
        },
    },
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
    loadSplitData();
    renderSplitPlanner();
}

// ─────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────

function loadSplitData() {
    SplitState.presetSplits = PRESET_SPLITS;

    // Load user's current split from storage (future implementation)
    const savedSplit = getSavedSplit();

    if (savedSplit) {
        SplitState.currentSplit = savedSplit.id;
        SplitState.weekSchedule = savedSplit.schedule;
    } else {
        // Default to PPL
        SplitState.currentSplit = 'ppl';
        SplitState.weekSchedule = PRESET_SPLITS.ppl.schedule;
    }

    SplitState.loaded = true;
}

function getSavedSplit() {
    // Future: retrieve from Storage
    // For now, return null to use default
    return null;
}

function saveSplit() {
    // Future: save to Storage
    const splitData = {
        id: SplitState.currentSplit,
        schedule: SplitState.weekSchedule,
        updatedAt: new Date().toISOString(),
    };

    console.log('[SPLIT] Saving split:', splitData);
    // [FIX] Uncommented Storage.updateSplit because it was commented out, preventing saves
    // Storage.updateSplit(splitData);
    Storage.updateSplit(splitData);
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderSplitPlanner() {
    const root = document.getElementById('split-planner-root');
    if (!root) return;

    root.innerHTML = `
    <div class="split-planner-screen">

      <!-- Header -->
      <div class="split-header">
        <div class="split-screen-tag">// TRAINING SCHEDULE</div>
        <h1 class="split-screen-title">SPLIT <span class="accent">PLANNER</span></h1>
        <p class="split-screen-sub">Plan your weekly workout schedule.</p>
      </div>

      <!-- Preset Templates -->
      <div class="split-section">
        <h2 class="section-title">PRESET TEMPLATES</h2>
        <div class="preset-splits-grid">
          ${renderPresetSplits()}
        </div>
      </div>

      <!-- Weekly Schedule -->
      <div class="split-section">
        <div class="section-header">
          <h2 class="section-title">WEEKLY SCHEDULE</h2>
          <button class="btn-split btn-save" id="btn-save-split">SAVE SPLIT</button>
        </div>
        <div class="week-schedule-grid">
          ${renderWeekSchedule()}
        </div>
      </div>

      <!-- Workout Type Legend -->
      <div class="split-section">
        <h2 class="section-title">WORKOUT TYPES</h2>
        <div class="workout-legend">
          ${renderWorkoutLegend()}
        </div>
      </div>

    </div>
  `;

    bindSplitEvents();
}

function renderPresetSplits() {
    return Object.values(SplitState.presetSplits).map(split => {
        const isActive = split.id === SplitState.currentSplit;

        return `
      <div class="preset-split-card ${isActive ? 'active' : ''}" data-split-id="${split.id}">
        <h3 class="preset-split-name">${split.name}</h3>
        <p class="preset-split-desc">${split.description}</p>
        <button class="btn-split btn-select-split" data-split-id="${split.id}">
          ${isActive ? 'ACTIVE' : 'SELECT'}
        </button>
      </div>
    `;
    }).join('');
}

function renderWeekSchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return days.map((day, index) => {
        const workoutType = SplitState.weekSchedule[day] || 'rest';
        const workoutInfo = workoutType === 'rest'
            ? { label: 'REST', color: '#3a3a55', glyph: '—' }
            : {
                label: WORKOUT_TYPES[workoutType.toUpperCase()]?.label || workoutType.toUpperCase(),
                color: WORKOUT_TYPES[workoutType.toUpperCase()]?.color || '#ffffff',
                glyph: WORKOUT_TYPES[workoutType.toUpperCase()]?.glyph || '●',
            };

        return `
      <div class="day-schedule-card" data-day="${day}" style="--workout-color: ${workoutInfo.color}">
        <div class="day-label">${dayLabels[index]}</div>
        <div class="day-workout">
          <span class="workout-glyph">${workoutInfo.glyph}</span>
          <span class="workout-label">${workoutInfo.label}</span>
        </div>
        <select class="day-workout-select" data-day="${day}">
          <option value="rest" ${workoutType === 'rest' ? 'selected' : ''}>REST</option>
          <option value="push" ${workoutType === 'push' ? 'selected' : ''}>PUSH</option>
          <option value="pull" ${workoutType === 'pull' ? 'selected' : ''}>PULL</option>
          <option value="legs" ${workoutType === 'legs' ? 'selected' : ''}>LEGS</option>
          <option value="fullBody" ${workoutType === 'fullBody' ? 'selected' : ''}>FULL BODY</option>
          <option value="cardio" ${workoutType === 'cardio' ? 'selected' : ''}>CARDIO</option>
        </select>
      </div>
    `;
    }).join('');
}

function renderWorkoutLegend() {
    const types = [
        { type: 'push', ...WORKOUT_TYPES.PUSH },
        { type: 'pull', ...WORKOUT_TYPES.PULL },
        { type: 'legs', ...WORKOUT_TYPES.LEGS },
        { type: 'fullBody', ...WORKOUT_TYPES.FULL_BODY },
        { type: 'cardio', ...WORKOUT_TYPES.CARDIO },
    ];

    return types.map(workout => `
    <div class="legend-item" style="--workout-color: ${workout.color}">
      <span class="legend-glyph">${workout.glyph}</span>
      <div class="legend-info">
        <span class="legend-label">${workout.label}</span>
        <span class="legend-desc">${workout.description}</span>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────

function bindSplitEvents() {
    // Preset split selection
    document.querySelectorAll('.btn-select-split').forEach(btn => {
        btn.addEventListener('click', () => {
            const splitId = btn.dataset.splitId;
            selectPresetSplit(splitId);
        });
    });

    // Day workout selection
    document.querySelectorAll('.day-workout-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const day = e.target.dataset.day;
            const workoutType = e.target.value;
            updateDayWorkout(day, workoutType);
        });
    });

    // Save split
    const saveBtn = document.getElementById('btn-save-split');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveSplit();
            showSystemMessage('SPLIT SAVED SUCCESSFULLY', 'success');
        });
    }
}

function selectPresetSplit(splitId) {
    const split = SplitState.presetSplits[splitId];
    if (!split) return;

    SplitState.currentSplit = splitId;
    SplitState.weekSchedule = { ...split.schedule };

    renderSplitPlanner();
    showSystemMessage(`${split.name} template loaded`, 'success');
}

function updateDayWorkout(day, workoutType) {
    SplitState.weekSchedule[day] = workoutType;
    SplitState.currentSplit = 'custom'; // Mark as custom when user modifies

    // Re-render the specific day card
    const dayCard = document.querySelector(`.day-schedule-card[data-day="${day}"]`);
    if (dayCard) {
        const workoutInfo = workoutType === 'rest'
            ? { label: 'REST', color: '#3a3a55', glyph: '—' }
            : {
                label: WORKOUT_TYPES[workoutType.toUpperCase()]?.label || workoutType.toUpperCase(),
                color: WORKOUT_TYPES[workoutType.toUpperCase()]?.color || '#ffffff',
                glyph: WORKOUT_TYPES[workoutType.toUpperCase()]?.glyph || '●',
            };

        dayCard.style.setProperty('--workout-color', workoutInfo.color);

        const workoutLabelEl = dayCard.querySelector('.workout-label');
        const workoutGlyphEl = dayCard.querySelector('.workout-glyph');

        if (workoutLabelEl) workoutLabelEl.textContent = workoutInfo.label;
        if (workoutGlyphEl) workoutGlyphEl.textContent = workoutInfo.glyph;
    }
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

function showSystemMessage(msg, type = 'info') {
    const existing = document.getElementById('system-message-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'system-message-toast';
    toast.className = `system-toast toast-${type}`;
    toast.textContent = `// ${msg}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('toast-visible'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

// ─────────────────────────────────────────────
// HELPER: GET TODAY'S WORKOUT
// ─────────────────────────────────────────────

function getTodaysWorkout() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];

    return SplitState.weekSchedule[today] || 'rest';
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    renderSplitPlanner,
    selectPresetSplit,
    updateDayWorkout,
    getTodaysWorkout,
    SplitState,
};

// Auto-init if on split planner page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}