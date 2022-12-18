import { Rock } from "./Rock";
import { RockArea } from "./RockArea";

export class LRock extends Rock {
    public get highestY(): number {
        return this.bottomLeftY + 2;
    }
    public finishRock(): void {
        for (let i = this.bottomLeftX; i < this.bottomLeftX + 3; i++) {
            this.area.grid[this.bottomLeftY][i] = '#';
        }
        for (let i = this.bottomLeftY; i < this.bottomLeftY + 3; i++) {
            this.area.grid[i][this.bottomLeftX + 2] = '#';
        }
    }
    constructor(bottomLeftX: number, bottomLeftY: number, area: RockArea) {
        super(bottomLeftX, bottomLeftY, 3, area);
    }
    public canMoveRight(): boolean {
        return this.area.grid[this.bottomLeftY][this.bottomLeftX + this.width] === '.'
            && this.area.grid[this.bottomLeftY + 1][this.bottomLeftX + this.width] === '.'
            && this.area.grid[this.bottomLeftY + 2][this.bottomLeftX + this.width] === '.';

    }
    public canMoveLeft(): boolean {
        return this.area.grid[this.bottomLeftY][this.bottomLeftX - 1] === '.'
            && this.area.grid[this.bottomLeftY + 1][this.bottomLeftX + 1] === '.'
            && this.area.grid[this.bottomLeftY + 2][this.bottomLeftX + 1] === '.';
    }
    public canMoveDown(): boolean {
        return this.area.grid[this.bottomLeftY - 1][this.bottomLeftX] === '.'
            && this.area.grid[this.bottomLeftY - 1][this.bottomLeftX + 1] === '.'
            && this.area.grid[this.bottomLeftY - 1][this.bottomLeftX + 2] === '.';
    }

}
