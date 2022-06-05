import * as inquirer from 'inquirer';
//import { Chalk } from 'chalk';
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { BackCommand } from './BackCommand';
import { BlockchainSelector } from './BlockchainSettingsCommands/BlockchainSelector';
import { SettingsData } from '../SettingsData';
import { CliStrings } from '../CliStrings';


//const chalk = new Chalk();
const BSRun = {
  run: false,
};

const helpCommand = new HelpCommand();
const CommandIndex: Command[] = [
  helpCommand,
  new BlockchainSelector(),
  new BackCommand(BSRun),
];
helpCommand.commandIndex = CommandIndex;

export class BlockchainSettingsCommand implements Command {
  name = CliStrings.BlockchainSettingsCommandLabel;
  help = CliStrings.BlockchainSettingsCommandHelp;

  async execute() {
    BSRun.run = true;

    const commandChoices: string[] = [];

    for (const command of CommandIndex) {
      commandChoices.push(command.name);
    }

    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'list',
        name: 'selectedCommand',
        message: (CliStrings.BlockchainSettingsMenuQuestion),//chalk.yellow(CliStrings.BlockchainSettingsMenuQuestion),
        choices: commandChoices,
      },
    ];

    while (BSRun.run) {
      console.log(CliStrings.horizontalHashLine);//chalk.green(CliStrings.horizontalHashLine));
      console.log(CliStrings.BlockchainSettingsMenuHeader);//chalk.green(CliStrings.BlockchainSettingsMenuHeader));
      console.log(CliStrings.horizontalHashLine);//chalk.green(CliStrings.horizontalHashLine));
      if (SettingsData.selectedBlockchains.length !== 0) {
        console.log(CliStrings.BlockchainSettingsMenuSelectionInfo);//chalk.blue(CliStrings.BlockchainSettingsMenuSelectionInfo));
      }

      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
