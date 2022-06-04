import * as inquirer from 'inquirer';
import { Chalk } from 'chalk';
import { Command } from './Command';
import { CliStrings } from '../CliStrings';

const chalk = new Chalk();


export class VersionCommand implements Command {
  name = CliStrings.VersionCommandLabel;
  help = CliStrings.VersionCommandHelp;
  async execute() {
    console.log(chalk.green(CliStrings.horizontalHashLine));
    console.log(chalk.green(CliStrings.VersionMenuHeader));
    console.log(chalk.green(CliStrings.horizontalHashLine));

    console.log(chalk.blue(CliStrings.VersionCommandOutput));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: chalk.yellow(CliStrings.VersionMenuQuestion),
        choices: [CliStrings.VersionMenuBackButtonLabel],
      },
    ]);
  }
}
