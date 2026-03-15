import { count } from "./commands/count.js";
import { csvToJson } from "./commands/csvToJson.js";
import { decrypt } from "./commands/decrypt.js";
import { encrypt } from "./commands/encrypt.js";
import { calcHash } from "./commands/hash.js";
import { hashCompare } from "./commands/hashCompare.js";
import { jsonToCsv } from "./commands/jsonToCsv.js";
import { logStat } from "./commands/logStats.js";
import { ls, up, cd, currentDirectory } from "./navigation.js";

export const repl = async (rl ,line) => {
    const [command, ...args] = line.trim().split(' ');

    try {
        switch (command) {
            case 'up':
                if(!up()) return;
                break;
            case 'cd':
                if(args[0]){
                    await cd(args[0]);
                }
                break;
            case 'ls':
                await ls();
                break;
            case 'csv-to-json':
                await csvToJson(args);
                break;
            case 'json-to-csv':
                await jsonToCsv(args);
                break;
            case 'count':
                await count(args);
                break
            case 'hash':
                await calcHash(args);
                break
            case 'hash-compare':
                await hashCompare(args);
                break
            case 'encrypt':
                await encrypt(args);
                break
            case 'decrypt':
                await decrypt(args);
                break
            case 'log-stats':
                await logStat(args);
                break
            case '.exit':
                return rl.close();    
            default:
                console.log('Invalid input');
                return;
        }

        console.log(currentDirectory);
    } catch (error) {
        console.log('Operation failed');
        console.log(error)
    }
    rl.prompt();
}