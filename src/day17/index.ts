import * as helpers from "../helpers";

const test = process.argv.slice(2)[0] === 'test';
const input = helpers.readInput("inputs/input16" + (test ? "test.txt" : ".txt"));


class Valve {
  public valves: Valve[];
  public open = false;
  public openedAtMinute = -1;
  public valveMap: Map<string, Valve[]> = new Map();
  constructor(public name: string, public flowRate: number, public valveNames: string[]) {
    this.valves = [];
  }
  populateValves(valves: Valve[]) {
    this.valves = valves.filter(valve => this.valveNames.find(name => name === valve.name))
    this.valves.forEach(valve => {
      this.valveMap.set(valve.name, [valve]);
    })
  }

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

function mapValves(valves: Valve[]): Map<string, ValveNode> {
  const valveMap: Map<string, ValveNode> = new Map();
  const startValve = valves.find(valve => valve.name === 'AA');

  const valveStack = new helpers.Stack<Valve>();
  valveStack.push(startValve!);

  while (valveStack.size()) {
    const currentValve = valveStack.pop()!;

  }


  return valveMap
}

interface ValveNode {
  valve: Valve, distance: number
}
/**
 *
 * @param input
 * @returns
 */
function aocD14Q1(valves: Valve[]): number {
  const startValve = valves.find(valve => valve.name === 'AA');
  const valveMap: Map<string, { valve: Valve, distance: number }> = new Map();








  return -1;
}

function aocD15Q2(valves: Valve[]): number {
  return -1;
}
