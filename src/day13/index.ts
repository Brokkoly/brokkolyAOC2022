import * as helpers from "../helpers";

const input = helpers
  .readInput("inputs/input12.txt").filter(row => !!row)
  .map((str) => str.split(""));

// inputNodes.forEach(row => {
//   console.log(row.map(node => node.neighbors.length).join(''));
// })

console.log(`Output 1: ${aocD13Q1(startNode!)}`);
// console.log(`Output 1: ${aocD12Q1FromEnd(startNode!, endNode!)}`);
console.log(`Output 2: ${aocD13Q2(inputNodes)}`);
console.log(input.length);
console.log(input[0].length);

/**
 *
 * @param input
 * @returns
 */
function aocD13Q1(startNode: Node): number {
  

  // console.log(endNode!);
  return -1;
}


function aocD13Q2(nodes: Node[][]): number {
  return -1;
}
