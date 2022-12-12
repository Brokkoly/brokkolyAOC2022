import * as helpers from "../helpers";

const input = helpers
  .readInput("inputs/input12test.txt")
  .map((str) => str.split(""));

class Node {
  neighbors: Node[];
  endNode: boolean;
  elevation: number;
  constructor(character: string) {
    this.elevation =
      character === "S"
        ? "a".charCodeAt(0)
        : character.charCodeAt(0) - "a".charCodeAt(0);
    this.endNode = character === "E";
    this.neighbors = [];
  }
}

const inputNodes = input.map((row) => {
  const rowNodes: Node[] = [];
  row.forEach((char) => new Node(char));
});

console.log(`Output 1: ${aocD12Q1(inputNodes)}`);
console.log(`Output 2: ${aocD12Q2(inputNodes)}`);

/**
 *
 * @param input
 * @returns
 */
function aocD12Q1(monkies: Node[]): number {
  return -1;
}

function aocD12Q2(monkies: Node[]): number {
  return -1;
}
