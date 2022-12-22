import * as helpers from "../helpers";

const test = process.argv.slice(2)[0] === "test";
const input = helpers.readInput(
  "inputs/input16" + (test ? "test.txt" : ".txt")
);

class Valve {
  public valves: Valve[];
  // public open = false;
  // public openedAtMinute = -1;
  // public unoptimizedPaths: Map<string, Valve[][]> = new Map();
  // public optimizedPaths: Map<string, Valve[]> = new Map();
  // public totalPressure: number;
  constructor(
    public name: string,
    public flowRate: number,
    public valveNames: string[]
  ) {
    this.valves = [];
    // this.totalPressure = flowRate * 30
  }
  populateValves(valves: Valve[]) {
    this.valves = valves.filter((valve) =>
      this.valveNames.find((name) => name === valve.name)
    );
    // this.valves.forEach(valve => {
    //   this.optimizedPaths.set(valve.name, [valve]);
    //   this.unoptimizedPaths.set(valve.name, [[valve]]);
    // })
  }
  //
}
function valveFactory(input: string) {
  //Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  const split = input.split(" ");
  const name = split[1];
  // console.log(name);
  const flowRate = parseInt(split[4].split("=")[1]);
  // console.log(flowRate);
  const valveNamesTemp = input.split("valve")[1];
  var valveNames: string[];
  if (valveNamesTemp[0] !== "s") {
    valveNames = valveNamesTemp.slice(1).split(", ");
  } else {
    valveNames = valveNamesTemp.slice(2).split(", ");
  }
  // console.log(valveNames);
  return new Valve(name, flowRate, valveNames);
}

const valves1 = input
  .filter((line) => {
    return !!line;
  })
  .map((line) => {
    return valveFactory(line);
  });
valves1.forEach((valve) => {
  valve.populateValves(valves1);
});
const valves2 = input
  .filter((line) => {
    return !!line;
  })
  .map((line) => {
    return valveFactory(line);
  });
valves2.forEach((valve) => {
  valve.populateValves(valves2);
});

// console.log(valves);
// valves.forEach(valve => {
//   console.log(valve.valveNames);
//   console.log(valve.valves.map(valve => valve.name));
// })

function valveToValve(valve1: Valve, valve2: Valve) {
  const visited = [valve1.name];
  const valveStack = new helpers.Stack<Valve>();
}

function printDistanceMatrix(map: Map<string, Map<string, number>>) {
  const indices = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  console.log("   " + indices.join("  "));
  indices.forEach((index) => {
    var rowString = index.padEnd(3);
    map.get(index)?.forEach((num, key) => {
      rowString += num.toString().substring(0, 3).padEnd(4);
    });
    console.log(rowString);
  });
}

class Calculator {
  public currentTime = 1;
  public flowRate = 0;
  public openValves: string[] = [];
  public timeTillNextValve = 100;
  public nextValveIndex: number = 1;
  public currentValve: Valve;
  public nextValve: Valve;
  public totalPressure = 0;
  constructor(
    public path: Valve[],
    public distanceMatrix: Map<string, Map<string, number>>
  ) {
    this.currentValve = path[0];
    this.nextValve = path[1];
    this.timeTillNextValve = distanceMatrix
      .get(this.currentValve.name)
      ?.get(this.nextValve.name)!;
  }

  public advance() {
    // console.log(`== Minute ${this.currentTime} ==`);
    // console.log(`Valves ${this.openValves.join(' and ')} are open, releasing ${this.flowRate} pressure`);
    this.totalPressure += this.flowRate;
    if (this.nextValveIndex < this.path.length) {
      if (this.timeTillNextValve === 0) {
        // console.log(`You open valve ${this.currentValve.name}`)
        this.flowRate += this.nextValve.flowRate;
        this.openValves.push(this.currentValve.name);
        this.currentValve = this.nextValve;
        this.nextValve = this.path[++this.nextValveIndex];
        if (this.nextValve) {
          this.timeTillNextValve = this.distanceMatrix
            .get(this.currentValve.name)
            ?.get(this.nextValve.name)!;
        }
      } else {
        this.timeTillNextValve--;
        // console.log(`You move. ${this.timeTillNextValve} left`)
      }
    }
    this.currentTime++;
  }
}

function mapValves(valves: Valve[]): Map<string, Map<string, number>> {
  const valveDistanceMatrix = new Map<string, Map<string, number>>();

  const valveNames = valves
    .map((valve) => valve.name)
    .sort((a, b) => {
      return a.localeCompare(b);
    });

  valveNames.forEach((name) => {
    valveDistanceMatrix.set(name, new Map<string, number>());
    valveNames.forEach((nameAgain) => {
      valveDistanceMatrix
        .get(name)
        ?.set(nameAgain, name === nameAgain ? 0 : Number.POSITIVE_INFINITY);
    });
  });

  valves.forEach((valve) => {
    const row = valveDistanceMatrix.get(valve.name);
    valve.valves.forEach((innerValve) => {
      // paths.push([valve, innerValve]);
      row?.set(innerValve.name, 1);
      valveDistanceMatrix.get(innerValve.name)?.set(valve.name, 1);
    });
  });

  // printDistanceMatrix(valveDistanceMatrix);

  valveNames.forEach((vertex) => {
    valveNames.forEach((startName) => {
      valveNames.forEach((endName) => {
        const distanceToStart = valveDistanceMatrix
          .get(vertex)
          ?.get(startName)!;
        const distanceToEnd = valveDistanceMatrix.get(vertex)?.get(endName)!;
        const distance = distanceToStart + distanceToEnd;
        const current = valveDistanceMatrix.get(startName)?.get(endName)!;
        const newDistance = Math.min(current, distance);
        valveDistanceMatrix.get(startName)?.set(endName, newDistance);
        valveDistanceMatrix.get(endName)?.set(startName, newDistance);
      });
    });
  });
  // printDistanceMatrix(valveDistanceMatrix);

  console.log("Done with distance matrix");

  return valveDistanceMatrix;
}

interface ValveNode {
  valve: Valve;
  distance: number;
}

function permutator(inputArr: any[]) {
  let result: any[] = [];

  const permute = (arr: any[], m: any[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
}

/**
 *
 * @param input
 * @returns
 */
function aocD14Q1(valves: Valve[]): number {
  var currentValve = valves.find((valve) => valve.name === "AA")!;

  const valveMatrix = mapValves(valves);
  const usefulValves = valves.filter((valve) => valve.flowRate > 0);

  const permutations = permutator(
    usefulValves.map((valve) => valve.name)
  ) as string[][];

  // console.log(permutations);
  console.log("done with permutation");

  var maxPressure = 0;

  // permutations.forEach(perm => {
  //   const totalPressure = calculatePressureReleased(currentValve, perm, valveMatrix);
  //   maxPressure = Math.max(totalPressure, maxPressure);
  // })
  // const testArr: Valve[] = []
  // testArr.push(valves.find(valve => valve.name === 'AA')!);
  // testArr.push(usefulValves.find(valve => valve.name === 'DD')!);
  // testArr.push(usefulValves.find(valve => valve.name === 'BB')!);
  // testArr.push(usefulValves.find(valve => valve.name === 'JJ')!);
  // testArr.push(usefulValves.find(valve => valve.name === 'HH')!);
  // testArr.push(usefulValves.find(valve => valve.name === 'EE')!);
  // testArr.push(usefulValves.find(valve => valve.name === 'CC')!);

  permutations.forEach((perm) => {
    perm.unshift(currentValve.name);
    const calculator = new Calculator(
      perm.map(
        (valveName) => valves.find((valve) => valve.name === valveName)!
      ),
      valveMatrix
    );
    while (calculator.currentTime <= 30) {
      calculator.advance();
    }
    const newPressure = calculator.totalPressure;
    maxPressure = Math.max(maxPressure, calculator.totalPressure);

    // const totalPressure = calculatePressureReleased(currentValve, testArr, valveMatrix);
  });

  return maxPressure;

  return -1;
}

function aocD15Q2(valves: Valve[]): number {
  return -1;
}

console.log(`Output 1: ${aocD14Q1(valves1)}`);
console.log(`Output 2: ${aocD15Q2(valves2)}`);
