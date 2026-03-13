import os from 'node:os';
import { createReadStream } from "node:fs";
import { argParser } from "../utils/argParser.js";
import { access } from 'node:fs/promises';
import { Transform } from 'node:stream';
import { pathResolver } from "../utils/pathResolver.js";
import { pipeline } from 'node:stream/promises';

export const count = async (args) => {
    const { input } = argParser(args);

    if (!input) {
        console.log('Invalid input');
        return;
    }

    const pathInputFile = pathResolver(input);  

    await access(pathInputFile);

    const read = createReadStream(pathInputFile);

    class CounterTransform extends Transform {
        constructor() {
            super();
            this.buffer = '';
            this.lines = 0;
            this.words = 0;
            this.characters = 0;
        }

        _transform(chunk, _, callback){
            this.buffer += chunk.toString();

            const lines = this.buffer.split(os.EOL);
            this.buffer = lines.pop();

            lines.forEach(line => {
                this.lines++;
                this.words += line.split(' ').length;
                this.characters += line.length;
            });

            callback();
        }

        _flush(callback) {
            if(this.buffer) {
                this.lines++;
                this.words += this.buffer.split(' ').length;
                this.characters += this.buffer.length;
            }
            this.push();
            console.log(`\nLines: ${this.lines}\nWords: ${this.words}\nCharacters: ${this.characters}\n`);
            callback();
        }
    }

    await pipeline(read, new CounterTransform());
}