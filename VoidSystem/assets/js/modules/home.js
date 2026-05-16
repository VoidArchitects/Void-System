// ─────────────────────────────────────────
//  DOM ELEMENTS
// ─────────────────────────────────────────

const userxp = document.getElementById("xp");
const userlevel = document.getElementById("userlevel");
const systemMessage = document.getElementById("systemMessage");
const addxpBtn = document.getElementById("addXp");


// ─────────────────────────────────────────
//  RENDER SYSTEM
// ─────────────────────────────────────────

function renderXp() {
    userxp.innerText = playerData.xp;
}

function renderLevel() {
    userlevel.innerText = "Level: " + getLevel();
}

function renderSystemMessage(message) {
    systemMessage.innerText = message;
}

function renderPlayerStats() {
    renderXp();
    renderLevel();
}


// ─────────────────────────────────────────
//  GAME LOGIC
// ─────────────────────────────────────────

function getLevel() {
    return getLevelFromXp(playerData.xp);
}

function gainXp(amount) {
    const oldLevel = getLevel();

    addXp(amount); // from storage.js

    const newLevel = getLevel();

    if (newLevel > oldLevel) {
        levelUp(newLevel);
    }

    renderPlayerStats();
}

function levelUp(level) {
    renderSystemMessage("LEVEL UP! You reached Level " + level);

    userlevel.style.color = "#00ffcc";
    setTimeout(() => {
        userlevel.style.color = "";
    }, 1000);
}


// ─────────────────────────────────────────
//  EVENTS
// ─────────────────────────────────────────

addxpBtn.addEventListener("click", () => {
    gainXp(5);
});


// ─────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────

function initializeHome() {
    renderPlayerStats();

    if (playerData.xp === 0) {
        renderSystemMessage("Welcome, Player.");
    } else {
        renderSystemMessage("System recognizes your progress.");
    }
}

initializeHome();