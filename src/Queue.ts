export interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  protected storage: T[] = [];

  constructor(protected capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }
  dequeue(): T | undefined {
    return this.storage.shift();
  }
  size(): number {
    return this.storage.length;
  }
  toArray(): T[] {
    return [...this.storage];
  }
}

export class DropQueue<T> extends Queue<T> {
  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      this.storage.shift();
    }
    super.enqueue(item);
  }
}
