import { resolve } from 'node:path';
import { currentDirectory } from '../navigation.js';

export const pathResolver = (inputPath) => {
    console.log(resolve(currentDirectory, inputPath))
    return resolve(currentDirectory, inputPath);
}