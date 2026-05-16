// ============================================================
// VOID SYSTEM — router.js
// Navigation Control | Route Protection | Redirect Logic
// ============================================================

import { Storage } from './storage.js';

// ─────────────────────────────────────────────
// ROUTE CONFIGURATION
// ─────────────────────────────────────────────

const ROUTES = {
  // PUBLIC ROUTES (no auth required)
  public: [
    '/index.html',
    '/',
  ],
  
  // PROTECTED ROUTES (require system acceptance)
  protected: [
    '/pages/dashboard.html',
    '/pages/profile.html',
    '/pages/quests.html',
    '/pages/workout.html',
    '/pages/progress.html',
    '/pages/splitPlanner.html',
    '/pages/achievements.html',
    '/pages/library.html',
    '/pages/diet.html',
    '/pages/analytics.html',
    '/pages/settings.html',
  ],
  
  // SPECIAL ROUTES
  special: {
    rejected: '/pages/rejected.html',
    banned: '/pages/banned.html',
    intro: '/index.html',
    dashboard: '/pages/dashboard.html',
  },
};

// ─────────────────────────────────────────────
// ROUTE GUARDS
// ─────────────────────────────────────────────

class Router {
  
  constructor() {
    this.currentPath = window.location.pathname;
    this.player = Storage.getPlayer();
  }
  
  // ─── MAIN GUARD ───
  
  checkAccess() {
    const path = this.getCurrentPath();
    const player = Storage.getPlayer();
    
    // BANNED CHECK (highest priority)
    if (Storage.isBanned()) {
      if (!this.isOnBannedPage()) {
        this.redirectToBanned();
      }
      return false;
    }
    
    // NOT ACCEPTED CHECK
    if (!Storage.hasAcceptedSystem()) {
      // Allow intro page and rejected page
      if (this.isOnIntroPage() || this.isOnRejectedPage()) {
        return true;
      }
      
      // Redirect to intro if trying to access protected routes
      if (this.isProtectedRoute(path)) {
        this.redirectToIntro();
        return false;
      }
      
      return true;
    }
    
    // ACCEPTED — allow all protected routes
    // If on intro page and already accepted, go to dashboard
    if (this.isOnIntroPage() && Storage.hasAcceptedSystem()) {
      this.redirectToDashboard();
      return false;
    }
    
    return true;
  }
  
  // ─── PATH CHECKERS ───
  
  getCurrentPath() {
    return window.location.pathname;
  }
  
  isProtectedRoute(path) {
    return ROUTES.protected.some(route => path.includes(route));
  }
  
  isPublicRoute(path) {
    return ROUTES.public.some(route => {
      if (route === '/') return path === '/' || path.endsWith('/');
      return path.includes(route);
    });
  }
  
  isOnIntroPage() {
    const path = this.getCurrentPath();
    return path.includes('index.html') || path === '/' || path.endsWith('/');
  }
  
  isOnBannedPage() {
    return this.getCurrentPath().includes('banned.html');
  }
  
  isOnRejectedPage() {
    return this.getCurrentPath().includes('rejected.html');
  }
  
  isOnDashboard() {
    return this.getCurrentPath().includes('dashboard.html');
  }
  
  // ─── REDIRECTS ───
  
  redirectToIntro() {
    console.log('[ROUTER] Redirecting to intro — system not accepted');
    window.location.href = this.getBaseURL() + ROUTES.special.intro;
  }
  
  redirectToDashboard() {
    console.log('[ROUTER] Redirecting to dashboard');
    window.location.href = this.getBaseURL() + ROUTES.special.dashboard;
  }
  
  redirectToBanned() {
    console.log('[ROUTER] Redirecting to banned page');
    window.location.href = this.getBaseURL() + ROUTES.special.banned;
  }
  
  redirectToRejected() {
    console.log('[ROUTER] Redirecting to rejected page');
    window.location.href = this.getBaseURL() + ROUTES.special.rejected;
  }
  
  navigateTo(route) {
    // Manual navigation helper
    const fullPath = this.getBaseURL() + route;
    console.log('[ROUTER] Navigating to:', fullPath);
    window.location.href = fullPath;
  }
  
  // ─── HELPERS ───
  
  getBaseURL() {
    // Get base URL for absolute paths
    const path = window.location.pathname;
    const parts = path.split('/');
    
    // If we're in a subdirectory like /pages/, go up one level
    if (parts.includes('pages')) {
      return '../';
    }
    
    // If we're at root or in assets/js, use relative root
    return './';
  }
  
  // ─── NAVIGATION HISTORY ───
  
  goBack() {
    window.history.back();
  }
  
  goForward() {
    window.history.forward();
  }
  
  // ─── LOGGING ───
  
  logState() {
    console.log('[ROUTER] Current State:', {
      path: this.getCurrentPath(),
      accepted: Storage.hasAcceptedSystem(),
      banned: Storage.isBanned(),
      rejectionCount: Storage.getRejectionCount(),
      level: Storage.getLevel(),
    });
  }
}

// ─────────────────────────────────────────────
// NAVIGATION HELPERS (for UI buttons)
// ─────────────────────────────────────────────

function navigateToDashboard() {
  window.location.href = getCorrectPath('/pages/dashboard.html');
}

function navigateToProfile() {
  window.location.href = getCorrectPath('/pages/profile.html');
}

function navigateToQuests() {
  window.location.href = getCorrectPath('/pages/quests.html');
}

function navigateToWorkout() {
  window.location.href = getCorrectPath('/pages/workout.html');
}

function navigateToProgress() {
  window.location.href = getCorrectPath('/pages/progress.html');
}

function navigateToSettings() {
  window.location.href = getCorrectPath('/pages/settings.html');
}

function navigateToLibrary() {
  window.location.href = getCorrectPath('/pages/library.html');
}

function navigateToDiet() {
  window.location.href = getCorrectPath('/pages/diet.html');
}

function navigateToAchievements() {
  window.location.href = getCorrectPath('/pages/achievements.html');
}

function navigateToSplitPlanner() {
  window.location.href = getCorrectPath('/pages/splitPlanner.html');
}

function navigateToAnalytics() {
  window.location.href = getCorrectPath('/pages/analytics.html');
}

function getCorrectPath(route) {
  const currentPath = window.location.pathname;
  
  // If we're already in /pages/, remove the leading /pages from route
  if (currentPath.includes('/pages/')) {
    return route.replace('/pages/', '');
  }
  
  // If we're at root, use the route as-is but with relative path
  if (currentPath === '/' || currentPath.includes('index.html')) {
    return '.' + route;
  }
  
  // Default: relative navigation
  return route;
}

// ─────────────────────────────────────────────
// ACTIVE LINK HIGHLIGHTING
// ─────────────────────────────────────────────

function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if the link's href matches current path
    if (currentPath.includes(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ─────────────────────────────────────────────
// INIT GUARD (run on every page load)
// ─────────────────────────────────────────────

function initRouteGuard() {
  const router = new Router();
  router.checkAccess();
  router.logState();
  
  // Highlight active nav links
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightActiveNavLink);
  } else {
    highlightActiveNavLink();
  }
}

// ─────────────────────────────────────────────
// AUTO-EXECUTE GUARD
// ─────────────────────────────────────────────

// Run route guard immediately on script load
initRouteGuard();

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
  Router,
  initRouteGuard,
  navigateToDashboard,
  navigateToProfile,
  navigateToQuests,
  navigateToWorkout,
  navigateToProgress,
  navigateToSettings,
  navigateToLibrary,
  navigateToDiet,
  navigateToAchievements,
  navigateToSplitPlanner,
  navigateToAnalytics,
  highlightActiveNavLink,
};

// Make navigation helpers globally available (optional, for inline onclick handlers)
if (typeof window !== 'undefined') {
  window.voidNavigate = {
    dashboard: navigateToDashboard,
    profile: navigateToProfile,
    quests: navigateToQuests,
    workout: navigateToWorkout,
    progress: navigateToProgress,
    settings: navigateToSettings,
    library: navigateToLibrary,
    diet: navigateToDiet,
    achievements: navigateToAchievements,
    splitPlanner: navigateToSplitPlanner,
    analytics: navigateToAnalytics,
  };
}