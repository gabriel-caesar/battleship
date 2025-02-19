const { Ship, SHIPS_LIST } = require('../src/Ship');
const myShip = new Ship(1);
myShip.hit();
myShip.isSunk();

test('testing if boat sinks and take hits', () => {
  expect(myShip.hitTimes).toBe(1);
  expect(myShip).toMatchObject({
    sunk: true,
    length: 1,
    hitTimes: 1
  })
});

test('testing boats array to return all boats for boards', () => {
  expect(SHIPS_LIST).toEqual(expect.any(Array));
});