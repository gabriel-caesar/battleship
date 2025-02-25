class Ship {
  constructor(length, name) {
    (this.name = name),
    (this.sunk = false),
    (this.length = length),
    (this.hitTimes = 0),
    (this.position = []);
  }

  // if hit() is true
  hit() {
    return this.hitTimes++;
  }

  // checks if the ship have sunk
  isSunk() {
    return this.hitTimes === this.length ? (this.sunk = true) : this.sunk;
  }
}

const SHIPS_LIST = [
  new Ship(5, "Carrier"), // vertical
  new Ship(4, "Battleship"), // vertical
  new Ship(3, "Cruiser"), // vertical
  new Ship(3, "Destroyer"),
  new Ship(3, "Destroyer"),
  new Ship(2, "Submarine"),
  new Ship(2, "Submarine"),
  new Ship(2, "Submarine"),
];

const SHIPS_LIST_TWO = [
  new Ship(5, "Carrier"), // vertical
  new Ship(4, "Battleship"), // vertical
  new Ship(3, "Cruiser"), // vertical
  new Ship(3, "Destroyer"),
  new Ship(3, "Destroyer"),
  new Ship(2, "Submarine"),
  new Ship(2, "Submarine"),
  new Ship(2, "Submarine"),
];

module.exports = { Ship, SHIPS_LIST, SHIPS_LIST_TWO };
