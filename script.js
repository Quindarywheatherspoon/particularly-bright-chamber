let log = document.getElementById("log");
let exploreButton = document.getElementById("explore");
let inspectButton = document.getElementById("inspect");
let inspectCooldownBar = inspectButton.querySelector(".cooldown-bar");
let plainTab = document.getElementById("plain-tab");
let cabinTab = document.getElementById("cabin-tab");
let inspectCount = 0;
let cooldownTime = 3800;
let inspecting = false;
let currentLocation = "plain";
let playerHealth = 50;
let gauntManHealth = 25;

document.addEventListener("click", function () {
  let audio = document.getElementById("background-sound");
  audio.muted = false;
  audio.play();
}, { once: true });


// Battle log container
let battleLog = document.createElement("div");
battleLog.id = "battle-log";
battleLog.style.marginTop = "20px";
document.body.appendChild(battleLog);

// Health indicators
let playerHealthDisplay = document.createElement("div");
let gauntManHealthDisplay = document.createElement("div");
let battleDamageDisplay = document.createElement("div"); // Damage log
battleLog.appendChild(gauntManHealthDisplay);
battleLog.appendChild(playerHealthDisplay);
battleLog.appendChild(battleDamageDisplay);

// Attack button
let attackButton = document.createElement("button");
attackButton.id = "attack";
attackButton.textContent = "Attack";
attackButton.style.display = "none";
document.body.appendChild(attackButton);

function addLog(text) {
  log.textContent += "\n" + text;
  log.scrollTop = log.scrollHeight;
}

function updateBattleLog() {
  gauntManHealthDisplay.textContent = `Gaunt Man Health: ${Math.max(
    gauntManHealth,
    0
  )}`; // Stops at 0
  playerHealthDisplay.textContent = `Your Health: ${Math.max(playerHealth, 0)}`; // Stops at 0
}

function showDamageLog(gauntManAttack, playerAttack) {
  battleDamageDisplay.innerHTML = `${gauntManAttack}<br>${playerAttack}`;
}

setTimeout(() => {
  addLog("You see a wooden cabin in the distance.");
  exploreButton.style.display = "block";
}, 2000);

exploreButton.addEventListener("click", () => {
  if (currentLocation === "cabin") return;
  addLog("You step inside the cabin.");
  exploreButton.style.display = "none";
  inspectButton.style.display = "block";
  cabinTab.style.display = "block";
  cabinTab.classList.add("active-tab");
  plainTab.classList.remove("active-tab");
  currentLocation = "cabin";
});

inspectButton.addEventListener("click", () => {
  if (inspectButton.disabled || inspecting) return;

  inspecting = true;
  let actionText = "Examining...";
  if (inspectCount === 0) actionText = "Examining the table...";
  else if (inspectCount === 1) actionText = "Reading the journal...";
  else if (inspectCount === 2) actionText = "Examining...";
  else if (inspectCount === 3) actionText = "Lifting the floorboard...";
  else if (inspectCount === 4) actionText = "Entering the hidden passage...";
  else if (inspectCount === 5) actionText = "Approaching the metal door...";

  inspectButton.textContent = actionText;

  let startTime = Date.now();
  let cooldownInterval = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let progress = (elapsedTime / cooldownTime) * 100;
    inspectCooldownBar.style.width = `${progress}%`;

    if (elapsedTime >= cooldownTime) {
      clearInterval(cooldownInterval);
      inspectCooldownBar.style.width = "100%";
      inspectButton.textContent =
        inspectCount < 4 ? "Examine the Cabin" : "Approach the Metal Door";
      inspecting = false;
    }
  }, 50);

  setTimeout(() => {
    inspectCount++;
    if (inspectCount === 1) addLog("An old journal lies on a dusty table.");
    else if (inspectCount === 2)
      addLog("The journal contains cryptic notes about the cabin's history.");
    else if (inspectCount === 3)
      addLog("A loose floorboard creaks under your foot.");
    else if (inspectCount === 4) {
      addLog(
        "You lift the floorboard, revealing a hidden passage leading underground."
      );
      inspectButton.textContent = "Enter the passage";
    } else if (inspectCount === 5) {
      addLog(
        "You descend into the hidden passage. The passage is narrow, the only thing inside being a metal door placed at the other end."
      );
      inspectButton.textContent = "Approach the Metal Door";
    } else if (inspectCount === 6) {
      addLog("You approach the metal door.");
      inspectButton.textContent = "Check Behind the Door";
    } else if (inspectCount === 7) {
      addLog("You check behind the door.");
      setTimeout(() => {
        addLog("A gaunt man appears.");
        startBattle();
      }, 1000);
    }
  }, cooldownTime);
});

function startBattle() {
  addLog("The gaunt man is hostile toward you. Fight Back.");
  updateBattleLog(); // Display initial health
  exploreButton.disabled = true;
  inspectButton.disabled = true;
  inspectButton.style.display = "none";
  attackButton.style.display = "block";
  attackButton.addEventListener("click", attackGauntMan);
}

function attackGauntMan() {
  if (gauntManHealth > 0) {
    let playerDamage = Math.floor(Math.random() * 8) + 1;
    gauntManHealth = Math.max(gauntManHealth - playerDamage, 0); // Ensures it doesn't go below 0

    let enemyDamage = 0;
    let enemyAttackText = "";
    let playerAttackText = `You attack the gaunt man, dealing ${playerDamage} damage!`;

    if (gauntManHealth > 0) {
      enemyDamage = Math.floor(Math.random() * 5) + 1;
      playerHealth = Math.max(playerHealth - enemyDamage, 0); // Ensures it doesn't go below 0
      enemyAttackText = `The gaunt man attacks you, dealing ${enemyDamage} damage!`;
    }

    showDamageLog(enemyAttackText, playerAttackText);
    updateBattleLog();

    if (gauntManHealth <= 0) {
      showDamageLog("", "You have defeated the gaunt man!");
      attackButton.removeEventListener("click", attackGauntMan);
      attackButton.style.display = "none";
      exploreButton.disabled = false;
      inspectButton.disabled = false;
      inspectButton.style.display = "block";
    }

    if (playerHealth <= 0) {
      showDamageLog("", "You have been defeated!");
      attackButton.removeEventListener("click", attackGauntMan);
      attackButton.style.display = "none";
      exploreButton.disabled = false;
      inspectButton.disabled = false;
      inspectButton.style.display = "block";
    }
  }
}
