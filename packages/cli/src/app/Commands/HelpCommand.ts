import * as inquirer from 'inquirer';
import { Chalk } from 'chalk';
import { CliStrings } from '../CliStrings';
import { Command } from './Command';

const chalk = new Chalk();


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
        message: chalk.yellow(CliStrings.HelpCommandMenuQuestion),
        choices: [CliStrings.HelpCommandMenuBackButtonLabel],
      },
    ]);

    console.clear();
  }
}
