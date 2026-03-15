import os from 'node:os';
import { pathResolver } from '../utils/pathResolver.js';
import { access } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { argParser } from '../utils/argParser.js';

export const jsonToCsv = async (args) => {
    const { input, output } = argParser(args);

    if(!input || !output) {
        console.log('Invalid input');
        return;
    }

    const pathInputFile = pathResolver(input);
    const pathOutputFile = pathResolver(output);

    await access(pathInputFile);
    
    const read = createReadStream(pathInputFile);
    const write = createWriteStream(pathOutputFile);

    class CsvTransform extends Transform {
        constructor() {
            super();
            this.buffer = '';
            this.headers = '';
        }

        _transform(chunk, _, callback){
            this.buffer += chunk.toString();
            callback();
        }

        _flush(callback) {
            const data = JSON.parse(this.buffer);

            if( !Array.isArray(data) || data.length === 0){
                throw new Error();
            }

            const headers = Object.keys(data[0]);

            this.push(headers.join(',') + os.EOL);
            data.forEach(row => {
                const str = headers.map(header => row[header]);
                this.push(str.join(',') + os.EOL);
            })
            callback();
        }
    }

    await pipeline(read, new CsvTransform(), write)
}