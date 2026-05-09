//name
//difficulty
//reward
//completion conditions
//category
//time limit
//description

//store in a object array

//renderQuest()

//if complete then, get reward{gainXp(reward.xp)} + rerender();

const quests = [
    {
        id: "Q001",
        name: "Courage of the Weak",
        description: "Complete your very first workout to prove your resolve.",
        difficulty: "E-Rank",
        category: "Physical",
        status: "available", // Options: 'available', 'active', 'completed', 'failed', 'refused'
        timeLimit: 1440, // Recommend using minutes or seconds for easier countdown math (1440 mins = 24 hours)

        // --- System Requirements ---
        requiredLevel: 1,
        prerequisiteQuest: null, // ID of a quest that must be completed first
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
        status: "locked",
        timeLimit: 120, // 2 hours

        // --- System Requirements ---
        requiredLevel: 2,
        prerequisiteQuest: "Q001", // Must complete Q001 first
        repeatable: true,
        daily: true,
        hidden: true, // Remains hidden until requiredLevel/prerequisite is met

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

//Build renderQuests() to display every quest from the quests array onto the dashboard 
function renderQuests() {
    const questsContainer = document.getElementById('quests');
    if (!questsContainer) return; // Safeguard in case the element isn't on the page

    // Crucial: Clear out the old UI before painting the new UI!
    questsContainer.innerHTML = '';

    for (let i = 0; i < quests.length; i++) {
        const quest = quests[i];
        const questElement = document.createElement('div');
        questElement.innerHTML = `
            <h2>${quest.name}</h2>
            <p>${quest.description}</p>
            <p>${quest.difficulty}</p>
            <p>${quest.category}</p>
            <p>${quest.status}</p>
            <p>${quest.timeLimit}</p>
            <p>${quest.reward.xp}</p>
            <p>${quest.reward.money}</p>
            <p>${quest.reward.items}</p>
            <p>${quest.reward.title}</p>
            <p>${quest.reward.rank}</p>
            <button onclick="completeQuest('${quest.id}')">Complete</button>
        `;
        questsContainer.appendChild(questElement);
    }
}

//complete button
function completeQuest(id) {
    const quest = quests.find(quest => quest.id === id);
    if (quest.status === "active") {
        quest.status = "completed";
        gainXp(quest.reward.xp);
    }
    else{
        renderSystemMessage(systemMessage, "quest not found");
    }
    renderQuests();
}

