import { Rock } from "./Rock";
import { RockArea } from "./RockArea";


export class Square extends Rock {
    public get highestY(): number {
        return this.bottomLeftY + 1;
    }
    public finishRock(): void {
        this.area.grid[this.bottomLeftY][this.bottomLeftX] = '#';
        this.area.grid[this.bottomLeftY + 1][this.bottomLeftX] = '#';
        this.area.grid[this.bottomLeftY + 1][this.bottomLeftX + 1] = '#';
        this.area.grid[this.bottomLeftY][this.bottomLeftX + 1] = '#';
    }
    constructor(bottomLeftX: number, bottomLeftY: number, area: RockArea) {
        super(bottomLeftX, bottomLeftY, 2, area);
    }
    public canMoveRight(): boolean {
        return this.area.grid[this.bottomLeftY][this.bottomLeftX + this.width] === '.' && this.area.grid[this.bottomLeftY + 1][this.bottomLeftX + this.width] === '.';
    }
    public canMoveLeft(): boolean {
        return this.area.grid[this.bottomLeftY][this.bottomLeftX - 1] === '.' && this.area.grid[this.bottomLeftY + 1][this.bottomLeftX - 1] === '.';
    }
    public canMoveDown(): boolean {
        return this.area.grid[this.bottomLeftY - 1][this.bottomLeftX] === '.' && this.area.grid[this.bottomLeftY - 1][this.bottomLeftX + 1] === '.';
    }
}
