import * as inquirer from 'inquirer';
import { Chalk } from 'chalk';
import { CliStrings } from '../../CliStrings';
import { SettingsData } from '../../SettingsData';
import { Command } from '../Command';

const chalk = new Chalk();


export class BlockchainSelector implements Command {
  name = CliStrings.BlockchainSelectorCommandLabel;
  help = CliStrings.BlockchainSelectorCommandHelp;

  async execute() {
    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'checkbox',
        name: 'selectedBlockchains',
        message: chalk.yellow(CliStrings.BlockchainSelectorMenuQuestion),
        choices: ['Ethereum', 'Flow'], // TODO diese Infos sollten dynamisch aus dem Backend kommen
        default: SettingsData.selectedBlockchains,
      },
    ];
    SettingsData.selectedBlockchains = (
      await inquirer.prompt(promptQuestions)
    ).selectedBlockchains;
  }
}
