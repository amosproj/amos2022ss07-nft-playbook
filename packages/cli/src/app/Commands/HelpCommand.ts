import inquirer = require('inquirer');
import { CliStrings } from '../CliStrings';
import { Command } from './Command';

export class HelpCommand implements Command {
  name = CliStrings.HelpCommandLabel;
  help = `THIS STRING IS CURRENTLY NOT IN USE`;

  commandIndex: Command[];

  async execute() {
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
        message: CliStrings.HelpCommandMenuQuestion,
        choices: [CliStrings.HelpCommandMenuBackButtonLabel],
      },
    ]);

    console.clear();
  }
}
