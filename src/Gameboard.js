class Gameboard {
  constructor(rows, columns) {
    this.rows = rows, //10
    this.columns = columns, //10
    this.ships = null,
    this.sunkShips = [],
    this.missedShots = [],
    this.successfulShots = []
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

  coordinateMatch(x, y) {
    // creating a array to keep track of all ships positions
    let shipsCoordinates = [];
    // recording the positions into the array
    this.ships.map(ship => ship.position.forEach(coordinates => {
      shipsCoordinates.push(coordinates);
    }));

    // checking for a successful shot on a ship
    const shot = shipsCoordinates.find(c => c[0] == x && c[1] == y);
    return shot;
  };

  findByCoordinate(x, y) {
    return this.ships.find(ship => {
      for (let i = 0; i < ship.length; i++) {
        if (ship.position[i][0] == x && ship.position[i][1] == y) {
          return ship;
        };
      };
    });
  };

  // handles an attack, either that being missed or hitting a ship
  receiveAttack(x, y) {
    
    if (!this.coordinateMatch(x, y)) { // missed                      
      this.missedShots.push([x, y]);  // keeping track of missed shots
      return false; // returning boolean for index.js
    } else { // success shot
      this.successfulShots.push([x, y]); // keeping track of successful shots
      const foundShip = this.findByCoordinate(x, y);
      // ship hit, incrementing hitTimes
      foundShip.hit();
      // cheking if the ship sunk, if it is increment sunkShips
      if (foundShip.isSunk()) {
        foundShip.position.forEach(c => this.sunkShips.push(c));
      };
      return true; // returning boolean for index.js
    };
  };

  // checks if all ships are sunk
  allShipsSunk() {
    return this.sunkShips.length === 24 ? true : false;
  };
};

module.exports = { Gameboard };