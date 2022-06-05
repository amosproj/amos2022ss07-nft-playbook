import * as inquirer from 'inquirer';
import { chalk } from '../CliStrings';
import { CliStrings } from '../CliStrings';
import { Command } from './Command';

//const chalk = new Chalk();


export class HelpCommand implements Command {
  name = CliStrings.HelpCommandLabel;
  help = `THIS STRING IS CURRENTLY NOT IN USE`;

  commandIndex: Command[];

  async execute() {
    this.commandIndex.forEach((command) => {
      if (command !== this) {
        console.log(chalk.green(`${command.name}:`));
        console.log(command.help);
        console.log();
      }
    });

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: (CliStrings.HelpCommandMenuQuestion), //chalk.yellow(CliStrings.HelpCommandMenuQuestion),
        choices: [CliStrings.HelpCommandMenuBackButtonLabel],
      },
    ]);

    console.clear();
  }
}
