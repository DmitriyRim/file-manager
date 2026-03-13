import { csvToJson } from "./commands/csvToJson.js";
import { jsonToCsv } from "./commands/jsonToCsv.js";
import { ls, up, cp, currentDirectory } from "./navigation.js";
import { argParser } from "./utils/argParser.js";

export const repl = async (rl ,line) => {
    const [command, ...args] = line.trim().split(' ');

    try {
        switch (command) {
            case 'up':
                if(!up()) return;
                break;
            case 'cp':
                if(args[0]){
                    await cp(args[0]);
                }
                break;
            case 'ls':
                await ls();
                break;
            case 'csv-to-json':
                const { input, output } = argParser(args);

                if(input && output) {
                    await csvToJson(input, output);
                } else {
                    console.log('Invalid input');
                }
                break;
            case 'json-to-csv':
                await jsonToCsv(args);
                break;
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