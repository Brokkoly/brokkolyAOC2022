import * as helpers from "../helpers";
import { Queue } from "../Queue";

const input = helpers.readInput("inputs/input11.txt");

class Operation {
  private useOldNumber: boolean = false;
  private operatorNumber?: number;
  constructor(public operator: string, num: string) {
    if (operator !== "*" && operator !== "+") {
      throw new Error(`Invalid operator input: ${operator}`);
    }
    if (num === "old") {
      this.useOldNumber = true;
    } else {
      this.operatorNumber = parseInt(num);
    }
  }
  public perform(input: number) {
    var numberToUse = this.useOldNumber ? input : this.operatorNumber!;
    if (this.operator === "*") {
      return input * numberToUse;
    } else {
      return input + numberToUse;
    }
  }
  public performModulo(input: Item) {
    var numberToUse = this.useOldNumber ? undefined : this.operatorNumber!;
    if (this.operator === "*") {
      input.multiply(numberToUse);
    } else {
      input.add(numberToUse);
    }
  }
  public get num(): string {
    return this.useOldNumber ? "itself" : this.operatorNumber!.toString();
  }
}

class Item {
  public modulos: ModuloItem[] = [];
  public modNumberToValue: Map<number, number> = new Map<number, number>();
  constructor(initialValue: number, modNumbers: number[]) {
    modNumbers.forEach((modNumber) => {
      this.modNumberToValue.set(modNumber, initialValue % modNumber);
    });
  }
  public add(input?: number) {
    const useSelf = input === undefined;
    this.modNumberToValue.forEach((value, modNumber) => {
      const toAdd = useSelf ? value : input;
      const result = (value + toAdd) % modNumber;
      this.modNumberToValue.set(modNumber, result);
    });
  }
  public multiply(input?: number) {
    const useSelf = input === undefined;
    this.modNumberToValue.forEach((value, modNumber) => {
      const toMult = useSelf ? value : input;
      const result = (value * toMult) % modNumber;
      this.modNumberToValue.set(modNumber, result);
    });
  }
  public divisibleBy(input: number) {
    const value = this.modNumberToValue.get(input);
    if (value === undefined) {
      throw new Error(`Did not have a value for modulus number: ${input}`);
    }
    if (value === 0) {
      return true;
    }
    return false;
  }
}

class ModuloItem {
  constructor(public currentNumber: number, public moduloNumber: number) {}
  public add(input: number) {
    this.currentNumber += input;
    this.currentNumber = this.currentNumber % this.moduloNumber;
  }
  public multiply(input: number) {
    this.currentNumber *= input;
    this.currentNumber = this.currentNumber % this.moduloNumber;
  }
}

class Monkey {
  private items: Queue<number>;
  public moduloItems: Queue<Item>;
  public monkeyNumber: number;
  public testNumber: number;
  public operation: Operation;
  public trueMonkey?: Monkey;
  public falseMonkey?: Monkey;
  public trueMonkeyNumber: number;
  public falseMonkeyNumber: number;
  public numInspections = 0;
  public numInspectionsPart2 = 0;
  constructor(input: string[]) {
    console.log(input);
    this.monkeyNumber = parseInt(input[0].split(" ")[1]);
    this.items = new Queue<number>();
    const items = input[1]
      .split(": ")[1]
      .split(",")
      .map((item) => parseInt(item));
    items.forEach((item) => this.items.enqueue(item));
    this.moduloItems = new Queue<Item>();
    const operatorSplit = input[2].split("old ")[1].split(" ");
    this.operation = new Operation(operatorSplit[0], operatorSplit[1]);
    this.testNumber = parseInt(input[3].split("by")[1]);
    this.trueMonkeyNumber = parseInt(input[4].split("monkey ")[1]);
    this.falseMonkeyNumber = parseInt(input[5].split("monkey ")[1]);
  }

  public initializeMonkey(monkies: Monkey[]) {
    const moduloNumbers = monkies.map((monkey) => monkey.testNumber);
    this.items.toArray().forEach((element) => {
      this.moduloItems.enqueue(new Item(element, moduloNumbers));
    });
    this.trueMonkey = monkies.find(
      (monkey) => monkey.monkeyNumber === this.trueMonkeyNumber
    );
    this.falseMonkey = monkies.find(
      (monkey) => monkey.monkeyNumber === this.falseMonkeyNumber
    );
  }

  public takeTurn(worry: boolean = true) {
    console.log(`Monkey ${this.monkeyNumber}:`);
    while (this.items.size()) {
      this.numInspections++;
      var item = this.items.dequeue()!;
      console.log(` Monkey inspects an item with a worry level of ${item}.`);
      item = this.operation.perform(item);
      if (this.operation.operator === "*") {
        console.log(
          `   Worry level is multiplied by ${this.operation.num} to ${item}.`
        );
      } else {
        console.log(
          `   Worry level increases by ${this.operation.num} to ${item}.`
        );
      }
      if (worry) {
        item = Math.floor(item / 3);
        console.log(
          `   Monkey gets bored with item. Worry level is divided by 3 to ${item}`
        );
      }

      //todo: figure out how to keep worry from hitting infinity
      if (item % this.testNumber === 0) {
        console.log(
          `   Current worry level is divisible by ${this.testNumber}.`
        );
        console.log(
          `   Item with worry level ${item} is thrown to monkey ${this.trueMonkey?.monkeyNumber}.`
        );
        this.trueMonkey?.items.enqueue(item);
      } else {
        console.log(
          `   Current worry level is not divisible by ${this.testNumber}.`
        );
        console.log(
          `   Item with worry level ${item} is thrown to monkey ${this.falseMonkey?.monkeyNumber}.`
        );
        this.falseMonkey?.items.enqueue(item);
      }
    }
  }
  public takeTurnModulus() {
    // console.log(`Monkey ${this.monkeyNumber}:`);
    while (this.moduloItems.size()) {
      this.numInspectionsPart2++;
      var item = this.moduloItems.dequeue()!;
      // console.log(` Monkey inspects an item with a worry level of ${item}.`);
      this.operation.performModulo(item);
      // if (this.operation.operator === "*") {
      //   console.log(
      //     `   Worry level is multiplied by ${this.operation.num} to ${item}.`
      //   );
      // } else {
      //   console.log(
      //     `   Worry level increases by ${this.operation.num} to ${item}.`
      //   );
      // }

      //todo: figure out how to keep worry from hitting infinity
      if (item.divisibleBy(this.testNumber)) {
        // console.log(
        //   `   Current worry level is divisible by ${this.testNumber}.`
        // );
        // console.log(
        //   `   Item with worry level ${item} is thrown to monkey ${this.trueMonkey?.monkeyNumber}.`
        // );
        this.trueMonkey?.moduloItems.enqueue(item);
      } else {
        // console.log(
        //   `   Current worry level is not divisible by ${this.testNumber}.`
        // );
        // console.log(
        //   `   Item with worry level ${item} is thrown to monkey ${this.falseMonkey?.monkeyNumber}.`
        // );
        this.falseMonkey?.moduloItems.enqueue(item);
      }
    }
  }
}
const inputMonkeyGroups: string[][] = [];
for (let i = 0; i < input.length; i += 7) {
  inputMonkeyGroups.push(input.slice(i, i + 6));
}

const inputMonkeys = inputMonkeyGroups.map((group) => {
  return new Monkey(group);
});
//console.log(inputMonkeys)
inputMonkeys.forEach((monkey) => monkey.initializeMonkey(inputMonkeys));
// console.log(inputMonkeys)

const output1 = aocD11Q1(inputMonkeys);
const output2 = aocD11Q2(inputMonkeys);
console.log(`Output 1: ${output1}`);
console.log(`Output 2: ${output2}`);

/**
 *
 * @param input
 * @returns
 */
function aocD11Q1(monkies: Monkey[]): number {
  for (let i = 0; i < 20; i++) {
    monkies.forEach((monkey) => monkey.takeTurn());
  }
  const monkeyActivity = monkies.map((monkey) => monkey.numInspections);
  var highest: number = 0;
  var secondHighest: number = 0;
  monkeyActivity.forEach((num) => {
    if (num > highest) {
      secondHighest = highest;
      highest = num;
    } else if (num > secondHighest) {
      secondHighest = num;
    }
  });
  return highest * secondHighest;
}

function aocD11Q2(monkies: Monkey[]): number {
  for (let i = 0; i < 10000; i++) {
    monkies.forEach((monkey) => monkey.takeTurnModulus());
  }
  const monkeyActivity = monkies.map((monkey) => monkey.numInspectionsPart2);
  var highest: number = 0;
  var secondHighest: number = 0;
  monkeyActivity.forEach((num) => {
    if (num > highest) {
      secondHighest = highest;
      highest = num;
    } else if (num > secondHighest) {
      secondHighest = num;
    }
  });
  return highest * secondHighest;
}
