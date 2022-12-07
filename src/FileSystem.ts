export abstract class DirectoryMember {
  abstract get size(): number;
  constructor(public name: string) {}
}

export class Directory extends DirectoryMember {
  contents: Map<string, DirectoryMember> = new Map<string, DirectoryMember>();
  //   private _size: number = -1;
  constructor(name: string, public parent?: Directory) {
    super(name);
  }

  public get size(): number {
    // if (this._size !== -1) {
    //   return this._size;
    // }
    let size = 0;
    this.contents.forEach((item) => {
      size += item.size;
      //   if (item instanceof Directory) {
      //     size += item.size;
      //   } else if (item instanceof File) {
      //     size += item.size;
      //   }
    });
    return size;
  }
}

export class File extends DirectoryMember {
  constructor(name: string, public size: number) {
    super(name);
  }
}

export enum Commands {
  CD = "cd",
  LS = "ls",
}
