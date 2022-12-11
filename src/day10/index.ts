import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input10.txt");

type Commands = "noop" | "addx"

abstract class Command {
  public abstract get cycles(): number;
  public abstract get operation(): Commands;
  public abstract cyclesRemaining: number;
  constructor() {
  }
  public passCycle() {
    this.cyclesRemaining--;
  }
  public get ready() {
    return this.cyclesRemaining === 0;
  }
} class NoopCommand extends Command {

  public cyclesRemaining: number = this.cycles;
  constructor() {
    super();
  }

  public get cycles(): number {
    return 1;
  }
  public get operation(): Commands {
    return 'noop';
  }


}
class AddXCommand extends Command {

  public cyclesRemaining: number = this.cycles;
  constructor(public argument: number) {
    super();
  }
  public get cycles(): number {
    return 2;
  }
  public get operation(): Commands {
    return "addx"
  };
}

function commandFactory(input: string): Command {
  const split = input.split(' ');
  if (split[0] === "noop") {
    return new NoopCommand();
  } else if (split[0] === 'addx') {
    return new AddXCommand(parseInt(split[1]));
  }
  throw new Error(`invalid input ${input}`);
}


const inputCommands: Command[] = [];

input.forEach(row => {
  if (!row) {
    return;
  }
  inputCommands.push(commandFactory(row));
})

class Executor {
  public X: number = 1;
  private _currentCommandIndex = 0;
  private _cycle = 1;
  private _screenArray: string[] = Array.from({ length: 6 * 40 }, e => '.');

  constructor(public commands: Command[]) {

  }
  public advanceCycle(printCycles?: number[], printAll?: boolean): number | undefined {
    if (this.done) {
      return;
    }
    var signalStrength = 0;
    if (printCycles?.find(num => num === this.cycle) || printAll) {
      console.log(`Cycle: ${this.cycle}, X: ${this.X}, Signal Strength: ${this.X * this.cycle}`)
      signalStrength = this.cycle * this.X;
    }
    this.draw();

    this.currentCommand.passCycle();
    if (this.currentCommand.ready) {
      if (this.currentCommand instanceof AddXCommand) {
        this.X += this.currentCommand.argument;
      }
      this._currentCommandIndex++;
    }
    this._cycle++;
    return signalStrength;
  }

  private draw() {
    const pixelsDrawn = [this.X - 1, this.X, this.X + 1];
    console.log(pixelsDrawn, (this.cycle - 1) % 40, pixelsDrawn.find(num => num === (this.cycle - 1) % 40))
    const index = pixelsDrawn.find(num => num === (this.cycle - 1) % 40)
    if (index !== undefined) {
      this._screenArray[this.cycle - 1] = '#';
    }

  }

  public printScreen() {
    for (let i = 0; i < this._screenArray.length; i += 40)
      console.log(this._screenArray.slice(i, i + 40).join(''));
  }

  public get cycle() {
    return this._cycle;
  }
  public get currentCommandIndex() {
    return this._currentCommandIndex;
  }
  public get currentCommand(): Command {
    return this.commands[this.currentCommandIndex];
  }
  public get done(): boolean {
    return this.currentCommandIndex >= this.commands.length;
  }
}

const output1 = aocD10Q1(inputCommands);
const output2 = aocD10Q2(inputCommands);
console.log(`Output 1: ${output1}`);
console.log(`Output 2: ${output2}`);

/**
 *
 * @param input
 * @returns
 */
function aocD10Q1(commands: Command[]): number {
  const executor = new Executor(commands);
  const strengths: number[] = [];
  while (!executor.done) {
    const result = executor.advanceCycle([20, 60, 100, 140, 180, 220]);
    // const result = executor.advanceCycle([], true);
    if (result) {
      strengths.push(result);
    }
  }
  var strengthSum = 0;
  strengths.forEach(strength => strengthSum += strength);
  console.log(strengths);
  executor.printScreen();
  return strengthSum;
}

function aocD10Q2(comands: Command[]): number {
  return -1;
}
