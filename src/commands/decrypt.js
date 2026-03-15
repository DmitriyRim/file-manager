import { argParser } from "../utils/argParser.js";
import { pathResolver } from "../utils/pathResolver.js";
import { createReadStream, createWriteStream } from 'node:fs';
import { access } from "node:fs/promises";

const {
  scrypt,
  createDecipheriv,
} = await import('node:crypto');

export const  decrypt = async (args) => {
    const { input, output, password } = argParser(args);
    console.log(input, output, password)
    if (!input || !output || !password) {
        console.log('Invalid input');
        return;
    }

    const pathToFile = pathResolver(input); 
    const pathToOutput = pathResolver(output); 
    await access(pathToFile);

    const chunks = [];
    const readStream = createReadStream(pathToFile);
    const writeStream = createWriteStream(pathToOutput);

    readStream.on("data", (chunk) => chunks.push(chunk));

    await new Promise((res, rej) => {
        readStream.on("end", res);
        readStream.on("error", rej);
    });

    const fileBuffer = Buffer.concat(chunks);
    if (fileBuffer.length < 44) throw new Error;

    const salt = fileBuffer.slice(0, 16);
    const iv = fileBuffer.slice(16, 28);
    const authTag = fileBuffer.slice(-16);
    const encryptedData = fileBuffer.slice(28, -16);
    const key = await new Promise((resolve, reject) =>
        scrypt(password, salt, 32, (err, key) =>
            err ? reject(err) : resolve(key)
        )
    );
    const decipher = createDecipheriv("aes-256-gcm", key, iv);  
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    writeStream.write(decrypted);
    writeStream.end();
}