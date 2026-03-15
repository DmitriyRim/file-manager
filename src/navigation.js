import { readdir, stat } from 'node:fs/promises';
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

export const cd = async (pathToDirectory) => {
    const absolutePath = pathResolver(pathToDirectory);
    const stats = await stat(absolutePath);

    if( stats.isDirectory()) {
        currentDirectory = absolutePath;
    } else {
        throw new Error();
    }
}

export const ls = async () => {
    const data = await readdir(currentDirectory);
    const files = [];
    const folders = [];

    for (let item of data) {
        try {
            const stats = await stat(pathResolver(item));

            if(stats.isDirectory()) folders.push(item);
            if(stats.isFile()) files.push(item);
        } catch {
            continue;
        }
    }

    folders.sort((a, b) => b - a);
    files.sort((a, b) => b - a);

    console.log('\n', ...folders.map(folder => `${folder} [folder]\n`), ...files.map(file => `${file} [file]\n`))
}