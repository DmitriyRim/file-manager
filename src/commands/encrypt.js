import { access } from 'node:fs/promises';
import { argParser } from "../utils/argParser.js";
import { pathResolver } from "../utils/pathResolver.js";
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { randomBytes } from 'node:crypto';
const {
  scrypt,
  createCipheriv,
} = await import('node:crypto');

export const encrypt = async (args) => {
    const { input, output, password } = argParser(args);
    const algorithm = 'aes-256-gcm';

    if (!input || !output || !password) {
        console.log('Invalid input');
        return;
    }

    const pathToFile = pathResolver(input); 
    const pathToOutput = pathResolver(output); 
    await access(pathToFile);

    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = await new Promise((resolve, reject) =>
        scrypt(password, salt, 32, (err, key) =>
            err ? reject(err) : resolve(key)
        )
    );
    const cipher = createCipheriv(algorithm, key, iv);
    const readStream = createReadStream(pathToFile);
    const writeStream = createWriteStream(pathToOutput);

    writeStream.write(Buffer.concat([salt, iv]));
    await pipeline(readStream, cipher, writeStream);

    const ws = createWriteStream(pathToOutput, { flags: 'a' });
    ws.write(cipher.getAuthTag());
    ws.end();
}