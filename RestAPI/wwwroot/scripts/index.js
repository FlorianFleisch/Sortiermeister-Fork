// API Base URL
const API_BASE = '/api/player';

// Game State
let currentPlayer = null;
let selectedDifficulty = null;
let selectedSpeed = null;
let gameStartTime = null;
let gameEnded = false;
let nums = [];
let touch;

// DOM Elements
let computer;
let human;
let loginContainer;
let loginOverlay;
let gameContainer;
let playerInfo;
let currentPlayerName;

// ==================== HELPER FUNCTIONS ====================

function getGameContainers() {
    const container = document.getElementById('gameContainer');
    return {
        container,
        computer: container ? container.querySelector('.computer') : null,
        human: container ? container.querySelector('.human') : null
    };
}

const getColor = (num) => {
    const colors = [
        { bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #FF8E72 0%, #FF7043 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #FFD93D 0%, #FFCA3D 100%)', text: '#000' },
        { bg: 'linear-gradient(135deg, #6BCB77 0%, #4CAF50 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #4FB3D9 0%, #00BCD4 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)', text: '#fff' },
        { bg: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)', text: '#fff' }
    ];
    return colors[(num - 1) % colors.length];
};

const createDiv = () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.classList.add('box');
    
    let num = Math.floor(Math.random() * 49) + 1;
    while (nums.includes(num)) {
        num = Math.floor(Math.random() * 49) + 1;
    }
    nums.push(num);
    
    const colorObj = getColor(num);
    div.style.background = colorObj.bg;
    div.style.color = colorObj.text;
    div.style.borderRadius = "10px";
    
    span.innerHTML = num.toString();
    div.appendChild(span);
    return div;
};

// ==================== LOGIN FLOW ====================

document.addEventListener('DOMContentLoaded', () => {
    computer = document.getElementsByClassName('computer')[0];
    human = document.getElementsByClassName('human')[0];
    loginContainer = document.getElementById('loginContainer');
    loginOverlay = document.getElementById('loginOverlay');
    gameContainer = document.getElementById('gameContainer');
    playerInfo = document.getElementById('playerInfo');
    currentPlayerName = document.getElementById('currentPlayerName');
    
    setupLoginForm();
    setupReplayDifficultyButtons();
    checkExistingSession();
});

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const startButton = document.getElementById('startButton');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyButtons.forEach(b => b.style.border = '3px solid transparent');
            btn.style.border = '5px solid white';
            selectedDifficulty = btn.getAttribute('data-difficulty');
            selectedSpeed = parseInt(btn.getAttribute('data-speed'));
            
            const playerName = document.getElementById('playerName').value;
            if (playerName.trim()) {
                startButton.disabled = false;
                startButton.style.cursor = 'pointer';
            }
        });
    });
    
    document.getElementById('playerName').addEventListener('input', (e) => {
        if (e.target.value.trim() && selectedDifficulty) {
            startButton.disabled = false;
            startButton.style.cursor = 'pointer';
        } else {
            startButton.disabled = true;
            startButton.style.cursor = 'not-allowed';
        }
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const playerName = document.getElementById('playerName').value.trim();
        const algorithm = document.getElementById('algorithmSelect').value;
        
        if (!playerName || !selectedDifficulty) {
            alert('Bitte fülle alle Felder aus!');
            return;
        }
        
        await loginPlayer(playerName, algorithm, selectedDifficulty);
    });
}

async function loginPlayer(name, algorithm, difficulty) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, algorithm, difficulty })
        });
        
        if (!response.ok) {
            throw new Error('Login fehlgeschlagen');
        }
        
        const data = await response.json();
        currentPlayer = data;
        
        loginContainer.style.display = 'none';
        loginOverlay.style.display = 'none';
        gameContainer.style.display = 'block';
        playerInfo.style.display = 'block';
        currentPlayerName.textContent = data.name;
        
        startSort();
    } catch (error) {
        console.error('Login error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'background-color: #ff3333; color: white; padding: 10px; border-radius: 5px; margin-top: 10px; text-align: center;';
        errorDiv.textContent = `Fehler: ${error.message}`;
        document.getElementById('loginForm').appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

async function checkExistingSession() {
    try {
        const response = await fetch(`${API_BASE}/current`, { credentials: 'include' });
    } catch (error) {}
}

async function logout() {
    try {
        await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
        location.reload();
    } catch (error) {
        location.reload();
    }
}

// ==================== LEADERBOARD ====================

async function showLeaderboard() {
    const overlay = document.getElementById('leaderboardOverlay');
    const container = document.getElementById('leaderboardContainer');
    const content = document.getElementById('leaderboardContent');
    
    content.innerHTML = '<tr><td colspan="4" style="padding: 40px; text-align: center; color: #00d4ff;">Lade Rangliste...</td></tr>';
    overlay.style.display = 'block';
    container.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE}/leaderboard`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`);
        
        const leaderboard = await response.json();
        
        if (!leaderboard || leaderboard.length === 0) {
            content.innerHTML = '<tr><td colspan="4" style="padding: 60px 20px; text-align: center;">Noch keine Einträge</td></tr>';
        } else {
            let html = '';
            leaderboard.forEach((entry, index) => {
                const timeInSeconds = (entry.bestTimeInMs / 1000).toFixed(2);
                const rankText = index < 3 ? (index === 0 ? '1' : index === 1 ? '2' : '3') : entry.rank;
                
                html += `<tr>`;
                html += `<td style="font-weight: 800;">${rankText}</td>`;
                html += `<td><strong>${entry.playerName}</strong></td>`;
                html += `<td><span class="time-display">${timeInSeconds}s</span></td>`;
                html += `<td><span class="difficulty-badge ${entry.difficulty}">${entry.difficulty}</span></td>`;
                html += `</tr>`;
            });
            content.innerHTML = html;
        }
    } catch (error) {
        content.innerHTML = `<tr><td colspan="4" style="padding: 40px 20px; text-align: center;">Fehler beim Laden</td></tr>`;
    }
}

function closeLeaderboard() {
    document.getElementById('leaderboardOverlay').style.display = 'none';
    document.getElementById('leaderboardContainer').style.display = 'none';
    
    const popUpContainer = document.getElementById('popUpContainer');
    if (popUpContainer.style.display !== 'none') {
        document.getElementById('overlay1').style.display = 'block';
    }
}

// ==================== GAME LOGIC ====================

const checkWinner = async (boxes, player) => {
    const winContainer = document.getElementById('popUpContainer');
    const winPopup = document.getElementById('winPopup');
    const losePopup = document.getElementById('losePopup');
    const overlay = document.getElementById('overlay1');
    
    for (let i = 1; i < boxes.length; i++) {
        let previousBox = parseInt(boxes[i - 1].children[0].innerHTML);
        let currentBox = parseInt(boxes[i].children[0].innerHTML);
        if (previousBox > currentBox) {
            return false;
        }
    }
    
    const gameEndTime = Date.now();
    const timeInMs = gameEndTime - gameStartTime;
    
    if (player === "Computer") {
        winContainer.style.display = "block";
        losePopup.style.display = "block";
        winPopup.style.display = "none";
        overlay.style.display = "block";
        await saveGameResult(timeInMs, false);
    } else if (player === "Spieler") {
        winContainer.style.display = "block";
        winPopup.style.display = "block";
        losePopup.style.display = "none";
        overlay.style.display = "block";
        await saveGameResult(timeInMs, true);
    }
    gameEnded = true;
    return true;
};

async function saveGameResult(timeInMs, won) {
    try {
        await fetch(`${API_BASE}/result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ timeInMs, won })
        });
    } catch (error) {
        console.error('Error saving result:', error);
    }
}

const playAgain = () => {
    console.log('=== PLAY AGAIN CALLED ===');
    
    document.getElementById('popUpContainer').style.display = 'none';
    document.getElementById('overlay1').style.display = 'none';
    document.getElementById('winPopup').style.display = 'none';
    document.getElementById('losePopup').style.display = 'none';

    const { computer, human } = getGameContainers();
    if (!computer || !human) {
        console.error('Could not find game containers!');
        return;
    }

    // ALLE Boxen entfernen
    Array.from(computer.children).forEach(child => {
        if (child.classList && (child.classList.contains('box') || child.classList.contains('cbox'))) {
            child.remove();
        }
    });
    
    Array.from(human.children).forEach(child => {
        if (child.classList && (child.classList.contains('box') || child.classList.contains('cbox'))) {
            child.remove();
        }
    });

    // KOMPLETT ZURÜCKSETZEN
    nums = [];
    touch = null;
    gameEnded = false;
    
    console.log('Nums array cleared:', nums);

    // 10 NEUE Zufallszahlen generieren
    for (let i = 0; i < 10; i++) {
        // Computer Box erstellen (mit neuer Zahl)
        let computerDiv = createDiv();
        computerDiv.classList.add('cbox');
        computer.appendChild(computerDiv);
        
        // DIE GLEICHE Zahl für den Spieler (als Klon)
        let playerDiv = computerDiv.cloneNode(true);
        playerDiv.classList.remove('cbox'); // Entferne cbox-Klasse vom Spieler
        human.appendChild(playerDiv);
    }
    
    // Jetzt die Spieler-Zahlen MISCHEN (damit sie nicht gleich sortiert sind)
    const humanBoxes = Array.from(human.querySelectorAll('.box'));
    for (let i = humanBoxes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        human.insertBefore(humanBoxes[j], humanBoxes[i]);
    }
    
    console.log('New nums array:', nums);

    startSort();
};

const playAgainSameDifficulty = () => {
    playAgain();
};

const showLeaderboardAfterGame = () => {
    document.getElementById('popUpContainer').style.display = 'none';
    document.getElementById('overlay1').style.display = 'none';
    showLeaderboard();
};

const tryAgain = () => {
    playAgain();
};

function setupReplayDifficultyButtons() {
    const replayButtons = document.querySelectorAll('.replay-difficulty-btn');
    replayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDifficulty = btn.getAttribute('data-difficulty');
            selectedSpeed = parseInt(btn.getAttribute('data-speed'));
            playAgain();
        });
    });
}

const startSort = () => {
    console.log('=== START SORT CALLED ===');
    console.log('Difficulty:', selectedDifficulty, 'Speed:', selectedSpeed);
    
    gameStartTime = Date.now();
    gameEnded = false;

    const { computer, human, container } = getGameContainers();
    if (!computer || !human || !container) {
        console.error('Could not find game containers!');
        return;
    }

    // Falls keine Boxen existieren, erstelle neue
    const existingBoxes = container.querySelectorAll('.box, .cbox');
    if (existingBoxes.length === 0) {
        console.log('No boxes found, creating new ones');
        nums = [];
        
        // 10 Boxen für Computer erstellen
        for (let i = 0; i < 10; i++) {
            let computerDiv = createDiv();
            computerDiv.classList.add('cbox');
            computer.appendChild(computerDiv);
            
            // DIE GLEICHE Zahl für den Spieler (als Klon)
            let playerDiv = computerDiv.cloneNode(true);
            playerDiv.classList.remove('cbox');
            human.appendChild(playerDiv);
        }
        
        // Spieler-Zahlen MISCHEN
        const humanBoxes = Array.from(human.querySelectorAll('.box'));
        for (let i = humanBoxes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            human.insertBefore(humanBoxes[j], humanBoxes[i]);
        }
    }

    const computerBoxes = Array.from(container.querySelectorAll('.cbox'));
    const playerBoxes = Array.from(container.querySelectorAll('.box')).filter(box => !box.classList.contains('cbox'));

    console.log('Computer boxes:', computerBoxes.length, 'Player boxes:', playerBoxes.length);
    console.log('Current nums:', nums);

    // Event Listener für Spieler
    playerBoxes.forEach((box) => {
        box.addEventListener('click', function() {
            if (gameEnded) return;
            
            if (!touch) {
                touch = parseInt(this.children[0].innerHTML);
                this.classList.add('active');
            } else {
                const clickedNum = parseInt(this.children[0].innerHTML);
                
                if (touch !== clickedNum) {
                    const activeBox = container.querySelector('.active');
                    if (!activeBox) return;
                    
                    const temp = this.children[0].innerHTML;
                    this.children[0].innerHTML = touch;
                    activeBox.children[0].innerHTML = temp;
                    
                    const color1 = getColor(touch);
                    this.style.background = color1.bg;
                    this.style.color = color1.text;
                    
                    const color2 = getColor(parseInt(temp));
                    activeBox.style.background = color2.bg;
                    activeBox.style.color = color2.text;
                    
                    activeBox.classList.remove('active');
                    touch = null;
                    
                    checkWinner(playerBoxes, "Spieler");
                } else {
                    touch = null;
                    this.classList.remove("active");
                }
            }
        });
    });

    // Computer Sortierung
    let i = 1;
    let j = 0;
    let sortStage = () => {
        if (gameEnded) return;
        
        if (i < computerBoxes.length) {
            if (j < i) {
                const num1 = parseInt(computerBoxes[i].children[0].innerHTML);
                const num2 = parseInt(computerBoxes[j].children[0].innerHTML);
                
                if (num1 < num2) {
                    computerBoxes[i].children[0].innerHTML = num2;
                    computerBoxes[j].children[0].innerHTML = num1;
                    
                    const color1 = getColor(num2);
                    computerBoxes[i].style.background = color1.bg;
                    computerBoxes[i].style.color = color1.text;
                    
                    const color2 = getColor(num1);
                    computerBoxes[j].style.background = color2.bg;
                    computerBoxes[j].style.color = color2.text;
                    
                    setTimeout(sortStage, selectedSpeed);
                    j++;
                    return;
                }
                j++;
            } else {
                j = 0;
                i++;
            }
            sortStage();
        } else {
            checkWinner(computerBoxes, "Computer");
        }
    };
    sortStage();
};
