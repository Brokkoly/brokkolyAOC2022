import * as helpers from "../helpers";
import { Tree } from "../Tree";

const test = process.argv.slice(2)[0] === 'test';
const input = helpers.readInput("inputs/input16" + (test ? "test.txt" : ".txt"));


class Valve {
  public valves: Valve[];
  // public open = false;
  // public openedAtMinute = -1;
  // public unoptimizedPaths: Map<string, Valve[][]> = new Map();
  // public optimizedPaths: Map<string, Valve[]> = new Map();
  // public totalPressure: number;
  constructor(public name: string, public flowRate: number, public valveNames: string[]) {
    this.valves = [];
    // this.totalPressure = flowRate * 30
  }
  populateValves(valves: Valve[]) {
    this.valves = valves.filter(valve => this.valveNames.find(name => name === valve.name))
    // this.valves.forEach(valve => {
    //   this.optimizedPaths.set(valve.name, [valve]);
    //   this.unoptimizedPaths.set(valve.name, [[valve]]);
    // })
  }
  //

}
function valveFactory(input: string) {
  //Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  const split = input.split(' ');
  const name = split[1]
  // console.log(name);
  const flowRate = parseInt(split[4].split('=')[1]);
  // console.log(flowRate);
  const valveNamesTemp = input.split('valve')[1];
  var valveNames: string[]
  if (valveNamesTemp[0] !== 's') {
    valveNames = valveNamesTemp.slice(1).split(', ');
  }
  else {
    valveNames = valveNamesTemp.slice(2).split(', ');
  }
  // console.log(valveNames);
  return new Valve(name, flowRate, valveNames);
}

const valves1 = input.filter(line => {
  return !!line;
}).map(line => {
  return valveFactory(line);
})
valves1.forEach(valve => {
  valve.populateValves(valves1);
})
const valves2 = input.filter(line => {
  return !!line;
}).map(line => {
  return valveFactory(line);
})
valves2.forEach(valve => {
  valve.populateValves(valves2);
})

// console.log(valves);
// valves.forEach(valve => {
//   console.log(valve.valveNames);
//   console.log(valve.valves.map(valve => valve.name));
// })

console.log(`Output 1: ${aocD14Q1(valves1)}`);
console.log(`Output 2: ${aocD15Q2(valves2)}`);

function valveToValve(valve1: Valve, valve2: Valve) {
  const visited = [valve1.name];
  const valveStack = new helpers.Stack<Valve>();


}

function printDistanceMatrix(map: Map<string, Map<string, number>>) {

  const indices = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  console.log('   ' + indices.join('  '));
  indices.forEach(index => {
    var rowString = index.padEnd(3);
    map.get(index)?.forEach((num, key) => {
      rowString += num.toString().substring(0, 3).padEnd(4);
    })
    console.log(rowString);
  })

}




function mapValves(valves: Valve[]): Map<string, Map<string, number>> {

  const valveDistanceMatrix = new Map<string, Map<string, number>>();

  const valveNames = valves.map(valve => valve.name).sort((a, b) => {
    return (a).localeCompare(b);
  });

  valveNames.forEach(name => {
    valveDistanceMatrix.set(name, new Map<string, number>());
    valveNames.forEach(nameAgain => {
      valveDistanceMatrix.get(name)?.set(nameAgain, name === nameAgain ? 0 : Number.POSITIVE_INFINITY);
    });
  });

  valves.forEach(valve => {
    const row = valveDistanceMatrix.get(valve.name);
    valve.valves.forEach(innerValve => {
      // paths.push([valve, innerValve]);
      row?.set(innerValve.name, 1);
      valveDistanceMatrix.get(innerValve.name)?.set(valve.name, 1);
    });
  });

  printDistanceMatrix(valveDistanceMatrix);


  valveNames.forEach(vertex => {
    valveNames.forEach(startName => {
      valveNames.forEach(endName => {
        const distanceToStart = valveDistanceMatrix.get(vertex)?.get(startName)!;
        const distanceToEnd = valveDistanceMatrix.get(vertex)?.get(endName)!;
        const distance = distanceToStart + distanceToEnd;
        const current = valveDistanceMatrix.get(startName)?.get(endName)!;
        const newDistance = Math.min(current, distance);
        valveDistanceMatrix.get(startName)?.set(endName, newDistance);
        valveDistanceMatrix.get(endName)?.set(startName, newDistance);
      })
    })
  })
  printDistanceMatrix(valveDistanceMatrix);

  return valveDistanceMatrix;
}

interface ValveNode {
  valve: Valve, distance: number
}

function permutator(inputArr: any[]) {
  let result: any[] = [];

  const permute = (arr: any[], m: any[] = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result;
}

function calculatePressureReleased(startValve: Valve, input: Valve[], distanceMatrix: Map<string, Map<string, number>>): number {
  var totalPressure = 0;
  var totalFlow = 0;
  var currentTime = 1;
  var currentValve = startValve;
  for (let i = 0; i < input.length; i++) {
    const valve = input[i]
    if (currentTime >= 30) {
      return totalPressure;
    };



    const time = distanceMatrix.get(currentValve.name)?.get(valve.name)!

    var travelTime = 0;
    while (travelTime < time) {
      // console.log(`minute ${currentTime}`)
      // console.log(`Traveling to ${valve.name}, ${time - travelTime}min left`)
      totalPressure += totalFlow;
      // console.log(`Pressure released increases by ${totalFlow} to ${totalPressure}`)
      travelTime++;
      currentTime++;
      if (currentTime > 30) {
        return totalPressure;
      };
    }
    // console.log(`minute ${currentTime}`)
    totalPressure += totalFlow;
    // console.log(`Pressure released increases by ${totalFlow} to ${totalPressure}`)
    totalFlow += valve.flowRate
    // console.log(`Opening valve ${valve.name}, increasing flow by ${valve.flowRate}to ${totalFlow}`)
    currentTime++;

  }
  while (currentTime < 30) {
    // console.log(`minute ${currentTime}`)
    totalPressure += totalFlow;
    // console.log(`Pressure released increases by ${totalFlow} to ${totalPressure}`)
    currentTime++;
  }
  console.log({ totalPressure })
  return totalPressure
}

/**
 *
 * @param input
 * @returns
 */
function aocD14Q1(valves: Valve[]): number {
  var currentValve = valves.find(valve => valve.name === 'AA')!;

  const valveMatrix = mapValves(valves);
  const usefulValves = valves.filter(valve => valve.flowRate > 0);
  const openValves: string[] = [];

  usefulValves.forEach(valve => {
    const timeToOpen = valveMatrix.get(currentValve.name)?.get(valve.name)! + 1
    console.log(`Total steam for valve ${valve.name}: ${(30 - timeToOpen) * valve.flowRate}`);
  })

  const permutations = permutator(usefulValves);

  // console.log(permutations);
  var maxPressure = 0;

  permutations.forEach(perm => {
    const totalPressure = calculatePressureReleased(currentValve, perm, valveMatrix);
    maxPressure = Math.max(totalPressure, maxPressure);
  })
  // const totalPressure = calculatePressureReleased(currentValve, permutations[0], valveMatrix);
  // console.log(totalPressure);
  return maxPressure;










  return -1;
}

function aocD15Q2(valves: Valve[]): number {
  return -1;
}
