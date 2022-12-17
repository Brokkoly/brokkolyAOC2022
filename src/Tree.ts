export class Tree<T>{
    public children: Map<string, Tree<T>> = new Map();

    constructor(public head: T, public name: string, public parent?: Tree<T>) {

    }

    public getDepth(name: string): number {
        if (name === this.name) {
            return 0;
        }
        // else {
        //     return this.children.forEach((child, key) => {

        //     })
        // }
        return -1;
    }
    public allParents(): Tree<T>[] {
        if (!this.parent) {
            return [];
        }
        else {
            return [this, ...this.allParents()]
        }
    }
}



