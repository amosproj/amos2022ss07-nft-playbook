import inquirer = require('inquirer');
import { Command, sleep } from './Command';

export class ExampleSubprogram implements Command {
  name = 'Example Subprogram';
  help = `Example Subprogram
  This demos a subprogram that will do nothing usefull.`;
  async execute() {
    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Wer bist du?',
        },
      ])
      .then((a) => {
        console.log(`Hello ${a.username}`);
      });

    await sleep(2000);
  }
}
