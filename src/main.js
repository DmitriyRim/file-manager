import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { repl } from './repl.js';
import { homedir } from 'node:os';

const init = async () => {
    const welcomeMessage = '\x1b[32mWelcome to Data Processing CLI!\x1b[0m';
    const exitMessage = '\x1b[32mThank you for using Data Processing CLI!\x1b[0m';
    const rl = createInterface({
        input: stdin,
        output: stdout,
    });

    rl.setPrompt('> ');
    rl.on('line', (line) => {
        console.log(`Received: ${line}`);
        repl(rl, line);
    });
    rl.on('close', () => {
        console.log('\r' + exitMessage);
    })

    console.log(welcomeMessage, '\n' + homedir());
    rl.prompt();
}

init();
