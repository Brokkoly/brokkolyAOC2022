import { Coordinate } from "../Coordinate";

export class Vector {
  constructor(public tail: Coordinate, public head: Coordinate) { }
  public get length() {
    return Math.sqrt(
      Math.pow(this.head.x - this.tail.x, 2) +
      Math.pow(this.head.y - this.tail.y, 2)
    );
  }
  public get slope() {
    return (this.head.y - this.tail.y) / (this.head.x - this.tail.x);
  }
  public get diagonal() {
    return new Vector(
      this.tail,
      new Coordinate(
        this.head.x / Math.abs(this.head.x),
        this.head.y / Math.abs(this.head.y)
      )
    );
  }
  public get xDir() {
    return (this.head.x - this.tail.x) / Math.abs(this.head.x - this.tail.x);
  }
  public get yDir() {
    return (this.head.y - this.tail.y) / Math.abs(this.head.y - this.tail.y);
  }
}
