function renderPlayerData(){
    const username = playerData.name;
    let level = getLevel();
    let rank = getRank();
    let xp = getXp();
    let xpRequiredForNextLevel = getTotalXpForLevel(level + 1) - getXp();
    let title = getTitle();

    let bodyStats = getBodyStats();
    let attributes = getAttributes();

    let progression = getProgression();
    let achievements = getAchievements();

    const profile = document.getElementById("profile");
    profile.innerHTML = `
    <h2>Player Profile</h2>
    <p>Name : ${username}</p>
    <p>level : ${level}</p>
    <p>Rank : ${rank}</p>
    <p>XP : ${xp}</p>
    <p>XP required for next level : ${xpRequiredForNextLevel}</p>
    <p>Title : ${title}</p>

    <hr>

    <h2>Body Stats</h2>
    <p>Age : ${bodyStats.age}</p>
    <p>Weight : ${bodyStats.weight}</p>
    <p>Height : ${bodyStats.height}</p>
    <p>BMI : ${bodyStats.bmi}</p>

    <hr>

    <h2>Attributes</h2>
    <p>Strength : ${attributes.strength}</p>
    <p>Vitality : ${attributes.vitality}</p>
    <p>Stamina : ${attributes.stamina}</p>
    <p>Endurance : ${attributes.endurance}</p>

    <hr>

    <h2>Progression</h2>
    <p>Progression : ${progression}</p>

    <hr>

    <h2>Achievements</h2>
    <p>Achievements : ${achievements}</p>
    `;
}

function getRank(){
    if(getLevel() <= 10) return "E";
    if(getLevel() <= 20) return "D";
    if(getLevel() <= 30) return "C";
    if(getLevel() <= 40) return "B";
    if(getLevel() <= 50) return "A";
    else{
        return "S";
    }
}

function getTitle(){
    return "Novice";
}

function getBodyStats(){
    return {
        "age": playerData.age,
        "weight": playerData.weight,
        "height": playerData.height,
        "bmi": calculateBMI()
    };
}

function calculateBMI(){
    return Number(playerData.weight / (playerData.height * playerData.height)).toFixed(2);
}

function getAttributes(){
    return {
        "strength": playerData.stats.strength,
        "vitality": playerData.stats.vitality,
        "stamina": playerData.stats.stamina,
        "endurance": playerData.stats.endurance,
    };
}

function getProgression(){
    return [];
}

function getAchievements(){
    return [];
}

renderPlayerData();