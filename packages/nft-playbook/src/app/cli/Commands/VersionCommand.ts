import { Command } from './Command';
import inquirer = require('inquirer');
import { CliStrings } from '../CliStrings';

export class VersionCommand implements Command {
  name = CliStrings.VersionCommandLabel;
  help = CliStrings.VersionCommandHelp;
  async execute() {
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.VersionMenuHeader);
    console.log(CliStrings.horizontalHashLine);

    console.log(CliStrings.VersionCommandOutput);

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: CliStrings.VersionMenuQuestion,
        choices: [CliStrings.VersionMenuBackButtonLabel],
      },
    ]);
  }
}
