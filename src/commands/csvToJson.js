import os from 'node:os';
import { pathResolver } from '../utils/pathResolver.js';
import { access } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export const csvToJson = async (input, output) => {
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
            if(!this.buffer) {
                this.push('[');
            }

            this.buffer += chunk.toString();

            const lines = this.buffer.split(os.EOL);
            this.buffer = lines.pop();

            for (let line of lines) {
                if(!this.headers) {
                    this.headers = line.split(',');
                    continue;
                }
                const items = line.split(',');
                const json = {};
                this.headers.forEach((header, index) => json[header] = items[index])
                this.push(JSON.stringify(json));
                this.push(',');
            }
            callback();
        }

        _flush(callback) {
            if(this.buffer) {
                const items = this.buffer.split(',');
                const json = {};
                this.headers.forEach((header, index) => json[header] = items[index])
                this.push(JSON.stringify(json));
            } 

            this.push(']');
            callback();
        }
    }

    await pipeline(read, new CsvTransform(), write)
}