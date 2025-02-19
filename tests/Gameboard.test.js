const { Gameboard } = require('../src/gameboard');

const game = new Gameboard(4, 4);

test('board() should input any array', () => { // --> testing the board()
  expect(game.board()).toEqual(expect.any(Array));
});

game.placeShip(3, 3, 2); // --> testing ship placement

test('testing if ships are created', () => {
  console.log(game.ships[0])
  expect(game.ships[0]).toEqual(expect.any(Object));
});

game.receiveAttack(3, 3); // --> testing ship attacks and if they're sunk
game.receiveAttack(3, 3);

test('testing ships being attacked', () => {
  expect(game.ships[0]).toMatchObject({
    hitTimes: 2
  });
  expect(game.ships[0].sunk).toBeTruthy();
});