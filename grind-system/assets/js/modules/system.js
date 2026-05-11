// ─────────────────────────────────────────
//  STATE / DATA
// ─────────────────────────────────────────
// DOM Elements
const msg = document.getElementById('message');
const acceptBtn = document.getElementById('accept');
const refuseBtn = document.getElementById('refuse');
const reAcceptBtn = document.getElementById('re-accept');
const finalRefuseBtn = document.getElementById('final-refuse');

// State Variables
// (No global state needed anymore)

// ─────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────
function setStatus(status) {
    localStorage.setItem('status', status);
}

// (Redirect logic handled globally by router.js)

// ─────────────────────────────────────────
//  RENDER FUNCTIONS
// ─────────────────────────────────────────
function renderMessage(text) {
    if (msg) msg.innerHTML = text;
}

function renderButtons(btn1, btn1Text, btn2, btn2Text) {
    if (btn1) {
        btn1.innerHTML = btn1Text;
        btn1.style.display = "block";
    }
    if (btn2) {
        btn2.innerHTML = btn2Text;
        btn2.style.display = "block";
    }
}

// ─────────────────────────────────────────
//  LOGIC FUNCTIONS
// ─────────────────────────────────────────
function createSequence(initialMessage, nextMessage, btn1, btn1Text, btn2, btn2Text) {
    let sequenceTimeout;
    let clickHandler;

    const showNext = () => {
        clearTimeout(sequenceTimeout);
        renderMessage(nextMessage);
        document.removeEventListener('click', clickHandler);

        setTimeout(() => {
            renderButtons(btn1, btn1Text, btn2, btn2Text);
        }, 3000);
    };

    clickHandler = showNext;

    setTimeout(() => {
        renderMessage(initialMessage);

        setTimeout(() => {
            document.addEventListener('click', clickHandler);
            sequenceTimeout = setTimeout(showNext, 10000);
        }, 500);

    }, 1500);
}

// ─────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────
function setupEventListeners() {
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setStatus('accepted');
            location.reload(); // router.js will catch this and redirect
        });
    }

    if (reAcceptBtn) {
        reAcceptBtn.addEventListener('click', () => {
            setStatus('accepted');
            location.reload();
        });
    }

    if (refuseBtn) {
        refuseBtn.addEventListener('click', () => {
            setStatus('rejected');
            location.reload();
        });
    }

    if (finalRefuseBtn) {
        finalRefuseBtn.addEventListener('click', () => {
            setStatus('banned');
            location.reload();
        });
    }
}

// ─────────────────────────────────────────
//  INITIALIZATION
// ─────────────────────────────────────────
function initSystem() {
    setupEventListeners();

    if (msg && acceptBtn && refuseBtn) {
        createSequence(
            '[you have completed all the necessary requirements of the secret quest \'<span style="color: var(--text-quest);">courage of the weak</span>\']',
            '[you have earned the right to become a <span style="color: var(--text-accept);">player</span>. will you accept?]',
            acceptBtn, "accept", refuseBtn, "refuse"
        );
    } else if (msg && reAcceptBtn && finalRefuseBtn) {
        createSequence(
            '[your previous refusal has been noted. however, the system has detected a remnant of potential.]',
            '[this is your final opportunity. will you reconsider and become a <span style="color: var(--text-accept);">player</span>?]',
            reAcceptBtn, "accept", finalRefuseBtn, "refuse"
        );
    }
}

initSystem();
