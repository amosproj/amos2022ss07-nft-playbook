import * as inquirer from 'inquirer';
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { BackCommand } from './BackCommand';
import { BlockchainSelector } from './BlockchainSettingsCommands/BlockchainSelector';
import { CliStrings } from '../CliStrings';
import { middleware } from '@nft-playbook/middleware';

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
        message: CliStrings.BlockchainSettingsMenuQuestion,
        choices: commandChoices,
      },
    ];

    while (BSRun.run) {
      console.log(CliStrings.horizontalHashLine);
      console.log(CliStrings.BlockchainSettingsMenuHeader);
      console.log(CliStrings.horizontalHashLine);
      if (middleware.getSelectedBlockchains().length !== 0) {
        console.log(CliStrings.BlockchainSettingsMenuSelectionInfo);
      }

      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
