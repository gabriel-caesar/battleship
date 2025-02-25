import { Ship, SHIPS_LIST, SHIPS_LIST_TWO } from '../src/Ship';
import { Player, Computer } from '../src/Player';
import { Gameboard } from '../src/gameboard';
import './styles.css';
import './board-coordinates.css';
import { randomizePositions, zeroTo } from './positionLogic';

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

// getting the DIALOGS
const passDialog = document.getElementById('pass-device-dialog');
const passMessage = document.getElementById('pass-message');
const startDialog = document.getElementById('start-dialog');
const startMessage = document.getElementById('start-message');
const shipsInfoDialog = document.getElementById('ships-info-dialog');
const shipsInfoMessage = document.getElementById('ships-info-message');

// getting the 'To Battle' button
const toBattleButton = document.getElementById('toBattle-button');

// getting the 'Randomize' button
const randomizeButton = document.getElementById('randomize-btn');
const randomizeButtonTwo = document.getElementById('randomize-btn-two');

// function that disables a given name input
const disableInput = (input, bool) => {
  if (bool) {
    input.disabled = true;
    input.style.backgroundColor = 'var(--dark-font-color)'
  } else {
    input.disabled = false;
    input.style.backgroundColor = 'var(--main-font-color)'
  };
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
  } else if (player == 1 && name === '') { // if user doesn't input a name
    thisPlayer = new Player('Admiral 1');
  } else if (player == 2 && name === '') { // if user doesn't input a name
    thisPlayer = new Player('Admiral 2');
  } else { // opponent is a bot
    thisPlayer = new Computer('Bot');
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

// function to handle rendering the squares in the board 
const renderSquares = (board, player, bool) => {
  for (let square of board) {
    const ships = player.gameBoard.ships;
    for (let i = 0; i < ships.length; i++) {
      ships[i].position.map(pos => {
        
        if (square.dataset.x == pos[0] && square.dataset.y == pos[1]) {
          if (bool) {
            square.style.backgroundColor = 'var(--main-font-color)';
            square.style.border = '2px solid var(--highlight-color)';
          } else {
            square.style.backgroundColor = 'var(--light-theme-color)';
            square.style.border = '1px solid var(--dark-font-color)';
          };
        };

      });
    };
  };
};

const highlightSunkShip = (player, side) => {
  // highlight sunk ships
  for (let coordinates of player.gameBoard.sunkShips) {
    // const sunkShipSquare = document.getElementById(`p${c[i][0]}-${c[i][1]}-right`);
    const sunkShipSquare = document.getElementById(`p${coordinates[0]}-${coordinates[1]}-${side}`);
    sunkShipSquare.style.border = '3px solid var(--highlight-color)';
    sunkShipSquare.innerHTML = '<i class="fa-solid fa-explosion"></i>';
  };
};

const OnOffButton = (board, bool, player, side) => {
  const miss = player.gameBoard.missedShots;
  const hit = player.gameBoard.successfulShots;
  // disable or enable all buttons
  for (let buttons of board.children) {
    buttons.disabled = bool;
  };

  // maintain MISSED shots squares disabled
  miss.forEach(c => {
    const square = document.getElementById(`p${c[0]}-${c[0 + 1]}-${side}`);
    square.disabled = true;
  });

  // maintain SUCCESSFUL shots squares disabled
  hit.forEach(c => {
    const square = document.getElementById(`p${c[0]}-${c[0 + 1]}-${side}`);
    square.disabled = true;
  });
};

const checkWinner = (player, opponent, board) => {
  // if all enemy ships are sunk
  if (player.gameBoard.allShipsSunk()) {
    // disabling all buttons from the given boards
    OnOffButton(leftBoard, true, player, 'left');
    OnOffButton(rightBoard, true, opponent, 'right');

    // showing all the ships
    renderSquares(board.children, opponent, true);

    // winning message
    passMessage.textContent = `${opponent.name} won the Battle!`;
    passDialog.showModal();

    // update the game log (log that's in the middle of the upper nav-bar)
    gameLog.innerHTML = `${opponent.name} <strong>Won!</strong>`;

    // getting and assign a function to 'Continue' button
    const winnerCloseBtn = document.getElementById('winner-close-button');
    const continueButton = document.getElementById('continue-button');
    winnerCloseBtn.style.display = 'block';
    continueButton.style.display = 'none'
    winnerCloseBtn.addEventListener('click', () => passDialog.close());
  };
};

// style and disable the square button clicked
const handleDomAttack = (square) => {
  // style the shot square
  square.innerHTML = '<i class="fa-solid fa-ship"></i>';
  square.style.backgroundColor = 'var(--ship-hit-color)';
  square.disabled = true; // disable square

  // disable hover styles for the square
  square.style.opacity = '1';
  square.hover = square.style.border = '1px solid var(--dark-font-color)';
};

// style and disable the square button clicked
const handleDomMiss = (square) => {
  // style the missed shot square
  square.innerHTML = '<i class="fa-solid fa-water"></i>';
  square.style.color = 'var(--highlight-color)';
  square.disabled = true; // disable square

  // disable hover styles for the square
  square.style.opacity = '1';
  square.style.border = '1px solid var(--dark-font-color)';
};

// function to handle attacks on the gameboard
const attackSquares = (x, y, player, side) => {
  // shooting the enemy board function
  const thisSquare = document.getElementById(`p${x}-${y}-${side}`);

  // calling receiveAttack to handle missed shots and successful shot
  if (player.gameBoard.receiveAttack(x, y)) { // successful shot
    handleDomAttack(thisSquare);
    return true; // so the if you hit, you play again
  } else {
    handleDomMiss(thisSquare);
    return false;
  };
};

// map for 'Bot' to keep track of its shots
const map = new Map();

// bot attacks player
const botAttack = (coordinate, player, bot) => {
  // desabling all buttons from the given board
  OnOffButton(rightBoard, true, bot, 'right');
  gameLog.innerHTML = `<strong>Bot game:</strong> Bot's turn`; // update the game log
  const [x, y] = coordinate;
  
  // getting the missed and successful shots
  let hit = player.gameBoard.successfulShots;
  const miss = player.gameBoard.missedShots;
  const thisSquare = document.getElementById(`p${x}-${y}-left`);
  if (map.has([x, y].toString())) { // if the missed coordinate was already shot
    return botAttack([zeroTo(10), zeroTo(10)], player, bot);
  };

  // bot's reasoning time
  setTimeout(() => {
    OnOffButton(rightBoard, false, bot, 'right'); // disable all buttons from right board while bot's reasoning

    if (!player.gameBoard.receiveAttack(x, y)) { // missed shot
      handleDomMiss(thisSquare); // handle rendering
      map.set([x, y].toString()); // update map
      gameLog.innerHTML = `<strong>Bot game:</strong> ${player.name}'s turn`; // update the game log
      return;
    } else {
  
      const shotShip = player.gameBoard.findByCoordinate(x, y); // find shot ship
      if (shotShip.isSunk()) { // if ship sunk after shot
        handleDomAttack(thisSquare); // handle rendering
        highlightSunkShip(player, 'left'); // highlight the entire sunk ship
        map.set([x, y].toString()); // update map
        gameLog.innerHTML = `<strong>Bot game:</strong> ${player.name}'s turn`; // update the game log

        // filtering sunk ship from already shot ships
        hit = hit.filter(c => {
          const sunk = player.gameBoard.sunkShips;
          for (let i = 0; i < sunk.length; i++) {
            if (c[0] == sunk[i][0] && c[1] == sunk[i][1]) return false;
          }
          return true;
        });

        if (checkWinner(player, bot, rightBoard)) { // auto-explanatory
          return;
        } else return botAttack([zeroTo(10), zeroTo(10)], player, bot);
      };

      handleDomAttack(thisSquare); // handle rendering
      map.set([x, y].toString()); // update map
      const thisSurroundings = bot.gameBoard.surroundings(x, y, hit, miss);
      return botAttack(thisSurroundings[zeroTo(thisSurroundings.length)], player, bot);
    };   
  }, 1000);
};

// for sake of readability, this function is a short for if the game is against your friend or a bot
const isFriendGame = () => { return !playerBot.checked ? true : false };

// function that tie all together for the game to begin
const letTheGamesBegin = () => {

  // getting players data
  const playerOne = initializePlayer('1', playerOneName.value, SHIPS_LIST);
  const playerTwo = initializePlayer('2', playerTwoName.value, SHIPS_LIST_TWO);
  const computer = initializePlayer('3', '', SHIPS_LIST_TWO);

  // getting the 'Ships Info', 'Pass' and 'Ready' button
  const passButton = document.getElementById('pass-button');
  const readyButton = document.getElementById('ready-button');
  const shipsInfoButton = document.getElementById('ships-info-button');

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

    generateBoardGrid(playerTwo.gameBoard.board(), rightBoard); // GENERATE RIGHT-BOARD
    generateBoardGrid(playerOne.gameBoard.board(), leftBoard); // GENERATE LEFT-BOARD
    
    // showing the 'Pass' button
    passButton.style.display = 'block';

    // encapsulating the game log's message in a function to use as a turn condition
    const innerText = player => `<strong>Friend game:</strong> ${player.name}, position your ships`;
  
    // update the game log (log that's in the middle of the upper nav-bar)
    gameLog.innerHTML = innerText(playerOne);

    // getting and assign a function to 'Continue' button
    const continueButton = document.getElementById('continue-button');
    continueButton.addEventListener('click', () => {
      if (gameLog.innerHTML === innerText(playerTwo)) {
        
        
        renderSquares(rightBoard.children, playerTwo, true); // rendering the ships on the left board

        // displaying 'Randomize' button for RIGHT BOARD
        randomizeButton.style.display = 'none';
        randomizeButtonTwo.style.display = 'block';
        randomizeButtonTwo.addEventListener('click', () => {
          rightBoard.innerHTML = '';
          playerTwo.gameBoard.ships = randomizePositions(SHIPS_LIST_TWO);
          generateBoardGrid(playerTwo.gameBoard.board(), rightBoard);
          return renderSquares(rightBoard.children, playerTwo, true);
        });

        passButton.style.display = 'none'; // hiding
        readyButton.style.display = 'block'; // showing

        // when 'Ready' button is clicked
        readyButton.addEventListener('click', () => {
          gameLog.innerHTML = `<strong>Friend game:</strong> ${playerOne.name}'s turn`; // update the game log

          // the start game dialog
          startMessage.textContent = `Pass the device to ${playerOne.name}! The battle will begin!`;
          startDialog.showModal();
          document.getElementById('start-button').addEventListener('click', () => startDialog.close());

          // unrendering ships from both boards
          renderSquares(leftBoard.children, playerOne, false);
          renderSquares(rightBoard.children, playerTwo, false);

          // making sure all 'Randomize' buttons are hidden
          randomizeButton.style.display = 'none';
          randomizeButtonTwo.style.display = 'none';
          // hiding the ready button
          readyButton.style.display = 'none';
          // ships info button and dialog
          shipsInfoButton.style.display = 'block';
          shipsInfoButton.addEventListener('click', () => {
            shipsInfoDialog.showModal();
            document.getElementById('close-button').addEventListener('click', () => shipsInfoDialog.close());
          });

          // initializing clickable buttons for players
          for (let square of rightBoard.children) {
            OnOffButton(leftBoard, true, playerOne, 'left'); // leftboard frozen when game starts
            square.addEventListener('click', () => {
              if (attackSquares(square.dataset.x, square.dataset.y, playerTwo, 'right')) {
                // if shot hit a ship, keep playing
                OnOffButton(leftBoard, true, playerOne, 'left'); // remains disabled
                OnOffButton(rightBoard, false, playerTwo, 'right'); // remains enabled
                highlightSunkShip(playerTwo, 'right');
                checkWinner(playerTwo, playerOne, leftBoard);
              } else {
                gameLog.innerHTML = `<strong>Friend game:</strong> ${playerTwo.name}'s turn`; // update the game log
                OnOffButton(leftBoard, false, playerOne, 'left');
                OnOffButton(rightBoard, true, playerTwo, 'right');
              };
            });
          };
         
          for (let square of leftBoard.children) {
            
            OnOffButton(rightBoard, false, playerTwo, 'right');
            square.addEventListener('click', () => {
              if (attackSquares(square.dataset.x, square.dataset.y, playerOne, 'left')) {
                // if shot hit a ship, keep playing
                OnOffButton(leftBoard, false, playerOne, 'left');
                OnOffButton(rightBoard, true, playerTwo, 'right');
                highlightSunkShip(playerOne, 'left');
                checkWinner(playerOne, playerTwo, rightBoard);
              } else {
                gameLog.innerHTML = `<strong>Friend game:</strong> ${playerOne.name}'s turn`; // update the game log
                OnOffButton(leftBoard, true, playerOne, 'left');
                OnOffButton(rightBoard, false, playerTwo, 'right');
              };
            });
          };
        });

      } else {
        // rendering the ships on the left board
        renderSquares(leftBoard.children, playerOne, true);

        // displaying 'Randomize' button for LEFT BOARD
        randomizeButton.style.display = 'block';
        randomizeButton.addEventListener('click', () => {
          leftBoard.innerHTML = '';
          playerOne.gameBoard.ships = randomizePositions(SHIPS_LIST);
          generateBoardGrid(playerOne.gameBoard.board(), leftBoard);
          return renderSquares(leftBoard.children, playerOne, true);
        });
      }
      passDialog.close();
    });

    // assigning a function to 'Pass' button
    passButton.addEventListener('click', () => {
      if (gameLog.innerHTML === innerText(playerOne)) { // switching turns as pass button's clicked
        renderSquares(leftBoard.children, playerOne, false); // hiding leftboard's ships
        gameLog.innerHTML = innerText(playerTwo);
        passMessage.textContent = `Pass the device to ${playerTwo.name}`;
      } else {
        renderSquares(rightBoard.children, playerTwo, false); // hiding rightboard's ships
        gameLog.innerHTML = innerText(playerOne);
        passMessage.textContent = `Pass the device to ${playerOne.name}`;
      };

      passDialog.showModal(); // show dialog
    });    
  };

  // ---------------------------------------- BOT GAME ----------------------------------------

  if (!isFriendGame()) { // playing against a bo
    // update the game log
    gameLog.innerHTML = `<strong>Bot game:</strong> ${playerOne.name}'s turn`;

    generateBoardGrid(playerOne.gameBoard.board(), leftBoard); // GENERATE RIGHT-BOARD
    generateBoardGrid(computer.gameBoard.board(), rightBoard); // GENERATE LEFT-BOARD

    // displaying 'Randomize' button and assigning its function
    randomizeButton.style.display = 'block';
    randomizeButton.addEventListener('click', () => {
      leftBoard.innerHTML = '';
      playerOne.gameBoard.ships = randomizePositions(SHIPS_LIST);
      generateBoardGrid(playerOne.gameBoard.board(), leftBoard);
      return renderSquares(leftBoard.children, playerOne, true);
    });

    // rendering the ships on the left board
    renderSquares(leftBoard.children, playerOne, true);
    
    // rendering the ships on the right board
    renderSquares(rightBoard.children, computer, false);

    // ships info button and dialog
    shipsInfoButton.style.display = 'block';
    shipsInfoButton.addEventListener('click', () => {
      shipsInfoDialog.showModal();
      document.getElementById('close-button').addEventListener('click', () => shipsInfoDialog.close());
    });

    // assigning the attack function to the bot's board
    for (let square of rightBoard.children) {
      square.addEventListener('click', () => {
        randomizeButton.style.display = 'none';
        if (attackSquares(square.dataset.x, square.dataset.y, computer, 'right')) {
          highlightSunkShip(computer, 'right');
          checkWinner(computer, playerOne, leftBoard);
        } else {    

          // getting the missed and successful shots arrays
          let hit = playerOne.gameBoard.successfulShots;
          const miss = playerOne.gameBoard.missedShots;

          // filtering sunk ship from already shot ships
          hit = hit.filter(c => {
            const sunk = playerOne.gameBoard.sunkShips;
            for (let i = 0; i < sunk.length; i++) {
              if (c[0] == sunk[i][0] && c[1] == sunk[i][1]) return false;
            }
            return true;
          });
      
          // this has an error of returning the computer object idk why
          if (hit.length !== 0) {
            // shortening arguments for better understanding
            let x = hit[hit.length - 1][0];
            let y = hit[hit.length - 1][1];
            let surroundings = computer.gameBoard.surroundings(x, y, hit, miss);
          
            // this doesnt work whenever one piece of the ship is left behind
            // if surroundings array is empty
            while (surroundings.length === 0) {
              // pop the last successful shot
              hit.pop();
              // reassign x and y values for the new last successful shot
              x = hit[hit.length - 1][0];
              y = hit[hit.length - 1][1];
              // call surroundings with the newly assigned x and y
              surroundings = computer.gameBoard.surroundings(x, y, hit, miss);
            }; // this prevents infinite loop when all surroundings are shot
            return botAttack((surroundings[zeroTo(surroundings.length)]), playerOne, computer);
          };
          return botAttack([zeroTo(10), zeroTo(10)], playerOne, computer);
        };
      });
    };
  };
};

// when user clicks 'To Battle' button
toBattleButton.addEventListener('click', () => {
  letTheGamesBegin();
});