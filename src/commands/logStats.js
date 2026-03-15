import { createReadStream, createWriteStream } from "node:fs";
import { argParser } from "../utils/argParser.js";
import { pathResolver } from "../utils/pathResolver.js";
import { access, stat } from 'node:fs/promises';
import os from 'node:os';
import { Worker } from 'node:worker_threads';
import path from "node:path";

export const logStat = async (args) => {
    const { input, output } = argParser(args);

    if (!input || !output) {
        console.log('Invalid input');
        return;
    }

    const pathToFile = pathResolver(input); 
    const pathToOutput = pathResolver(output); 
    await access(pathToFile);
    
    const cpus = os.cpus().length;
    const sizeFile = (await stat(pathToFile)).size;
    const maxSizeChunk = Math.ceil(sizeFile / cpus);
    let buffer = '';
    const workers = [];

    const readStream = createReadStream(pathToFile, { highWaterMark: maxSizeChunk });
    const writeStream = createWriteStream(pathToOutput);
    readStream.on('data', (data) => {
        buffer += data.toString();
        const lines = buffer.split('\n');

        buffer = lines.pop();
        workers.push(new Promise((resolve, reject) => {
            const worker = new Worker(path.resolve('./src/workers/logWorker.js'));

            worker.postMessage(lines);
            worker.on('message', (data) => resolve(data));
            worker.once('error', (err) => reject(err));
            })
        )
    })

    readStream.on('end', async () => {
        if (buffer.trim()) {
            workers.push(new Promise((resolve, reject) => {
                const worker = new Worker(path.resolve('./src/workers/logWorker.js'));
                worker.postMessage([buffer]);
                worker.on('message', resolve);
                worker.once('error', reject);
            }));
        }

        const results = await Promise.all(workers);
        let total = 0;
        const levels = {};
        const status = {};
        const topPaths = {};
        let totalResponseTime = 0;

        const mergeCounts = (target, source) => {
            for (const [k, v] of Object.entries(source)) {
                target[k] = (target[k] || 0) + v;
            }
        }   

        results.forEach(result => {
            total +=result.total;
            totalResponseTime += result.totalResponseTime;

            mergeCounts(levels, result.levels);
            mergeCounts(status, result.status);
            mergeCounts(topPaths, result.topPaths);
        });
        
        writeStream.write(JSON.stringify({
            total,
            levels,
            status,
            topPaths,
            avgResponseTimeMs: Number((totalResponseTime / total).toFixed(2))
        }, null, 2));
        writeStream.end();
    });
}