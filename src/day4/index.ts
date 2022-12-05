import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input4.txt");
console.log(input);
const inputPairs = input.map(row => {
  const elves: number[][] = [];
  row.split(',').forEach(elf => {
    elves.push([...elf.split('-').map(num => parseInt(num))]);
  })
  return elves;
})
//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD4Q1(inputPairs);
const output2 = aocD4Q2(inputPairs);
console.log(output1);
console.log(output2);

function checkEnvelop(elf1: number[], elf2: number[]): boolean {
  if (elf1[0] <= elf2[0] && elf1[1] >= elf2[1]) {
    return true;
  }
  if (elf2[0] <= elf1[0] && elf2[1] >= elf1[1]) {
    return true;
  }
  return false;

}

function checkOverlap(elf1: number[], elf2: number[]): boolean {
  if (elf1[0] >= elf2[0] && elf1[0] <= elf2[1]) {
    return true;
  }
  if (elf1[1] <= elf2[1] && elf1[1] >= elf2[0]) {
    return true;
  }
  if (elf2[0] >= elf1[0] && elf2[0] <= elf1[1]) {
    return true;
  }
  if (elf2[1] <= elf1[1] && elf2[1] >= elf1[0]) {
    return true;
  }
  return false;
}

/**
 *
 * @param input
 * @returns
 */
function aocD4Q1(input: number[][][]): number {
  let numEnvelop = 0;
  input.forEach(pair => {
    if (checkEnvelop(pair[0], pair[1])) {
      numEnvelop++;
    }
  })
  return numEnvelop;
}

function aocD4Q2(input: number[][][]): number {
  let numOverlap = 0;
  input.forEach(pair => {
    if (checkOverlap(pair[0], pair[1])) {
      numOverlap++;
    }
  })
  return numOverlap
}
