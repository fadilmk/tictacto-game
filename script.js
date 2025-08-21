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

let playerXName = '';
let playerOName = '';

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

startGameButton.addEventListener('click', () => {
    if (playerXInput.value.trim() === '' || playerOInput.value.trim() === '') {
        alert('Please enter names for both players.');
        return;
    }
    playerXName = playerXInput.value;
    playerOName = playerOInput.value;
    playerNameScreen.classList.remove('show');
    startGame();
});

restartButton.addEventListener('click', startGame);
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
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
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
