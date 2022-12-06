import { group } from "console";
import { Dirent } from "fs";
import * as helpers from "../helpers";
import { Stack } from "../helpers";
import { DropQueue } from "../Queue";

const input = helpers.readInput("inputs/input6.txt");
console.log(input);

//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD6Q1(input[0]);
const output2 = aocD6Q2(input[0]);
console.log(`Output 1: ${output1}`);
console.log(`Output 1: ${output2}`);

function valuesAreUnique(input: string[]): boolean {
  var values = Object.create(null);
  for (let i = 0; i < input.length; i++) {
    var value = input[i];
    if (value in values) {
      return false;
    }
    values[value] = true;
  }
  return true;
}

function getMarker(input: string, bufferSize: number): number {
  const buffer = new DropQueue<string>(bufferSize);
  let marker = -1;
  const inputArr = input.split("");
  for (let i = 0; i < inputArr.length; i++) {
    buffer.enqueue(inputArr[i]);
    if (i > bufferSize - 1) {
      if (valuesAreUnique(buffer.toArray())) {
        marker = i;
        break;
      }
    }
  }
  return marker + 1;
}

/**
 *
 * @param input
 * @returns
 */
function aocD6Q1(input: string): number {
  return getMarker(input, 4);
}

function aocD6Q2(input: string): number {
  return getMarker(input, 14)
}
