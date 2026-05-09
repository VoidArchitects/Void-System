// ─────────────────────────────────────────
//  STATE / DATA

// ─────────────────────────────────────────
// State Variables

// DOM Elements
const userxp = document.getElementById('xp');
const systemMessage = document.getElementById("systemMessage");
const addxp = document.getElementById('addXp');
const userlevel = document.getElementById('userlevel');

// ─────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────
function getXp() {
    if (localStorage.getItem('xp') === null) {
        return null
    }
    else {
        return Number(localStorage.getItem('xp'));
    }
}

function setXp(xp) {
    localStorage.setItem('xp', xp);
}

function addXp(add) {
    localStorage.setItem('xp', getXp() + add);
}

// ─────────────────────────────────────────
//  RENDER FUNCTIONS
function renderXp() {
    //upadte every xp related thing
    userxp.innerHTML = getXp();
}
function renderSystemMessage(x, y) {
    x.innerHTML = y;
}

function renderLevel() {
    userlevel.innerHTML = "level : " + getLevel();
}

function renderPlayerStats(){
    renderXp();
    renderLevel();
}
// ─────────────────────────────────────────
// (Add UI rendering functions here)

// ─────────────────────────────────────────
//  LOGIC FUNCTIONS
// ─────────────────────────────────────────
function gainXp(xpAmount) {
    let oldLevel = getLevel();
    addXp(xpAmount);
    let currentLevel = getLevel();
    if(currentLevel > oldLevel){
        levelUp();
    }
    renderPlayerStats();
}

function getLevel() {
    if (getXp() > 0) {
        return Math.trunc(getXp() / 100) + 1;
    }
    else {
        return 1;
    }
}

function levelUp() {
    renderSystemMessage(systemMessage, "LEVEL UP! You are now level " + getLevel());
    // Add visual effect class if you have one
    userlevel.style.color = '#00ffcc';
    setTimeout(() => userlevel.style.color = '', 1000);
}

// ─────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────
addxp.addEventListener('click', () => {
    gainXp(5);
});

// ─────────────────────────────────────────
//  INITIALIZATION
// ─────────────────────────────────────────
// Run on page load

function initializePlayer() {
    if (getXp() === null) {
        renderSystemMessage(systemMessage, "Welcome!");
        setXp(0);
    }
    else {
        renderSystemMessage(systemMessage, "I commend your determination!");
    }
    renderPlayerStats();
}
initializePlayer();