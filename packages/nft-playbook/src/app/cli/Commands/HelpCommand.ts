import inquirer = require('inquirer');
import { Command, TopLevelCommandIndex } from './Command';

export class HelpCommand implements Command {
  name = 'Help';
  help = `This is the help page of the Help Command
  It is useless

  The End
`;
  async execute() {
    TopLevelCommandIndex.forEach((command) => {
      console.log(command.help);
      console.log();
    });

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Want to go back?',
        choices: ['Back'],
      },
    ]);
  }
}
