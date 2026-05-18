// ============================================================
// VOID SYSTEM — helpers.js
// General Utility Functions | DOM Helpers | Common Logic
// ============================================================

// ─────────────────────────────────────────────
// DOM MANIPULATION HELPERS
// ─────────────────────────────────────────────

/**
 * Get element by ID with error checking
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
export function getEl(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[HELPERS] Element not found: #${id}`);
  }
  return el;
}

/**
 * Query selector with error checking
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {HTMLElement|null}
 */
export function qs(selector, parent = document) {
  const el = parent.querySelector(selector);
  if (!el) {
    console.warn(`[HELPERS] Element not found: ${selector}`);
  }
  return el;
}

/**
 * Query selector all
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {NodeList}
 */
export function qsa(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Create element with options
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.className) el.className = options.className;
  if (options.id) el.id = options.id;
  if (options.text) el.textContent = options.text;
  if (options.html) el.innerHTML = options.html;

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }

  if (options.styles) {
    Object.assign(el.style, options.styles);
  }

  if (options.data) {
    Object.entries(options.data).forEach(([key, value]) => {
      el.dataset[key] = value;
    });
  }

  return el;
}

/**
 * Show element
 * @param {HTMLElement|string} el - Element or ID
 */
export function show(el) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) element.style.display = '';
}

/**
 * Hide element
 * @param {HTMLElement|string} el - Element or ID
 */
export function hide(el) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) element.style.display = 'none';
}

/**
 * Toggle element visibility
 * @param {HTMLElement|string} el - Element or ID
 */
export function toggle(el) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  }
}

/**
 * Add class to element
 * @param {HTMLElement|string} el - Element or ID
 * @param {string} className - Class name
 */
export function addClass(el, className) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) element.classList.add(className);
}

/**
 * Remove class from element
 * @param {HTMLElement|string} el - Element or ID
 * @param {string} className - Class name
 */
export function removeClass(el, className) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) element.classList.remove(className);
}

/**
 * Toggle class on element
 * @param {HTMLElement|string} el - Element or ID
 * @param {string} className - Class name
 */
export function toggleClass(el, className) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) element.classList.toggle(className);
}

// ─────────────────────────────────────────────
// ARRAY & COLLECTION HELPERS
// ─────────────────────────────────────────────

/**
 * Get random element from array
 * @param {Array} arr - Array
 * @returns {*}
 */
export function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array (Fisher-Yates)
 * @param {Array} arr - Array to shuffle
 * @returns {Array}
 */
export function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Remove duplicates from array
 * @param {Array} arr - Array
 * @returns {Array}
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Chunk array into groups
 * @param {Array} arr - Array
 * @param {number} size - Chunk size
 * @returns {Array}
 */
export function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Sort array of objects by key
 * @param {Array} arr - Array of objects
 * @param {string} key - Key to sort by
 * @param {boolean} ascending - Sort direction
 * @returns {Array}
 */
export function sortBy(arr, key, ascending = true) {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Group array by key
 * @param {Array} arr - Array of objects
 * @param {string} key - Key to group by
 * @returns {Object}
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

// ─────────────────────────────────────────────
// NUMBER & MATH HELPERS
// ─────────────────────────────────────────────

/**
 * Clamp number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Round to decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number}
 */
export function round(value, decimals = 0) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Progress (0-1)
 * @returns {number}
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input minimum
 * @param {number} inMax - Input maximum
 * @param {number} outMin - Output minimum
 * @param {number} outMax - Output maximum
 * @returns {number}
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// ─────────────────────────────────────────────
// STRING HELPERS
// ─────────────────────────────────────────────

/**
 * Capitalize first letter
 * @param {string} str - String
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize all words
 * @param {string} str - String
 * @returns {string}
 */
export function titleCase(str) {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
}

/**
 * Truncate string
 * @param {string} str - String
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix (default: '...')
 * @returns {string}
 */
export function truncate(str, maxLength, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string}
 */
export function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Slugify string (URL-safe)
 * @param {string} str - String
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─────────────────────────────────────────────
// OBJECT HELPERS
// ─────────────────────────────────────────────

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object}
 */
export function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Check if object is empty
 * @param {Object} obj - Object
 * @returns {boolean}
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// ─────────────────────────────────────────────
// ASYNC HELPERS
// ─────────────────────────────────────────────

/**
 * Sleep/delay
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
export function throttle(fn, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ─────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*}
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error('[HELPERS] localStorage get error:', err);
    return defaultValue;
  }
}

/**
 * Set item in localStorage with JSON stringification
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean}
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('[HELPERS] localStorage set error:', err);
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('[HELPERS] localStorage remove error:', err);
  }
}

/**
 * Clear all localStorage
 */
export function clearStorage() {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('[HELPERS] localStorage clear error:', err);
  }
}

// ─────────────────────────────────────────────
// URL & QUERY STRING HELPERS
// ─────────────────────────────────────────────

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null}
 */
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Get all query parameters
 * @returns {Object}
 */
export function getAllQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

// ─────────────────────────────────────────────
// COPY TO CLIPBOARD
// ─────────────────────────────────────────────

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('[HELPERS] Copy to clipboard failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────
// SCROLL HELPERS
// ─────────────────────────────────────────────

/**
 * Scroll to top of page
 * @param {boolean} smooth - Use smooth scrolling
 */
export function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Scroll to element
 * @param {HTMLElement|string} el - Element or ID
 * @param {boolean} smooth - Use smooth scrolling
 */
export function scrollToElement(el, smooth = true) {
  const element = typeof el === 'string' ? getEl(el) : el;
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    });
  }
}

// ─────────────────────────────────────────────
// PERFORMANCE
// ─────────────────────────────────────────────

/**
 * Request animation frame promise
 * @returns {Promise}
 */
export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Request idle callback promise
 * @returns {Promise}
 */
export function whenIdle() {
  return new Promise(resolve => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(resolve);
    } else {
      setTimeout(resolve, 1);
    }
  });
}