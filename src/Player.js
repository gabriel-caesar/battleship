class Player {
  constructor(name, gameBoard) {
    this.name = name,
    this.gameBoard = gameBoard
  };
  
};

class Computer {
  constructor(gameBoard) {
    this.gameBoard = gameBoard
  };
};

module.exports = { Player, Computer }