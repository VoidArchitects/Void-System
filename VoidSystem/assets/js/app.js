// ============================================================
// VOID SYSTEM — app.js
// Global Application Initializer | Startup Sequence | Core Setup
// ============================================================

import { Storage } from './storage.js';
import { initRouteGuard } from './router.js';
// [FIX] Commented out unused import to remove orphaned logic
// import { checkSystemAccess } from './modules/system.js';

// ─────────────────────────────────────────────
// APPLICATION STATE
// ─────────────────────────────────────────────

const AppState = {
    initialized: false,
    player: null,
    currentPage: null,
    debug: false,
};

// ─────────────────────────────────────────────
// INITIALIZATION SEQUENCE
// ─────────────────────────────────────────────

/**
 * Main application initialization
 */
async function init() {
    if (AppState.initialized) {
        console.warn('[APP] Already initialized');
        return;
    }

    console.log('[APP] Initializing VOID SYSTEM...');

    try {
        // 1. Load player data
        await loadPlayerData();

        // 2. Initialize route guard (already runs automatically, but ensure it's done)
        initRouteGuard();

        // 3. Detect current page
        detectCurrentPage();

        // 4. Setup global event listeners
        setupGlobalListeners();

        // 5. Initialize page-specific modules
        // [FIX] Commented out duplicate module auto-initialization since modules self-initialize
        // await initPageModules();

        // 6. Check for level-up or rank-up notifications
        checkProgressionNotifications();

        // 7. Mark as initialized
        AppState.initialized = true;

        console.log('[APP] VOID SYSTEM initialized successfully');
    } catch (err) {
        console.error('[APP] Initialization failed:', err);
        showCriticalError('System initialization failed. Please refresh the page.');
    }
}

// ─────────────────────────────────────────────
// PLAYER DATA LOADING
// ─────────────────────────────────────────────

/**
 * Load player data from storage
 */
async function loadPlayerData() {
    try {
        AppState.player = Storage.getPlayer();

        if (!AppState.player) {
            console.error('[APP] Failed to load player data');
            return;
        }

        console.log('[APP] Player data loaded:', {
            id: AppState.player.id,
            level: AppState.player.level,
            rank: AppState.player.rank,
            xp: AppState.player.xp,
        });
    } catch (err) {
        console.error('[APP] Error loading player data:', err);
        throw err;
    }
}

// ─────────────────────────────────────────────
// PAGE DETECTION
// ─────────────────────────────────────────────

/**
 * Detect current page from URL
 */
function detectCurrentPage() {
    const path = window.location.pathname;

    if (path.includes('dashboard.html')) {
        AppState.currentPage = 'dashboard';
    } else if (path.includes('profile.html')) {
        AppState.currentPage = 'profile';
    } else if (path.includes('quests.html')) {
        AppState.currentPage = 'quests';
    } else if (path.includes('workout.html')) {
        AppState.currentPage = 'workout';
    } else if (path.includes('progress.html')) {
        AppState.currentPage = 'progress';
    } else if (path.includes('splitPlanner.html')) {
        AppState.currentPage = 'splitPlanner';
    } else if (path.includes('achievements.html')) {
        AppState.currentPage = 'achievements';
    } else if (path.includes('library.html')) {
        AppState.currentPage = 'library';
    } else if (path.includes('diet.html')) {
        AppState.currentPage = 'diet';
    } else if (path.includes('analytics.html')) {
        AppState.currentPage = 'analytics';
    } else if (path.includes('settings.html')) {
        AppState.currentPage = 'settings';
    } else if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        AppState.currentPage = 'intro';
    } else if (path.includes('banned.html')) {
        AppState.currentPage = 'banned';
    } else if (path.includes('rejected.html')) {
        AppState.currentPage = 'rejected';
    } else {
        AppState.currentPage = 'unknown';
    }

    console.log('[APP] Current page:', AppState.currentPage);
}

// ─────────────────────────────────────────────
// PAGE MODULE INITIALIZATION
// ─────────────────────────────────────────────

/**
 * Initialize page-specific modules
 */
async function initPageModules() {
    const page = AppState.currentPage;

    console.log(`[APP] Initializing modules for: ${page}`);

    // Page-specific initialization is handled by individual module files
    // This function can be used for shared setup or cross-page coordination

    switch (page) {
        case 'dashboard':
            // dashboard module auto-initializes
            break;

        case 'profile':
            // profile module auto-initializes
            break;

        case 'quests':
            // quests module auto-initializes
            break;

        case 'workout':
            // workout module auto-initializes
            break;

        case 'intro':
            // system module auto-initializes
            break;

        default:
            // Other pages will auto-initialize when created
            break;
    }
}

// ─────────────────────────────────────────────
// GLOBAL EVENT LISTENERS
// ─────────────────────────────────────────────

/**
 * Setup global event listeners
 */
function setupGlobalListeners() {
    // Handle visibility change (tab focus/blur)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle before unload (save state before closing)
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Handle online/offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeyboard);

    console.log('[APP] Global event listeners registered');
}

/**
 * Handle tab visibility change
 */
function handleVisibilityChange() {
    if (document.hidden) {
        console.log('[APP] Tab hidden - saving state');
        Storage.savePlayer();
    } else {
        console.log('[APP] Tab visible - checking for updates');
        // Reload player data in case it changed in another tab
        AppState.player = Storage.getPlayer();
    }
}

/**
 * Handle before page unload
 */
function handleBeforeUnload(e) {
    // Save player data one final time
    Storage.savePlayer();
}

/**
 * Handle online status
 */
function handleOnline() {
    console.log('[APP] Connection restored');
    showSystemNotification('CONNECTION RESTORED', 'success');
}

/**
 * Handle offline status
 */
function handleOffline() {
    console.log('[APP] Connection lost');
    showSystemNotification('OFFLINE MODE — DATA SAVED LOCALLY', 'warning');
}

/**
 * Handle global keyboard shortcuts
 */
function handleGlobalKeyboard(e) {
    // Debug mode toggle (Ctrl + Shift + D)
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        toggleDebugMode();
        e.preventDefault();
    }

    // Quick navigation shortcuts
    if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
            case 'H': // Home/Dashboard
                window.location.href = getRelativePath('dashboard.html');
                e.preventDefault();
                break;
            case 'P': // Profile
                window.location.href = getRelativePath('profile.html');
                e.preventDefault();
                break;
            case 'Q': // Quests
                window.location.href = getRelativePath('quests.html');
                e.preventDefault();
                break;
            case 'W': // Workout
                window.location.href = getRelativePath('workout.html');
                e.preventDefault();
                break;
        }
    }
}

// ─────────────────────────────────────────────
// PROGRESSION NOTIFICATIONS
// ─────────────────────────────────────────────

/**
 * Check for progression notifications (level-up, rank-up)
 */
function checkProgressionNotifications() {
    // This is a placeholder for future notification system
    // Will check if player just leveled up or ranked up
    // and show celebratory notifications

    const player = AppState.player;

    // Example: Check if there's a flag for recent level-up
    if (sessionStorage.getItem('VOID_JUST_LEVELED_UP')) {
        showLevelUpNotification(player.level);
        sessionStorage.removeItem('VOID_JUST_LEVELED_UP');
    }

    if (sessionStorage.getItem('VOID_JUST_RANKED_UP')) {
        showRankUpNotification(player.rank);
        sessionStorage.removeItem('VOID_JUST_RANKED_UP');
    }
}

/**
 * Show level-up notification
 */
function showLevelUpNotification(level) {
    showSystemNotification(`LEVEL UP — LEVEL ${level} REACHED`, 'level-up');
    // Future: trigger level-up animation/sound
}

/**
 * Show rank-up notification
 */
function showRankUpNotification(rank) {
    showSystemNotification(`RANK PROMOTION — ${rank}-RANK ACHIEVED`, 'level-up');
    // Future: trigger rank-up animation/sound
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

/**
 * Show system notification
 */
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
    }, 3000);
}

/**
 * Show critical error
 */
function showCriticalError(msg) {
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'critical-error-overlay';
    errorOverlay.innerHTML = `
    <div class="critical-error-box">
      <h2>SYSTEM ERROR</h2>
      <p>${msg}</p>
      <button onclick="window.location.reload()">RELOAD</button>
    </div>
  `;
    document.body.appendChild(errorOverlay);
}

// ─────────────────────────────────────────────
// DEBUG MODE
// ─────────────────────────────────────────────

/**
 * Toggle debug mode
 */
function toggleDebugMode() {
    AppState.debug = !AppState.debug;

    if (AppState.debug) {
        console.log('[APP] Debug mode ENABLED');
        document.body.classList.add('debug-mode');
        showSystemNotification('DEBUG MODE ENABLED', 'info');
        exposeDebugAPI();
    } else {
        console.log('[APP] Debug mode DISABLED');
        document.body.classList.remove('debug-mode');
        showSystemNotification('DEBUG MODE DISABLED', 'info');
    }
}

/**
 * Expose debug API to window
 */
function exposeDebugAPI() {
    window.VOID_DEBUG = {
        getPlayer: () => Storage.getPlayer(),
        getState: () => AppState,
        addXP: (amount) => Storage.addXP(amount),
        setLevel: (level) => {
            const player = Storage.getPlayer();
            player.level = level;
            Storage.savePlayer();
            console.log(`Level set to ${level}`);
        },
        resetPlayer: () => Storage.resetPlayer(),
        exportData: () => Storage.exportData(),
        getCurrentPage: () => AppState.currentPage,
        log: (msg) => console.log('[DEBUG]', msg),
    };

    console.log('[APP] Debug API exposed to window.VOID_DEBUG');
    console.log('Available commands:', Object.keys(window.VOID_DEBUG));
}

// ─────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────

/**
 * Get relative path for navigation
 */
function getRelativePath(filename) {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/pages/')) {
        return filename;
    }

    return `./pages/${filename}`;
}

/**
 * Refresh player data
 */
function refreshPlayerData() {
    AppState.player = Storage.getPlayer();
    return AppState.player;
}

/**
 * Get current player
 */
function getCurrentPlayer() {
    return AppState.player;
}

/**
 * Check if app is initialized
 */
function isInitialized() {
    return AppState.initialized;
}

// ─────────────────────────────────────────────
// PERFORMANCE MONITORING (OPTIONAL)
// ─────────────────────────────────────────────

/**
 * Log performance metrics
 */
function logPerformanceMetrics() {
    if (!AppState.debug) return;

    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

        console.log('[APP] Performance Metrics:', {
            totalLoadTime: `${loadTime}ms`,
            domReady: `${domReady}ms`,
        });
    }
}

// ─────────────────────────────────────────────
// AUTO-INITIALIZATION
// ─────────────────────────────────────────────

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        // Log performance after load
        window.addEventListener('load', logPerformanceMetrics);
    });
} else {
    // DOM already loaded
    init();
    logPerformanceMetrics();
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
    init,
    AppState,
    refreshPlayerData,
    getCurrentPlayer,
    isInitialized,
    showSystemNotification,
    toggleDebugMode,
};

// Expose some functions globally for inline event handlers (if needed)
if (typeof window !== 'undefined') {
    window.VoidApp = {
        refreshPlayerData,
        showSystemNotification,
        toggleDebugMode,
    };
}