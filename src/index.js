import { Ship, SHIPS_LIST, SHIPS_LIST_TWO } from '../src/Ship';
import { Player, Computer } from '../src/Player';
import { Gameboard } from '../src/gameboard';
import './styles.css';
import './board-coordinates.css';
import { randomizePositions } from './positionLogic';

// getting the boards
const leftBoard = document.querySelector('.left-board-container');
const rightBoard = document.querySelector('.right-board-container');

// getting the info and game log
const infoLog = document.querySelector('.info-log')
const gameLog = document.getElementById('game-log');

// getting players name input and bot
const playerOneName = document.getElementById('player-left');
const playerTwoName = document.getElementById('player-right');
const playerBot = document.getElementById('player-bot');

// getting the 'To Battle' button
const toBattleButton = document.getElementById('toBattle-button');

// function that disables a given name input
const disableInput = (input, bool) => {
  if (bool) {
    input.disabled = true;
    input.style.backgroundColor = 'var(--dark-font-color)'
  } else {
    input.disabled = false;
    input.style.backgroundColor = 'var(--main-font-color)'
  }
};

// as bot game is the standard, disable the admiral 2 input 
disableInput(playerTwoName, true);

// adding eventListeners to NAME INPUT ONE
playerOneName.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    disableInput(playerOneName, true);
    //getting player one container
    const wrapperAdmiralOne = document.getElementById('admiralOne-wrapper');

    // creating edit button for name input
    const editNameButton = document.createElement('button');  
    editNameButton.id = 'editName1-button';
    editNameButton.className = 'edit-btns';
    editNameButton.textContent = 'Edit';
    wrapperAdmiralOne.appendChild(editNameButton);

    // adding functionality to edit button
    editNameButton.addEventListener('click', () => {
      editNameButton.style.display = 'none';
      disableInput(playerOneName, false);
    });
  };
});

// adding eventListeners to NAME INPUT TWO
playerTwoName.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    disableInput(playerTwoName, true);
    //getting player one container
    const wrapperAdmiralTwo = document.getElementById('admiralTwo-wrapper');

    // creating edit button for name input
    const editNameButton = document.createElement('button');  
    editNameButton.id = 'editName2-button';
    editNameButton.className = 'edit-btns';
    editNameButton.textContent = 'Edit';
    wrapperAdmiralTwo.appendChild(editNameButton);

    // adding functionality to edit button
    editNameButton.addEventListener('click', () => {
      editNameButton.style.display = 'none';
      disableInput(playerTwoName, false);
    });
  };
});

// adding eventListeners to BOT INPUT
playerBot.addEventListener('change', () => {
  playerBot.checked ? disableInput(playerTwoName, true) : disableInput(playerTwoName, false);
});

// initializing players
const initializePlayer = (player, name, shipList) => {
  let thisPlayer;

  if (name !== '') { // if user inputs a name
    thisPlayer = new Player(name);
  } else if (player === '1' && name === '') { // if user doesn't input a name
    thisPlayer = new Player('Admiral 1');
  } else if (player === '2' && name === '') { // if user doesn't input a name
    thisPlayer = new Player('Admiral 2');
  } else { // opponent is a bot
    thisPlayer = new Computer();
  };

  thisPlayer.gameBoard = new Gameboard(10, 10);
  // here it will be assigned all the 7 ships to the new player
  thisPlayer.gameBoard.ships = randomizePositions(shipList);
  console.log(thisPlayer);
  return thisPlayer;
};

// generates the board grid with for loop
const generateBoardGrid = (board, container) => {
  board.forEach(row => {
    for (let i = 0; i < row.length; i++) {
      const squareElement = document.createElement('button');

      if (container === rightBoard) { // differing boards to handle different player's moves
        squareElement.id = `p${i}-${board.indexOf(row)}-right`; // (x, y)
      } else {
        squareElement.id = `p${i}-${board.indexOf(row)}-left`; // (x, y)
      };

      squareElement.dataset.x = i;
      squareElement.dataset.y = board.indexOf(row);
      squareElement.className = 'board-square';
      squareElement.style.position = 'relative'; // to handle ::before and ::after absolute position using CSS
      squareElement.style.backgroundColor = 'var(--light-theme-color)';
      container.appendChild(squareElement);
    }
  });
};

// for sake of readability, this function is a short for if the game is against your friend or a bot
const isFriendGame = () => { return !playerBot.checked ? true : false };

// function that tie all together for the game to begin
const letTheGamesBegin = () => {

  // getting players data
  const playerOne = initializePlayer('1', playerOneName.value, SHIPS_LIST);
  const playerTwo = initializePlayer('2', playerTwoName.value, SHIPS_LIST_TWO);
  const computer = initializePlayer('3', '', SHIPS_LIST_TWO);

  // getting the pass-device dialog pop-up elements
  const passDialog = document.getElementById('pass-device-dialog');
  const passMessage = document.getElementById('pass-message');

  // getting the 'Pass' and 'Ready' button
  const passButton = document.getElementById('pass-button');
  const readyButton = document.getElementById('ready-button');

  // generate a 'QUIT" button with dialog  
  const navBar = document.querySelector('.nav-bar');
  const gitHubLogo = document.getElementById('github-logo-a');
  gitHubLogo.style.display = 'none';
  const quitButton = document.createElement('button');
  quitButton.className = 'quit-button';
  quitButton.id = 'quit-button'
  quitButton.textContent = 'Quit';
  navBar.appendChild(quitButton);
  quitButton.addEventListener('click', () => {
    const quitLog = document.getElementById('quit-dialog');
    const yesQuit = document.getElementById('yes-quit');
    const noQuit = document.getElementById('no-quit');
    quitLog.showModal();
    yesQuit.addEventListener('click', () => {
      window.location.reload();
    });
    noQuit.addEventListener('click', () => {
      quitLog.close();
    });
  });

  // 'To Battle' button and info log disappears
  toBattleButton.style.display = 'none';
  infoLog.style.display = 'none';

  // getting rid of 'Edit' name buttons
  const editBtn1 = document.getElementById('editName1-button');
  const editBtn2 = document.getElementById('editName2-button');
  if (editBtn1) { editBtn1.style.display = 'none' };
  if (editBtn2) { editBtn2.style.display = 'none' };

  // render the rightBoard and leftBoard (CONTAINERS), not the board with squares itself
  leftBoard.style.display = 'grid';
  rightBoard.style.display = 'grid';

  // grey-out and disable all the inputs
  disableInput(playerOneName, true);
  disableInput(playerTwoName, true);
  disableInput(playerBot, true); 

  // ---------------------------------------- FRIEND GAME ----------------------------------------
  
  if (isFriendGame()) { // playing against a friend
    passMessage.textContent = `Pass the device to ${playerOne.name}`;
    passDialog.showModal();
    
    // showing the 'Pass' button
    passButton.style.display = 'block';

    // update the game log (log that's in the middle of the upper nav-bar)
    gameLog.innerHTML = `<strong>Friend game:</strong> ${playerOne.name}, position your ships`;

    // getting and assign a function to 'Continue' button
    const continueButton = document.getElementById('continue-button');
    continueButton.addEventListener('click', () => {
      if (leftBoard.firstElementChild) {
        // GENERATE RIGHT-BOARD
        generateBoardGrid(playerTwo.gameBoard.board(), rightBoard);

        const leftSquares = leftBoard.children;
        for (let squares of leftSquares) {
          squares.style.display = 'none';
        };

        passButton.style.display = 'none';
        readyButton.style.display = 'block';
      } else {
        // GENERATE LEFT-BOARD
        generateBoardGrid(playerOne.gameBoard.board(), leftBoard);
      }
      passDialog.close();
    });

    // assigning a function to 'Pass' button
    passButton.addEventListener('click', () => {
      passMessage.textContent = `Pass the device to ${playerTwo.name}`;
      passDialog.showModal();
      gameLog.innerHTML = `<strong>Friend game:</strong> ${playerTwo.name}, position your ships`;
    });    
  };

  // ---------------------------------------- BOT GAME ----------------------------------------

  if (!isFriendGame()) { // playing against a bot
    generateBoardGrid(playerOne.gameBoard.board(), leftBoard);
    generateBoardGrid(computer.gameBoard.board(), rightBoard); // computer
    
    // rendering the ships on the left board
    const leftSquares = leftBoard.children;
    for (let square of leftSquares) {
      const ships = playerOne.gameBoard.ships;
      for (let i = 0; i < ships.length; i++) {
        ships[i].position.map(pos => {
          
          if (square.dataset.x === pos[0].toString() && square.dataset.y === pos[1].toString()) {
            square.style.backgroundColor = 'var(--main-font-color)';
            square.style.border = '2px solid var(--highlight-color)';
          };

        });
      };
    };

    // 'rightBoard.children' returns an object, so I iterate through it with a for...of loop to get all the buttons
    const rightSquares = rightBoard.children;
    for (let square of rightSquares) {
      const ships = computer.gameBoard.ships;

      // shooting the enemy board function
      square.addEventListener('click', () => {
        const thisSquare = document.getElementById(`p${square.dataset.x}-${square.dataset.y}-right`);
        // calling receiveAttack to handle missed shots and successful shot
        
        if (computer.gameBoard.receiveAttack(square.dataset.x, square.dataset.y)) { // successful shot
          // style the shot square
          thisSquare.innerHTML = '<i class="fa-solid fa-ship"></i>';
          thisSquare.style.backgroundColor = 'var(--ship-hit-color)';
          thisSquare.disabled = true; // disable square

          // disable hover styles for the square
          thisSquare.hover = thisSquare.style.opacity = '1';
          thisSquare.hover = thisSquare.style.border = '1px solid var(--dark-font-color)';
          thisSquare.hover = thisSquare.style.cursor = 'default';
        } else {
          // style the missed shot square
          thisSquare.innerHTML = '<i class="fa-solid fa-water"></i>';
          thisSquare.disabled = true; // disable square

          // disable hover styles for the square
          thisSquare.hover = thisSquare.style.opacity = '1';
          thisSquare.hover = thisSquare.style.border = '1px solid var(--dark-font-color)';
          thisSquare.hover = thisSquare.style.cursor = 'default';
        };

        // if all enemy ships are sunk
        if (computer.gameBoard.allShipsSunk()) {
          // 'rightBoard.children' returns an object, so I iterate through it with a for...of loop to get all the buttons
          // disable all buttons
          for (let buttons of rightBoard.children) {
            buttons.disabled = true;
          };

          // winning message
          passMessage.textContent = `${playerOne.name} won the Battle!`;
          passDialog.showModal();

          // update the game log (log that's in the middle of the upper nav-bar)
          gameLog.innerHTML = `${playerOne.name} <strong>Won!</strong>`;

          // getting and assign a function to 'Continue' button
          const continueButton = document.getElementById('continue-button');
          continueButton.addEventListener('click', () => passDialog.close());
        };
      });
      
      // rendering the enemy ships on the right board
      for (let i = 0; i < ships.length; i++) {
        ships[i].position.map(pos => {
          if (square.dataset.x === pos[0].toString() && square.dataset.y === pos[1].toString()) {
            square.style.backgroundColor = 'var(--theme-color)';
          };
        });
      };
    };

    // update the game log (log that's in the middle of the upper nav-bar)
    gameLog.innerHTML = `<strong>Bot game:</strong> ${playerOne.name}'s turn`;
  };
};

// when user clicks 'To Battle' button
toBattleButton.addEventListener('click', () => {
  letTheGamesBegin();
});