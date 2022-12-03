import { group } from "console";
import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input3.txt");
console.log(input);
const inputSacks = input.map((str) => {
  const middle = Math.floor(str.length / 2);
  const compartments = [str.substr(0, middle), str.substr(middle)];
  console.log(compartments[0].length);
  console.log(compartments[1].length);
  return compartments;
})
//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD3Q1(inputSacks);
const output2 = aocD3Q2(input);
console.log(output1);
console.log(output2);

function getPriority(input: string) {
  const inputCharCode = input.charCodeAt(0);
  const ZCharCode = 'Z'.charCodeAt(0);
  const aCharCode = 'a'.charCodeAt(0);
  const ACharCode = 'A'.charCodeAt(0);
  if (input.charAt(0) > 'Z'.charAt(0)) {
    return inputCharCode - aCharCode + 1;
  }
  else {
    return inputCharCode - ACharCode + 27
  }
}

// function getSimilarChars(input1: string, input2: string): string {
//   const retChars: string[] = [];
//   for (let i = 0; i < input1.length; i++) {
//     const index = input2.indexOf(input1.charAt(i));
//     if (index >= 0) {
//       return input1.charAt(i);
//     }
//   }
//   return ''
// }
function getSimilarChars(...inputs: string[]): string[] {
  const map: Map<string, boolean[]> = new Map();
  inputs.forEach((input, index) => {
    input.split('').forEach(char => {
      let arr = map.get(char);
      if (!arr) {
        arr = new Array<boolean>(inputs.length).fill(false);
      }
      arr[index] = true;
      map.set(char, arr);
    })
  });
  const similarChars: string[] = [];
  map.forEach((value, key) => {
    if (value.every(v => v)) {
      similarChars.push(key);
    }
  })
  return similarChars;
}

function splitToChunks<T>(inputArray: T[], parts: number): T[][] {
  const array = [...inputArray];
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}


/**
 *
 * @param input
 * @returns
 */
function aocD3Q1(input: string[][]): number {
  let sum = 0;
  input.forEach((compartments, index) => {
    // console.log(compartments)
    console.log(getSimilarChars(compartments[0], compartments[1]))

    const similar = getPriority(getSimilarChars(compartments[0], compartments[1])[0]);
    if (similar) {
      sum += getPriority(getSimilarChars(compartments[0], compartments[1])[0]);
    }
    else {
      throw new Error(`error at index ${index} with inputs ${compartments[0]} and ${compartments[1]}`)
    }
  })
  return sum;
}

function aocD3Q2(input: string[]): number {
  const groups = splitToChunks(input, input.length / 3);
  let sum = 0;
  groups.forEach(group => {
    const similar = getSimilarChars(...group);
    sum += getPriority(similar[0]);
  })
  return sum;
}
