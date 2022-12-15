import { BetterCoordinate, Coordinate } from "../Coordinate";
import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input14.txt");

class Line {
  public coords: BetterCoordinate[];
  constructor(input: string) {
    this.coords = input.split("->").map((str) => new BetterCoordinate(str));
  }
  public get minX(): number {
    var minimum = Number.POSITIVE_INFINITY;
    this.coords.forEach((coord) => {
      minimum = Math.min(coord.x, minimum);
    });
    return minimum;
  }
  public get minY(): number {
    var minimum = Number.POSITIVE_INFINITY;
    this.coords.forEach((coord) => {
      minimum = Math.min(coord.y, minimum);
    });
    return minimum;
  }
  public get maxX(): number {
    var maximum = Number.NEGATIVE_INFINITY;
    this.coords.forEach((coord) => {
      maximum = Math.max(coord.x, maximum);
    });
    return maximum;
  }
  public get maxY(): number {
    var maximum = Number.NEGATIVE_INFINITY;
    this.coords.forEach((coord) => {
      maximum = Math.max(coord.y, maximum);
    });
    return maximum;
  }
}

class SandArea {
  public xOffset = 0;
  public maxX: number;
  public maxY: number;
  public minX: number;
  public grid: string[][];
  constructor(public lines: Line[], private part2: boolean = false) {
    this.maxX = Number.NEGATIVE_INFINITY;
    this.minX = Number.POSITIVE_INFINITY;
    this.maxY = Number.NEGATIVE_INFINITY;
    this.lines.forEach((line) => {
      this.maxY = Math.max(line.maxY, this.maxY);
      this.maxX = Math.max(line.maxX, this.maxX);
      this.minX = Math.min(line.minX, this.minX);
    });
    this.xOffset = this.maxX - this.minX;

    this.grid = Array.from({ length: this.maxY + 1 }, (e) =>
      Array.from({ length: this.xOffset + 1 }, (e) => ".")
    );
    console.log(this.maxX, this.minX, this.maxY);
    this.populateGrid();
    this.setAtWithOffset(500, 0, "+");
    this.printGrid();
  }
  public getAtWithOffset(x: number, y: number) {
    return this.getAt(x - this.minX, y);
  }
  public getAt(x: number, y: number) {
    if (y >= this.grid.length || y < 0) {
      return undefined;
    } else if (x < 0 || x >= this.grid[0].length) {
      console.log(`undefined at ${x},${y}`);
      if (!this.part2) {
        return undefined;
      } else {
        if (x < 0) {
          this.addSpace("front");
          this.minX--;
          this.xOffset = this.maxX - this.minX;
          console.log(this.grid[y][0]);
          return this.grid[y][0];
        } else {
          // console.log("At the back");
          this.addSpace("back");
          this.maxX++;
          this.xOffset = this.maxX + this.grid.length;
          
          // this.printGrid();
          // console.log(`${this.grid.length - 1},${y}`);
          // console.log(this.grid[y][this.grid[0].length - 1]);
          return this.grid[y][this.grid[0].length - 1];
        }
      }
    }

    return this.grid[y][x];
  }
  public setAt(x: number, y: number, value: string) {
    this.grid[y][x] = value;
  }
  public setAtWithOffset(x: number, y: number, value: string) {
    return this.setAt(x - this.minX, y, value);
  }
  private populateGrid() {
    this.lines.forEach((line) => {
      let previousCoord = line.coords[0];
      for (let i = 1; i < line.coords.length; i++) {
        previousCoord = line.coords[i - 1];
        const coord = line.coords[i];
        // console.log({ previousCoord });
        // console.log({ coord });
        if (previousCoord.y === coord.y) {
          const firstCoord = previousCoord.x < coord.x ? previousCoord : coord;
          const secondCoord = previousCoord.x > coord.x ? previousCoord : coord;
          for (let x = firstCoord.x; x <= secondCoord.x; x++) {
            // console.log({ x });
            this.setAtWithOffset(x, firstCoord.y, "#");
          }
        } else {
          const firstCoord = previousCoord.y < coord.y ? previousCoord : coord;
          const secondCoord = previousCoord.y > coord.y ? previousCoord : coord;
          // console.log({ firstCoord });
          // console.log({ secondCoord });
          for (let y = firstCoord.y; y <= secondCoord.y; y++) {
            // console.log({ y });

            this.setAtWithOffset(firstCoord.x, y, "#");
          }
        }
      }
    });
    if (this.part2) {
      this.grid.push(Array.from({ length: this.xOffset + 1 }, (e) => "."));
      this.grid.push(Array.from({ length: this.xOffset + 1 }, (e) => "#"));
    }
  }
  private addSpace(direction: "front" | "back") {
    for (let i = 0; i < this.grid.length; i++) {
      if (direction === "front") {
        this.grid[i].unshift(i === this.grid.length - 1 ? "#" : ".");
      } else {
        this.grid[i].push(i === this.grid.length - 1 ? "#" : ".");
      }
    }
  }
  public printGrid() {
    console.log(" 01234567890123456789");
    this.grid.forEach((line, index) => {
      const mark = index.toString();
      console.log(mark[mark.length - 1] + line.join(""));
    });
  }
}

export class Sand extends Coordinate {
  constructor(public area: SandArea) {
    super(500, 0);
  }
  public dropStep(): boolean | undefined {
    const below = this.area.getAtWithOffset(this.x, this.y + 1);
    const downLeft = this.area.getAtWithOffset(this.x - 1, this.y + 1);
    const downRight = this.area.getAtWithOffset(this.x + 1, this.y + 1);

    // console.log(`${this.x},${this.y}`);
    // console.log({ downLeft, below, downRight });
    if (below === ".") {
      this.move("U");
      return true;
    } else if (below === undefined) {
      return undefined;
    }
    if (downLeft === ".") {
      this.move("U");
      this.move("L");
      return true;
    } else if (downLeft === undefined) {
      return undefined;
    }
    if (downRight === ".") {
      this.move("U");
      this.move("R");
      return true;
    } else if (downRight === undefined) {
      return undefined;
    }
    // console.log(`stopped at ${this.x},${this.y}`);
    this.area.setAtWithOffset(this.x, this.y, "o");
    return false;
  }
  public drop() {
    while (true) {
      var result: boolean | undefined;

      //  this.area.setAtWithOffset(this.x, this.y, "0");
      // console.log();
      // this.area.printGrid();
      result = this.dropStep();

      if (!result) {
        return result;
      }
    }
  }
}

const lines: Line[] = [];
input.forEach((line) => {
  if (line) {
    lines.push(new Line(line));
  }
});

console.log(
  lines.map((line) =>
    line.coords.map((coord) => {
      return { x: coord.x, y: coord.y };
    })
  )
);
console.log(`Output 1: ${aocD14Q1(lines)}`);
console.log(`Output 2: ${aocD14Q2(lines)}`);
/**
 *
 * @param input
 * @returns
 */
function aocD14Q1(lines: Line[]): number {
  const sandArea = new SandArea(lines);
  const grains: Sand[] = [];
  var sandResult: boolean | undefined;
  do {
    const grain = new Sand(sandArea);
    sandResult = grain.drop();
    // sandArea.printGrid();
    grains.push(grain);
  } while (sandResult !== undefined);
  sandArea.printGrid();
  return grains.length - 1;
}

function aocD14Q2(lines: Line[]): number {
  const sandArea = new SandArea(lines, true);
  const grains: Sand[] = [];
  var sandResult: boolean | undefined;
  do {
    var grain = new Sand(sandArea);
    sandResult = grain.drop();
    // sandArea.printGrid();
    grains.push(grain);
    // console.log(
    //   `final position: ${grain.x},${grain.y}, Not Done: ${
    //     grain.x !== 500 && grain.y !== 0
    //   }`
    // );
  } while (grain.x !== 500 || grain.y !== 0);
  sandArea.printGrid();
  return grains.length;
}
