import * as fs from 'fs';
export function readInput(path: string): string[] {
	let data: string[] = [];
	try {
		data = fs.readFileSync(path, 'utf-8').toString().replace(/\r\n/g, '\n').split('\n');
		console.log(data);
	}
	catch (err) {
		console.error(err);
	}
	return data;
}
export class Stack<T>{
    private storage: T[] = [];
    constructor(private capacity: number = Infinity) { }

    push(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }
    toArray(): T[] {
        return [...this.storage];
    }
}
// export async function readInputFromURL(path: string): Promise<string[]> {
// 	const txt = fetch(path)
// 		.then(res => res.text())
// 		.then(txt => txt.replace(/\r\n/g, '\n').split('\n'));
// 	return txt;
//}


export { };
