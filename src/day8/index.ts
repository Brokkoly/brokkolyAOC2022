import * as helpers from "../helpers";
import { Matrix } from "../Matrix";

class TreehouseCandidate {
  public north?: TreehouseCandidate;
  public south?: TreehouseCandidate;
  public east?: TreehouseCandidate;
  public west?: TreehouseCandidate;

  private _highestNorth?: number;
  private _highestSouth?: number;
  private _highestEast?: number;
  private _highestWest?: number;

  constructor(public height: number) {}
  public get highestNorth(): number {
    if (this._highestNorth === undefined) {
      if (this.north) {
        this._highestNorth = Math.max(
          this.north.highestNorth,
          this.north.height
        );
      } else {
        this._highestNorth = -1;
      }
    }
    // console.log(this._highestNorth);
    return this._highestNorth;
  }
  public get highestSouth(): number {
    if (this._highestSouth === undefined) {
      if (this.south) {
        this._highestSouth = Math.max(
          this.south.highestSouth,
          this.south.height
        );
      } else {
        this._highestSouth = -1;
      }
    }
    return this._highestSouth;
  }
  public get highestEast(): number {
    if (this._highestEast === undefined) {
      if (this.east) {
        this._highestEast = Math.max(this.east.highestEast, this.east.height);
      } else {
        this._highestEast = -1;
      }
    }
    return this._highestEast;
  }
  public get highestWest(): number {
    if (this._highestWest === undefined) {
      if (this.west) {
        this._highestWest = Math.max(this.west.highestWest, this.west.height);
      } else {
        this._highestWest = -1;
      }
    }
    return this._highestWest;
  }
  public isVisible(): boolean {
    if (this.highestNorth < this.height) {
      return true;
    } else if (this.highestSouth < this.height) {
      return true;
    } else if (this.highestEast < this.height) {
      return true;
    } else if (this.highestWest < this.height) {
      return true;
    }
    return false;
  }
}

const input = helpers.readInput("inputs/input8.txt");
const inputTrees = new Array<TreehouseCandidate[]>();
input.forEach((line) => {
  if (line) {
    inputTrees.push(
      line.split("").map((num) => {
        return new TreehouseCandidate(parseInt(num));
      })
    );
  }
});
const inputTreeMatrix = new Matrix(inputTrees);
//var previousCandidate: TreehouseCandidate | undefined;
// for (let rowIndex = 0; rowIndex <= inputTrees.length; rowIndex++) {
//   const currentCandidate = inputTreeMatrix.getElement(rowIndex, 0);
//   if (previousCandidate) {
//     currentCandidate.north = previousCandidate;
//     previousCandidate.south = currentCandidate;
//   }
//   previousCandidate = currentCandidate;
// }

// previousCandidate = undefined;

// for (let columnIndex = 0; columnIndex <= inputTrees[0].length; columnIndex++) {
//   const currentCandidate = inputTreeMatrix.getElement(0, columnIndex);
//   if (previousCandidate) {
//     currentCandidate.west = previousCandidate;
//     previousCandidate.east = currentCandidate;
//   }
//   previousCandidate = currentCandidate;
// }

for (let rowIndex = 0; rowIndex < inputTrees.length; rowIndex++) {
  for (
    let columnIndex = 0;
    columnIndex < inputTrees[rowIndex].length;
    columnIndex++
  ) {
    const currentCandidate = inputTreeMatrix.getElement(rowIndex, columnIndex);
    if (rowIndex !== 0) {
      const westCandidate = inputTreeMatrix.getElement(
        rowIndex - 1,
        columnIndex
      );
      currentCandidate.west = westCandidate;
      westCandidate.east = currentCandidate;
    }
    if (columnIndex !== 0) {
      const northCandidate = inputTreeMatrix.getElement(
        rowIndex,
        columnIndex - 1
      );
      currentCandidate.north = northCandidate;
      northCandidate.south = currentCandidate;
    }
  }
}

for (let rowIndex = 0; rowIndex < inputTreeMatrix.height; rowIndex++) {
  for (
    let columnIndex = 0;
    columnIndex < inputTreeMatrix.width;
    columnIndex++
  ) {
    const tree = inputTreeMatrix.getElement(rowIndex, columnIndex);
    tree.isVisible();
  }
}

// console.log(input);

// const inputTrees: Matrix<TreehouseCandidate> = new Matrix<TreehouseCandidate>(
//   input.length - 1,
//   input[0].length
// );

// console.log(inputCommands);

//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD8Q1(inputTreeMatrix);
const output2 = aocD8Q2(inputTreeMatrix);
console.log(`Output 1: ${output1}`);
console.log(`Output 2: ${output2}`);

/**
 *
 * @param input
 * @returns
 */
function aocD8Q1(trees: Matrix<TreehouseCandidate>): number {
  var numVisible = 0;
  for (let rowIndex = 0; rowIndex < trees.height; rowIndex++) {
    for (let columnIndex = 0; columnIndex < trees.width; columnIndex++) {
      const tree = trees.getElement(rowIndex, columnIndex);
      //console.log(tree);
      // console.log(
      //   `row: ${rowIndex}, column: ${columnIndex}, height=${tree.height}`
      // );

      if (tree.isVisible()) {
        // console.log(`visible`);
        numVisible++;
      }
    }
  }
  return numVisible;
}

type Directions = "north" | "south" | "east" | "west";
function getTreeDirection(
  tree: TreehouseCandidate,
  direction: Directions
): TreehouseCandidate | undefined {
  switch (direction) {
    case "north":
      return tree.north;
    case "south":
      return tree.south;
    case "east":
      return tree.east;
    default:
      return tree.west;
  }
}

function getTreeScenicScore(tree: TreehouseCandidate): number {
  let score = 1;
  let scores: number[] = [];
  let dirs: Directions[] = ["north", "south", "east", "west"];
  dirs.forEach((dir) => {
    let newTree: TreehouseCandidate | undefined = tree;
    let currentScore = 0;
    while (true) {
      newTree = getTreeDirection(newTree, dir);
      if (!newTree) {
        break;
      }
      currentScore++;
      if (newTree.height >= tree.height) {
        break;
      }
    }
    scores.push(currentScore);
  });
  scores.forEach((num) => (score *= num));
  return score;
}

function aocD8Q2(trees: Matrix<TreehouseCandidate>): number {
  var highestScore = 0;
  for (let rowIndex = 0; rowIndex < trees.height; rowIndex++) {
    for (let columnIndex = 0; columnIndex < trees.width; columnIndex++) {
      const tree = trees.getElement(rowIndex, columnIndex);
      //console.log(tree);
      // console.log(
      //   `row: ${rowIndex}, column: ${columnIndex}, height=${tree.height}`
      // );

      if (tree.isVisible()) {
        highestScore = Math.max(highestScore, getTreeScenicScore(tree));
        // console.log(`visible`);
        // numVisible++;
      }
    }
  }
  return highestScore;
}
