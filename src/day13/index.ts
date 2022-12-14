import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input13.txt");

type PacketContents = number | PacketContents[];

class Packet {
  public packetInfo: PacketContents[];
  constructor(line: string) {
    this.packetInfo = this.parseLine(line);
  }

  private parseLine(line: string): PacketContents[] {
    const splitString = line.split("");
    const retArr: PacketContents[] = [];

    var currentlyProcessing: string[] = [];
    var arrStack = new helpers.Stack<PacketContents[]>();
    arrStack.push(retArr);
    var currentArr: PacketContents[] = retArr;
    for (let i = 1; i < splitString.length; i++) {
      // console.log(`processing ${splitString[i]}`);
      if (!Number.isNaN(parseInt(splitString[i]))) {
        currentlyProcessing.push(splitString[i]);
        // console.log({ currentlyProcessing });
      } else {
        // console.log({ currentlyProcessing });

        if (currentArr !== undefined && currentlyProcessing.length > 0) {
          currentArr.push(parseInt(currentlyProcessing.join("")));
          currentlyProcessing = [];
        }

        if (splitString[i] === "[") {
          const newArr: PacketContents[] = [];

          arrStack.push(newArr);
          if (currentArr !== undefined) {
            currentArr.push(newArr);
          }

          currentArr = newArr;
        } else if (splitString[i] === "]") {
          //array is done

          // if (arrStack.size() !== 1) {
          const top = arrStack.pop();
          // console.log(`top of stack: ${top}`);
          if (arrStack.peek()) {
            currentArr = arrStack.pop()!;
          } else {
            // console.log(`arrStack is undefined at index ${i}`);
          }
          // } else {
          //   // console.log(`done, top of stack: ${arrStack.peek()}`);
          // }
        }
      }
      // console.log(currentArr);
    }
    console.log({ retArr });
    return retArr;
  }

  public compareWithOtherPacket(otherPacket: Packet) {
    return Packet.comparePacketContents(
      this.packetInfo,
      otherPacket.packetInfo
    );
  }

  public static comparePacketContents(
    left: PacketContents,
    right: PacketContents
  ): boolean | undefined {
    const leftIsArray = Array.isArray(left);
    const rightIsArray = Array.isArray(right);

    console.log("Compare:");
    console.log({ left, right });

    if (!leftIsArray && !rightIsArray) {
      if (left < right) {
        return true;
      } else if (left > right) {
        console.log(
          `Right side is smaller, so inputs are not in the right order`
        );
        return false;
      }
      return undefined;
    } else if (leftIsArray && rightIsArray) {
      const leftLength = left.length;
      const rightLength = right.length;
      let resultBool: boolean;
      for (let i = 0; i < Math.min(leftLength, rightLength); i++) {
        const result = Packet.comparePacketContents(left[i], right[i]);
        if (result !== undefined) {
          return result;
        }
      }
      if (rightLength < leftLength) {
        console.log(
          `Right side ran out of items, so inputs are not in the right order rightLength: ${rightLength} leftLength: ${leftLength}}`
        );
        return false;
      }
      if (leftLength < rightLength) {
        console.log(
          `Left side ran out of items, so inputs are in the right order`
        );
        return true;
      }
      return undefined;
    } else {
      const leftArr = leftIsArray ? left : [left];
      const rightArr = rightIsArray ? right : [right];
      return Packet.comparePacketContents(leftArr, rightArr);
    }
  }
}

const packetPairs: Packet[][] = [];
for (let i = 0; i < input.length; i += 3) {
  packetPairs.push([new Packet(input[i]), new Packet(input[i + 1])]);
}

// inputNodes.forEach(row => {
//   console.log(row.map(node => node.neighbors.length).join(''));
// })

console.log(`Output 1: ${aocD13Q1(packetPairs)}`);
console.log(`Output 2: ${aocD13Q2(packetPairs)}`);
console.log(`NumPairs: ${packetPairs.length}`);
/**
 *
 * @param input
 * @returns
 */
function aocD13Q1(packetPairs: Packet[][]): number {
  console.log(packetPairs);
  var pairIndexSum = 0;
  packetPairs.forEach((pair, pairIndex) => {
    const result = pair[0].compareWithOtherPacket(pair[1]);
    console.log(`Result: ${result}, index: ${pairIndex}`);
    if (result) {
      pairIndexSum += pairIndex + 1;
    }
    else if(result===undefined){
      throw new Error(`Result: ${result}, index: ${pairIndex}`)
    }
    // console.log(`arr1: ${pair[0].packetInfo.toString()}`);
    // console.log(`arr1.length: ${pair[0].packetInfo.length}`);
    // console.log(`arr2: ${pair[1].packetInfo.toString()}`);
    // console.log(`arr2.length: ${pair[1].packetInfo.length}`);
  });
  return pairIndexSum;
}

function aocD13Q2(packetPairs: Packet[][]): number {
  return -1;
}
