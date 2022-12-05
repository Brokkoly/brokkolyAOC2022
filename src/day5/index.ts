import { group } from "console";
import { Dirent } from "fs";
import * as helpers from "../helpers";
import { Stack } from "../helpers";

const input = helpers.readInput("inputs/input5test.txt");
console.log(input);

const inputSplitIndex = input.findIndex(row => row.length === 0)

const boxes = input.slice(0, inputSplitIndex);
const stackIds = boxes[boxes.length - 1].split('   ');
const numStacks = parseInt(stackIds[stackIds.length - 1]);
const stacks: Stack<string>[] = new Array<Stack<string>>(numStacks);
for (let i = 0; i < stacks.length; i++) {
  stacks[i] = new Stack<string>();
}
boxes.forEach((row, index) => {
  if (index === boxes.length - 1) {
    return;
  }
  for (let i = 1; i <= numStacks; i++) {
    if (row.charAt(i)) {
      //todo: getting undefined error here
      stacks[i].push(row.charAt(i * 3 + 2));
    }
  }
});




const directions = input.slice(inputSplitIndex + 1).map(row => {
  const splitDir = row.split(' ');
  const dir: Direction = {
    num: parseInt(splitDir[1]),
    source: parseInt(splitDir[3]),
    destination: parseInt(splitDir[5])
  }
  return dir
});


type Direction = {
  num: number,
  source: number,
  destination: number
}

console.log(inputSplitIndex);

//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD5Q1(stacks, directions);
const output2 = aocD5Q2(input);
console.log(output1);
console.log(output2);


/**
 *
 * @param input
 * @returns
 */
function aocD5Q1(boxes: Stack<string>[], directions: Direction[]): string {
  directions.forEach(direction => {
    for (let i = 0; i < direction.num; i++) {
      const top = boxes[direction.source].pop();
      if (top) {
        boxes[direction.destination].push;
      }
    }
  })
  return boxes.map(stack => {
    return stack.peek();
  }).join('');
}

function aocD5Q2(input: string[]): number {
  return -1;
}
