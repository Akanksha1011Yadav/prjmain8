const grid = document.getElementById('grid');
const moveDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

const flipSound = new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");

let symbols = ['🔥','🔥','☁️','☁️','⚛️','⚛️','🚀','🚀','💎','💎','🌙','🌙','⭐','⭐','🌈','🌈'];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let isLocked = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds/60)).padStart(2,'0');
        const secs = String(seconds%60).padStart(2,'0');
        timerDisplay.textContent = `${mins}:${secs}`;
    },1000);
}

function createBoard() {
    grid.innerHTML = '';
    shuffle(symbols).forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${symbol}</div>
        `;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (isLocked || this.classList.contains('flipped')) return;

    flipSound.play();
    startTimer();

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    isLocked = true;
    moves++;
    moveDisplay.textContent = moves;

    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-back').textContent;
    const symbol2 = card2.querySelector('.card-back').textContent;

    if (symbol1 === symbol2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        isLocked = false;

        if (matchedPairs === symbols.length / 2) victory();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

function victory() {
    clearInterval(timer);

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });

    document.getElementById('winModal').style.display = 'flex';
    document.getElementById('final-time').textContent = timerDisplay.textContent;
    document.getElementById('final-moves').textContent = moves;
}

function resetGame() {
    clearInterval(timer);
    seconds = 0;
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    timer = null;

    timerDisplay.textContent = "00:00";
    moveDisplay.textContent = "0";
    document.getElementById('winModal').style.display = 'none';

    createBoard();
}

restartBtn.addEventListener('click', resetGame);

createBoard();





