const memoryGame = document.querySelector('.memory-game');
const restartButton = document.getElementById('restart');
const timerElement = document.getElementById('time');
const movesElement = document.getElementById('moves');

const cardsData = ['🍎', '🍊', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝'];

// Duplicar e embaralhar os ícones
let cards = [...cardsData, ...cardsData].sort(() => Math.random() - 0.5);

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = null;
let timeElapsed = 0;

// Função para criar o tabuleiro
function createBoard() {
    memoryGame.innerHTML = '';
    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-icon', icon);

        card.innerHTML = `
            <div class="front">${icon}</div>
            <div class="back"></div>
        `;

        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

// Função para virar a carta
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flip')) return;

    this.classList.add('flip');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        checkMatch();
    }

    if (moves === 1 && !timer) startTimer();
}

// Função para verificar correspondência
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const isMatch = firstCard.getAttribute('data-icon') === secondCard.getAttribute('data-icon');

    if (isMatch) {
        matchedCards.push(firstCard, secondCard);
        flippedCards = [];
        if (matchedCards.length === cards.length) {
            setTimeout(() => alert(`Você ganhou em ${timeElapsed} segundos e ${moves} movimentos!`), 500);
            stopTimer();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            flippedCards = [];
        }, 1000);
    }
}

// Função para reiniciar o jogo
function restartGame() {
    stopTimer();
    timeElapsed = 0;
    moves = 0;
    matchedCards = [];
    flippedCards = [];
    cards = [...cardsData, ...cardsData].sort(() => Math.random() - 0.5);
    timerElement.textContent = '0:00';
    movesElement.textContent = '0';
    createBoard();
}

// Funções para o cronômetro
function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// Inicializar o jogo
createBoard();
restartButton.addEventListener('click', restartGame);
