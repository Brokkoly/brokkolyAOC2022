import { group } from "console";
import { Dirent } from "fs";
import * as helpers from "../helpers";
import { Stack } from "../helpers";

const input = helpers.readInput("inputs/input5.txt");
console.log(input);

const inputSplitIndex = input.findIndex((row) => row.length === 0);

const boxes = input.slice(0, inputSplitIndex);
console.log(boxes);
const stackIds = boxes[boxes.length - 1].split("   ");
const numStacks = parseInt(stackIds[stackIds.length - 1]);
const stacks: Stack<string>[] = new Array<Stack<string>>(numStacks);
console.log("stacks.length", stacks.length);
for (let i = 0; i < stacks.length; i++) {
  stacks[i] = new Stack<string>();
}
console.log("stacks.length", stacks.length);
boxes.reverse().forEach((row, index) => {
  if (index === 0) {
    return;
  }
  for (let i = 0; i <= stacks.length; i++) {
    const char = row.charAt(i * 4 + 1);
    if (char && char !== " ") {
      if (!stacks[i]) {
        stacks[i] = new Stack<string>();
      }
      stacks[i].push(row.charAt(i * 4 + 1));
    }
  }
});
// stacks.forEach((stack) => {
//   console.log(stack.toArray());
// });

const directions = input.slice(inputSplitIndex + 1).map((row) => {
  const splitDir = row.split(" ");
  const dir: Direction = {
    num: parseInt(splitDir[1]),
    source: parseInt(splitDir[3]),
    destination: parseInt(splitDir[5]),
  };
  return dir;
});

type Direction = {
  num: number;
  source: number;
  destination: number;
};

//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD5Q1(
  stacks.map((stack) => stack.clone()),
  directions
);
const output2 = aocD5Q2(
  stacks.map((stack) => stack.clone()),
  directions
);
console.log(output1);
console.log(output2);

/**
 *
 * @param input
 * @returns
 */
function aocD5Q1(stacks: Stack<string>[], directions: Direction[]): string {
  // stacks.forEach((stack, index) => {
  //   console.log(index);
  //   console.log(stack.toArray());
  // });
  directions.forEach((direction) => {
    for (let i = 0; i < direction.num; i++) {
      const top = stacks[direction.source - 1].pop();
      if (top) {
        stacks[direction.destination - 1].push(top);
      }
    }
  });
  return stacks
    .map((stack) => {
      return stack.peek();
    })
    .join("");
}

function aocD5Q2(stacks: Stack<string>[], directions: Direction[]): string {
  stacks.forEach((stack, index) => {
    //console.log(index);
    console.log(stack.toArray());
  });
  directions.forEach((direction, dirIndex) => {
    const grabbed = new Stack<string>();
    for (let i = 0; i < direction.num; i++) {
      const top = stacks[direction.source - 1].pop();
      if (top) {
        grabbed.push(top);
      }
    }
    while (true) {
      const current = grabbed.pop();
      if (!current) {
        break;
      }
      stacks[direction.destination - 1].push(current);
    }
    console.log(`after direction index ${dirIndex}`);
    console.log(
      `move ${direction.num} from ${direction.source} to ${direction.destination}`
    );

    stacks.forEach((stack, index) => {
      console.log(stack.toArray());
    });
  });
  console.log();
  stacks.forEach((stack, index) => {
    //console.log(index);
    console.log(stack.toArray());
  });
  return stacks
    .map((stack) => {
      return stack.peek();
    })
    .join("");
}
