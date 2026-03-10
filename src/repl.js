import * as navigation from "./navigation.js";
import { argParser } from "./utils/argParser.js";

export const repl = async (rl ,line) => {
    const [command, ...args] = argParser(line);

    try {
        switch (command) {
            case 'up':
                if(!navigation.up()) return;
                break;
            case 'cp':
                if(args[0]){
                    await navigation.cp(args[0]);
                }
                break;
            case 'ls':
                await navigation.ls();
                break;
            case '.exit':
                return rl.close();    
            default:
                console.log('Invalid input');
                return;
        }

        console.log(navigation.currentDirectory);
    } catch (error) {
        console.log('Operation failed');
    }
    rl.prompt();
}