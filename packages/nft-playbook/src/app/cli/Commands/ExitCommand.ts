import { Command, sleep } from './Command';

export class ExitCommand implements Command {
  name = 'Exit';
  help = 'Exit will close the program';
  async execute() {
    console.log('Bye bye');
    await sleep(2000);
    process.exit(0);
  }
}
