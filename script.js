const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const container = document.querySelector('.container');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const restartButtonWinner = document.getElementById('restartButtonWinner');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const turnDisplay = document.getElementById('turnDisplay');
const playerNameScreen = document.getElementById('player-name-screen');
const startGameButton = document.getElementById('startGameButton');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const gameModeScreen = document.getElementById('game-mode-screen');
const vsPlayerButton = document.getElementById('vsPlayerButton');
const vsBotButton = document.getElementById('vsBotButton');

let playerXName = '';
let playerOName = '';
let gameMode = 'pvp'; // pvp or pvb

const X_CLASS = 'x';
const O_CLASS = 'o';
let oTurn;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

vsPlayerButton.addEventListener('click', () => {
    gameMode = 'pvp';
    playerOInput.parentElement.style.display = 'block';
    gameModeScreen.classList.remove('show');
    playerNameScreen.classList.add('show');
});

vsBotButton.addEventListener('click', () => {
    gameMode = 'pvb';
    playerOName = 'Bot';
    playerOInput.parentElement.style.display = 'none';
    gameModeScreen.classList.remove('show');
    playerNameScreen.classList.add('show');
});

startGameButton.addEventListener('click', () => {
    if (playerXInput.value.trim() === '') {
        alert('Please enter a name for Player X.');
        return;
    }
    if (gameMode === 'pvp' && playerOInput.value.trim() === '') {
        alert('Please enter a name for Player O.');
        return;
    }
    playerXName = playerXInput.value;
    if (gameMode === 'pvp') {
        playerOName = playerOInput.value;
    }
    playerNameScreen.classList.remove('show');
    startGame();
});

restartButton.addEventListener('click', () => {
    location.reload();
});
restartButtonWinner.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('winning-cell');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
    container.classList.remove('blur');
    updateTurnDisplay();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
        return;
    }
    if (isDraw()) {
        endGame(true);
        return;
    }
    swapTurns();
    setBoardHoverClass();
    if (gameMode === 'pvb' && oTurn) {
        board.classList.add('thinking');
        setTimeout(botMove, 1000);
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${oTurn ? playerOName : playerXName} Wins!`;
        const winningCombination = getWinningCombination();
        winningCombination.forEach(index => {
            cellElements[index].classList.add('winning-cell');
        });
    }
    setTimeout(() => {
        winningMessageElement.classList.add('show');
        container.classList.add('blur');
    }, 1500); // 1.5 second delay
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    updateTurnDisplay();
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function getWinningCombination() {
    return WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(oTurn ? O_CLASS : X_CLASS);
        });
    });
}

function updateTurnDisplay() {
    turnDisplay.innerText = `${oTurn ? playerOName : playerXName}'s Turn`;
}

function botMove() {
    const bestMove = findBestMove();
    placeMark(cellElements[bestMove.index], O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        board.classList.remove('thinking');
    }
}

function findBestMove() {
    let bestVal = -1000;
    let bestMove = { index: -1 };

    for (let i = 0; i < 9; i++) {
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
            cellElements[i].classList.add(O_CLASS);
            let moveVal = minimax(0, false);
            cellElements[i].classList.remove(O_CLASS);
            if (moveVal > bestVal) {
                bestMove.index = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(depth, isMax) {
    let score = evaluate();

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (isDraw()) return 0;

    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
                cellElements[i].classList.add(O_CLASS);
                best = Math.max(best, minimax(depth + 1, !isMax));
                cellElements[i].classList.remove(O_CLASS);
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(O_CLASS)) {
                cellElements[i].classList.add(X_CLASS);
                best = Math.min(best, minimax(depth + 1, !isMax));
                cellElements[i].classList.remove(X_CLASS);
            }
        }
        return best;
    }
}

function evaluate() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (cellElements[a].classList.contains(O_CLASS) && cellElements[b].classList.contains(O_CLASS) && cellElements[c].classList.contains(O_CLASS)) {
            return 10;
        } else if (cellElements[a].classList.contains(X_CLASS) && cellElements[b].classList.contains(X_CLASS) && cellElements[c].classList.contains(X_CLASS)) {
            return -10;
        }
    }
    return 0;
}
