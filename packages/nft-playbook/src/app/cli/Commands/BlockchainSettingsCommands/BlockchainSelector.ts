import inquirer = require('inquirer');
import { CliStrings } from '../../CliStrings';
import { SettingsData } from '../../SettingsData';
import { Command } from '../Command';

export class BlockchainSelector implements Command {
  name = CliStrings.BlockchainSelectorCommandLabel;
  help = CliStrings.BlockchainSelectorCommandHelp;

  async execute() {
    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'checkbox',
        name: 'selectedBlockchains',
        message: CliStrings.BlockchainSelectorMenuQuestion,
        choices: ['Ethereum', 'Flow'], // TODO diese Infos sollten dynamisch aus dem Backend kommen
        default: SettingsData.selectedBlockchains,
      },
    ];
    SettingsData.selectedBlockchains = (
      await inquirer.prompt(promptQuestions)
    ).selectedBlockchains;
  }
}
