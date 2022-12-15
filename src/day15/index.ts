import { dir } from "console";
import { BetterCoordinate, Coordinate } from "../Coordinate";
import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input15test.txt");

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

class Beacon extends Coordinate {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

class Sensor extends Coordinate {
  constructor(x: number, y: number, public closestBeacon: Beacon) {
    super(x, y);
  }
}

function sensorFactory(input: string) {
  //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  const parts = input.split(" ");
  const sensorX = parseInt(parts[2].split("=")[1]);
  const sensorY = parseInt(parts[2].split("=")[1]);
  const beaconX = parseInt(parts[2].split("=")[1]);
  const beaconY = parseInt(parts[2].split("=")[1]);
  return new Sensor(sensorX, sensorY, new Beacon(beaconX, beaconY));
}

class BeaconArea {
  public maxX: number = 0;
  public maxY: number = 0;
  public minX: number = 0;
  public minY: number = 0;
  public grid: string[][];
  constructor(public sensors: Sensor[]) {
    this.maxX = Number.NEGATIVE_INFINITY;
    this.minX = Number.POSITIVE_INFINITY;
    this.maxY = Number.NEGATIVE_INFINITY;
    this.minY = Number.POSITIVE_INFINITY;
    this.sensors.forEach((sensor) => {
      this.maxY = Math.max(sensor.y, sensor.closestBeacon.y, this.maxY);
      this.maxX = Math.max(sensor.x, sensor.closestBeacon.x, this.maxX);
      this.minY = Math.min(sensor.y, sensor.closestBeacon.y, this.minY);
      this.minX = Math.min(sensor.x, sensor.closestBeacon.x, this.minX);
    });

    this.grid = Array.from({ length: this.yOffset + 1 }, (e) =>
      Array.from({ length: this.xOffset + 1 }, (e) => ".")
    );
    console.log(this.maxX, this.minX, this.maxY);
    this.populateGrid();
    this.printGrid();
  }
  public get xOffset(): number {
    return this.maxX - this.minX;
  }
  public get yOffset(): number {
    return this.maxY - this.minY;
  }
  public getAtWithOffset(x: number, y: number) {
    return this.getAt(x - this.minX, y);
  }
  public getAt(x: number, y: number) {
    if (y >= this.grid.length) {
      this.addSpace("bottom");
      this.minY--;
    } else if (y < 0) {
      this.addSpace("top");
      this.maxY++;
      return this.grid[0][x];
    } else if (x < 0) {
      this.addSpace("front");
      this.minX--;
      return this.grid[y][0];
    } else if (x >= this.grid[0].length) {
      this.addSpace("back");
      this.maxX++;
      return this.grid[y][this.grid[0].length - 1];
    }

    return this.grid[y][x];
  }
  public setAt(x: number, y: number, value: string) {
    this.grid[y][x] = value;
  }
  public setAtWithOffset(x: number, y: number, value: string) {
    return this.setAt(x - this.minX, y - this.minY, value);
  }
  private populateGrid() {}
  private addSpace(direction: "front" | "back" | "top" | "bottom") {
    switch (direction) {
      case "front":
        for (let i = 0; i < this.grid.length; i++) {
          this.grid[i].unshift(".");
        }
        return;
      case "back":
        for (let i = 0; i < this.grid.length; i++) {
          this.grid[i].push(".");
        }
        return;
      case "top":
        this.grid.unshift(
          Array.from({ length: this.grid[0].length }, (e) => ".")
        );
        return;
      case "bottom":
        this.grid.push(Array.from({ length: this.grid[0].length }, (e) => "."));
        return;
    }
  }
  public printGrid() {
    var maxYIndexSize = Math.max(
      this.maxY.toString().length,
      this.minY.toString().length
    );
    var maxXIndexSize = Math.max(
      this.maxX.toString().length,
      this.minX.toString().length
    );
    const yIndices = this.grid.map((arr, index) => {
      return (index - this.minY).toString().padStart(maxYIndexSize, " ");
    });
    const xIndices = this.grid[0].map((str, index) => {
      return (index - this.minY).toString().padStart(maxXIndexSize, " ");
    });
    const xStrings = Array.from({ length: this.grid[0].length + 1 }, (e) =>
      Array.from({ length: maxXIndexSize }, (e) => " ")
    );
    xIndices.forEach((str) => {
      str.split("").forEach((char, index) => {
        xStrings[index].push(char);
      });
    });
    xStrings.forEach((strArr) => {
      console.log(strArr.join(""));
      console.log(strArr);
    });
    this.grid.forEach((line, index) => {
      const mark = index.toString();
      console.log(mark[mark.length - 1] + line.join(""));
    });
  }
}

const sensors: Sensor[] = [];
input.forEach((beaconLine) => {
  if (beaconLine) {
    sensors.push(sensorFactory(beaconLine));
  }
});

// console.log(
//   lines.map((line) =>
//     line.coords.map((coord) => {
//       return { x: coord.x, y: coord.y };
//     })
//   )
// );
console.log(`Output 1: ${aocD14Q1(sensors)}`);
console.log(`Output 2: ${aocD14Q2(sensors)}`);
/**
 *
 * @param input
 * @returns
 */
function aocD14Q1(sensors: Sensor[]): number {
  const area = new BeaconArea(sensors);
  return -1;
}

function aocD14Q2(sensors: Sensor[]): number {
  return -1;
}
