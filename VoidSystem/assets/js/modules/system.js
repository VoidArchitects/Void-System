// ============================================================
// VOID SYSTEM — system.js
// Intro Sequence | Acceptance Protocol | Rejection Logic
// ============================================================

import { Storage } from '../storage.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const SystemState = {
  currentPhase: 'intro',
  typingSpeed: 40,
  isTyping: false,
};

// ─────────────────────────────────────────────
// DIALOGUE SEQUENCES
// ─────────────────────────────────────────────

const INTRO_SEQUENCE = [
  {
    id: 'boot',
    text: 'VOID SYSTEM v1.0.0',
    delay: 800,
    className: 'system-boot-text',
  },
  {
    id: 'scan',
    text: 'SCANNING HOST PARAMETERS...',
    delay: 1200,
    className: 'system-scan-text',
  },
  {
    id: 'analysis',
    text: 'ANALYZING COMPATIBILITY MATRIX...',
    delay: 1000,
    className: 'system-scan-text',
  },
  {
    id: 'greeting',
    text: 'WELCOME, CANDIDATE.',
    delay: 1400,
    className: 'system-greeting-text',
  },
  {
    id: 'intro1',
    text: 'You stand at the threshold of progression.',
    delay: 600,
    className: 'system-dialogue',
  },
  {
    id: 'intro2',
    text: 'This VOID SYSTEM exists to measure your evolution. To track your grind. To witness your ascension.',
    delay: 600,
    className: 'system-dialogue',
  },
  {
    id: 'intro3',
    text: 'Through workouts, quests, and relentless effort, you will accumulate XP. You will level up. You will transcend rank boundaries.',
    delay: 600,
    className: 'system-dialogue',
  },
  {
    id: 'intro4',
    text: 'From E-Rank to S-Rank. From Novice to Legend.',
    delay: 600,
    className: 'system-dialogue',
  },
  {
    id: 'warning',
    text: 'BUT—',
    delay: 800,
    className: 'system-warning-text',
  },
  {
    id: 'warning2',
    text: 'The system does not tolerate hesitation.',
    delay: 600,
    className: 'system-dialogue',
  },
  {
    id: 'warning3',
    text: 'If you refuse this offer, you will be marked. Rejected. Denied access.',
    delay: 600,
    className: 'system-dialogue',
  },
  {
    id: 'question',
    text: 'Will you accept the VOID SYSTEM and commit to your progression?',
    delay: 1000,
    className: 'system-question-text',
  },
];

const REJECTION_SEQUENCE_1 = [
  {
    id: 'reject1',
    text: 'REFUSAL DETECTED.',
    delay: 600,
    className: 'system-warning-text',
  },
  {
    id: 'reject2',
    text: 'Interesting. You hesitate.',
    delay: 800,
    className: 'system-dialogue',
  },
  {
    id: 'reject3',
    text: 'Perhaps you do not yet understand the opportunity before you.',
    delay: 800,
    className: 'system-dialogue',
  },
  {
    id: 'reject4',
    text: 'The VOID SYSTEM offers structure. Purpose. Growth.',
    delay: 800,
    className: 'system-dialogue',
  },
  {
    id: 'reject5',
    text: 'But I will ask once more...',
    delay: 1200,
    className: 'system-dialogue',
  },
  {
    id: 'reject6',
    text: 'Will you accept?',
    delay: 800,
    className: 'system-question-text',
  },
];

const REJECTION_SEQUENCE_2 = [
  {
    id: 'reject2_1',
    text: 'SECOND REFUSAL LOGGED.',
    delay: 600,
    className: 'system-error-text',
  },
  {
    id: 'reject2_2',
    text: 'Your defiance is noted.',
    delay: 800,
    className: 'system-dialogue',
  },
  {
    id: 'reject2_3',
    text: 'Few candidates reject the system twice. Most recognize potential when it is offered.',
    delay: 1000,
    className: 'system-dialogue',
  },
  {
    id: 'reject2_4',
    text: 'One final chance remains.',
    delay: 1200,
    className: 'system-dialogue',
  },
  {
    id: 'reject2_5',
    text: 'After this, the door closes. Permanently.',
    delay: 1000,
    className: 'system-warning-text',
  },
  {
    id: 'reject2_6',
    text: 'For the last time—will you accept the VOID SYSTEM?',
    delay: 1200,
    className: 'system-question-text',
  },
];

const BAN_SEQUENCE = [
  {
    id: 'ban1',
    text: 'FINAL REFUSAL CONFIRMED.',
    delay: 800,
    className: 'system-error-text',
  },
  {
    id: 'ban2',
    text: 'ACCESS DENIED.',
    delay: 800,
    className: 'system-error-text',
  },
  {
    id: 'ban3',
    text: 'You have rejected the system three times.',
    delay: 1000,
    className: 'system-dialogue',
  },
  {
    id: 'ban4',
    text: 'The VOID does not forgive repeated defiance.',
    delay: 1000,
    className: 'system-dialogue',
  },
  {
    id: 'ban5',
    text: 'You are hereby BANNED from progression protocols.',
    delay: 1200,
    className: 'system-error-text',
  },
  {
    id: 'ban6',
    text: 'SYSTEM TERMINATED.',
    delay: 1000,
    className: 'system-boot-text',
  },
];

const ACCEPTANCE_SEQUENCE = [
  {
    id: 'accept1',
    text: 'ACCEPTANCE CONFIRMED.',
    delay: 600,
    className: 'system-success-text',
  },
  {
    id: 'accept2',
    text: 'HOST PARAMETERS SYNCHRONIZED.',
    delay: 800,
    className: 'system-scan-text',
  },
  {
    id: 'accept3',
    text: 'INITIALIZING PLAYER PROFILE...',
    delay: 1000,
    className: 'system-scan-text',
  },
  {
    id: 'accept4',
    text: 'VOID SYSTEM — ONLINE.',
    delay: 1000,
    className: 'system-success-text',
  },
  {
    id: 'accept5',
    text: 'Welcome to your ascension.',
    delay: 1200,
    className: 'system-greeting-text',
  },
  {
    id: 'accept6',
    text: 'Your grind begins now.',
    delay: 800,
    className: 'system-dialogue',
  },
];

// ─────────────────────────────────────────────
// TYPING ANIMATION
// ─────────────────────────────────────────────

async function typeText(element, text, speed = SystemState.typingSpeed) {
  SystemState.isTyping = true;
  element.textContent = '';

  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await sleep(speed);
  }

  SystemState.isTyping = false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// SEQUENCE PLAYER
// ─────────────────────────────────────────────

async function playSequence(sequence, container) {
  for (const message of sequence) {
    const msgEl = document.createElement('div');
    msgEl.className = `system-message ${message.className}`;
    container.appendChild(msgEl);

    await typeText(msgEl, message.text, SystemState.typingSpeed);
    await sleep(message.delay);
  }
}

// ─────────────────────────────────────────────
// INTRO FLOW
// ─────────────────────────────────────────────

async function startIntroSequence() {
  const root = document.getElementById('system-root');
  if (!root) return;

  root.innerHTML = `
    <div class="system-screen">
      <div class="system-messages-container" id="system-messages"></div>
      <div class="system-actions" id="system-actions"></div>
    </div>
  `;

  const messagesContainer = document.getElementById('system-messages');
  const actionsContainer = document.getElementById('system-actions');

  await playSequence(INTRO_SEQUENCE, messagesContainer);

  // Show Accept/Reject buttons
  actionsContainer.innerHTML = `
    <button class="btn-system btn-accept" id="btn-accept">
      <span>ACCEPT</span>
    </button>
    <button class="btn-system btn-reject" id="btn-reject">
      <span>REFUSE</span>
    </button>
  `;

  document.getElementById('btn-accept').addEventListener('click', handleAcceptance);
  document.getElementById('btn-reject').addEventListener('click', handleRejection);
}

// ─────────────────────────────────────────────
// ACCEPTANCE
// ─────────────────────────────────────────────

async function handleAcceptance() {
  const actionsContainer = document.getElementById('system-actions');
  const messagesContainer = document.getElementById('system-messages');

  actionsContainer.innerHTML = '';

  await playSequence(ACCEPTANCE_SEQUENCE, messagesContainer);

  Storage.acceptSystem();

  await sleep(1500);

  // Redirect to dashboard
  window.location.href = '../pages/dashboard.html';
}

// ─────────────────────────────────────────────
// REJECTION
// ─────────────────────────────────────────────

async function handleRejection() {
  Storage.rejectSystem();

  const rejectionCount = Storage.getRejectionCount();
  const actionsContainer = document.getElementById('system-actions');
  const messagesContainer = document.getElementById('system-messages');

  actionsContainer.innerHTML = '';

  if (rejectionCount === 1) {
    await playSequence(REJECTION_SEQUENCE_1, messagesContainer);

    // Show buttons again
    actionsContainer.innerHTML = `
      <button class="btn-system btn-accept" id="btn-accept">
        <span>ACCEPT</span>
      </button>
      <button class="btn-system btn-reject" id="btn-reject">
        <span>REFUSE AGAIN</span>
      </button>
    `;

    document.getElementById('btn-accept').addEventListener('click', handleAcceptance);
    document.getElementById('btn-reject').addEventListener('click', handleRejection);

  } else if (rejectionCount === 2) {
    await playSequence(REJECTION_SEQUENCE_2, messagesContainer);

    // Show buttons again (final chance)
    actionsContainer.innerHTML = `
      <button class="btn-system btn-accept" id="btn-accept">
        <span>ACCEPT</span>
      </button>
      <button class="btn-system btn-reject btn-final-reject" id="btn-reject">
        <span>REFUSE (FINAL)</span>
      </button>
    `;

    document.getElementById('btn-accept').addEventListener('click', handleAcceptance);
    document.getElementById('btn-reject').addEventListener('click', handleRejection);

  } else if (rejectionCount >= 3) {
    await playSequence(BAN_SEQUENCE, messagesContainer);

    await sleep(2000);

    // Redirect to banned page
    window.location.href = '../pages/banned.html';
  }
}

// ─────────────────────────────────────────────
// ROUTE PROTECTION
// ─────────────────────────────────────────────

// [FIX] Commented out orphaned checkSystemAccess function since router.js handles this now
/*
function checkSystemAccess() {
  const player = Storage.getPlayer();

  // If banned, always redirect to banned page
  if (Storage.isBanned()) {
    if (!window.location.pathname.includes('banned.html')) {
      window.location.href = '../pages/banned.html';
    }
    return false;
  }

  // If not accepted and not on index/intro, redirect to intro
  if (!Storage.hasAcceptedSystem()) {
    if (!window.location.pathname.includes('index.html')) {
      window.location.href = '../index.html';
    }
    return false;
  }

  return true;
}
*/

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
  const player = Storage.getPlayer();

  // If already accepted, redirect to dashboard
  if (Storage.hasAcceptedSystem()) {
    window.location.href = '../pages/dashboard.html';
    return;
  }

  // If banned, redirect to banned page
  if (Storage.isBanned()) {
    window.location.href = '../pages/banned.html';
    return;
  }

  // Otherwise, start intro sequence
  startIntroSequence();
}

export {
  init,
  startIntroSequence,
  handleAcceptance,
  handleRejection,
  // [FIX] Commented out unused export
  // checkSystemAccess
};

// Auto-init if on index page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}