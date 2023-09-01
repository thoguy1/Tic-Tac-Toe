// Game stats
let board = ['','','','','','','','',''];
let currentPlayerToken = '';
let moveCount = 0;
const players = [
  {name: '', token: '', winCount: 0},
  {name: '', token: '', winCount: 0}
];

// Cell index to occupy for a player to win a game
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const moveCountElement = document.querySelector('#moveCount');
const p1Element = document.querySelector('#player1');
const p2Element = document.querySelector('#player2')
const p1WinCountElement = document.querySelector('#p1WinCount');
const p2WinCountElement = document.querySelector('#p2WinCount');
const winMessageElement = document.querySelector('#winMessage');
const startButton = document.querySelector('#start-button');
const p1NameElement = document.querySelector('#p1-name');
const p2NameElement = document.querySelector('#p2-name');
const p1TokenElement = document.querySelector('#token-menu');
const turnMessageElement = document.querySelector('#turn-message');
const drawMessageElement = document.querySelector('#draw-message');

// UI
// Initialise the game
const initialiseGame = function () {
  
  startButton.addEventListener('click', function() {
    const player1Name = p1NameElement.value;
    const player2Name = p2NameElement.value;
    const player1Token = p1TokenElement.value;
    const validateSuccess = validateFields(player1Name, player2Name, player1Token);
    // If the players are successfully validated, then make all the cells active
    if(validateSuccess) {
      cells.forEach(function(cell) {
        cell.addEventListener('click', handleCellClick);
        cell.style.cursor = 'pointer';
      });
    }
  }); 
};

// Logic
// Validate player names and token chosen and return true if all filled in otherwise return false
const validateFields = function (p1Name, p2Name, p1Token) {
  if (p1Name.trim() === '' || p2Name.trim() === '' || p1Token === '') {
    alert('All fields must be filled!');
    return false;
  } else {
    currentPlayerToken = p1Token;
    players[0].name = p1Name;
    players[0].token = p1Token;
    players[1].name = p2Name;
    // If player one chose token 'X' then assign player two to 'O' and vise versa
    players[1].token = players[0].token === 'X' ? 'O' : 'X';
    displayButtons();
    showStats();
    showTurn();
    return true;
  }
};

// UI
// Display 'Reset Score' and 'Next Game' buttons
const displayButtons = function() {
  // Hide the player name inputs and start button
  const playerContainers = document.querySelectorAll('.player-container');
    playerContainers.forEach(function(pContainer) {
      pContainer.style.display = 'none';
    });

  const resetButton = document.querySelector('#reset-score-button');
  resetButton.addEventListener('click', resetScore);
  const nextGameButton  =document.querySelector('#next-game-button');
  nextGameButton.addEventListener('click', nextGame);
  const newPlayersButton  =document.querySelector('#new-players-button');
  newPlayersButton.addEventListener('click', function() {
    window.location.reload();
  });
  const buttonsContainer = document.querySelector('#control-buttons-container');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'center';
};

// Logic
// Clear the board for the next game and assign the current player to the next player in turn
const nextGame = function() {
  board = ['','','','','','','','',''];
  currentPlayerToken = (currentPlayerToken === 'X') ? 'O' : 'X'; 
  moveCount = 0;
  showStats();
  clearBoard();
  showTurn();
};

// Logic
// Clear the board and all the stats
const resetScore = function() {
  board = ['','','','','','','','',''];
  currentPlayerToken = players[0].token;
  moveCount = 0;
  players[0].winCount = 0;
  players[1].winCount = 0;

  showStats();
  clearBoard();
  showTurn();
};

// UI
const clearBoard = function() {
  cells.forEach(function(cell) {
    cell.innerHTML = '';
  });
  winMessageElement.innerHTML = '';
};

// UI
// Display which player is in turn
const showTurn = function () {
  // If the game is finished (won or draw) don't display a player's turn otherwise show the player's name and the token in turn
  if(isGameWon() || moveCount === 9) {
    turnMessageElement.innerHTML = '';
  } else {
    for (const player of players ) {
      if (player.token === currentPlayerToken) {
        turnMessageElement.innerHTML = `${player.name}(${currentPlayerToken})'s turn!`
        turnMessageElement.style.display = 'block';
      }
    }
  }
};

// Logic
// When a player clicks the board this function will run
const handleCellClick = function (event) {
  const rect = event.target; // find which cell/rectangle the mouse clicked
  const index = rect.dataset.index; // find the index of that cell
  // If the cell is not empty or game already won, do exit the function and do nothing
  if(board[index] !== '' || isGameWon()) {
    return;
  }
  // assign and draw the current player token to the clicked cell 
  board[index] = currentPlayerToken;
  rect.innerHTML = currentPlayerToken;
  moveCount++;

  if (isGameWon()) {
    handleGameWon();
  } else if (moveCount === 9) {
    handleGameDraw();
  } else { // If currentPlayerToken is 'X' change it to 'O' and vise versa
    currentPlayerToken = (currentPlayerToken === 'X') ? 'O' : 'X'; 
  }

  showStats();
  showTurn();
};

// UI
// Display the stats on screen
const showStats = function () {
  moveCountElement.innerHTML = moveCount;
  p1Element.innerHTML = `${players[0].name}(${players[0].token})`;
  p1WinCountElement.innerHTML = `${players[0].winCount}`;
  p2Element.innerHTML = `${players[1].name}(${players[1].token})`;
  p2WinCountElement.innerHTML = `${players[1].winCount}`;
};

// Logic
// Check if the game is alreay won
const isGameWon = function() {
  for (const condition of winConditions) { 
    //  Extract the elements from the condition array and assign them to individual variables a, b, and c.
    const [a, b, c] = condition;
    // check if cell is not empty and all three cells in the condition are the same value
    if(board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
};

// Logic
// The game is won
const handleGameWon = function () {
  displayWinMessage();

  if (players[0].token === currentPlayerToken) {
    players[0].winCount++;
  } else {
    players[1].winCount++;
  }
};

// UI
// Display draw message when the game is draw
const handleGameDraw = function () {
  drawMessageElement.innerHTML = "It's a draw!";
  drawMessageElement.style.display = 'block';
    
  setTimeout(function() {
     drawMessageElement.style.display = 'none';
  }, 5000)
};

// UI
// Display win message when the game is won
const displayWinMessage = function () {
  for (const player of players) {
    if (player.token === currentPlayerToken) {
      winMessageElement.innerHTML = `${player.name}(${currentPlayerToken}) wins!`;
    }
  }
  winMessageElement.classList.add('celebrate');
  winMessageElement.style.position = 'fixed';
  winMessageElement.style.top = '45%';
  winMessageElement.style.left = '35%';
  
  const winInterval = setInterval(function() {
    winMessageElement.style.display = 'block';
  });
    
  setTimeout(function() {
    clearInterval(winInterval);
    winMessageElement.style.display = 'none';
  }, 4000)
};

initialiseGame();

