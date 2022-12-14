import * as helpers from "../helpers";

const input = helpers.readInput("inputs/input13test.txt");

type PacketContents = number | PacketContents[];

class Packet {
  public packetInfo: PacketContents[];
  constructor(line: string) {
    this.packetInfo = JSON.parse(line);
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
const packets: Packet[] = [];
for (let i = 0; i < input.length; i += 3) {
  const left = new Packet(input[i]);
  const right = new Packet(input[i + 1]);
  packetPairs.push([left, right]);
  packets.push(left, right);
}

// inputNodes.forEach(row => {
//   console.log(row.map(node => node.neighbors.length).join(''));
// })

console.log(`Output 1: ${aocD13Q1(packetPairs)}`);
console.log(`Output 2: ${aocD13Q2(packets)}`);
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
    } else if (result === undefined) {
      throw new Error(`Result: ${result}, index: ${pairIndex}`);
    }
    // console.log(`arr1: ${pair[0].packetInfo.toString()}`);
    // console.log(`arr1.length: ${pair[0].packetInfo.length}`);
    // console.log(`arr2: ${pair[1].packetInfo.toString()}`);
    // console.log(`arr2.length: ${pair[1].packetInfo.length}`);
  });
  return pairIndexSum;
}

function aocD13Q2(packets: Packet[]): number {
  packets.push(new Packet("[[2]]"));
  packets.push(new Packet("[[6]]"));
  packets.sort((left, right) => {
    const result = left.compareWithOtherPacket(right);
    if (result === undefined) {
      return 0;
    } else {
      return result ? -1 : 1;
    }
  });
  const firstIndex =
    packets.findIndex((packet) => {
      if (packet.packetInfo.length === 1) {
        const element = packet.packetInfo[0];
        if (Array.isArray(element)) {
          if (element.length === 1 && element[0] === 2) {
            return true;
          }
        }
      }
    }) + 1;
  const secondIndex =
    packets.findIndex((packet) => {
      if (packet.packetInfo.length === 1) {
        const element = packet.packetInfo[0];
        if (Array.isArray(element)) {
          if (element.length === 1 && element[0] === 6) {
            return true;
          }
        }
      }
    }) + 1;
  return firstIndex * secondIndex;
}
