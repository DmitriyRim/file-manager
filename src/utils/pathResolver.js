import { resolve } from 'node:path';
import { currentDirectory } from '../navigation.js';

export const pathResolver = (inputPath) => {
    return resolve(currentDirectory, inputPath);
}