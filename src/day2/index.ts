import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input2.txt");
const inputRounds = input.map((row) => row.split(" ")) as [ABC, XYZ][];
console.log(input);
//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD1Q1(inputRounds);
const output2 = aocD1Q2(inputRounds);
console.log(output1);
console.log(output2);

type RPS = "R" | "P" | "S";
type INPUT = ABC | XYZ;
type ABC = "A" | "B" | "C";
type XYZ = "X" | "Y" | "Z";

function choiceToScore(input: RPS): number {
  switch (input) {
    case "R":
      return 1;
    case "P":
      return 2;
    case "S":
      return 3;
  }
}

function inputToChoice(input: INPUT): RPS {
  switch (input) {
    case "A":
      return "R";
    case "X":
      return "R";
    case "B":
      return "P";
    case "Y":
      return "P";
    case "C":
      return "S";
    case "Z":
      return "S";
  }
}

//X == lose
//Y === draw
//Z === win

function resultToChoice(theirInput: ABC, result: XYZ): ABC {
  if (result === "Y") {
    return theirInput;
  }
  if (result === "X") {
    //loss
    if (theirInput === "A") {
      return "C";
    }
    if (theirInput === "B") {
      return "A";
    }
    if (theirInput === "C") {
      return "B";
    }
  }

  throw new Error("Invalid input in result to choice");
}

/**
 *
 * @param opponent
 * @param you
 * @returns points result
 */
function rps(opponent: RPS, you: RPS): number {
  if (opponent === you) {
    return 3;
  }
  if (opponent === "R") {
    return you === "P" ? 6 : 0;
  }
  if (opponent === "P") {
    return you === "S" ? 6 : 0;
  }
  if (opponent === "S") {
    return you === "R" ? 6 : 0;
  }
  throw new Error("Invalid rps input");
}

/**
 *
 * @param input
 * @returns
 */
function aocD1Q1(input: INPUT[][]): number {
  let currentScore = 0;

  input.forEach((round) => {
    if (round.length !== 2) {
      return;
    }
    const theirChoice = inputToChoice(round[0]);
    const yourChoice = inputToChoice(round[1]);
    const score = rps(theirChoice, yourChoice);
    currentScore += score + choiceToScore(yourChoice);
    //console.log(currentScore);
  });
  return currentScore;
}

function aocD1Q2(input: [ABC, XYZ][]): number {
  let currentScore = 0;

  input.forEach((round) => {
    if (round.length !== 2) {
      return;
    }

    const theirChoice = inputToChoice(round[0]);
    const yourChoice = inputToChoice(resultToChoice(round[0], round[1]));
    const score = rps(theirChoice, yourChoice);
    currentScore += score + choiceToScore(yourChoice);
    //console.log(currentScore);
  });
  return currentScore;
}
