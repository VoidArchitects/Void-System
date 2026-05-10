// ─────────────────────────────────────────
//  STATE / DATA
// ─────────────────────────────────────────
const quests = [
    {
        id: "Q001",
        name: "Courage of the Weak",
        description: "Complete your very first workout to prove your resolve.",
        difficulty: "E-Rank",
        category: "Physical",
        status: "active", // Default status if not in localStorage
        timeLimit: 1440,
        
        // --- System Requirements ---
        requiredLevel: 1,
        prerequisiteQuest: null,
        repeatable: false,
        daily: false,
        hidden: false,

        reward: {
            xp: 50, 
            money: 10,
            items: [],
            title: "Novice Player",
            rank: "E"
        },
        requirements: {
            pushups: 10,
            situps: 10,
            squats: 10
        }
    },
    {
        id: "Q002",
        name: "Daily Grind",
        description: "Run 5 kilometers before the sun sets.",
        difficulty: "D-Rank",
        category: "Endurance",
        status: "locked", // Default status if not in localStorage
        timeLimit: 120,

        // --- System Requirements ---
        requiredLevel: 2,
        prerequisiteQuest: "Q001",
        repeatable: true,
        daily: true,
        hidden: true,

        reward: {
            xp: 150,
            money: 50,
            items: ["Stamina Potion"],
            title: "",
            rank: ""
        },
        requirements: {
            running_km: 5
        }
    }
];

// ─────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────
function setQuestStatus(id, status) {
    localStorage.setItem(id, status);
    renderQuests();
}

function getQuestStatus(id) {
    return localStorage.getItem(id);
}
// ─────────────────────────────────────────
//  RENDER FUNCTIONS
// ─────────────────────────────────────────
function renderQuests() {
    const questsContainer = document.getElementById('quests');
    if (!questsContainer) return; 
    
    questsContainer.innerHTML = '';
    
    for (let i = 0; i < quests.length; i++) {
        const quest = quests[i];
        // Always read the live status from localStorage, not the static array!
        const currentStatus = getQuestStatus(quest.id);

        const questElement = document.createElement('div');
        questElement.innerHTML = `
        <h2>Name : ${quest.name}</h2>
        <p>Description : ${quest.description}</p>
        <p>Difficulty : ${quest.difficulty}</p>
        <p>Category : ${quest.category}</p>
        <p>Status : ${currentStatus}</p>
        <p>Time Limit : ${quest.timeLimit}</p>
        <p>Reward XP : ${quest.reward.xp}</p>
        <p>Reward Money : ${quest.reward.money}</p>
        <p>Reward Items : ${quest.reward.items}</p>
        <p>Reward Title : ${quest.reward.title}</p>
        <p>Reward Rank : ${quest.reward.rank}</p>
        ${currentStatus === 'available' ? `<button class="quest-btn" data-action="accept" data-id="${quest.id}">Accept</button>` : ''}
        ${currentStatus === 'active' ? `<button class="quest-btn" data-action="complete" data-id="${quest.id}">Complete</button>` : ''}
        `;
        questsContainer.appendChild(questElement);
    }
}

// ─────────────────────────────────────────
//  LOGIC FUNCTIONS
// ─────────────────────────────────────────
function acceptQuest(id) {
    const quest = quests.find(quest => quest.id === id);
    if (!quest) return;

    if (getQuestStatus(id) === "available") {
        setQuestStatus(id, "active");
    } else {
        renderSystemMessage(systemMessage, "Quest is not available.");
    }
}

function completeQuest(id) {
    const quest = quests.find(quest => quest.id === id);
    if (!quest) return;

    if (getQuestStatus(id) === "active") {
        setQuestStatus(id, "completed");
        gainXp(quest.reward.xp);
    } else {
        renderSystemMessage(systemMessage, "Quest is not active.");
    }
}

// ─────────────────────────────────────────
//  INITIALIZATION
// ─────────────────────────────────────────
function initQuests() {
    // 1. Initialize missing localStorage data without triggering re-renders
    for (let i = 0; i < quests.length; i++) {
        if (getQuestStatus(quests[i].id) === null) {
            localStorage.setItem(quests[i].id, quests[i].status);
        }
    }

    // 2. Set up Event Delegation for all quest buttons (No inline events!)
    const questsContainer = document.getElementById('quests');
    if (questsContainer) {
        questsContainer.addEventListener('click', (event) => {
            // Check if what was clicked was a quest button
            if (event.target.classList.contains('quest-btn')) {
                const action = event.target.getAttribute('data-action');
                const questId = event.target.getAttribute('data-id');

                if (action === 'accept') {
                    acceptQuest(questId);
                } else if (action === 'complete') {
                    completeQuest(questId);
                }
            }
        });
    }

    // 3. Paint the UI
    renderQuests();
}

// Start the module!
initQuests();
