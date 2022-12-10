import { Motion } from ".";
import { Coordinate } from "./Coordinate";
import { Vector } from "./Vector";

export class Rope {
    public knots: Coordinate[];
    public history: Coordinate[][];
    public newDirectionHistory: { index: number, direction: Motion }[] = [];
    constructor(initialHead: Coordinate, numKnots = 2) {
        this.knots = Array.from({ length: numKnots }, e => initialHead.copy())

        // this.ropeVector = new Vector(
        //     initialHead.copy,
        //     initialHead
        // );
        this.history = this.knots.map(knot => {
            return [knot.copy()];
        })
    }
    //public ropeVector: Vector;

    public move(motion: Motion) {
        //loop motion.distance times
        this.newDirectionHistory.push({ index: this.history[0].length - 1, direction: motion });
        for (let i = 0; i < motion.distance; i++) {
            const previousHead = this.knots[0].copy();
            // console.log({ headBeforeMove: this.knots[0] });
            this.knots[0].move(motion.direction);
            this.history[0].push(this.knots[0].copy());
            // console.log({ headAfterMove: this.knots[0] });
            // console.log({ tailBeforeUpdate: this.ropeVector.tail });
            // console.log({ length: this.ropeVector.length });
            //this.updateTail(previousHead);
            // console.log({ vectorAfterUpdate: this.ropeVector });
            // console.log({ length: this.ropeVector.length });

            this.updateAllBehind(previousHead);
        }
    }

    private updateAllBehind(previousHead: Coordinate) {
        //position of knot ahead
        var nextPos = previousHead;
        for (let index = 1; index < this.knots.length; index++) {
            //current position
            const tempCoord = this.knots[index].copy();
            const vector = new Vector(tempCoord.copy(), this.knots[index - 1].copy());
            if (vector.length > Math.SQRT2) {
                //if >2, must move diagonally
                // const xDir = vector.xDir;
                // if (vector.length > 2) {
                //     if (vector.slope * xDir > 0) {
                //         this.knots[index].move('U');
                //     }
                //     else if (vector.slope * xDir < 0) {
                //         this.knots[index].move('D');
                //     }

                // }
                // else {
                //     if (vector.xDir > 0) {
                //         this.knots[index].move('R')
                //     }
                //     else {
                //         this.knots[index].move('L')
                //     }
                // }
                if (vector.xDir > 0) {
                    this.knots[index].move('R')
                }
                else if (vector.xDir < 0) {
                    this.knots[index].move('L')
                }
                if (vector.yDir > 0) {
                    this.knots[index].move('U')
                }
                else if (vector.yDir < 0) {
                    this.knots[index].move('D')
                }

            }
            nextPos = tempCoord;
            this.history[index].push(this.knots[index].copy());
        }
    }

    // private updateTail(previousHead: Coordinate) {
    //     const length = this.ropeVector.length;
    //     if (length > Math.SQRT2) {
    //         this.ropeVector.tail = Coordinate.fromCoordinate(previousHead);
    //     }
    //     this.history[this.history.length - 1].push(this.ropeVector.tail);
    // }

    public headArray(): string[][] {
        const maxX = Math.max(...this.history[0].map((coord) => coord.x));
        const minX = Math.min(...this.history[0].map((coord) => coord.x));
        const maxY = Math.max(...this.history[0].map((coord) => coord.y));
        const minY = Math.min(...this.history[0].map((coord) => coord.y));
        const xOffset = minX < 0 ? minX * -1 : 0;
        // console.log({ xOffset });
        const yOffset = minY < 0 ? minY * -1 : 0;
        // console.log({ yOffset });
        var retMap = Array.from({ length: maxY + 1 + yOffset }, e => Array(maxX + 1 + xOffset).fill("."));
        this.history[0].forEach((coord) => {
            console.log(coord);
            retMap[coord.y + yOffset][coord.x + xOffset] = "#";
        });

        // retMap[yOffset][xOffset] = "S";

        return retMap.reverse();
    }
    public tailArray(): string[][] {
        const maxX = Math.max(...this.history[0].map((coord) => coord.x));
        const minX = Math.min(...this.history[0].map((coord) => coord.x));
        const maxY = Math.max(...this.history[0].map((coord) => coord.y));
        const minY = Math.min(...this.history[0].map((coord) => coord.y));
        const xOffset = minX < 0 ? minX * -1 : 0;
        const yOffset = minY < 0 ? minY * -1 : 0;
        var retMap = Array.from({ length: maxY + 1 + yOffset }, e => Array(maxX + 1 + xOffset).fill("."));
        this.history[this.history.length - 1].forEach((coord) => {
            // console.log({ coord, xOffset, yOffset, maxX, maxY });
            // console.log(retMap);
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
        const maxX = Math.max(...this.history[0].map((coord) => coord.x));
        const minX = Math.min(...this.history[0].map((coord) => coord.x));
        const maxY = Math.max(...this.history[0].map((coord) => coord.y));
        const minY = Math.min(...this.history[0].map((coord) => coord.y));
        const xOffset = minX < 0 ? minX * -1 : 0;
        const yOffset = minY < 0 ? minY * -1 : 0;

        this.history[0].forEach((coord, index) => {
            var retMap = Array.from({ length: maxY + 1 + yOffset }, e => Array(maxX + 1 + xOffset).fill("."));
            retMap[yOffset][xOffset] = "s";

            for (let knotIndex = this.history.length - 1; knotIndex >= 0; knotIndex--) {
                // console.log({ knotIndex, index });
                const eachCoord = this.history[knotIndex][index];
                // console.log(eachCoord);
                retMap[eachCoord.y + yOffset][eachCoord.x + xOffset] = (knotIndex === 0 ? 'H' : knotIndex).toString();
            }

            retMap.reverse().forEach(row => {
                console.log(row.join(''));
            });
            console.log(' ');
        });

    }
    public printPathBeforeDirection() {
        const maxX = Math.max(...this.history[0].map((coord) => coord.x));
        const minX = Math.min(...this.history[0].map((coord) => coord.x));
        const maxY = Math.max(...this.history[0].map((coord) => coord.y));
        const minY = Math.min(...this.history[0].map((coord) => coord.y));
        const xOffset = minX < 0 ? minX * -1 : 0;
        const yOffset = minY < 0 ? minY * -1 : 0;
        this.newDirectionHistory.forEach(newDirection => {
            this.printRopeAtHistoryIndex(newDirection.index);
            console.log(' ');
            console.log(`== ${newDirection.direction.direction} ${newDirection.direction.distance} ==`);
            console.log(' ');
        });
        var retMap = Array.from({ length: maxY + 1 + yOffset }, e => Array(maxX + 1 + xOffset).fill("."));
        retMap[yOffset][xOffset] = "s";

        for (let knotIndex = this.history.length - 1; knotIndex >= 0; knotIndex--) {
            // console.log({ knotIndex, index });
            const eachCoord = this.history[knotIndex][this.history[0].length - 1];
            // console.log(eachCoord);
            retMap[eachCoord.y + yOffset][eachCoord.x + xOffset] = (knotIndex === 0 ? 'H' : knotIndex).toString();
        }

        retMap.reverse().forEach(row => {
            console.log(row.join(''));
        });
        //print current too
    }
    printRopeAtHistoryIndex(index: number, maxX?: number, maxY?: number, minX?: number, minY?: number, xOffset?: number, yOffset?: number) {
        maxX = maxX ?? Math.max(...this.history[0].map((coord) => coord.x));
        minX = minX ?? Math.min(...this.history[0].map((coord) => coord.x));
        maxY = maxY ?? Math.max(...this.history[0].map((coord) => coord.y));
        minY = minY ?? Math.min(...this.history[0].map((coord) => coord.y));
        xOffset = xOffset ?? minX < 0 ? minX * -1 : 0;
        yOffset = yOffset ?? minY < 0 ? minY * -1 : 0;
        var retMap = Array.from({ length: maxY + 1 + yOffset }, e => Array(maxX! + 1 + xOffset!).fill("."));
        retMap[yOffset][xOffset] = "s";

        for (let knotIndex = this.history.length - 1; knotIndex >= 0; knotIndex--) {
            // console.log({ knotIndex, index });
            const eachCoord = this.history[knotIndex][index];
            // console.log(eachCoord);
            retMap[eachCoord.y + yOffset][eachCoord.x + xOffset] = (knotIndex === 0 ? 'H' : knotIndex).toString();
        }

        retMap.reverse().forEach(row => {
            console.log(row.join(''));
        });
    }
}