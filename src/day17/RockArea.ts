export class RockArea {
    public xOffset = 0;
    public grid: string[][];
    constructor(public width: number = 9, public height: number = 10) {
        this.grid = Array.from({ length: this.height }, (e) => Array.from({ length: this.width }, (e) => ".")
        );
        for (let i = 0; i < this.grid[0].length; i++) {
            if (i === 0 || i === this.grid[0].length - 1) {
                this.grid[0][i] = '+';
            }
            else {
                this.grid[0][i] = '-';
            }
        }
        for (let y = 1; y < this.grid.length; y++) {
            this.grid[y][0] = '|';
            this.grid[y][this.grid[0].length - 1] = '|';

        }
        this.printGrid();
    }

    public getAt(x: number, y: number) {
        return this.grid[y][x];
    }
    public setAt(x: number, y: number, value: string) {
        this.grid[y][x] = value;
    }

    private addSpace() {
        this.grid.push('|.......|'.split(''));
    }
    
    public printGrid() {
        for (let i = this.grid.length - 1; i >= 0; i--) {
            console.log(this.grid[i].join(''));
        }
    }
}
