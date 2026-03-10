import os from 'node:os';
import { sep } from 'node:path';

export let currentDirectory = os.homedir();

export const up = () => {
    const path = currentDirectory.split(sep);

    if (path.length > 1) {
        return currentDirectory = path.slice(0, -1).join(sep);
    }

    return false;
}
