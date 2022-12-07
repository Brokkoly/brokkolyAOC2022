import { dir, info } from "console";
import { Dir } from "fs";
import { Commands, Directory, DirectoryMember, File } from "../FileSystem";
import * as helpers from "../helpers";

interface Command {
  command: string;
  argument: string;
  result: string[];
}

const input = helpers.readInput("inputs/input7.txt");
// console.log(input);

const inputCommands: Command[] = [];

input.forEach((line) => {
  if (!line) {
    return;
  }
  if (line.startsWith("$")) {
    const splitString = line.split(" ");
    const newCommand: Command = {
      command: splitString[1],
      argument: splitString[2],
      result: [],
    };
    inputCommands.push(newCommand);
  } else {
    inputCommands[inputCommands.length - 1].result.push(line);
  }
});

// console.log(inputCommands);

//const inputNums = input.map((str) => Number.parseInt(str));
const output1 = aocD7Q1(inputCommands);
const output2 = aocD7Q2(inputCommands);
console.log(`Output 1: ${output1}`);
console.log(`Output 2: ${output2}`);

function mapFiles(commands: Command[]): Directory {
  let currentDirectory = new Directory("root", undefined);

  //mapping file system
  commands.forEach((command) => {
    if (command.command === Commands.CD) {
      if (command.argument === "..") {
        if (currentDirectory?.parent) {
          currentDirectory = currentDirectory.parent;
        } else {
          console.log(currentDirectory);
          console.log(command);
          throw new Error("Current directory's parent is undefined");
        }
      } else {
        if (!currentDirectory.contents.has(command.argument)) {
          currentDirectory.contents.set(
            command.argument,
            new Directory(command.argument, currentDirectory.parent)
          );
        }
        const target = currentDirectory.contents.get(command.argument);
        if (target instanceof Directory) {
          currentDirectory = target;
        }
      }
    } else {
      //command was ls
      command.result.forEach((line) => {
        const splitLine = line.split(" ");
        if (line.startsWith("dir")) {
          if (!currentDirectory.contents.has(splitLine[1])) {
            currentDirectory.contents.set(
              splitLine[1],
              new Directory(splitLine[1], currentDirectory)
            );
          }
        } else {
          currentDirectory.contents.set(
            splitLine[1],
            new File(splitLine[1], parseInt(splitLine[0]))
          );
        }
      });
    }
  });
  while (currentDirectory.parent !== undefined) {
    currentDirectory = currentDirectory.parent;
  }
  return currentDirectory;
}

function printFiles(item: DirectoryMember, depth: number = 0) {
  let infoString = "";
  if (item instanceof Directory) {
    const size = item.size;
    infoString = `(dir, size=${size}) ${size > 8381165 ? "***********" : ""}`;
  } else if (item instanceof File) {
    infoString = `(file, size=${item.size})`;
  }
  console.log(
    `${new Array<string>(depth).fill("| ").join("")}- ${
      item.name
    } ${infoString}`
  );
  if (item instanceof Directory) {
    item.contents.forEach((value, key) => {
      printFiles(value, depth + 1);
    });
  }
}

function findSmallDirs(
  dir: Directory,
  dirLimit: number,
  direction: "greaterThan" | "lessThan"
): Directory[] {
  const retDirs: Directory[] = [];
  if (direction === "greaterThan") {
    if (dir.size >= dirLimit) {
      retDirs.push(dir);
      dir.contents.forEach((value, key) => {
        if (value instanceof Directory) {
          retDirs.push(...findSmallDirs(value, dirLimit, direction));
        }
      });
    }
  } else {
    if (dir.size <= dirLimit) {
      retDirs.push(dir);
    }
    dir.contents.forEach((value, key) => {
      if (value instanceof Directory) {
        retDirs.push(...findSmallDirs(value, dirLimit, direction));
      }
    });
  }
  return retDirs;
}

function findDepth(dir: Directory): number {
  var depth = 0;
  var currentDir = dir;
  while (currentDir.parent !== undefined) {
    currentDir = currentDir.parent;
    depth++;
  }
  return depth;
}

/**
 *
 * @param input
 * @returns
 */
function aocD7Q1(commands: Command[]): number {
  const dirLimit = 100000;
  const rootDir = mapFiles(commands);
  const dirSizes = findSmallDirs(rootDir, dirLimit, "lessThan");
  let retSize = 0;
  dirSizes.forEach((dir) => {
    const size = dir.size;
    console.log(size);
    retSize += size;
  });
  return retSize;
}

function aocD7Q2(commands: Command[]): number {
  const rootDir = mapFiles(commands);
  printFiles(rootDir);
  const dirLimit = 30000000 - (70000000 - rootDir.size);
  const dirSizes = findSmallDirs(rootDir, dirLimit, "greaterThan");

  let retSize = Number.POSITIVE_INFINITY;
  dirSizes.forEach((dir) => {
    const size = dir.size;
    if (size < retSize) {
      retSize = size;
    }
  });

  console.log({ dirLimit });

  return retSize;
}
