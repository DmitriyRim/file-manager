import { createReadStream, createWriteStream } from "node:fs";
import { argParser } from "../utils/argParser.js";
import { access } from 'node:fs/promises';
import { pathResolver } from "../utils/pathResolver.js";
import crypto from 'node:crypto';
import { pipeline } from "node:stream/promises";

export const calcHash = async (args) => {
    const { input, algorithm = 'sha256', save } = argParser(args);
    const algorithms = ['sha256', 'md5', 'sha512'];

    if (!input) {
        console.log('Invalid input');
        return;
    }

    if(!algorithms.includes(algorithm)){
        throw new Error();
    }

    const pathInputFile = pathResolver(input);  

    await access(pathInputFile);

    const hash = crypto.createHash(algorithm);
    const readStream = createReadStream(pathInputFile);

    readStream.on('readable', () => {
        const data = readStream.read();

        if (data)
            hash.update(data);
        else {
            const output = `${algorithm}: ${hash.digest('hex')}`;
            console.log(output);

            if(save) {
                const writeStream = createWriteStream(pathInputFile + '.' + algorithm);
                writeStream.write(output);
            }
        }
    });

    await pipeline(readStream, hash);
}