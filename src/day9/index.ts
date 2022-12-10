import * as helpers from "../helpers";
import { Coordinate, InputDirection } from "./Coordinate";
import { Rope } from "./Rope";

const input = helpers.readInput("inputs/input9.txt");


export interface Motion {
  direction: InputDirection;
  distance: number;
}
const inputMotions: Motion[] = [];
input.forEach((line) => {
  if (!line) {
    return;
  }
  const parts = line.split(" ");
  inputMotions.push({
    direction: parts[0] as InputDirection,
    distance: parseInt(parts[1]),
  });
});

//const inputNums = input.map((str) => Number.parseInt(str));





const output1 = aocD9Q1(inputMotions);
const output2 = aocD9Q2(inputMotions);
console.log(`Output 1: ${output1}`);
console.log(`Output 2: ${output2}`);

function findNumUniqueCoords(input: Coordinate[]): number {
  const map = new Map<number, number[]>();
  input.forEach((coord) => {
    const arr = map.get(coord.x);
    if (arr) {
      if (!arr.find((y) => y === coord.y)) {
        arr.push(coord.y);
      }
    } else {
      map.set(coord.x, [coord.y]);
    }
  });
  var retVal = 0;
  map.forEach((arr) => {
    retVal += arr.length;
  });
  return retVal;
}

/**
 *
 * @param input
 * @returns
 */
function aocD9Q1(motions: Motion[]): number {
  const rope = new Rope(new Coordinate(0, 0));
  motions.forEach((motion) => {
    //console.log({ motion });
    rope.move(motion);
  });
  // rope.printPath();
  //return findNumUniqueCoords(rope.tailHistory);
  let num = 0;
  rope.tailArray().forEach((element) => {
    num += element.filter((entry) => entry === "#").length;
  });

  // rope.printHistory()
  return num;
}

function aocD9Q2(motions: Motion[]): number {
  const rope = new Rope(new Coordinate(0, 0), 10);
  motions.forEach((motion) => {
    //console.log({ motion });
    rope.move(motion);
  });
  let num = 0;
  rope.tailArray().forEach((element) => {
    num += element.filter((entry) => entry === "#").length;
  });
  // for (let i = 13; i <= 21; i++) {
  //   rope.printRopeAtHistoryIndex(i);
  //   console.log();
  // }
  // rope.printPathBeforeDirection()
  return num;
}
