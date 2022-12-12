import * as helpers from "../helpers";

const input = helpers
  .readInput("inputs/input12test.txt")
  .map((str) => str.split(""));

class Node {
  neighbors: Node[];
  endNode: boolean;
  elevation: number;
  constructor(character: string) {
    this.elevation = character.charCodeAt(0) - "a".charCodeAt(0);
  }
}

const nodes = new Map<string, INode>();

input.forEach((arr) => {
  arr.forEach((label) => {
    if (!nodes.has(label)) {
      nodes.set(label, {
        label: label,
        neighbors: [],
        endNode: label === "end",
        small: label === label.toLowerCase() || label === "start",
      });
    }
    if (label === "start") {
      startNode = nodes.get("start")!;
    }
  });
});

console.log(`Output 1: ${aocD12Q1(inputMonkeys)}`);
console.log(`Output 2: ${aocD12Q2(inputMonkeys)}`);

/**
 *
 * @param input
 * @returns
 */
function aocD12Q1(monkies: Monkey[]): number {
  for (let i = 0; i < 20; i++) {
    monkies.forEach((monkey) => monkey.takeTurn());
  }
  const monkeyActivity = monkies.map((monkey) => monkey.numInspections);
  var highest: number = 0;
  var secondHighest: number = 0;
  monkeyActivity.forEach((num) => {
    if (num > highest) {
      secondHighest = highest;
      highest = num;
    } else if (num > secondHighest) {
      secondHighest = num;
    }
  });
  return highest * secondHighest;
}

function aocD12Q2(monkies: Monkey[]): number {
  for (let i = 0; i < 10000; i++) {
    monkies.forEach((monkey) => monkey.takeTurn());
  }
  const monkeyActivity = monkies.map((monkey) => monkey.numInspections);
  var highest: number = 0;
  var secondHighest: number = 0;
  monkeyActivity.forEach((num) => {
    if (num > highest) {
      secondHighest = highest;
      highest = num;
    } else if (num > secondHighest) {
      secondHighest = num;
    }
  });
  return highest * secondHighest;
}
