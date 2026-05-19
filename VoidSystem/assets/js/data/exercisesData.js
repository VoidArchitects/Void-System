// ============================================================
// VOID SYSTEM — exercisesData.js
// Exercise Database Loader | JSON Bridge | Fallback Handler
// ============================================================

// ─────────────────────────────────────────────
// FALLBACK EXERCISE DATA
// ─────────────────────────────────────────────

const FALLBACK_EXERCISES = {
    // PUSH EXERCISES
    push: [
        { id: 'bench_press', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'incline_bench', name: 'Incline Bench Press', muscle: 'Upper Chest', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'dumbbell_press', name: 'Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'chest_fly', name: 'Chest Fly', muscle: 'Chest', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'overhead_press', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'arnold_press', name: 'Arnold Press', muscle: 'Shoulders', equipment: 'Dumbbells', difficulty: 'intermediate' },
        { id: 'lateral_raise', name: 'Lateral Raise', muscle: 'Side Delts', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'front_raise', name: 'Front Raise', muscle: 'Front Delts', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'tricep_dips', name: 'Tricep Dips', muscle: 'Triceps', equipment: 'Bodyweight', difficulty: 'intermediate' },
        { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'Triceps', equipment: 'Cable', difficulty: 'beginner' },
        { id: 'skull_crushers', name: 'Skull Crushers', muscle: 'Triceps', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'pushups', name: 'Push-Ups', muscle: 'Chest', equipment: 'Bodyweight', difficulty: 'beginner' },
    ],

    // PULL EXERCISES
    pull: [
        { id: 'deadlift', name: 'Deadlift', muscle: 'Full Back', equipment: 'Barbell', difficulty: 'advanced' },
        { id: 'barbell_row', name: 'Barbell Row', muscle: 'Mid Back', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'dumbbell_row', name: 'Dumbbell Row', muscle: 'Mid Back', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'pullups', name: 'Pull-Ups', muscle: 'Lats', equipment: 'Bodyweight', difficulty: 'intermediate' },
        { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Lats', equipment: 'Cable', difficulty: 'beginner' },
        { id: 'face_pulls', name: 'Face Pulls', muscle: 'Rear Delts', equipment: 'Cable', difficulty: 'beginner' },
        { id: 'reverse_fly', name: 'Reverse Fly', muscle: 'Rear Delts', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'barbell_curl', name: 'Barbell Curl', muscle: 'Biceps', equipment: 'Barbell', difficulty: 'beginner' },
        { id: 'dumbbell_curl', name: 'Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'Biceps', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'preacher_curl', name: 'Preacher Curl', muscle: 'Biceps', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'chin_ups', name: 'Chin-Ups', muscle: 'Biceps/Back', equipment: 'Bodyweight', difficulty: 'intermediate' },
    ],

    // LEG EXERCISES
    legs: [
        { id: 'back_squat', name: 'Back Squat', muscle: 'Quads', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'front_squat', name: 'Front Squat', muscle: 'Quads', equipment: 'Barbell', difficulty: 'advanced' },
        { id: 'leg_press', name: 'Leg Press', muscle: 'Quads', equipment: 'Machine', difficulty: 'beginner' },
        { id: 'leg_extension', name: 'Leg Extension', muscle: 'Quads', equipment: 'Machine', difficulty: 'beginner' },
        { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', difficulty: 'intermediate' },
        { id: 'leg_curl', name: 'Leg Curl', muscle: 'Hamstrings', equipment: 'Machine', difficulty: 'beginner' },
        { id: 'lunges', name: 'Lunges', muscle: 'Quads/Glutes', equipment: 'Dumbbells', difficulty: 'beginner' },
        { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscle: 'Quads/Glutes', equipment: 'Dumbbells', difficulty: 'intermediate' },
        { id: 'hip_thrust', name: 'Hip Thrust', muscle: 'Glutes', equipment: 'Barbell', difficulty: 'beginner' },
        { id: 'calf_raise', name: 'Calf Raise', muscle: 'Calves', equipment: 'Machine', difficulty: 'beginner' },
        { id: 'seated_calf_raise', name: 'Seated Calf Raise', muscle: 'Calves', equipment: 'Machine', difficulty: 'beginner' },
    ],

    // CARDIO EXERCISES
    cardio: [
        { id: 'treadmill_run', name: 'Treadmill Run', muscle: 'Cardiovascular', equipment: 'Treadmill', difficulty: 'beginner' },
        { id: 'stationary_bike', name: 'Stationary Bike', muscle: 'Cardiovascular', equipment: 'Bike', difficulty: 'beginner' },
        { id: 'elliptical', name: 'Elliptical', muscle: 'Cardiovascular', equipment: 'Elliptical', difficulty: 'beginner' },
        { id: 'rowing_machine', name: 'Rowing Machine', muscle: 'Full Body', equipment: 'Rower', difficulty: 'intermediate' },
        { id: 'jump_rope', name: 'Jump Rope', muscle: 'Cardiovascular', equipment: 'Jump Rope', difficulty: 'beginner' },
        { id: 'burpees', name: 'Burpees', muscle: 'Full Body', equipment: 'Bodyweight', difficulty: 'intermediate' },
        { id: 'mountain_climbers', name: 'Mountain Climbers', muscle: 'Core/Cardio', equipment: 'Bodyweight', difficulty: 'beginner' },
        { id: 'stair_climber', name: 'Stair Climber', muscle: 'Legs/Cardio', equipment: 'Machine', difficulty: 'intermediate' },
    ],
};

// ─────────────────────────────────────────────
// DATA LOADER
// ─────────────────────────────────────────────

let cachedExercises = null;

/**
 * Load exercises from JSON file
 * @returns {Promise<Object>} Exercise database organized by type
 */
export async function loadExercises() {
    // Return cached if available
    if (cachedExercises) {
        return cachedExercises;
    }

    try {
        const response = await fetch('../data/exercises.json');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        cachedExercises = data.exercises || FALLBACK_EXERCISES;

        console.log('[EXERCISES DATA] Loaded from JSON');
        return cachedExercises;
    } catch (err) {
        console.warn('[EXERCISES DATA] Failed to load JSON, using fallback:', err.message);
        cachedExercises = FALLBACK_EXERCISES;
        return FALLBACK_EXERCISES;
    }
}

/**
 * Get exercises by type
 * @param {string} type - Exercise type (push, pull, legs, cardio)
 * @returns {Promise<Array>} Array of exercises
 */
export async function getExercisesByType(type) {
    const exercises = await loadExercises();
    return exercises[type] || [];
}

/**
 * Get exercise by ID
 * @param {string} id - Exercise ID
 * @returns {Promise<Object|null>} Exercise object or null
 */
export async function getExerciseById(id) {
    const exercises = await loadExercises();

    for (const type in exercises) {
        const exercise = exercises[type].find(ex => ex.id === id);
        if (exercise) return exercise;
    }

    return null;
}

/**
 * Get exercises by muscle group
 * @param {string} muscle - Muscle group
 * @returns {Promise<Array>} Array of exercises
 */
export async function getExercisesByMuscle(muscle) {
    const exercises = await loadExercises();
    const results = [];

    for (const type in exercises) {
        const filtered = exercises[type].filter(ex =>
            ex.muscle.toLowerCase().includes(muscle.toLowerCase())
        );
        results.push(...filtered);
    }

    return results;
}

/**
 * Get exercises by equipment
 * @param {string} equipment - Equipment type
 * @returns {Promise<Array>} Array of exercises
 */
export async function getExercisesByEquipment(equipment) {
    const exercises = await loadExercises();
    const results = [];

    for (const type in exercises) {
        const filtered = exercises[type].filter(ex =>
            ex.equipment.toLowerCase() === equipment.toLowerCase()
        );
        results.push(...filtered);
    }

    return results;
}

/**
 * Get exercises by difficulty
 * @param {string} difficulty - Difficulty (beginner, intermediate, advanced)
 * @returns {Promise<Array>} Array of exercises
 */
export async function getExercisesByDifficulty(difficulty) {
    const exercises = await loadExercises();
    const results = [];

    for (const type in exercises) {
        const filtered = exercises[type].filter(ex =>
            ex.difficulty === difficulty
        );
        results.push(...filtered);
    }

    return results;
}

/**
 * Search exercises by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching exercises
 */
export async function searchExercises(query) {
    const exercises = await loadExercises();
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const type in exercises) {
        const filtered = exercises[type].filter(ex =>
            ex.name.toLowerCase().includes(lowerQuery)
        );
        results.push(...filtered);
    }

    return results;
}

/**
 * Get all exercises (flattened)
 * @returns {Promise<Array>} Array of all exercises
 */
export async function getAllExercises() {
    const exercises = await loadExercises();
    const results = [];

    for (const type in exercises) {
        results.push(...exercises[type]);
    }

    return results;
}

/**
 * Clear cache
 */
export function clearCache() {
    cachedExercises = null;
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export default {
    loadExercises,
    getExercisesByType,
    getExerciseById,
    getExercisesByMuscle,
    getExercisesByEquipment,
    getExercisesByDifficulty,
    searchExercises,
    getAllExercises,
    clearCache,
    FALLBACK_EXERCISES,
};