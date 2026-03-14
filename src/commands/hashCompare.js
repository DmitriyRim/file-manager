import { argParser } from "../utils/argParser.js";
import { createReadStream } from "node:fs";
import { access, readFile } from 'node:fs/promises';
import { pathResolver } from "../utils/pathResolver.js";
import crypto from 'node:crypto';
import { pipeline } from "node:stream/promises";

export const hashCompare = async (args) => {
    const { input, hash: pathHash, algorithm = 'sha256' } = argParser(args);
    const algorithms = ['sha256', 'md5', 'sha512'];

    if (!input || !pathHash) {
        console.log('Invalid input');
        return;
    }

    if(!algorithms.includes(algorithm)){
        throw new Error();
    }

    const pathToInput = pathResolver(input);
    const pathToHash = pathResolver(pathHash);  
    
    await access(pathToInput);
    await access(pathToHash);

    const readStream = createReadStream(pathToInput);
    const textHash = await readFile(pathToHash, 'utf-8');
    const hash = crypto.createHash(algorithm);
    const hashFromFile = textHash.toLowerCase().split(`:`)[1].trim();

    await pipeline(readStream, hash);
    console.log(hashFromFile === hash.digest('hex') ? 'OK' : 'MISMATCH');
}