// ============================================================
// VOID SYSTEM — profile.js
// Player Profile System | Stats Display | Body Info
// ============================================================

import { Storage } from '../storage.js';
import { formatXP, formatLevel, formatRank, formatTitle, formatStreak, formatHeight, formatWeight, formatBMI, getBMICategory } from '../utils/formatters.js';
import { calculateXPProgress, getRankInfo, calculateRankProgress, calculateTotalStats } from '../utils/calculations.js';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const ProfileState = {
    player: null,
    editMode: false,
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
    ProfileState.player = Storage.getPlayer();
    renderProfile();
}

// ─────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────

function renderProfile() {
    const root = document.getElementById('profile-root');
    if (!root) return;

    const player = ProfileState.player;

    root.innerHTML = `
    <div class="profile-screen">

      <!-- Header -->
      <div class="profile-header">
        <div class="profile-screen-tag">// PLAYER PROFILE</div>
        <h1 class="profile-screen-title">SYSTEM <span class="accent">OVERVIEW</span></h1>
        <p class="profile-screen-sub">Your progression statistics and attributes.</p>
      </div>

      <!-- Main Profile Card -->
      <div class="profile-main-card">
        <div class="profile-identity">
          <div class="profile-rank-badge" style="--rank-color: ${getRankInfo(player.rank).color}">
            <span class="rank-glyph">${getRankInfo(player.rank).glyph}</span>
            <span class="rank-label">${player.rank}</span>
          </div>
          <div class="profile-name-title">
            <h2 class="profile-name">${player.name || 'UNKNOWN PLAYER'}</h2>
            <p class="profile-title">${formatTitle(player.title)}</p>
          </div>
        </div>

        <div class="profile-progression">
          <div class="prog-item">
            <span class="prog-label">LEVEL</span>
            <span class="prog-value accent">${player.level}</span>
          </div>
          <div class="prog-item">
            <span class="prog-label">RANK</span>
            <span class="prog-value">${formatRank(player.rank)}</span>
          </div>
          <div class="prog-item">
            <span class="prog-label">TOTAL XP</span>
            <span class="prog-value">${formatXP(player.xp)}</span>
          </div>
          <div class="prog-item">
            <span class="prog-label">STREAK</span>
            <span class="prog-value">${player.streak} ${player.streak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        <!-- XP Progress Bar -->
        <div class="profile-xp-section">
          <div class="xp-section-header">
            <span class="xp-section-label">LEVEL PROGRESS</span>
            <span class="xp-section-percent">${Math.round(calculateXPProgress(player.xp, player.level))}%</span>
          </div>
          <div class="xp-progress-bar">
            <div class="xp-progress-fill" style="width: ${calculateXPProgress(player.xp, player.level)}%"></div>
          </div>
        </div>

        <!-- Rank Progress -->
        <div class="profile-rank-section">
          <div class="rank-section-header">
            <span class="rank-section-label">RANK PROGRESS</span>
            <span class="rank-section-percent">${calculateRankProgress(player.level)}%</span>
          </div>
          <div class="rank-progress-bar">
            <div class="rank-progress-fill" style="width: ${calculateRankProgress(player.level)}%; background: ${getRankInfo(player.rank).color}"></div>
          </div>
          <div class="rank-info">
            <span>${getRankInfo(player.rank).description}</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="profile-section">
        <div class="section-header">
          <h3 class="section-title">ATTRIBUTES</h3>
          <span class="section-total">TOTAL: ${calculateTotalStats(player.stats)}</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards(player.stats)}
        </div>
      </div>

      <!-- Body Information -->
      <div class="profile-section">
        <div class="section-header">
          <h3 class="section-title">BODY METRICS</h3>
          <button class="btn-edit" id="btn-edit-body">
            ${ProfileState.editMode ? 'SAVE' : 'EDIT'}
          </button>
        </div>
        <div class="body-grid" id="body-metrics-grid">
          ${ProfileState.editMode ? renderBodyEditForm(player.body) : renderBodyMetrics(player.body)}
        </div>
      </div>

      <!-- Achievements Preview -->
      <div class="profile-section">
        <div class="section-header">
          <h3 class="section-title">ACHIEVEMENTS</h3>
          <a href="achievements.html" class="section-link">VIEW ALL →</a>
        </div>
        <div class="achievements-preview">
          ${renderAchievementsPreview(player.unlockedAchievements)}
        </div>
      </div>

      <!-- Titles Collection -->
      <div class="profile-section">
        <div class="section-header">
          <h3 class="section-title">UNLOCKED TITLES</h3>
          <span class="section-count">${player.unlockedTitles.length} TITLES</span>
        </div>
        <div class="titles-grid">
          ${renderTitles(player.unlockedTitles, player.title)}
        </div>
      </div>

      <!-- Profile Stats Summary -->
      <div class="profile-section">
        <div class="section-header">
          <h3 class="section-title">SUMMARY</h3>
        </div>
        <div class="summary-grid">
          <div class="summary-card">
            <span class="summary-label">Total Workouts</span>
            <span class="summary-value">${player.totalWorkouts}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Total XP Earned</span>
            <span class="summary-value">${formatXP(player.totalXPEarned)}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Current Streak</span>
            <span class="summary-value">${player.streak} days</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Longest Streak</span>
            <span class="summary-value">${player.longestStreak} days</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Active Quests</span>
            <span class="summary-value">${player.activeQuests.length}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Completed Quests</span>
            <span class="summary-value">${player.completedQuests.length}</span>
          </div>
        </div>
      </div>

    </div>
  `;

    bindProfileEvents();
}

// ─────────────────────────────────────────────
// COMPONENT RENDERERS
// ─────────────────────────────────────────────

function renderStatCards(stats) {
    const statNames = {
        strength: { label: 'Strength', icon: '💪', color: '#ff4444' },
        endurance: { label: 'Endurance', icon: '🏃', color: '#44aaff' },
        agility: { label: 'Agility', icon: '⚡', color: '#ffaa44' },
        intelligence: { label: 'Intelligence', icon: '🧠', color: '#aa44ff' },
        willpower: { label: 'Willpower', icon: '🔥', color: '#44ffaa' },
    };

    return Object.entries(stats).map(([key, value]) => {
        const stat = statNames[key];
        if (!stat) return '';

        return `
      <div class="stat-card" style="--stat-color: ${stat.color}">
        <div class="stat-icon">${stat.icon}</div>
        <div class="stat-info">
          <span class="stat-label">${stat.label}</span>
          <span class="stat-value">${value}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${value}%; background: ${stat.color}"></div>
        </div>
      </div>
    `;
    }).join('');
}

function renderBodyMetrics(body) {
    const bmi = body.bmi || (body.height && body.weight ? calculateBMI(body.weight, body.height) : null);
    const bmiCategory = bmi ? getBMICategory(bmi) : 'Unknown';

    return `
    <div class="body-metric-card">
      <span class="metric-label">HEIGHT</span>
      <span class="metric-value">${body.height ? formatHeight(body.height) : '—'}</span>
    </div>
    <div class="body-metric-card">
      <span class="metric-label">WEIGHT</span>
      <span class="metric-value">${body.weight ? formatWeight(body.weight) : '—'}</span>
    </div>
    <div class="body-metric-card">
      <span class="metric-label">AGE</span>
      <span class="metric-value">${body.age || '—'}</span>
    </div>
    <div class="body-metric-card">
      <span class="metric-label">GENDER</span>
      <span class="metric-value">${body.gender ? body.gender.toUpperCase() : '—'}</span>
    </div>
    <div class="body-metric-card">
      <span class="metric-label">BMI</span>
      <span class="metric-value">${bmi ? formatBMI(bmi) : '—'}</span>
    </div>
    <div class="body-metric-card">
      <span class="metric-label">CATEGORY</span>
      <span class="metric-value">${bmiCategory}</span>
    </div>
  `;
}

function renderBodyEditForm(body) {
    return `
    <div class="body-edit-form">
      <div class="form-group">
        <label>Height (cm)</label>
        <input type="number" id="input-height" value="${body.height || ''}" placeholder="170" min="50" max="300">
      </div>
      <div class="form-group">
        <label>Weight (kg)</label>
        <input type="number" id="input-weight" value="${body.weight || ''}" placeholder="70" min="20" max="500">
      </div>
      <div class="form-group">
        <label>Age</label>
        <input type="number" id="input-age" value="${body.age || ''}" placeholder="25" min="13" max="120">
      </div>
      <div class="form-group">
        <label>Gender</label>
        <select id="input-gender">
          <option value="">Select</option>
          <option value="male" ${body.gender === 'male' ? 'selected' : ''}>Male</option>
          <option value="female" ${body.gender === 'female' ? 'selected' : ''}>Female</option>
          <option value="other" ${body.gender === 'other' ? 'selected' : ''}>Other</option>
          <option value="prefer-not-to-say" ${body.gender === 'prefer-not-to-say' ? 'selected' : ''}>Prefer not to say</option>
        </select>
      </div>
    </div>
  `;
}

function renderAchievementsPreview(achievements) {
    if (!achievements || achievements.length === 0) {
        return `
      <div class="no-achievements">
        <span>No achievements unlocked yet.</span>
        <p>Complete quests and workouts to earn achievements.</p>
      </div>
    `;
    }

    const preview = achievements.slice(0, 6);

    return `
    <div class="achievements-grid">
      ${preview.map(a => `
        <div class="achievement-badge">
          <span class="achievement-icon">🏆</span>
          <span class="achievement-name">${a}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTitles(titles, activeTitle) {
    if (!titles || titles.length === 0) {
        return `<div class="no-titles">No titles unlocked yet.</div>`;
    }

    return titles.map(title => `
    <div class="title-card ${title === activeTitle ? 'active' : ''}" data-title="${title}">
      <span class="title-text">"${title}"</span>
      ${title === activeTitle ? '<span class="title-badge">ACTIVE</span>' : ''}
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────

function bindProfileEvents() {
    const editBtn = document.getElementById('btn-edit-body');
    if (editBtn) {
        editBtn.addEventListener('click', toggleBodyEdit);
    }

    // Bind title selection
    document.querySelectorAll('.title-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title;
            selectTitle(title);
        });
    });
}

function toggleBodyEdit() {
    if (ProfileState.editMode) {
        // Save mode
        saveBodyMetrics();
        ProfileState.editMode = false;
    } else {
        // Edit mode
        ProfileState.editMode = true;
    }

    renderProfile();
}

function saveBodyMetrics() {
    const height = parseFloat(document.getElementById('input-height')?.value);
    const weight = parseFloat(document.getElementById('input-weight')?.value);
    const age = parseInt(document.getElementById('input-age')?.value);
    const gender = document.getElementById('input-gender')?.value;

    const bodyData = {};

    if (!isNaN(height) && height > 0) bodyData.height = height;
    if (!isNaN(weight) && weight > 0) bodyData.weight = weight;
    if (!isNaN(age) && age > 0) bodyData.age = age;
    if (gender) bodyData.gender = gender;

    Storage.updateBody(bodyData);
    ProfileState.player = Storage.getPlayer();

    showSystemMessage('BODY METRICS UPDATED', 'success');
}

function selectTitle(title) {
    Storage.setActiveTitle(title);
    ProfileState.player = Storage.getPlayer();
    renderProfile();
    showSystemMessage(`TITLE EQUIPPED — "${title}"`, 'success');
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
// HELPER: CALCULATE BMI
// ─────────────────────────────────────────────

function calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm === 0) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    renderProfile,
    toggleBodyEdit,
    selectTitle,
};

// Auto-init if on profile page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}