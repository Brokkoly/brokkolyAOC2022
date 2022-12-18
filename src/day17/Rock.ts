import { dir } from "console";
import { RockArea } from "./RockArea";

export abstract class Rock {
    constructor(public bottomLeftX: number, public bottomLeftY: number, public width: number, public area: RockArea) {
    }
    public abstract canMoveRight(): boolean;
    public abstract canMoveLeft(): boolean;
    public abstract canMoveDown(): boolean;
    public abstract finishRock(): void;
    public abstract get highestY(): number;
    public move(direction: ">" | "<" | "d"): void {
        switch (direction) {
            case ">":
                if (this.canMoveLeft()) {
                    this.bottomLeftX--;
                }
                return;
            case "<":
                if (this.canMoveRight()) {
                    this.bottomLeftX++;
                }
                return;
            case "d":
                if (this.canMoveDown()) {
                    this.bottomLeftY--;
                }
                return;
        }
    }
}

