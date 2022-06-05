import * as inquirer from 'inquirer';
import { chalk } from '../CliStrings';
import { Command } from './Command';
import { CliStrings } from '../CliStrings';

//const chalk = new Chalk();


export class VersionCommand implements Command {
  name = CliStrings.VersionCommandLabel;
  help = CliStrings.VersionCommandHelp;
  async execute() {
    console.log((CliStrings.horizontalHashLine));//chalk.green(CliStrings.horizontalHashLine));
    console.log((CliStrings.VersionMenuHeader));//chalk.green(CliStrings.VersionMenuHeader));
    console.log((CliStrings.horizontalHashLine));//chalk.green(CliStrings.horizontalHashLine));

    console.log((CliStrings.VersionCommandOutput));//chalk.blue(CliStrings.VersionCommandOutput));

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: (CliStrings.VersionMenuQuestion),//chalk.yellow(CliStrings.VersionMenuQuestion),
        choices: [CliStrings.VersionMenuBackButtonLabel],
      },
    ]);
  }
}
