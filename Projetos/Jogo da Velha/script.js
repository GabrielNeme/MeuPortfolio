const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartButton = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

let difficulty = 'hard';  // Padrão é 'difícil'

// Definir a profundidade de busca de acordo com a dificuldade
function getSearchDepth() {
    if (difficulty === 'easy') {
        return 1; // Profundidade rasa para o modo fácil
    } else if (difficulty === 'medium') {
        return 2; // Profundidade intermediária para o modo médio
    } else {
        return 3; // Profundidade máxima para o modo difícil
    }
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Função para verificar se há um vencedor
function checkWinner(player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

// Função para verificar se o jogo terminou (empate ou vitória)
function checkGameStatus() {
    if (checkWinner('X')) {
        statusText.textContent = `Jogador venceu!`;
        gameActive = false;
        return true;
    }
    if (checkWinner('O')) {
        statusText.textContent = `IA venceu!`;
        gameActive = false;
        return true;
    }
    if (board.every(cell => cell !== '')) {
        statusText.textContent = 'Empate!';
        gameActive = false;
        return true;
    }
    return false;
}

// Função para reiniciar o jogo
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

// Função chamada ao clicar nas células
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive || currentPlayer === 'O') return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkGameStatus()) return;

    currentPlayer = 'O';
    statusText.textContent = `Vez da IA...`;
    setTimeout(() => aiMove(), 500);
}

// Função para o movimento da IA utilizando o Minimax
function aiMove() {
    const depth = getSearchDepth();  // Obtém a profundidade de busca de acordo com a dificuldade
    const bestMove = minimax(board, 0, 'O', -Infinity, Infinity, depth);
    board[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';
    cells[bestMove.index].classList.add('taken');

    if (checkGameStatus()) return;

    currentPlayer = 'X';
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
}

// Função Minimax para calcular a melhor jogada com poda alfa-beta
function minimax(board, depth, player, alpha, beta, maxDepth) {
    const availableCells = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);

    // Se um jogador venceu, retorna a pontuação correspondente
    if (checkWinner('O')) return { score: 1, index: -1 };  // Vitória para IA
    if (checkWinner('X')) return { score: -1, index: -1 }; // Vitória para o jogador
    if (availableCells.length === 0 || depth >= maxDepth) return { score: 0, index: -1 };  // Empate ou atinge a profundidade máxima

    let bestScore = player === 'O' ? -Infinity : Infinity;
    let bestMove = -1;

    for (let i = 0; i < availableCells.length; i++) {
        const index = availableCells[i];
        board[index] = player;  // Faz o movimento

        const score = minimax(board, depth + 1, player === 'O' ? 'X' : 'O', alpha, beta, maxDepth).score;

        board[index] = ''; // Desfaz o movimento

        if (player === 'O') {
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
            alpha = Math.max(alpha, score);
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestMove = index;
            }
            beta = Math.min(beta, score);
        }

        if (beta <= alpha) {
            break; // Poda alfa-beta
        }
    }

    return { score: bestScore, index: bestMove };
}

// Função para adicionar eventos de clique nas células
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Função para reiniciar o jogo
restartButton.addEventListener('click', restartGame);

// Alterar a dificuldade ao selecionar
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    restartGame(); // Reinicia o jogo quando a dificuldade é alterada
});
