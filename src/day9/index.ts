import * as helpers from "../helpers";
import { Matrix } from "../Matrix";

const input = helpers.readInput("inputs/input9test.txt");

type InputDirection = "R" | "U" | "L" | "D";
interface Motion {
  direction: InputDirection;
  distance: number;
}
const inputMotions: Motion[] = [];
input.forEach((line) => {
  if (!line) {
    return;
  }
  const parts = line.split(" ");
  inputMotions.push({
    direction: parts[0] as InputDirection,
    distance: parseInt(parts[1]),
  });
});

//const inputNums = input.map((str) => Number.parseInt(str));

class Coordinate {
  constructor(public x: number, public y: number) {}
  static fromCoordinate(coord: Coordinate) {
    return new Coordinate(coord.x, coord.y);
  }
  public copy() {
    return new Coordinate(this.x, this.y);
  }
  public add(input: { x: number; y: number }) {
    this.x += input.x;
    this.y += input.y;
  }
  public move(dir: InputDirection) {
    switch (dir) {
      case "U":
        this.y++;
        return;
      case "D":
        this.y--;
        return;
      case "L":
        this.x--;
        return;
      case "R":
        this.x++;
        return;
    }
  }
}
class Vector {
  constructor(public tail: Coordinate, public head: Coordinate) {}
  public get length() {
    return Math.sqrt(
      Math.pow(this.head.x - this.tail.x, 2) +
        Math.pow(this.head.y - this.tail.y, 2)
    );
  }
  public get slope() {
    return (this.head.y - this.tail.y) / (this.head.x - this.tail.x);
  }
  public get diagonal() {
    return new Vector(
      this.tail,
      new Coordinate(
        this.head.x / Math.abs(this.head.x),
        this.head.y / Math.abs(this.head.y)
      )
    );
  }
}

class Rope {
  constructor(initialHead: Coordinate, initialTail?: Coordinate) {
    this.ropeVector = new Vector(
      initialTail ? initialTail : Coordinate.fromCoordinate(initialHead),
      initialHead
    );
    this.tailHistory = [(initialTail ? initialTail : initialHead).copy()];
    this.headHistory = [initialHead.copy()];
  }
  public ropeVector: Vector;

  public move(motion: Motion) {
    //loop motion.distance times
    for (let i = 0; i < motion.distance; i++) {
      const previousHead = this.ropeVector.head.copy();
      // console.log({ headBeforeMove: this.ropeVector.head });
      this.ropeVector.head.move(motion.direction);
      this.headHistory.push(this.ropeVector.head.copy());
      // console.log({ headAfterMove: this.ropeVector.head });
      // console.log({ tailBeforeUpdate: this.ropeVector.tail });
      // console.log({ length: this.ropeVector.length });
      this.updateTail(previousHead);
      // console.log({ vectorAfterUpdate: this.ropeVector });
      // console.log({ length: this.ropeVector.length });
    }
  }

  public tailHistory: Coordinate[];
  public headHistory: Coordinate[];

  private updateTail(previousHead: Coordinate) {
    const length = this.ropeVector.length;
    if (length > Math.SQRT2) {
      this.ropeVector.tail = Coordinate.fromCoordinate(previousHead);
      this.tailHistory.push(this.ropeVector.tail);
    }
  }

  public headArray(): string[][] {
    const maxX = Math.max(...this.headHistory.map((coord) => coord.x));
    const minX = Math.min(...this.headHistory.map((coord) => coord.x));
    const maxY = Math.max(...this.headHistory.map((coord) => coord.y));
    const minY = Math.min(...this.headHistory.map((coord) => coord.y));
    const xOffset = minX < 0 ? minX * -1 : 0;
    // console.log({ xOffset });
    const yOffset = minY < 0 ? minY * -1 : 0;
    // console.log({ yOffset });
    var retMap = new Array<string[]>(maxY + 1 + yOffset);
    retMap.fill([]);
    retMap.forEach((xArr, index) => {
      retMap[index] = new Array(maxX + 1 + xOffset).fill(".");
    });
    this.headHistory.forEach((coord) => {
      // console.log(coord);
      retMap[coord.y + yOffset][coord.x + xOffset] = "#";
    });

    // retMap[yOffset][xOffset] = "S";

    return retMap.reverse();
  }
  public tailArray(): string[][] {
    const maxX = Math.max(...this.headHistory.map((coord) => coord.x));
    const minX = Math.min(...this.headHistory.map((coord) => coord.x));
    const maxY = Math.max(...this.headHistory.map((coord) => coord.y));
    const minY = Math.min(...this.headHistory.map((coord) => coord.y));
    const xOffset = minX < 0 ? minX * -1 : 0;
    // console.log({ xOffset });
    const yOffset = minY < 0 ? minY * -1 : 0;
    // console.log({ yOffset });
    var retMap = new Array<string[]>(maxY + 1 + yOffset);
    retMap.fill([]);
    retMap.forEach((xArr, index) => {
      retMap[index] = new Array(maxX + 1 + xOffset).fill(".");
    });
    this.tailHistory.forEach((coord) => {
      // console.log(coord);
      retMap[coord.y + yOffset][coord.x + xOffset] = "#";
    });
    // retMap[yOffset][xOffset] = "S";

    return retMap.reverse();
  }

  public printPath() {
    const tailArray = this.tailArray();

    console.log("\n\nTail:");
    tailArray.forEach((row) => {
      console.log(row.join(""));
    });

    const headArray = this.headArray();
    console.log("\n\nHead:");
    headArray.forEach((row) => {
      console.log(row.join(""));
    });
  }

  public printHistory() {
    const maxX = Math.max(...this.headHistory.map((coord) => coord.x));
    const minX = Math.min(...this.headHistory.map((coord) => coord.x));
    const maxY = Math.max(...this.headHistory.map((coord) => coord.y));
    const minY = Math.min(...this.headHistory.map((coord) => coord.y));
    const xOffset = minX < 0 ? minX * -1 : 0;
    const yOffset = minY < 0 ? minY * -1 : 0;

    this.headHistory.forEach((coord, index) => {});
    var retMap = new Array<string[]>(maxY + 1 + yOffset);
    retMap.fill([]);
    retMap.forEach((xArr, index) => {
      retMap[index] = new Array(maxX + 1 + xOffset).fill(".");
    });

    retMap[yOffset][xOffset] = "S";
  }
}
const output1 = aocD9Q1(inputMotions);
const output2 = aocD9Q2(inputMotions);
console.log(`Output 1: ${output1}`);
console.log(`Output 2: ${output2}`);

function findNumUniqueCoords(input: Coordinate[]): number {
  const map = new Map<number, number[]>();
  input.forEach((coord) => {
    const arr = map.get(coord.x);
    if (arr) {
      if (!arr.find((y) => y === coord.y)) {
        arr.push(coord.y);
      }
    } else {
      map.set(coord.x, [coord.y]);
    }
  });
  var retVal = 0;
  map.forEach((arr) => {
    retVal += arr.length;
  });
  return retVal;
}

/**
 *
 * @param input
 * @returns
 */
function aocD9Q1(motions: Motion[]): number {
  const rope = new Rope(new Coordinate(0, 0));
  motions.forEach((motion) => {
    //console.log({ motion });
    rope.move(motion);
  });
  rope.printPath();
  //return findNumUniqueCoords(rope.tailHistory);
  let num = 0;
  rope.tailArray().forEach((element) => {
    num += element.filter((entry) => entry === "#").length;
  });
  return num;
}

function aocD9Q2(motion: Motion[]): number {
  return -1;
}
