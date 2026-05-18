// ============================================================
// VOID SYSTEM — soundManager.js
// Audio Controller | Sound Effects | Background Music
// ============================================================

import { SOUNDS } from './constants.js';
import { Storage } from '../storage.js';

// ─────────────────────────────────────────────
// SOUND MANAGER STATE
// ─────────────────────────────────────────────

const SoundState = {
    enabled: true,
    volume: 0.5,
    loadedSounds: {},
    currentMusic: null,
    initialized: false,
};

// ─────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────

/**
 * Initialize sound manager
 */
function init() {
    if (SoundState.initialized) return;

    // Load settings from player preferences
    const player = Storage.getPlayer();
    if (player && player.settings) {
        SoundState.enabled = player.settings.soundEnabled !== false;
    }

    // Preload critical sounds
    preloadSounds();

    SoundState.initialized = true;
    console.log('[SOUND] Sound Manager initialized');
}

/**
 * Preload sound files
 */
function preloadSounds() {
    // Preload commonly used sounds
    const criticalSounds = [
        SOUNDS.LEVEL_UP,
        SOUNDS.QUEST_COMPLETE,
        SOUNDS.ACHIEVEMENT,
        SOUNDS.NOTIFICATION,
    ];

    criticalSounds.forEach(src => {
        if (src) preloadSound(src);
    });
}

/**
 * Preload a single sound file
 */
function preloadSound(src) {
    if (SoundState.loadedSounds[src]) return;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = src;

    SoundState.loadedSounds[src] = audio;
}

// ─────────────────────────────────────────────
// SOUND PLAYBACK
// ─────────────────────────────────────────────

/**
 * Play sound effect
 * @param {string} soundKey - Sound key from SOUNDS constants
 * @param {number} volumeOverride - Optional volume override (0-1)
 */
function playSound(soundKey, volumeOverride = null) {
    if (!SoundState.enabled) return;

    const src = SOUNDS[soundKey];
    if (!src) {
        console.warn(`[SOUND] Sound not found: ${soundKey}`);
        return;
    }

    try {
        let audio = SoundState.loadedSounds[src];

        if (!audio) {
            audio = new Audio(src);
            SoundState.loadedSounds[src] = audio;
        }

        // Clone audio for overlapping sounds
        const clone = audio.cloneNode();
        clone.volume = volumeOverride !== null ? volumeOverride : SoundState.volume;

        const playPromise = clone.play();

        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn('[SOUND] Play failed:', err);
            });
        }
    } catch (err) {
        console.error('[SOUND] Error playing sound:', err);
    }
}

/**
 * Play level up sound
 */
function playLevelUp() {
    playSound('LEVEL_UP', 0.7);
}

/**
 * Play quest complete sound
 */
function playQuestComplete() {
    playSound('QUEST_COMPLETE', 0.6);
}

/**
 * Play achievement unlock sound
 */
function playAchievement() {
    playSound('ACHIEVEMENT', 0.6);
}

/**
 * Play notification sound
 */
function playNotification() {
    playSound('NOTIFICATION', 0.4);
}

/**
 * Play warning sound
 */
function playWarning() {
    playSound('WARNING', 0.5);
}

/**
 * Play button click sound
 */
function playClick() {
    playSound('BUTTON_CLICK', 0.3);
}

/**
 * Play error sound
 */
function playError() {
    playSound('ERROR', 0.5);
}

// ─────────────────────────────────────────────
// BACKGROUND MUSIC (FUTURE)
// ─────────────────────────────────────────────

/**
 * Play background music
 * @param {string} musicSrc - Music file source
 * @param {boolean} loop - Loop music
 */
function playMusic(musicSrc, loop = true) {
    if (!SoundState.enabled) return;

    stopMusic();

    try {
        const music = new Audio(musicSrc);
        music.loop = loop;
        music.volume = SoundState.volume * 0.6; // Background music quieter than SFX

        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    SoundState.currentMusic = music;
                })
                .catch(err => {
                    console.warn('[SOUND] Music play failed:', err);
                });
        }
    } catch (err) {
        console.error('[SOUND] Error playing music:', err);
    }
}

/**
 * Stop background music
 */
function stopMusic() {
    if (SoundState.currentMusic) {
        SoundState.currentMusic.pause();
        SoundState.currentMusic.currentTime = 0;
        SoundState.currentMusic = null;
    }
}

/**
 * Pause background music
 */
function pauseMusic() {
    if (SoundState.currentMusic) {
        SoundState.currentMusic.pause();
    }
}

/**
 * Resume background music
 */
function resumeMusic() {
    if (SoundState.currentMusic) {
        const playPromise = SoundState.currentMusic.play();

        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn('[SOUND] Music resume failed:', err);
            });
        }
    }
}

// ─────────────────────────────────────────────
// VOLUME CONTROL
// ─────────────────────────────────────────────

/**
 * Set master volume
 * @param {number} volume - Volume (0-1)
 */
function setVolume(volume) {
    SoundState.volume = Math.max(0, Math.min(1, volume));

    // Update current music volume
    if (SoundState.currentMusic) {
        SoundState.currentMusic.volume = SoundState.volume * 0.6;
    }

    console.log(`[SOUND] Volume set to ${Math.round(SoundState.volume * 100)}%`);
}

/**
 * Get current volume
 * @returns {number} Current volume (0-1)
 */
function getVolume() {
    return SoundState.volume;
}

/**
 * Mute all sounds
 */
function mute() {
    SoundState.enabled = false;
    stopMusic();
    console.log('[SOUND] Muted');
}

/**
 * Unmute all sounds
 */
function unmute() {
    SoundState.enabled = true;
    console.log('[SOUND] Unmuted');
}

/**
 * Toggle mute
 */
function toggleMute() {
    if (SoundState.enabled) {
        mute();
    } else {
        unmute();
    }
    return SoundState.enabled;
}

/**
 * Check if sounds are enabled
 * @returns {boolean}
 */
function isEnabled() {
    return SoundState.enabled;
}

// ─────────────────────────────────────────────
// SETTINGS PERSISTENCE
// ─────────────────────────────────────────────

/**
 * Save sound settings to storage
 */
function saveSettings() {
    const player = Storage.getPlayer();
    if (player && player.settings) {
        player.settings.soundEnabled = SoundState.enabled;
        Storage.savePlayer();
    }
}

/**
 * Load sound settings from storage
 */
function loadSettings() {
    const player = Storage.getPlayer();
    if (player && player.settings) {
        SoundState.enabled = player.settings.soundEnabled !== false;
    }
}

// ─────────────────────────────────────────────
// SPATIAL AUDIO (FUTURE ENHANCEMENT)
// ─────────────────────────────────────────────

/**
 * Play sound with stereo panning
 * @param {string} soundKey - Sound key
 * @param {number} pan - Pan value (-1 to 1, -1 = left, 1 = right)
 */
function playSoundWithPan(soundKey, pan = 0) {
    if (!SoundState.enabled) return;

    const src = SOUNDS[soundKey];
    if (!src) return;

    try {
        const audio = new Audio(src);
        audio.volume = SoundState.volume;

        // Create audio context for panning (if available)
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(audio);
            const panner = audioContext.createStereoPanner();
            panner.pan.value = Math.max(-1, Math.min(1, pan));

            source.connect(panner);
            panner.connect(audioContext.destination);
        }

        audio.play().catch(err => console.warn('[SOUND] Panned sound play failed:', err));
    } catch (err) {
        console.error('[SOUND] Error playing panned sound:', err);
    }
}

// ─────────────────────────────────────────────
// AUDIO FEEDBACK HELPERS
// ─────────────────────────────────────────────

/**
 * Play UI feedback sound (for button clicks, etc.)
 */
function playUIFeedback() {
    playClick();
}

/**
 * Play success feedback
 */
function playSuccess() {
    playNotification();
}

/**
 * Play failure feedback
 */
function playFailure() {
    playError();
}

/**
 * Play progression sound (XP gain, level up, etc.)
 * @param {string} type - Type of progression ('xp', 'level', 'rank', 'achievement')
 */
function playProgression(type) {
    switch (type) {
        case 'level':
            playLevelUp();
            break;
        case 'rank':
            playLevelUp(); // Use same sound or create rank-specific
            break;
        case 'achievement':
            playAchievement();
            break;
        case 'quest':
            playQuestComplete();
            break;
        case 'xp':
        default:
            playNotification();
            break;
    }
}

// ─────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────

/**
 * Clean up sound manager (stop all sounds)
 */
function cleanup() {
    stopMusic();
    SoundState.loadedSounds = {};
    console.log('[SOUND] Cleanup complete');
}

// ─────────────────────────────────────────────
// AUTO-INITIALIZE
// ─────────────────────────────────────────────

// Auto-initialize when imported
init();

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
    init,
    playSound,
    playLevelUp,
    playQuestComplete,
    playAchievement,
    playNotification,
    playWarning,
    playClick,
    playError,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setVolume,
    getVolume,
    mute,
    unmute,
    toggleMute,
    isEnabled,
    saveSettings,
    loadSettings,
    playSoundWithPan,
    playUIFeedback,
    playSuccess,
    playFailure,
    playProgression,
    cleanup,
};

export {
    init,
    playSound,
    playLevelUp,
    playQuestComplete,
    playAchievement,
    playNotification,
    playWarning,
    playClick,
    playError,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setVolume,
    getVolume,
    mute,
    unmute,
    toggleMute,
    isEnabled,
    saveSettings,
    loadSettings,
    playSoundWithPan,
    playUIFeedback,
    playSuccess,
    playFailure,
    playProgression,
    cleanup,
};