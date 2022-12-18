import { Rock } from "./Rock";
import { RockArea } from "./RockArea";


export class VerticalLine extends Rock {
    public get highestY(): number {
        return this.bottomLeftY + 3;
    }
    public finishRock(): void {
        for (let i = this.bottomLeftY; i < this.bottomLeftY + 4; i++) {
            this.area.grid[i][this.bottomLeftX] = '#';
        }
    }
    constructor(bottomLeftX: number, bottomLeftY: number, area: RockArea) {
        super(bottomLeftX, bottomLeftY, 1, area);
    }
    public canMoveRight(): boolean {
        for (let i = this.bottomLeftY; i < this.bottomLeftY + 4; i++) {
            if (this.area.grid[i][this.bottomLeftX + this.width] !== '.') {
                return false;
            }
        }
        return true;
    }
    public canMoveLeft(): boolean {
        for (let i = this.bottomLeftY; i < this.bottomLeftY + 4; i++) {
            if (this.area.grid[i][this.bottomLeftX - 1] !== '.') {
                return false;
            }
        }
        return true;
    }
    public canMoveDown(): boolean {
        return this.area.grid[this.bottomLeftY - 1][this.bottomLeftX] === '.';
    }
}
