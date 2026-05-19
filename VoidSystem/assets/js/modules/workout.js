// ============================================================
// VOID SYSTEM — workout.js
// Core Gameplay Loop | XP Engine | Session Manager
// ============================================================

import { Storage } from '../storage.js';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const XP_REWARDS = {
  SET_COMPLETE: 10,
  EXERCISE_COMPLETE: 25,
  WORKOUT_COMPLETE: 100,
  BONUS_ALL_SETS: 15,      // per exercise if all sets done
  STREAK_MULTIPLIER: 0.1,  // 10% bonus per streak day (capped at 50%)
};

const WORKOUT_TYPES = {
  push: {
    label: 'PUSH',
    color: '#ff4444',
    glyph: '▲',
    description: 'Chest · Shoulders · Triceps',
  },
  pull: {
    label: 'PULL',
    color: '#4488ff',
    glyph: '▼',
    description: 'Back · Biceps · Rear Delts',
  },
  legs: {
    label: 'LEGS',
    color: '#aa44ff',
    glyph: '◆',
    description: 'Quads · Hamstrings · Glutes · Calves',
  },
  fullBody: {
    label: 'FULL BODY',
    color: '#44ffaa',
    glyph: '✦',
    description: 'Compound · Multi-Muscle',
  },
  cardio: {
    label: 'CARDIO',
    color: '#ffaa44',
    glyph: '◉',
    description: 'Endurance · Heart Rate · Burn',
  },
  custom: {
    label: 'CUSTOM',
    color: '#ffffff',
    glyph: '★',
    description: 'Your own protocol',
  },
};

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const WorkoutState = {
  activeSession: null,   // current live workout session
  selectedType: null,
  exercises: [],         // loaded from workouts.json
  isSessionActive: false,
  sessionStartTime: null,
  timerInterval: null,
};

// ─────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────

async function loadWorkoutData(type) {
  try {
    const res = await fetch('../data/workouts.json');
    const data = await res.json();
    return data[type] || [];
  } catch (err) {
    console.error('[VOID] Failed to load workout data:', err);
    return getFallbackExercises(type);
  }
}

function getFallbackExercises(type) {
  const fallbacks = {
    push: [
      { id: 'bench', name: 'Bench Press', sets: 4, reps: '8–10', muscle: 'Chest' },
      { id: 'ohp', name: 'Overhead Press', sets: 3, reps: '8–10', muscle: 'Shoulders' },
      { id: 'incline', name: 'Incline Dumbbell Press', sets: 3, reps: '10–12', muscle: 'Upper Chest' },
      { id: 'lateral', name: 'Lateral Raises', sets: 3, reps: '12–15', muscle: 'Side Delts' },
      { id: 'tricep_push', name: 'Tricep Pushdown', sets: 3, reps: '12–15', muscle: 'Triceps' },
    ],
    pull: [
      { id: 'deadlift', name: 'Deadlift', sets: 4, reps: '5–6', muscle: 'Full Back' },
      { id: 'row', name: 'Barbell Row', sets: 4, reps: '8–10', muscle: 'Mid Back' },
      { id: 'pullup', name: 'Pull-Ups', sets: 3, reps: '6–10', muscle: 'Lats' },
      { id: 'curl', name: 'Barbell Curl', sets: 3, reps: '10–12', muscle: 'Biceps' },
      { id: 'facepull', name: 'Face Pulls', sets: 3, reps: '15–20', muscle: 'Rear Delts' },
    ],
    legs: [
      { id: 'squat', name: 'Back Squat', sets: 4, reps: '6–8', muscle: 'Quads' },
      { id: 'rdl', name: 'Romanian Deadlift', sets: 3, reps: '10–12', muscle: 'Hamstrings' },
      { id: 'legpress', name: 'Leg Press', sets: 3, reps: '12–15', muscle: 'Quads' },
      { id: 'legcurl', name: 'Leg Curl', sets: 3, reps: '12–15', muscle: 'Hamstrings' },
      { id: 'calfraise', name: 'Calf Raises', sets: 4, reps: '15–20', muscle: 'Calves' },
    ],
    fullBody: [
      { id: 'squat_fb', name: 'Squat', sets: 3, reps: '8–10', muscle: 'Legs' },
      { id: 'bench_fb', name: 'Bench Press', sets: 3, reps: '8–10', muscle: 'Chest' },
      { id: 'row_fb', name: 'Bent Over Row', sets: 3, reps: '8–10', muscle: 'Back' },
      { id: 'press_fb', name: 'Overhead Press', sets: 3, reps: '8–10', muscle: 'Shoulders' },
      { id: 'rdl_fb', name: 'Romanian Deadlift', sets: 3, reps: '10–12', muscle: 'Hamstrings' },
    ],
    cardio: [
      { id: 'run', name: 'Treadmill Run', sets: 1, reps: '20 min', muscle: 'Cardiovascular' },
      { id: 'bike', name: 'Stationary Bike', sets: 1, reps: '15 min', muscle: 'Cardiovascular' },
      { id: 'jumprope', name: 'Jump Rope', sets: 5, reps: '2 min', muscle: 'Full Body' },
      { id: 'burpees', name: 'Burpees', sets: 4, reps: '15', muscle: 'Full Body' },
    ],
    custom: [],
  };
  return fallbacks[type] || [];
}

// ─────────────────────────────────────────────
// SESSION MANAGEMENT
// ─────────────────────────────────────────────

async function startSession(type) {
  if (WorkoutState.isSessionActive) return;

  const exercises = await loadWorkoutData(type);

  WorkoutState.activeSession = {
    type,
    exercises: exercises.map(ex => ({
      ...ex,
      completedSets: 0,
      isComplete: false,
    })),
    startTime: Date.now(),
    xpEarned: 0,
    completedExercises: 0,
  };

  WorkoutState.isSessionActive = true;
  WorkoutState.selectedType = type;
  WorkoutState.sessionStartTime = Date.now();

  startTimer();
  renderSession();
  showSystemMessage(`WORKOUT PROTOCOL INITIATED — ${WORKOUT_TYPES[type].label}`, 'success');
}

function completeSet(exerciseId) {
  if (!WorkoutState.isSessionActive) return;

  const session = WorkoutState.activeSession;
  const exercise = session.exercises.find(ex => ex.id === exerciseId);
  if (!exercise || exercise.isComplete) return;

  exercise.completedSets++;

  // Award XP for the set
  const setXP = XP_REWARDS.SET_COMPLETE;
  session.xpEarned += setXP;
  showFloatingXP(exerciseId, `+${setXP} XP`);

  // Check if exercise is complete
  if (exercise.completedSets >= exercise.sets) {
    exercise.isComplete = true;
    session.completedExercises++;

    const exerciseXP = XP_REWARDS.EXERCISE_COMPLETE + XP_REWARDS.BONUS_ALL_SETS;
    session.xpEarned += exerciseXP;
    showFloatingXP(exerciseId, `+${exerciseXP} XP COMPLETE!`);
    showSystemMessage(`${exercise.name} — PROTOCOL CLEARED`, 'success');
  }

  updateExerciseCard(exerciseId);
  updateSessionStats();
}

function skipExercise(exerciseId) {
  if (!WorkoutState.isSessionActive) return;

  const exercise = WorkoutState.activeSession.exercises.find(ex => ex.id === exerciseId);
  if (!exercise || exercise.isComplete) return;

  exercise.isComplete = true;
  exercise.skipped = true;

  updateExerciseCard(exerciseId);
  showSystemMessage(`${exercise.name} — SKIPPED`, 'warning');
}

async function finishSession() {
  if (!WorkoutState.isSessionActive) return;

  const session = WorkoutState.activeSession;
  const duration = Math.floor((Date.now() - session.startTime) / 1000);

  // Check if at least 1 exercise completed
  const completedCount = session.exercises.filter(ex => ex.isComplete && !ex.skipped).length;
  if (completedCount === 0) {
    showSystemMessage('COMPLETE AT LEAST ONE EXERCISE TO END SESSION', 'error');
    return;
  }

  // Full workout bonus if all non-skipped exercises done
  const nonSkipped = session.exercises.filter(ex => !ex.skipped);
  const allDone = nonSkipped.every(ex => ex.isComplete);
  if (allDone) {
    session.xpEarned += XP_REWARDS.WORKOUT_COMPLETE;
    showSystemMessage('FULL PROTOCOL COMPLETE — BONUS XP AWARDED', 'success');
  }

  // Apply streak multiplier
  const player = Storage.getPlayer();
  const streakDays = player?.streak || 0;
  const multiplier = Math.min(streakDays * XP_REWARDS.STREAK_MULTIPLIER, 0.5);
  const bonusXP = Math.floor(session.xpEarned * multiplier);
  if (bonusXP > 0) {
    session.xpEarned += bonusXP;
    showSystemMessage(`STREAK BONUS — +${bonusXP} XP`, 'info');
  }

  // Save to storage
  const sessionRecord = {
    id: `session_${Date.now()}`,
    type: session.type,
    date: new Date().toISOString(),
    duration,
    xpEarned: session.xpEarned,
    exercisesCompleted: completedCount,
    totalExercises: session.exercises.length,
    exercises: session.exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      completedSets: ex.completedSets,
      totalSets: ex.sets,
      isComplete: ex.isComplete,
      skipped: ex.skipped || false,
    })),
  };

  Storage.addWorkoutSession(sessionRecord);
  Storage.addXP(session.xpEarned);
  Storage.updateStreak();

  stopTimer();
  WorkoutState.isSessionActive = false;

  showCompletionScreen(sessionRecord);
}

function abandonSession() {
  if (!WorkoutState.isSessionActive) return;

  stopTimer();
  WorkoutState.isSessionActive = false;
  WorkoutState.activeSession = null;
  WorkoutState.selectedType = null;

  showSystemMessage('SESSION ABANDONED — NO XP AWARDED', 'error');

  setTimeout(() => {
    renderTypeSelection();
  }, 1500);
}

// ─────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────

function startTimer() {
  WorkoutState.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - WorkoutState.sessionStartTime) / 1000);
    updateTimerDisplay(elapsed);
  }, 1000);
}

function stopTimer() {
  if (WorkoutState.timerInterval) {
    clearInterval(WorkoutState.timerInterval);
    WorkoutState.timerInterval = null;
  }
}

function updateTimerDisplay(seconds) {
  const el = document.getElementById('session-timer');
  if (!el) return;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  el.textContent = h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderTypeSelection() {
  const root = document.getElementById('workout-root');
  if (!root) return;

  root.innerHTML = `
    <div class="workout-select-screen">
      <div class="workout-header-block">
        <div class="workout-screen-tag">// SELECT PROTOCOL</div>
        <h1 class="workout-screen-title">TRAINING <span class="accent">MODE</span></h1>
        <p class="workout-screen-sub">Choose your protocol. The system will track the rest.</p>
      </div>

      <div class="workout-type-grid">
        ${Object.entries(WORKOUT_TYPES).map(([key, type]) => `
          <button class="workout-type-card" data-type="${key}" style="--type-color: ${type.color}">
            <span class="type-glyph">${type.glyph}</span>
            <span class="type-label">${type.label}</span>
            <span class="type-desc">${type.description}</span>
            <div class="type-card-shine"></div>
          </button>
        `).join('')}
      </div>

      <div class="workout-history-preview">
        <div class="history-label">LAST SESSION</div>
        ${renderLastSessionPreview()}
      </div>
    </div>
  `;

  // Bind type selection
  root.querySelectorAll('.workout-type-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      if (type === 'custom') {
        showCustomWorkoutBuilder();
      } else {
        showTypeConfirm(type);
      }
    });
  });
}

function renderLastSessionPreview() {
  const sessions = Storage.getWorkoutHistory();
  if (!sessions || sessions.length === 0) {
    return `<div class="no-history">No sessions logged yet. Begin your ascent.</div>`;
  }

  const last = sessions[sessions.length - 1];
  const date = new Date(last.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const mins = Math.floor(last.duration / 60);
  const typeInfo = WORKOUT_TYPES[last.type] || WORKOUT_TYPES.custom;

  return `
    <div class="last-session-card" style="--type-color: ${typeInfo.color}">
      <span class="ls-glyph">${typeInfo.glyph}</span>
      <div class="ls-info">
        <span class="ls-type">${typeInfo.label}</span>
        <span class="ls-date">${date} · ${mins}m · +${last.xpEarned} XP</span>
      </div>
      <span class="ls-exercises">${last.exercisesCompleted}/${last.totalExercises} exercises</span>
    </div>
  `;
}

function showTypeConfirm(type) {
  const typeInfo = WORKOUT_TYPES[type];
  const root = document.getElementById('workout-root');

  root.innerHTML = `
    <div class="workout-confirm-screen">
      <div class="confirm-type-badge" style="--type-color: ${typeInfo.color}">
        <span class="confirm-glyph">${typeInfo.glyph}</span>
        <span class="confirm-label">${typeInfo.label}</span>
      </div>
      <p class="confirm-desc">${typeInfo.description}</p>
      <div class="confirm-actions">
        <button class="btn-void btn-start" id="confirm-start">
          <span>INITIATE PROTOCOL</span>
        </button>
        <button class="btn-void btn-back" id="confirm-back">
          BACK
        </button>
      </div>
    </div>
  `;

  document.getElementById('confirm-start').addEventListener('click', () => startSession(type));
  document.getElementById('confirm-back').addEventListener('click', renderTypeSelection);
}

function renderSession() {
  const root = document.getElementById('workout-root');
  const session = WorkoutState.activeSession;
  const typeInfo = WORKOUT_TYPES[session.type];

  root.innerHTML = `
    <div class="workout-session-screen">

      <!-- Session Header -->
      <div class="session-header" style="--type-color: ${typeInfo.color}">
        <div class="session-type-badge">
          <span>${typeInfo.glyph}</span>
          <span>${typeInfo.label}</span>
        </div>
        <div class="session-timer-wrap">
          <span class="timer-label">ELAPSED</span>
          <span class="session-timer" id="session-timer">00:00</span>
        </div>
        <div class="session-xp-live">
          <span class="xp-label">XP EARNED</span>
          <span class="xp-value" id="live-xp">0</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="session-progress-bar">
        <div class="session-progress-fill" id="session-progress-fill" style="width: 0%"></div>
        <span class="session-progress-text" id="session-progress-text">0 / ${session.exercises.length}</span>
      </div>

      <!-- Exercise Cards -->
      <div class="exercise-list" id="exercise-list">
        ${session.exercises.map((ex, i) => renderExerciseCard(ex, i)).join('')}
      </div>

      <!-- Session Actions -->
      <div class="session-actions">
        <button class="btn-void btn-finish" id="btn-finish-session">
          <span>FINISH SESSION</span>
        </button>
        <button class="btn-void btn-abandon" id="btn-abandon-session">
          ABANDON
        </button>
      </div>

    </div>
  `;

  document.getElementById('btn-finish-session').addEventListener('click', finishSession);
  document.getElementById('btn-abandon-session').addEventListener('click', () => {
    if (confirm('Abandon this session? No XP will be awarded.')) {
      abandonSession();
    }
  });

  bindExerciseCardEvents();
}

function renderExerciseCard(ex, index) {
  const session = WorkoutState.activeSession;
  const typeInfo = WORKOUT_TYPES[session.type];

  const setsArr = Array.from({ length: ex.sets }, (_, i) => i);

  return `
    <div class="exercise-card ${ex.isComplete ? (ex.skipped ? 'skipped' : 'complete') : ''}"
         id="ex-card-${ex.id}"
         style="--type-color: ${typeInfo.color}; --delay: ${index * 0.06}s">

      <div class="ex-card-header">
        <div class="ex-info">
          <span class="ex-index">${String(index + 1).padStart(2, '0')}</span>
          <div class="ex-name-wrap">
            <span class="ex-name">${ex.name}</span>
            <span class="ex-muscle">${ex.muscle}</span>
          </div>
        </div>
        <div class="ex-meta">
          <span class="ex-sets-reps">${ex.sets} × ${ex.reps}</span>
          ${ex.isComplete
      ? `<span class="ex-status-badge ${ex.skipped ? 'badge-skip' : 'badge-done'}">
                ${ex.skipped ? 'SKIPPED' : 'CLEARED'}
               </span>`
      : `<span class="ex-sets-done">${ex.completedSets}/${ex.sets} sets</span>`
    }
        </div>
      </div>

      ${!ex.isComplete ? `
        <div class="ex-set-tracker">
          ${setsArr.map(i => `
            <div class="set-dot ${i < ex.completedSets ? 'set-done' : ''}" data-set="${i}"></div>
          `).join('')}
        </div>

        <div class="ex-actions">
          <button class="btn-set-complete" data-exercise-id="${ex.id}">
            <span>✓ SET DONE</span>
          </button>
          <button class="btn-skip-exercise" data-exercise-id="${ex.id}">
            SKIP
          </button>
        </div>
      ` : `
        <div class="ex-complete-overlay">
          <span>${ex.skipped ? '— SKIPPED —' : '✦ PROTOCOL CLEARED ✦'}</span>
        </div>
      `}

      <div class="ex-xp-float" id="xp-float-${ex.id}"></div>
    </div>
  `;
}

function updateExerciseCard(exerciseId) {
  const session = WorkoutState.activeSession;
  const exercise = session.exercises.find(ex => ex.id === exerciseId);
  const card = document.getElementById(`ex-card-${exerciseId}`);
  if (!card || !exercise) return;

  // Update set dots
  const dots = card.querySelectorAll('.set-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('set-done', i < exercise.completedSets);
  });

  // Update sets done label
  const setsLabel = card.querySelector('.ex-sets-done');
  if (setsLabel) setsLabel.textContent = `${exercise.completedSets}/${exercise.sets} sets`;

  // If complete, re-render full card
  if (exercise.isComplete) {
    const index = session.exercises.indexOf(exercise);
    card.outerHTML = renderExerciseCard(exercise, index);
    // Rebind since DOM changed
    const newCard = document.getElementById(`ex-card-${exerciseId}`);
    if (newCard) {
      newCard.classList.add('just-completed');
      setTimeout(() => newCard.classList.remove('just-completed'), 800);
    }
    bindExerciseCardEvents();
  }
}

function updateSessionStats() {
  const session = WorkoutState.activeSession;

  const xpEl = document.getElementById('live-xp');
  if (xpEl) xpEl.textContent = session.xpEarned;

  const completed = session.exercises.filter(ex => ex.isComplete).length;
  const total = session.exercises.length;
  const pct = Math.round((completed / total) * 100);

  const fillEl = document.getElementById('session-progress-fill');
  if (fillEl) fillEl.style.width = `${pct}%`;

  const textEl = document.getElementById('session-progress-text');
  if (textEl) textEl.textContent = `${completed} / ${total}`;
}

function bindExerciseCardEvents() {
  document.querySelectorAll('.btn-set-complete').forEach(btn => {
    btn.addEventListener('click', () => completeSet(btn.dataset.exerciseId));
  });

  document.querySelectorAll('.btn-skip-exercise').forEach(btn => {
    btn.addEventListener('click', () => skipExercise(btn.dataset.exerciseId));
  });
}

function showCompletionScreen(record) {
  const root = document.getElementById('workout-root');
  const typeInfo = WORKOUT_TYPES[record.type];
  const player = Storage.getPlayer();
  const mins = Math.floor(record.duration / 60);
  const secs = record.duration % 60;

  root.innerHTML = `
    <div class="completion-screen">
      <div class="completion-pulse" style="--type-color: ${typeInfo.color}"></div>

      <div class="completion-header">
        <div class="completion-rank-glyph">${typeInfo.glyph}</div>
        <h1 class="completion-title">SESSION <span class="accent">COMPLETE</span></h1>
        <p class="completion-sub">${typeInfo.label} PROTOCOL TERMINATED</p>
      </div>

      <div class="completion-stats">
        <div class="stat-block">
          <span class="stat-value accent">+${record.xpEarned}</span>
          <span class="stat-label">XP EARNED</span>
        </div>
        <div class="stat-block">
          <span class="stat-value">${mins}:${pad(secs)}</span>
          <span class="stat-label">DURATION</span>
        </div>
        <div class="stat-block">
          <span class="stat-value">${record.exercisesCompleted}/${record.totalExercises}</span>
          <span class="stat-label">EXERCISES</span>
        </div>
        <div class="stat-block">
          <span class="stat-value">${player?.streak || 1}</span>
          <span class="stat-label">DAY STREAK</span>
        </div>
      </div>

      <div class="completion-level-bar">
        <span class="level-label">LVL ${player?.level || 1}</span>
        <div class="level-bar-track">
          <div class="level-bar-fill" style="width: ${getXPPercent(player)}%"></div>
        </div>
        <span class="level-label">${player?.xp || 0} XP</span>
      </div>

      <div class="completion-actions">
        <button class="btn-void btn-start" onclick="window.location.href='dashboard.html'">
          RETURN TO SYSTEM
        </button>
        <button class="btn-void btn-back" id="btn-train-again">
          TRAIN AGAIN
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-train-again')?.addEventListener('click', () => {
    WorkoutState.activeSession = null;
    renderTypeSelection();
  });

  // Animate XP bar in
  setTimeout(() => {
    const fill = document.querySelector('.level-bar-fill');
    if (fill) fill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  }, 100);
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getXPPercent(player) {
  if (!player) return 0;
  // [FIX] Bugged code commented out below: caused off-by-one errors with XP calculation
  /*
  const xpForNext = Storage.getXPForNextLevel(player.level);
  const xpForCurrent = Storage.getXPForNextLevel(player.level - 1);
  const progress = player.xp - xpForCurrent;
  const needed = xpForNext - xpForCurrent;
  return Math.min(Math.round((progress / needed) * 100), 100);
  */
  return Math.round(Storage.getXPProgress().percent);
}

function showFloatingXP(exerciseId, text) {
  const el = document.getElementById(`xp-float-${exerciseId}`);
  if (!el) return;
  el.textContent = text;
  el.classList.add('xp-float-active');
  setTimeout(() => el.classList.remove('xp-float-active'), 1200);
}

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

function showCustomWorkoutBuilder() {
  const root = document.getElementById('workout-root');
  root.innerHTML = `
    <div class="custom-builder-screen">
      <div class="workout-screen-tag">// CUSTOM PROTOCOL</div>
      <h2 class="workout-screen-title">BUILD YOUR <span class="accent">OWN</span></h2>
      <p class="workout-screen-sub">Custom workout builder — coming in the next update.</p>
      <button class="btn-void btn-back" id="back-from-custom">BACK</button>
    </div>
  `;
  document.getElementById('back-from-custom').addEventListener('click', renderTypeSelection);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
  renderTypeSelection();
}

export { init, startSession, completeSet, skipExercise, finishSession, abandonSession };

// Auto-init if on workout page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}