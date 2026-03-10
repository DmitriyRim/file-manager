import { stat } from 'node:fs/promises';
import os from 'node:os';
import { sep } from 'node:path';
import { pathResolver } from './utils/pathResolver.js';

export let currentDirectory = os.homedir();

export const up = () => {
    const path = currentDirectory.split(sep);

    if (path.length > 1) {
        return currentDirectory = path.slice(0, -1).join(sep);
    }

    return false;
}

export const cp = async (pathToDirectory) => {
    const absolutePath = pathResolver(pathToDirectory);
    const stats = await stat(absolutePath);

    if( stats.isDirectory()) {
        currentDirectory = absolutePath;
    } else {
        throw new Error();
    }
}