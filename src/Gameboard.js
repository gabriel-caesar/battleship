const { Ship, SHIPS_LIST } = require('../src/Ship');
const { randomizePositions } = require("./positionLogic");

class Gameboard {
  constructor(rows, columns) {
    this.rows = rows, //10
    this.columns = columns, //10
    this.ships = null,
    this.sunkShips = 0,
    this.missedShots = []
  };

  // creates the game board based in the given rows and columns
  board() {
    let board = [];
    for (let i = 0; i < this.rows; i++) {
      board[i] = [];
      for (let j = 0; j < this.columns; j++) {
        board[i].push('');
      };
    };
    return board;
  };

  // generate positions
  generatePositions(x, y, length, orientation) {

    // out of bounds coordinates check
    if (x > this.rows || y > this.columns) { throw new Error('Positioning out of bounds!') };

    // creates a random position for vertical ships
    if (orientation === 'vertical') {
      let positions = [];
      for (let i = 0; i < length; i++) {
        positions.push([x, y + i]);
      };
      return positions;
    };

    // creates a random position for horizontal ships
    if (orientation === 'horizontal') {
      let positions = [];
      for (let i = 0; i < length; i++) {
        positions.push([x + i, y]);
      };
      return positions;
    };
  };

  // handles an attack, either that being missed or hitting a ship
  receiveAttack(x, y) {

    // creating a array to keep track of all ships positions
    let shipsCoordinates = [];
    // recording the positions into the array
    this.ships.map(ship => ship.position.forEach(coordinates => {
      shipsCoordinates.push(coordinates);
    }));

    // checking for a successful shot on a ship
    const shot = shipsCoordinates.find(c => c[0].toString() === x && c[1].toString() === y);
    if (!shot) { // missed                         HANDLE DUPLICATE MISSED SHOTS! MAYBE DISABLE THE BUTTON THAT WAS CLICKED?
      this.missedShots.push([x, y]);  // keeping track of missed shots
      return false; // returning boolean for index.js
    } else { // success shot
      const foundShip = this.ships.find(ship => {
        for (let i = 0; i < ship.length; i++) {
          if (ship.position[i][0].toString() === x && ship.position[i][1].toString() === y) {
            return ship;
          };
        };
      });
      // ship hit, incrementing hitTimes
      foundShip.hit();
      // cheking if the ship sunk, if it is increment sunkShips
      foundShip.isSunk() ? this.sunkShips++ : foundShip.sunk;
      console.log(foundShip.name, 'got hit', foundShip.hitTimes, 'times!');
      return true; // returning boolean for index.js
    };
  };

  // checks if all ships are sunk
  allShipsSunk() {
    return this.sunkShips === 8 ? true : false;
  };
};

module.exports = { Gameboard };