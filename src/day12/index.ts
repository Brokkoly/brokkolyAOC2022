import { start } from "repl";
import * as helpers from "../helpers";
import { Queue } from "../Queue";

const input = helpers
  .readInput("inputs/input12test.txt")
  .map((str) => str.split(""));

class Node {
  neighbors: Node[];
  endNode: boolean;
  startNode: boolean;
  elevation: number;
  distance: number;
  visited: boolean = false;
  constructor(character: string) {
    this.elevation =
      character === "S"
        ? "a".charCodeAt(0)
        : character === "E" ? "z".charCodeAt(0) :
          character.charCodeAt(0) - "a".charCodeAt(0);
    this.endNode = character === "E";
    this.startNode = character === "S";
    this.neighbors = [];
    this.distance = Number.POSITIVE_INFINITY;
  }
}
const inputNodes = input.map((row) => {
  const rowNodes: Node[] = [];
  row.forEach((char) => rowNodes.push(new Node(char)));
  return rowNodes;
});

var startNode: Node;
var endNode: Node;

for (let rowIndex = 0; rowIndex < inputNodes.length; rowIndex++) {
  for (let columnIndex = 0; columnIndex < inputNodes[rowIndex].length; columnIndex++) {

    const node = inputNodes[rowIndex][columnIndex];
    if (node.startNode) {
      startNode = node;
    }
    if (node.endNode) {
      endNode = node;
    }
    const backNode = inputNodes[rowIndex][columnIndex - 1];
    const frontNode = inputNodes[rowIndex][columnIndex + 1];
    const topNode = inputNodes.at(rowIndex - 1)?.at(columnIndex);
    const bottomNode = inputNodes.at(rowIndex + 1)?.at(columnIndex);
    node.neighbors.push(...[backNode!, frontNode!, topNode!, bottomNode!].filter(maybeNode => maybeNode !== undefined));
  }
}

function allDone(paths: Node[][]): boolean {
  for (let i = 0; i < paths.length; i++) {
    if (paths[i].find(node => node.endNode) === undefined) {
      return false;
    }
  }
  return true;
}

// inputNodes.forEach(row => {
//   console.log(row.map(node => node.neighbors.length).join(''));
// })

console.log(`Output 1: ${aocD12Q1(startNode!)}`);
console.log(`Output 2: ${aocD12Q2(inputNodes)}`);

/**
 *
 * @param input
 * @returns
 */
function aocD12Q1(startNode: Node): number {
  var nodes = [startNode];
  
  return -1;
}

function aocD12Q2(nodes: Node[][]): number {
  return -1;
}
