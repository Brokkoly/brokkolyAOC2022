import { Motion } from ".";
import { Coordinate } from "./Coordinate";
import { Vector } from "./Vector";

export class Rope {
    constructor(initialHead: Coordinate, initialTail?: Coordinate) {
      this.ropeVector = new Vector(
        initialTail ? initialTail : Coordinate.fromCoordinate(initialHead),
        initialHead
      );
      this.tailHistory = [(initialTail ? initialTail : initialHead).copy()];
      this.headHistory = [initialHead.copy()];
    }
    public ropeVector: Vector;
  
    public move(motion: Motion) {
      //loop motion.distance times
      for (let i = 0; i < motion.distance; i++) {
        const previousHead = this.ropeVector.head.copy();
        // console.log({ headBeforeMove: this.ropeVector.head });
        this.ropeVector.head.move(motion.direction);
        this.headHistory.push(this.ropeVector.head.copy());
        // console.log({ headAfterMove: this.ropeVector.head });
        // console.log({ tailBeforeUpdate: this.ropeVector.tail });
        // console.log({ length: this.ropeVector.length });
        this.updateTail(previousHead);
        // console.log({ vectorAfterUpdate: this.ropeVector });
        // console.log({ length: this.ropeVector.length });
      }
    }
  
    public tailHistory: Coordinate[];
    public headHistory: Coordinate[];
  
    private updateTail(previousHead: Coordinate) {
      const length = this.ropeVector.length;
      if (length > Math.SQRT2) {
        this.ropeVector.tail = Coordinate.fromCoordinate(previousHead);
      }
      this.tailHistory.push(this.ropeVector.tail);
    }
  
    public headArray(): string[][] {
      const maxX = Math.max(...this.headHistory.map((coord) => coord.x));
      const minX = Math.min(...this.headHistory.map((coord) => coord.x));
      const maxY = Math.max(...this.headHistory.map((coord) => coord.y));
      const minY = Math.min(...this.headHistory.map((coord) => coord.y));
      const xOffset = minX < 0 ? minX * -1 : 0;
      // console.log({ xOffset });
      const yOffset = minY < 0 ? minY * -1 : 0;
      // console.log({ yOffset });
      var retMap = new Array<string[]>(maxY + 1 + yOffset);
      retMap.fill([]);
      retMap.forEach((xArr, index) => {
        retMap[index] = new Array(maxX + 1 + xOffset).fill(".");
      });
      this.headHistory.forEach((coord) => {
        // console.log(coord);
        retMap[coord.y + yOffset][coord.x + xOffset] = "#";
      });
  
      // retMap[yOffset][xOffset] = "S";
  
      return retMap.reverse();
    }
    public tailArray(): string[][] {
      const maxX = Math.max(...this.headHistory.map((coord) => coord.x));
      const minX = Math.min(...this.headHistory.map((coord) => coord.x));
      const maxY = Math.max(...this.headHistory.map((coord) => coord.y));
      const minY = Math.min(...this.headHistory.map((coord) => coord.y));
      const xOffset = minX < 0 ? minX * -1 : 0;
      // console.log({ xOffset });
      const yOffset = minY < 0 ? minY * -1 : 0;
      // console.log({ yOffset });
      var retMap = new Array<string[]>(maxY + 1 + yOffset);
      retMap.fill([]);
      retMap.forEach((xArr, index) => {
        retMap[index] = new Array(maxX + 1 + xOffset).fill(".");
      });
      this.tailHistory.forEach((coord) => {
        // console.log(coord);
        retMap[coord.y + yOffset][coord.x + xOffset] = "#";
      });
      // retMap[yOffset][xOffset] = "S";
  
      return retMap.reverse();
    }
  
    public printPath() {
      const tailArray = this.tailArray();
  
      console.log("\n\nTail:");
      tailArray.forEach((row) => {
        console.log(row.join(""));
      });
  
      const headArray = this.headArray();
      console.log("\n\nHead:");
      headArray.forEach((row) => {
        console.log(row.join(""));
      });
    }
  
    public printHistory() {
      const maxX = Math.max(...this.headHistory.map((coord) => coord.x));
      const minX = Math.min(...this.headHistory.map((coord) => coord.x));
      const maxY = Math.max(...this.headHistory.map((coord) => coord.y));
      const minY = Math.min(...this.headHistory.map((coord) => coord.y));
      const xOffset = minX < 0 ? minX * -1 : 0;
      const yOffset = minY < 0 ? minY * -1 : 0;
  
      this.headHistory.forEach((coord, index) => {
        var retMap = new Array<string[]>(maxY + 1 + yOffset);
        retMap.fill([]);
        retMap.forEach((xArr, index) => {
          retMap[index] = new Array(maxX + 1 + xOffset).fill(".");
        });
        retMap[yOffset][xOffset] = "s";
  
        const tailCoord = this.tailHistory[index];
        retMap[tailCoord.y + yOffset][tailCoord.x + xOffset] = 'T';
        retMap[coord.y + yOffset][coord.x + xOffset] = 'H';
  
        retMap.reverse().forEach(row => {
          console.log(row.join(''));
        });
        console.log(' ');
      });
  
    }
  }