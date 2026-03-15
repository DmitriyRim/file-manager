import { parentPort } from 'node:worker_threads';

parentPort.once('message', (array) => {
    let total = 0;
    const levels = {};
    const status = {};
    const topPaths = {};
    let totalResponseTime = 0;

    array.forEach(line => {
        const [
            isoTimestamp, 
            level, 
            service, 
            statusCode, 
            responseTimeMs, 
            method, 
            path
        ] = line.trim().split(' ');

        total++;
        totalResponseTime += Number(responseTimeMs);
        levels[level] = (levels[level] || 0) + 1;

        const group = Math.floor(statusCode / 100) + "xx";
        status[group] = (status[group] || 0) + 1;

        topPaths[path] = (topPaths[path] || 0) + 1;
    });
    
    parentPort.postMessage({
        total,
        levels,
        status,
        topPaths,
        totalResponseTime
    });

    parentPort.close();
});