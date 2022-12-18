import { Rock } from "./Rock";
import { RockArea } from "./RockArea";


export class HorizontalLine extends Rock {
    public get highestY(): number {
        return this.bottomLeftY;
    }
    public finishRock(): void {
        for (let i = this.bottomLeftX; i < this.bottomLeftX + 4; i++) {
            this.area.grid[this.bottomLeftY][i] = '#';
        }
    }
    constructor(bottomLeftX: number, bottomLeftY: number, area: RockArea) {
        super(bottomLeftX, bottomLeftY, 4, area);
    }
    public canMoveRight(): boolean {
        return this.area.grid[this.bottomLeftY][this.bottomLeftX + this.width] === '.';
    }
    public canMoveLeft(): boolean {
        return this.area.grid[this.bottomLeftY][this.bottomLeftX - 1] === '.';
    }
    public canMoveDown(): boolean {
        for (let i = this.bottomLeftX; i < this.bottomLeftX + this.width; i++) {
            if (this.area.grid[this.bottomLeftY - 1][i] !== '.') {
                return false;
            }
        }
        return true;
    }
}
