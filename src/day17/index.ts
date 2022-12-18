import * as helpers from "../helpers";
import { Cross } from "./Cross";
import { HorizontalLine } from "./HorizontalLine";
import { LRock } from "./LRock";
import { Rock } from "./Rock";
import { RockArea } from "./RockArea";
import { Square } from "./Square";
import { VerticalLine } from "./VerticalLine";

const test = process.argv.slice(2)[0] === 'test';
const input = helpers.readInput("inputs/input17" + (test ? "test.txt" : ".txt"));

class RockEngine {
  public jetArr: ("<" | ">")[];
  public nextJetIndex = 0;
  public rockArray = [HorizontalLine, Cross, LRock, VerticalLine, Square];
  public nextRockIndex = 0;
  public highestHeight = 0;
  public currentRock: Rock;
  public rockArea: RockArea;
  constructor(jets: string) {
    this.jetArr = jets.split('') as ("<" | ">")[];
    this.rockArea = new RockArea();
    this.currentRock = new this.nextRock(2, this.highestHeight + 2, this.rockArea);
  }

  public get nextJetDirection() {
    const retVal = this.jetArr[this.nextJetIndex++];
    if (this.nextJetIndex >= this.jetArr.length) {
      this.nextJetIndex = 0;
    }
    return retVal;
  }

  public get nextRock() {
    const retRock = this.rockArray[this.nextRockIndex++];
    if (this.nextRockIndex >= this.rockArray.length) {
      this.nextRockIndex = 0;
    }
    return retRock;
  }

  public startNextRock() {
    this.currentRock = new this.nextRock(3, this.highestHeight + 2, this.rockArea);
  }

  public advanceCurrentRock() {
    const nextJet = this.nextJetDirection;
    this.currentRock.move(nextJet);
    if (this.currentRock.canMoveDown()) {
      this.currentRock.move('d');
      return true;
    }
    else {
      this.finishCurrentRock();
      return false;
    }
  }
  public calculateRock() {
    while (this.advanceCurrentRock()) {
    }
  }
  public finishCurrentRock() {
    this.currentRock.finishRock();
    this.highestHeight = Math.max(this.currentRock.highestY, this.highestHeight);
  }
}



console.log(`Output 1: ${aocD17Q1(input[0])}`);
console.log(`Output 2: ${aocD17Q2(input[0])}`);


/**
 *
 * @param input
 * @returns
 */
function aocD17Q1(jets: string): number {
  const rockEngine = new RockEngine(jets);

  for (let i = 0; i < 5; i++) {
    rockEngine.calculateRock();
    rockEngine.rockArea.printGrid();
  }



  return -1;
}

function aocD17Q2(jets: string): number {
  return -1;
}
