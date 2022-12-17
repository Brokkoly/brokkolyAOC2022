import { BetterCoordinate, Coordinate } from "../Coordinate";
import * as helpers from "../helpers";

const test = process.argv.slice(2)[0] === 'test';
const input = helpers.readInput("inputs/input15" + (test ? "test.txt" : ".txt"));

class Beacon extends Coordinate {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

class Sensor extends Coordinate {
  public distanceToBeacon: number;
  constructor(x: number, y: number, public closestBeacon: Beacon) {
    super(x, y);
    this.distanceToBeacon =
      Math.abs(this.x - closestBeacon.x) + Math.abs(this.y - closestBeacon.y);
  }

  public checkPointWithinRange(coord: Coordinate) {
    return (
      Math.abs(this.x - coord.x) + Math.abs(this.y - coord.y) <=
      this.distanceToBeacon
    );
  }

  public getDistanceToCoordinate(coord: Coordinate) {
    return (
      Math.abs(this.x - coord.x) + Math.abs(this.y - coord.y)
    );
  }

  public getNextX(coord: Coordinate) {
    if (!this.checkPointWithinRange(coord)) {
      throw new Error(`point is not within range: ${coord.x},${coord.y}. My position: ${this.x},${this.y}`);
    }
    const yDist = Math.abs(coord.y - this.y);
    const xDist = Math.abs(coord.x - this.x)
    // console.log(` ${coord.x},${coord.y}. Me: x: ${this.x}, y: ${this.y}, distanceToBeacon: ${this.distanceToBeacon}}`)
    // console.log(`ydist: ${yDist}, ${this.distanceToBeacon - yDist}`)
    const nextX = coord.x + xDist + (this.distanceToBeacon - yDist) + 1;
    if (nextX === coord.x) {
      console.log(`ydist: ${yDist}, ${this.distanceToBeacon - yDist}`)
      throw new Error(`x (${nextX}) is the same: ${coord.x},${coord.y}. Me: x: ${this.x}, y: ${this.y}, distanceToBeacon: ${this.distanceToBeacon}}`);
    }
    return nextX
  }
  public print() {
    console.log(`x: ${this.x}, y: ${this.y}, distance: ${this.distanceToBeacon}`);
  }

  public getNextY(coord: Coordinate) {
    if (!this.checkPointWithinRange(coord)) {
      throw new Error('point is not within range');
    }
    const xDist = Math.abs(coord.x - this.x)
    return (this.distanceToBeacon - xDist) * 2 + 1;
  }
}

function sensorFactory(input: string) {
  //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  const parts = input.split(" ");
  const sensorX = parseInt(parts[2].split("=")[1]);
  const sensorY = parseInt(parts[3].split("=")[1]);
  const beaconX = parseInt(parts[8].split("=")[1]);
  const beaconY = parseInt(parts[9].split("=")[1]);
  return new Sensor(sensorX, sensorY, new Beacon(beaconX, beaconY));
}

class BeaconArea {
  public maxX: number = 0;
  public maxY: number = 0;
  public minX: number = 0;
  public minY: number = 0;
  public grid: string[][] = []
  constructor(public sensors: Sensor[]) {
    this.maxX = Number.NEGATIVE_INFINITY;
    this.minX = Number.POSITIVE_INFINITY;
    this.maxY = Number.NEGATIVE_INFINITY;
    this.minY = Number.POSITIVE_INFINITY;
    this.sensors.forEach((sensor) => {
      // this.maxY = Math.max(sensor.y, sensor.closestBeacon.y + sensor.distanceToBeacon, this.maxY);
      // this.maxX = Math.max(sensor.x, sensor.closestBeacon.x + sensor.distanceToBeacon, this.maxX);
      // this.minY = Math.min(sensor.y, sensor.closestBeacon.y - sensor.distanceToBeacon, this.minY);
      // this.minX = Math.min(sensor.x, sensor.closestBeacon.x - sensor.distanceToBeacon, this.minX);
      this.maxY = Math.max(sensor.y, sensor.closestBeacon.y, this.maxY);
      this.maxX = Math.max(sensor.x, sensor.closestBeacon.x, this.maxX);
      this.minY = Math.min(sensor.y, sensor.closestBeacon.y, this.minY);
      this.minX = Math.min(sensor.x, sensor.closestBeacon.x, this.minX);
    });

    // this.grid = Array.from({ length: this.yOffset + 1 }, (e) =>
    //   Array.from({ length: this.xOffset + 1 }, (e) => ".")
    // );

    // console.log(this.maxX, this.minX, this.maxY);
    // this.populateGrid();
    // this.expandGrid();
    // this.printGrid();
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
  private populateGrid() {
    this.sensors.forEach((sensor) => {
      this.setAtWithOffset(sensor.x, sensor.y, "S");
      this.setAtWithOffset(sensor.closestBeacon.x, sensor.closestBeacon.y, "B");
    });
  }
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
      return (index + this.minX).toString().padStart(maxXIndexSize, " ");
    });
    console.log({ xIndices });
    // console.log({ maxXIndexSize });
    const xStrings = Array.from({ length: maxXIndexSize }, (e) =>
      Array.from({ length: maxYIndexSize }, (e) => " ")
    );
    xIndices.forEach((str) => {
      str.split("").forEach((char, index) => {
        xStrings[index].push(char);
      });
    });
    // console.log(xStrings);
    xStrings.forEach((strArr) => {
      console.log(strArr.join(""));
    });
    this.grid.forEach((line, index) => {
      console.log(yIndices[index] + line.join(""));
    });
  }
  public expandGrid() {
    var maxX = Number.NEGATIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    var minX = Number.POSITIVE_INFINITY;
    var minY = Number.POSITIVE_INFINITY;
    this.sensors.forEach((sensor) => {
      maxY = Math.max(sensor.y + sensor.distanceToBeacon, maxY);
      maxX = Math.max(sensor.x + sensor.distanceToBeacon, maxX);
      minY = Math.min(sensor.y - sensor.distanceToBeacon, minY);
      minX = Math.min(sensor.x - sensor.distanceToBeacon, minX);
    });

    for (let x = this.maxX + 1; x <= maxX; x++) {
      this.getAtWithOffset(x, 0)
    }
    for (let x = this.minX - 1; x >= minX; x--) {
      this.getAtWithOffset(x, 0)
    }
    // while (this.maxX < maxX) {
    //   this.getAtWithOffset(this.maxX + 1, 0);
    // }
    // while (this.maxY < maxY) {
    //   this.getAtWithOffset(0, this.maxY + 1);
    // }
    // while (this.minX > minX) {
    //   this.getAtWithOffset(this.minX - 1, 0);
    // }
    // while (this.minY > minY) {
    //   this.getAtWithOffset(0, this.minY - 1);
    // }

  }
  public populateAreaAroundSensor(sensor: Sensor) {
    const xDistance = Math.abs(sensor.x - sensor.closestBeacon.x);
  }
}

const sensors: Sensor[] = [];
input.forEach((beaconLine) => {
  if (beaconLine) {
    sensors.push(sensorFactory(beaconLine));
  }
});
sensors.forEach((sensor) => console.log(sensor));

// console.log(
//   lines.map((line) =>
//     line.coords.map((coord) => {
//       return { x: coord.x, y: coord.y };
//     })
//   )
// );
console.log(`Output 1: ${aocD14Q1(sensors)}`);
console.log(`Output 2: ${aocD15Q2(sensors)}`);
/**
 *
 * @param input
 * @returns
 */
function aocD14Q1(sensors: Sensor[]): number {
  const area = new BeaconArea(sensors);
  var numImpossible = 0;
  for (let x = area.minX; x <= area.maxX; x++) {
    var foundOne = false;
    const y = 10
    area.sensors.forEach((sensor) => {
      if (!foundOne) {
        if (sensor.checkPointWithinRange(new Coordinate(x, y)) && !area.sensors.find(sensor => sensor.closestBeacon.x === x && sensor.closestBeacon.y === y)) {
          foundOne = true;
          numImpossible++;
        }
      }
    });
  }

  // area.printGrid();
  return numImpossible;
}

function getFrequency(x: number, y: number): number {
  return x * 4000000 + y
}

function aocD15Q2(sensors: Sensor[]): number {
  // const maxNumber = 4000000;
  const maxNumber = test ? 20 : 4000000;
  const area = new BeaconArea(sensors);
  console.log(area.minX, area.maxX, area.minY, area.maxY)
  // for (let populateX = area.minX; populateX <= area.maxX; populateX++) {
  //   for (let populateY = area.minY; populateY <= area.maxY; populateY++) {
  //     var foundOne = false;
  //     area.sensors.forEach((sensor) => {

  //       if (!foundOne)//&& sensor.y === 7) {
  //         if (sensor.checkPointWithinRange(new Coordinate(populateX, populateY))) {
  //           foundOne = true;
  //           const char = area.getAtWithOffset(populateX, populateY)
  //           if (char !== "B" && char !== 'S') {
  //             area.setAtWithOffset(populateX, populateY, "#");
  //           }
  //         }
  //     }
  //     );
  //   }
  // }
  // area.printGrid();
  for (let y = 0; y <= maxNumber; y++) {
    // console.log(`Y: ${y}`)
    for (let x = 0; x <= maxNumber;) {
      const sensors = area.sensors.filter((sensor) => {
        return sensor.checkPointWithinRange(new Coordinate(x, y));
      });
      // if (sensors.length > 1) {
      //   console.log(`x: ${x}, y: ${y}`)
      //   sensors.forEach(sensor => {
      //     console.log(`distance: ${sensor.getDistanceToCoordinate(new Coordinate(x, y))}`)
      //     sensor.print();
      //   })
      //   throw new Error('multiple sensors');
      // }
      const sensor = sensors[0];
      if (!sensor) {
        // console.log(`${x},${y}`);
        return getFrequency(x, y);
      }
      else {
        // console.log(`x: ${x}`)
        const oldX = x;
        const xes = sensors.map(sensor => sensor.getNextX(new Coordinate(x, y)));
        if (xes.length > 1) {
          // sensors.forEach(sensor => {
          //   console.log(`${x},${y}`);
          //   console.log(`distance: ${sensor.getDistanceToCoordinate(new Coordinate(x, y))}`)
          //   console.log(`nextX: ${sensor.getNextX(new Coordinate(x, y))}`)
          //   sensor.print();
          // })
        }
        x = Math.max(...xes);
        // console.log(`new distance from sensor: ${sensor.getDistanceToCoordinate(new Coordinate(x, y))}, distance: ${sensor.distanceToBeacon}`);
        // console.log(`old x: ${oldX}, next x: ${x},`)
      }
    }

    // for (let y = 0; y <= maxNumber; y++) {
    //   var foundOne = false;
    //   area.sensors.forEach((sensor) => {
    //     if (!foundOne) {
    //       if (sensor.checkPointWithinRange(new Coordinate(x, y))) {
    //         foundOne = true;
    //         numImpossible++;
    //       }
    //     }
    //   });
    // }
  }
  return -1;
}
