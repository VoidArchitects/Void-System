// ============================================================
// VOID SYSTEM — quests.js
// Quest Engine | Mission Control | Reward System
// ============================================================

import { Storage } from '../storage.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const QuestState = {
  allQuests: [],
  activeQuests: [],
  completedQuests: [],
  availableQuests: [],
  loaded: false,
};

// ─────────────────────────────────────────────
// QUEST DIFFICULTY COLORS
// ─────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'EASY',
    color: '#44ffaa',
    glyph: '●',
    multiplier: 1,
  },
  medium: {
    label: 'MEDIUM',
    color: '#44aaff',
    glyph: '◆',
    multiplier: 1.5,
  },
  hard: {
    label: 'HARD',
    color: '#ffaa44',
    glyph: '▲',
    multiplier: 2,
  },
  brutal: {
    label: 'BRUTAL',
    color: '#ff4466',
    glyph: '✦',
    multiplier: 3,
  },
  legendary: {
    label: 'LEGENDARY',
    color: '#aa44ff',
    glyph: '★',
    multiplier: 5,
  },
};

// ─────────────────────────────────────────────
// DATA LOADING
// ─────────────────────────────────────────────

async function loadQuests() {
  try {
    const res = await fetch('../data/quests.json');
    const data = await res.json();
    QuestState.allQuests = data.quests || [];
    QuestState.loaded = true;
    updateQuestState();
    return QuestState.allQuests;
  } catch (err) {
    console.error('[VOID] Failed to load quests:', err);
    QuestState.allQuests = getFallbackQuests();
    QuestState.loaded = true;
    updateQuestState();
    return QuestState.allQuests;
  }
}

function getFallbackQuests() {
  return [
    {
      id: 'first_workout',
      title: 'First Steps Into the Void',
      description: 'Complete your first workout session and begin your ascent.',
      difficulty: 'easy',
      category: 'physical',
      requirements: {
        type: 'workouts',
        target: 1,
      },
      rewards: {
        xp: 100,
        title: 'Awakened One',
      },
      requiredLevel: 1,
      repeatable: false,
      hidden: false,
    },
    {
      id: 'seven_day_streak',
      title: 'Unbroken Chain',
      description: 'Maintain a 7-day workout streak without breaking.',
      difficulty: 'medium',
      category: 'discipline',
      requirements: {
        type: 'streak',
        target: 7,
      },
      rewards: {
        xp: 350,
        title: 'Iron Will',
      },
      requiredLevel: 1,
      repeatable: false,
      hidden: false,
    },
    {
      id: 'reach_level_10',
      title: 'Breaking the E-Rank Ceiling',
      description: 'Reach Level 10 and ascend to D-Rank status.',
      difficulty: 'medium',
      category: 'progression',
      requirements: {
        type: 'level',
        target: 10,
      },
      rewards: {
        xp: 500,
        title: 'D-Rank Hunter',
      },
      requiredLevel: 1,
      repeatable: false,
      hidden: false,
    },
    {
      id: 'complete_25_workouts',
      title: 'Forged in Repetition',
      description: 'Complete 25 total workout sessions.',
      difficulty: 'hard',
      category: 'endurance',
      requirements: {
        type: 'workouts',
        target: 25,
      },
      rewards: {
        xp: 750,
        title: 'Grind Survivor',
      },
      requiredLevel: 5,
      repeatable: false,
      hidden: false,
    },
    {
      id: 'perfect_week',
      title: 'The Perfect Week',
      description: 'Complete at least one workout every day for 7 consecutive days.',
      difficulty: 'brutal',
      category: 'discipline',
      requirements: {
        type: 'streak',
        target: 7,
      },
      rewards: {
        xp: 1000,
        title: 'Relentless',
      },
      requiredLevel: 10,
      repeatable: true,
      hidden: false,
    },
    {
      id: 'hidden_monarch',
      title: '???',
      description: 'A hidden quest lies dormant. Only the worthy will discover it.',
      difficulty: 'legendary',
      category: 'hidden',
      requirements: {
        type: 'level',
        target: 50,
      },
      rewards: {
        xp: 5000,
        title: 'Monarch Candidate',
      },
      requiredLevel: 50,
      repeatable: false,
      hidden: true,
    },
  ];
}

// ─────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────

function updateQuestState() {
  const player = Storage.getPlayer();
  const activeQuestIds = Storage.getActiveQuests();
  const completedQuestIds = Storage.getCompletedQuests().map(q => q.questId);

  QuestState.activeQuests = QuestState.allQuests.filter(q => activeQuestIds.includes(q.id));
  QuestState.completedQuests = QuestState.allQuests.filter(q => completedQuestIds.includes(q.id));

  // Available quests = not active, not completed, meet level requirement, not hidden
  QuestState.availableQuests = QuestState.allQuests.filter(q => {
    const isActive = activeQuestIds.includes(q.id);
    const isCompleted = completedQuestIds.includes(q.id);
    const meetsLevel = player.level >= (q.requiredLevel || 1);
    const notHidden = !q.hidden;
    
    return !isActive && !isCompleted && meetsLevel && notHidden;
  });
}

// ─────────────────────────────────────────────
// QUEST ACTIONS
// ─────────────────────────────────────────────

function acceptQuest(questId) {
  const quest = QuestState.allQuests.find(q => q.id === questId);
  if (!quest) return { success: false, message: 'Quest not found' };

  const player = Storage.getPlayer();
  if (player.level < (quest.requiredLevel || 1)) {
    return { success: false, message: 'Level requirement not met' };
  }

  if (Storage.isQuestActive(questId)) {
    return { success: false, message: 'Quest already active' };
  }

  if (Storage.isQuestCompleted(questId) && !quest.repeatable) {
    return { success: false, message: 'Quest already completed' };
  }

  Storage.acceptQuest(questId);
  updateQuestState();

  showSystemNotification(`QUEST ACCEPTED — ${quest.title}`, 'success');
  return { success: true, quest };
}

function abandonQuest(questId) {
  const activeQuestIds = Storage.getActiveQuests();
  const index = activeQuestIds.indexOf(questId);
  
  if (index === -1) {
    return { success: false, message: 'Quest not active' };
  }

  // Remove from active quests
  const player = Storage.getPlayer();
  player.activeQuests.splice(index, 1);
  Storage.savePlayer();
  
  updateQuestState();
  showSystemNotification('QUEST ABANDONED', 'warning');
  return { success: true };
}

function completeQuest(questId) {
  const quest = QuestState.allQuests.find(q => q.id === questId);
  if (!quest) return { success: false, message: 'Quest not found' };

  if (!Storage.isQuestActive(questId)) {
    return { success: false, message: 'Quest not active' };
  }

  Storage.completeQuest(questId, quest.rewards);
  updateQuestState();

  showSystemNotification(`QUEST COMPLETE — ${quest.title}`, 'success');
  
  if (quest.rewards?.title) {
    setTimeout(() => {
      showSystemNotification(`TITLE UNLOCKED — "${quest.rewards.title}"`, 'info');
    }, 800);
  }

  return { success: true, quest, rewards: quest.rewards };
}

// ─────────────────────────────────────────────
// QUEST PROGRESS TRACKING
// ─────────────────────────────────────────────

function checkQuestProgress(quest) {
  const player = Storage.getPlayer();
  const req = quest.requirements;

  switch (req.type) {
    case 'workouts':
      return {
        current: player.totalWorkouts,
        target: req.target,
        percent: Math.min((player.totalWorkouts / req.target) * 100, 100),
        complete: player.totalWorkouts >= req.target,
      };

    case 'streak':
      return {
        current: player.streak,
        target: req.target,
        percent: Math.min((player.streak / req.target) * 100, 100),
        complete: player.streak >= req.target,
      };

    case 'level':
      return {
        current: player.level,
        target: req.target,
        percent: Math.min((player.level / req.target) * 100, 100),
        complete: player.level >= req.target,
      };

    case 'xp':
      return {
        current: player.xp,
        target: req.target,
        percent: Math.min((player.xp / req.target) * 100, 100),
        complete: player.xp >= req.target,
      };

    default:
      return {
        current: 0,
        target: req.target,
        percent: 0,
        complete: false,
      };
  }
}

function autoCheckQuestCompletion() {
  const activeQuests = QuestState.activeQuests;

  activeQuests.forEach(quest => {
    const progress = checkQuestProgress(quest);
    if (progress.complete) {
      completeQuest(quest.id);
    }
  });
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderQuestsPage() {
  const root = document.getElementById('quests-root');
  if (!root) return;

  if (!QuestState.loaded) {
    root.innerHTML = `
      <div class="loading-screen">
        <span class="loading-text">LOADING QUEST DATABASE...</span>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="quests-header">
      <div class="quests-screen-tag">// QUEST CONTROL</div>
      <h1 class="quests-screen-title">ACTIVE <span class="accent">MISSIONS</span></h1>
      <p class="quests-screen-sub">Complete quests to gain XP, titles, and unlock new challenges.</p>
    </div>

    ${QuestState.activeQuests.length > 0 ? `
      <div class="quest-section">
        <div class="section-label">ACTIVE QUESTS</div>
        <div class="quest-grid">
          ${QuestState.activeQuests.map(q => renderQuestCard(q, 'active')).join('')}
        </div>
      </div>
    ` : ''}

    ${QuestState.availableQuests.length > 0 ? `
      <div class="quest-section">
        <div class="section-label">AVAILABLE QUESTS</div>
        <div class="quest-grid">
          ${QuestState.availableQuests.map(q => renderQuestCard(q, 'available')).join('')}
        </div>
      </div>
    ` : ''}

    ${QuestState.completedQuests.length > 0 ? `
      <div class="quest-section">
        <div class="section-label">COMPLETED</div>
        <div class="quest-grid">
          ${QuestState.completedQuests.map(q => renderQuestCard(q, 'completed')).join('')}
        </div>
      </div>
    ` : ''}

    ${QuestState.availableQuests.length === 0 && QuestState.activeQuests.length === 0 ? `
      <div class="no-quests-message">
        <p>No quests available at your current level.</p>
        <p class="sub">Keep training to unlock new challenges.</p>
      </div>
    ` : ''}
  `;

  bindQuestCardEvents();
}

function renderQuestCard(quest, status) {
  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.easy;
  const progress = status === 'active' ? checkQuestProgress(quest) : null;

  return `
    <div class="quest-card ${status}" 
         data-quest-id="${quest.id}"
         style="--difficulty-color: ${diffConfig.color}">
      
      <!-- Difficulty Badge -->
      <div class="quest-difficulty-badge" style="background: ${diffConfig.color}">
        <span class="diff-glyph">${diffConfig.glyph}</span>
        <span class="diff-label">${diffConfig.label}</span>
      </div>

      <!-- Quest Header -->
      <div class="quest-header">
        <h3 class="quest-title">${quest.hidden && status !== 'completed' ? '???' : quest.title}</h3>
        <span class="quest-category">${quest.category.toUpperCase()}</span>
      </div>

      <!-- Description -->
      <p class="quest-description">
        ${quest.hidden && status !== 'completed' ? 'A hidden quest awaits discovery...' : quest.description}
      </p>

      <!-- Requirements -->
      ${!quest.hidden || status === 'completed' || status === 'active' ? `
        <div class="quest-requirements">
          <span class="req-label">OBJECTIVE</span>
          <span class="req-text">${formatRequirement(quest.requirements)}</span>
        </div>
      ` : ''}

      <!-- Progress Bar (active quests only) -->
      ${status === 'active' && progress ? `
        <div class="quest-progress-bar">
          <div class="quest-progress-fill" style="width: ${progress.percent}%"></div>
          <span class="quest-progress-text">${progress.current} / ${progress.target}</span>
        </div>
      ` : ''}

      <!-- Rewards -->
      ${!quest.hidden || status === 'completed' || status === 'active' ? `
        <div class="quest-rewards">
          <span class="reward-label">REWARDS</span>
          <div class="reward-list">
            ${quest.rewards.xp ? `<span class="reward-item xp">+${quest.rewards.xp} XP</span>` : ''}
            ${quest.rewards.title ? `<span class="reward-item title">"${quest.rewards.title}"</span>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Actions -->
      <div class="quest-actions">
        ${status === 'available' ? `
          <button class="btn-quest btn-accept" data-quest-id="${quest.id}">
            ACCEPT QUEST
          </button>
        ` : ''}
        ${status === 'active' ? `
          ${progress && progress.complete ? `
            <button class="btn-quest btn-complete" data-quest-id="${quest.id}">
              ✓ COMPLETE QUEST
            </button>
          ` : `
            <button class="btn-quest btn-abandon" data-quest-id="${quest.id}">
              ABANDON
            </button>
          `}
        ` : ''}
        ${status === 'completed' ? `
          <div class="quest-completed-stamp">
            <span>✦ COMPLETED ✦</span>
          </div>
        ` : ''}
      </div>

      <!-- Card Glow -->
      <div class="quest-card-glow"></div>
    </div>
  `;
}

function formatRequirement(req) {
  switch (req.type) {
    case 'workouts':
      return `Complete ${req.target} workout${req.target > 1 ? 's' : ''}`;
    case 'streak':
      return `Maintain a ${req.target}-day streak`;
    case 'level':
      return `Reach Level ${req.target}`;
    case 'xp':
      return `Earn ${req.target} total XP`;
    default:
      return 'Unknown objective';
  }
}

function bindQuestCardEvents() {
  document.querySelectorAll('.btn-accept').forEach(btn => {
    btn.addEventListener('click', () => {
      const questId = btn.dataset.questId;
      acceptQuest(questId);
      renderQuestsPage();
    });
  });

  document.querySelectorAll('.btn-abandon').forEach(btn => {
    btn.addEventListener('click', () => {
      const questId = btn.dataset.questId;
      if (confirm('Abandon this quest? Progress will be lost.')) {
        abandonQuest(questId);
        renderQuestsPage();
      }
    });
  });

  document.querySelectorAll('.btn-complete').forEach(btn => {
    btn.addEventListener('click', () => {
      const questId = btn.dataset.questId;
      completeQuest(questId);
      renderQuestsPage();
    });
  });
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

function showSystemNotification(msg, type = 'info') {
  const existing = document.getElementById('system-notification-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'system-notification-toast';
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
// INIT
// ─────────────────────────────────────────────

async function init() {
  await loadQuests();
  renderQuestsPage();
  
  // Auto-check active quests
  autoCheckQuestCompletion();
}

export {
  init,
  loadQuests,
  acceptQuest,
  abandonQuest,
  completeQuest,
  checkQuestProgress,
  autoCheckQuestCompletion,
  QuestState,
};

// Auto-init if on quests page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}