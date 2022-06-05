import * as inquirer from 'inquirer';
import { CliStrings } from '../../CliStrings';
import { Command } from '../Command';
import { middleware } from '@nft-playbook/middleware';

export class BlockchainSelector implements Command {
  name = CliStrings.BlockchainSelectorCommandLabel;
  help = CliStrings.BlockchainSelectorCommandHelp;

  async execute() {
    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'checkbox',
        name: 'selectedBlockchains',
        message: CliStrings.BlockchainSelectorMenuQuestion,
        choices: middleware.getAllBlockchains(),
        default: middleware.getSelectedBlockchains(),
      },
    ];
    const selectedBlockchains: string[] = (
      await inquirer.prompt(promptQuestions)
    ).selectedBlockchains;

    middleware.getAllBlockchains().forEach((blockchain) => {
      if (selectedBlockchains.includes(blockchain)) {
        middleware.selectBlockchain(blockchain);
      } else {
        middleware.deselectBlockchain(blockchain);
      }
    });
  }
}
