import inquirer = require('inquirer');
import { SettingsData } from '../../SettingsData';
import { Command } from '../Command';

export class BlockchainSelector implements Command {
  name = 'Select Blockchain';
  help = `\tCheck the blockchains you want to use`;

  async execute() {
    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'checkbox',
        name: 'selectedBlockchains',
        message: 'Please select the blockchains you want to use',
        choices: ['Ethereum', 'Flow'], // TODO diese Infos sollten dynamisch aus dem Backend kommen
        default: SettingsData.selectedBlockchains,
      },
    ];
    SettingsData.selectedBlockchains = (
      await inquirer.prompt(promptQuestions)
    ).selectedBlockchains;
  }
}
