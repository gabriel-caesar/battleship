const { Player } = require ('../src/Player');
const { SHIPS_LIST } = require('../src/Ship');
const { randomizePositions } = require('../src/positionLogic');

const gabriel = new Player('Gabriel');
gabriel.gameBoard.ships = SHIPS_LIST;
randomizePositions(); // random positions for ships

test('testing if player gets gameboard function', () => {
  expect(gabriel.gameBoard.board()).toEqual(expect.any(Object));
});

test('testing insertion of ships for player', () => {
  console.log(gabriel.gameBoard.ships)
  expect(gabriel.gameBoard.ships).toEqual(expect.any(Array));
});