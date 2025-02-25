class Player {
  constructor(name, gameBoard) {
    (this.name = name), (this.gameBoard = gameBoard);
  }
}

class Computer {
  constructor(name, gameBoard) {
    (this.name = name), (this.gameBoard = gameBoard);
  }
}

module.exports = { Player, Computer };
