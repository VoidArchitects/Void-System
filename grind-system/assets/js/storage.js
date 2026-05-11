// ─────────────────────────────────────────
//  DATA STRUCTURE
// ─────────────────────────────────────────
//  The default player data template used across the system.

let playerData = {
    "name": "",
    "xp": 0,

    "weight": 70, // in kg
    "height": 173, // in cm
    "age": 18,

    "quests": {},

    "stats": {
        "strength": 1,
        "vitality": 1
    }
};

// ─────────────────────────────────────────
//  DATA INITIALIZATION & STORAGE
// ─────────────────────────────────────────
//  Handles loading, parsing, and saving player data to local storage.

function initializePlayerData() {
    if (localStorage.getItem('playerData') === null) {
        savePlayerData(playerData);
    } else {
        playerData = getPlayerData();
    }
}

function getPlayerData() {
    const data = JSON.parse(localStorage.getItem('playerData'));
    return data || playerData;
}

function savePlayerData(data) {
    localStorage.setItem('playerData', JSON.stringify(data));
}

function updatePlayerData(){
    savePlayerData(playerData);
}
// ─────────────────────────────────────────
//  LEVELING SYSTEM
// ─────────────────────────────────────────
//  Handles XP scaling and level calculation based on cumulative XP.

function getTotalXpForLevel(level) {
    let cumulative = 0;
    if (level <= 21) {
        cumulative = 368.415 * Math.pow(level, 2) + 263.3 * level - 631.715; // Early Game
    } else if (level <= 41) {
        cumulative = 2236.845 * Math.pow(level, 2) - 78947.5 * level + 1057368; // Mid Game
    } else {
        cumulative = 0.001894 * Math.pow(level, 3) + 10526.14 * Math.pow(level, 2) - 763150 * level + 4892347; // Late Game
    }
    return Math.round(cumulative);
}

function getLevelFromXp(xp) {
    let level = 1;
    while (getTotalXpForLevel(level + 1) <= xp) {
        level++;
    }
    return level;
}

function getLevel(){
    return getLevelFromXp(playerData.xp);
}

// ─────────────────────────────────────────
//  XP MANAGEMENT
// ─────────────────────────────────────────

function addXp(amount){
    playerData.xp += amount;
    updatePlayerData();
}

initializePlayerData();