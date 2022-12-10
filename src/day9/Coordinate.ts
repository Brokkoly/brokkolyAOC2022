export type InputDirection = "R" | "U" | "L" | "D";

export class Coordinate {
    constructor(public x: number, public y: number) { }
    static fromCoordinate(coord: Coordinate) {
      return new Coordinate(coord.x, coord.y);
    }
    public copy() {
      return new Coordinate(this.x, this.y);
    }
    public add(input: { x: number; y: number }) {
      this.x += input.x;
      this.y += input.y;
    }
    public move(dir: InputDirection) {
      switch (dir) {
        case "U":
          this.y++;
          return;
        case "D":
          this.y--;
          return;
        case "L":
          this.x--;
          return;
        case "R":
          this.x++;
          return;
      }
    }
  }