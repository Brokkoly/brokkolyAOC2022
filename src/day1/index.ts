import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input1.txt");
const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD1Q1(inputNums);
const output2 = aocD1Q2(inputNums);
console.log(output1);
console.log(output2);
/**
 *
 * @param input
 * @returns
 */
function aocD1Q1(input: number[]): number {
  let currentMax = 0;
  let currentMaxIndex = 0;
  let numElves = 1;
  let currentElf = 0;
  console.log(input);
  for (let i = 0; i < input.length; i++) {
    //console.log(`input[${i}]=${input[i]}`);
    if (Number.isNaN(input[i])) {
      if (currentElf > currentMax) {
        currentMax = currentElf;
        currentMaxIndex = numElves;
      }
      numElves++;
      currentElf = 0;
    } else {
      currentElf += input[i];
    }
  }

  return currentMax;
}

function aocD1Q2(input: number[]): number {
  let elves: number[] = [];
  let currentMax = 0;
  let numElves = 1;
  let currentElf = 0;
  console.log(input);
  for (let i = 0; i < input.length; i++) {
    //console.log(`input[${i}]=${input[i]}`);
    if (Number.isNaN(input[i])) {
      elves.push(currentElf);
      numElves++;
      currentElf = 0;
    } else {
      currentElf += input[i];
    }
  }

  elves = elves.sort((a, b) => {
    return a - b;
  });

  console.log(elves);

  return (
    elves[elves.length - 1] + elves[elves.length - 2] + elves[elves.length - 3]
  );
}
