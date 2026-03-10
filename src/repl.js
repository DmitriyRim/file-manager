import { currentDirectory, up } from "./navigation.js";
import { argParser } from "./utils/argParser.js";

export const repl = (rl ,line) => {
    const [command] = argParser(line);

    try {
        switch (command) {
            case 'up':
                if(!up()) return;
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
    }
}