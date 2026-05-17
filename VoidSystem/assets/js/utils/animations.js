// ============================================================
// VOID SYSTEM — animations.js
// Animation Utilities | Motion Helpers | Visual Effects
// ============================================================

import { ANIMATION } from './constants.js';

// ─────────────────────────────────────────────
// FADE ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function fadeIn(element, duration = ANIMATION.NORMAL) {
    if (!element) return;

    element.style.opacity = '0';
    element.style.display = '';
    element.style.transition = `opacity ${duration}ms ease`;

    await nextFrame();
    element.style.opacity = '1';

    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Fade out element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function fadeOut(element, duration = ANIMATION.NORMAL) {
    if (!element) return;

    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, duration));
    element.style.display = 'none';
}

/**
 * Fade toggle
 * @param {HTMLElement} element - Element to toggle
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function fadeToggle(element, duration = ANIMATION.NORMAL) {
    if (!element) return;

    const isVisible = element.style.display !== 'none' && element.style.opacity !== '0';

    if (isVisible) {
        return fadeOut(element, duration);
    } else {
        return fadeIn(element, duration);
    }
}

// ─────────────────────────────────────────────
// SLIDE ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Slide in from direction
 * @param {HTMLElement} element - Element to slide
 * @param {string} direction - Direction (up, down, left, right)
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function slideIn(element, direction = 'up', duration = ANIMATION.NORMAL) {
    if (!element) return;

    const transforms = {
        up: 'translateY(20px)',
        down: 'translateY(-20px)',
        left: 'translateX(20px)',
        right: 'translateX(-20px)',
    };

    element.style.opacity = '0';
    element.style.transform = transforms[direction] || transforms.up;
    element.style.display = '';
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;

    await nextFrame();
    element.style.opacity = '1';
    element.style.transform = 'translate(0, 0)';

    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Slide out to direction
 * @param {HTMLElement} element - Element to slide
 * @param {string} direction - Direction (up, down, left, right)
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function slideOut(element, direction = 'down', duration = ANIMATION.NORMAL) {
    if (!element) return;

    const transforms = {
        up: 'translateY(-20px)',
        down: 'translateY(20px)',
        left: 'translateX(-20px)',
        right: 'translateX(20px)',
    };

    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    element.style.opacity = '0';
    element.style.transform = transforms[direction] || transforms.down;

    await new Promise(resolve => setTimeout(resolve, duration));
    element.style.display = 'none';
}

// ─────────────────────────────────────────────
// SCALE ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Scale in (pop in effect)
 * @param {HTMLElement} element - Element to scale
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function scaleIn(element, duration = ANIMATION.NORMAL) {
    if (!element) return;

    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.display = '';
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    await nextFrame();
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';

    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Scale out (pop out effect)
 * @param {HTMLElement} element - Element to scale
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function scaleOut(element, duration = ANIMATION.NORMAL) {
    if (!element) return;

    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';

    await new Promise(resolve => setTimeout(resolve, duration));
    element.style.display = 'none';
}

/**
 * Pulse scale animation
 * @param {HTMLElement} element - Element to pulse
 * @param {number} scale - Scale factor (e.g., 1.1)
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function pulse(element, scale = 1.05, duration = ANIMATION.FAST) {
    if (!element) return;

    const originalTransform = element.style.transform || 'scale(1)';

    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `scale(${scale})`;

    await new Promise(resolve => setTimeout(resolve, duration));

    element.style.transform = originalTransform;

    await new Promise(resolve => setTimeout(resolve, duration));
}

// ─────────────────────────────────────────────
// ROTATION ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Rotate element
 * @param {HTMLElement} element - Element to rotate
 * @param {number} degrees - Degrees to rotate
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function rotate(element, degrees, duration = ANIMATION.NORMAL) {
    if (!element) return;

    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `rotate(${degrees}deg)`;

    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Spin element (full rotation)
 * @param {HTMLElement} element - Element to spin
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function spin(element, duration = ANIMATION.SLOW) {
    return rotate(element, 360, duration);
}

// ─────────────────────────────────────────────
// SHAKE & VIBRATE
// ─────────────────────────────────────────────

/**
 * Shake element horizontally
 * @param {HTMLElement} element - Element to shake
 * @param {number} intensity - Shake intensity in px
 * @param {number} duration - Total duration in ms
 * @returns {Promise}
 */
export async function shake(element, intensity = 5, duration = ANIMATION.NORMAL) {
    if (!element) return;

    const originalTransform = element.style.transform || '';
    const iterations = 4;
    const iterationDuration = duration / (iterations * 2);

    for (let i = 0; i < iterations; i++) {
        element.style.transform = `translateX(${intensity}px)`;
        await sleep(iterationDuration);
        element.style.transform = `translateX(-${intensity}px)`;
        await sleep(iterationDuration);
    }

    element.style.transform = originalTransform;
}

/**
 * Bounce element vertically
 * @param {HTMLElement} element - Element to bounce
 * @param {number} height - Bounce height in px
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function bounce(element, height = 10, duration = ANIMATION.NORMAL) {
    if (!element) return;

    element.style.transition = `transform ${duration / 2}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.transform = `translateY(-${height}px)`;

    await sleep(duration / 2);

    element.style.transform = 'translateY(0)';

    await sleep(duration / 2);
}

// ─────────────────────────────────────────────
// FLASH & HIGHLIGHT
// ─────────────────────────────────────────────

/**
 * Flash element with background color
 * @param {HTMLElement} element - Element to flash
 * @param {string} color - Flash color
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function flash(element, color = 'rgba(123, 92, 250, 0.2)', duration = ANIMATION.NORMAL) {
    if (!element) return;

    const originalBg = element.style.backgroundColor;

    element.style.transition = `background-color ${duration / 2}ms ease`;
    element.style.backgroundColor = color;

    await sleep(duration / 2);

    element.style.backgroundColor = originalBg;

    await sleep(duration / 2);
}

/**
 * Highlight element with glow effect
 * @param {HTMLElement} element - Element to highlight
 * @param {string} color - Glow color
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function glow(element, color = '#7b5cfa', duration = ANIMATION.NORMAL) {
    if (!element) return;

    const originalShadow = element.style.boxShadow;

    element.style.transition = `box-shadow ${duration / 2}ms ease`;
    element.style.boxShadow = `0 0 20px ${color}`;

    await sleep(duration / 2);

    element.style.boxShadow = originalShadow;

    await sleep(duration / 2);
}

// ─────────────────────────────────────────────
// LEVEL UP ANIMATION
// ─────────────────────────────────────────────

/**
 * Level up celebration animation
 * @param {HTMLElement} element - Element to animate
 * @returns {Promise}
 */
export async function levelUpAnimation(element) {
    if (!element) return;

    // Scale up with glow
    element.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms ease';
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = '0 0 40px rgba(123, 92, 250, 0.8)';

    await sleep(400);

    // Bounce back
    element.style.transform = 'scale(1)';
    element.style.boxShadow = '0 0 0 rgba(123, 92, 250, 0)';

    await sleep(300);
}

/**
 * XP gain floating animation
 * @param {HTMLElement} element - Element to animate
 * @param {string} text - XP text to display
 * @returns {Promise}
 */
export async function floatingXP(element, text = '+100 XP') {
    if (!element) return;

    const floater = document.createElement('div');
    floater.textContent = text;
    floater.style.position = 'absolute';
    floater.style.top = '50%';
    floater.style.left = '50%';
    floater.style.transform = 'translate(-50%, -50%)';
    floater.style.fontSize = '16px';
    floater.style.fontWeight = 'bold';
    floater.style.color = '#7b5cfa';
    floater.style.pointerEvents = 'none';
    floater.style.zIndex = '9999';
    floater.style.transition = 'opacity 1.2s ease, transform 1.2s ease';

    element.style.position = 'relative';
    element.appendChild(floater);

    await nextFrame();

    floater.style.opacity = '0';
    floater.style.transform = 'translate(-50%, -100px)';

    await sleep(1200);

    floater.remove();
}

// ─────────────────────────────────────────────
// TYPING ANIMATION
// ─────────────────────────────────────────────

/**
 * Type text character by character
 * @param {HTMLElement} element - Element to type into
 * @param {string} text - Text to type
 * @param {number} speed - Speed in ms per character
 * @returns {Promise}
 */
export async function typeText(element, text, speed = ANIMATION.TYPING_SPEED) {
    if (!element) return;

    element.textContent = '';

    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(speed);
    }
}

/**
 * Erase text character by character
 * @param {HTMLElement} element - Element to erase from
 * @param {number} speed - Speed in ms per character
 * @returns {Promise}
 */
export async function eraseText(element, speed = ANIMATION.TYPING_SPEED / 2) {
    if (!element) return;

    const text = element.textContent;

    for (let i = text.length; i >= 0; i--) {
        element.textContent = text.slice(0, i);
        await sleep(speed);
    }
}

// ─────────────────────────────────────────────
// STAGGER ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Stagger animation on multiple elements
 * @param {NodeList|Array} elements - Elements to animate
 * @param {Function} animation - Animation function
 * @param {number} delay - Delay between each element in ms
 * @returns {Promise}
 */
export async function stagger(elements, animation, delay = 100) {
    if (!elements || elements.length === 0) return;

    const promises = Array.from(elements).map((el, index) => {
        return new Promise(async resolve => {
            await sleep(index * delay);
            await animation(el);
            resolve();
        });
    });

    await Promise.all(promises);
}

/**
 * Stagger fade in for list
 * @param {NodeList|Array} elements - Elements to fade in
 * @param {number} delay - Delay between each in ms
 * @returns {Promise}
 */
export async function staggerFadeIn(elements, delay = 100) {
    return stagger(elements, (el) => fadeIn(el, ANIMATION.FAST), delay);
}

/**
 * Stagger slide in for list
 * @param {NodeList|Array} elements - Elements to slide in
 * @param {number} delay - Delay between each in ms
 * @returns {Promise}
 */
export async function staggerSlideIn(elements, delay = 100) {
    return stagger(elements, (el) => slideIn(el, 'up', ANIMATION.FAST), delay);
}

// ─────────────────────────────────────────────
// PROGRESS BAR ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Animate progress bar fill
 * @param {HTMLElement} element - Progress bar element
 * @param {number} targetPercent - Target percentage (0-100)
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function animateProgress(element, targetPercent, duration = ANIMATION.SLOW) {
    if (!element) return;

    element.style.transition = `width ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.width = `${Math.min(Math.max(targetPercent, 0), 100)}%`;

    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Count up number animation
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
export async function countUp(element, start, end, duration = ANIMATION.SLOW) {
    if (!element) return;

    const startTime = Date.now();
    const diff = end - start;

    return new Promise(resolve => {
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + (diff * progress));
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end.toLocaleString();
                resolve();
            }
        };

        update();
    });
}

// ─────────────────────────────────────────────
// NOTIFICATION ANIMATIONS
// ─────────────────────────────────────────────

/**
 * Show notification with slide in
 * @param {HTMLElement} element - Notification element
 * @returns {Promise}
 */
export async function showNotification(element) {
    if (!element) return;

    element.style.transform = 'translateY(60px)';
    element.style.opacity = '0';
    element.style.display = '';

    await nextFrame();

    element.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease';
    element.style.transform = 'translateY(0)';
    element.style.opacity = '1';

    return new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * Hide notification with slide out
 * @param {HTMLElement} element - Notification element
 * @returns {Promise}
 */
export async function hideNotification(element) {
    if (!element) return;

    element.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease';
    element.style.transform = 'translateY(60px)';
    element.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, 300));

    element.style.display = 'none';
}

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Sleep/wait
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Request next animation frame
 * @returns {Promise}
 */
export function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Add CSS class with animation delay
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name
 * @param {number} delay - Delay in ms
 * @returns {Promise}
 */
export async function addClassDelayed(element, className, delay = 0) {
    if (!element) return;

    if (delay > 0) {
        await sleep(delay);
    }

    element.classList.add(className);
}

/**
 * Remove CSS class with animation delay
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name
 * @param {number} delay - Delay in ms
 * @returns {Promise}
 */
export async function removeClassDelayed(element, className, delay = 0) {
    if (!element) return;

    if (delay > 0) {
        await sleep(delay);
    }

    element.classList.remove(className);
}

/**
 * Chain multiple animations
 * @param {HTMLElement} element - Element to animate
 * @param {Array<Function>} animations - Array of animation functions
 * @returns {Promise}
 */
export async function chainAnimations(element, animations) {
    if (!element || !Array.isArray(animations)) return;

    for (const animation of animations) {
        await animation(element);
    }
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
    fadeIn,
    fadeOut,
    fadeToggle,
    slideIn,
    slideOut,
    scaleIn,
    scaleOut,
    pulse,
    rotate,
    spin,
    shake,
    bounce,
    flash,
    glow,
    levelUpAnimation,
    floatingXP,
    typeText,
    eraseText,
    stagger,
    staggerFadeIn,
    staggerSlideIn,
    animateProgress,
    countUp,
    showNotification,
    hideNotification,
    sleep,
    nextFrame,
    addClassDelayed,
    removeClassDelayed,
    chainAnimations,
};