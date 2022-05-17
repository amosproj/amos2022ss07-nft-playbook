import inquirer = require('inquirer');
import { Command } from './Command';

export class HelpCommand implements Command {
  name = 'Help';
  help = `MISSING HELP TEXT FOR THIS MENU`;

  commandIndex: Command[];

  async execute() {
    console.log(this.help);
    console.log();

    this.commandIndex.forEach((command) => {
      if (command !== this) {
        console.log(`${command.name}:`);
        console.log(command.help);
        console.log();
      }
    });

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Want to go back?',
        choices: ['Back'],
      },
    ]);

    console.clear();
  }
}
