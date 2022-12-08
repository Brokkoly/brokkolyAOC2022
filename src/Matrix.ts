export class Matrix<T> {
  constructor(private contents: T[][]) {
    // this.contents = new Array<T[]>(height);
    // this.contents.forEach((elem, index, theArray) => {
    //   theArray[index] = new Array<T>(width);
    // });
  }
  public get height() {
    return this.contents.length;
  }

  public get width() {
    return this.contents[0].length;
  }

  getRow(rowIndex: number) {
    if (rowIndex < 0 || rowIndex >= this.contents.length) {
      throw new Error("Row index out of bounds");
    }
    return this.contents[rowIndex];
  }
  getColumn(columnIndex: number) {
    if (columnIndex < 0 || columnIndex >= this.contents[0].length) {
      throw new Error("Column index out of bounds");
    }
    const column: T[] = [];
    this.contents.forEach((row) => {
      column.push(row[columnIndex]);
    });
    return column;
  }
  getElement(rowIndex: number, columnIndex: number) {
    if (rowIndex < 0 || rowIndex >= this.contents.length) {
      throw new Error("Row index out of bounds");
    }
    if (columnIndex < 0 || columnIndex >= this.contents[0].length) {
      throw new Error("Column index out of bounds");
    }
    return this.contents[rowIndex][columnIndex];
  }
}
