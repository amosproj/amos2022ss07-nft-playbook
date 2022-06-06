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

    for (const blockchain of selectedBlockchains) {
      middleware.setPrivateKeyUser(await this.getInput(`1. Please provide your private key for ${blockchain}`, ``), blockchain);

      const promptQuestions: inquirer.QuestionCollection = [
        {
          type: 'checkbox',
          name: 'selectedContractMethod',
          message: '2. Do you want to create a new contract or provide an existing contract address?',
          choices: [`Deploy new contract`,`Address of existing contract`],
        },
      ];

      const selectedContractMethod: string[] = (
        await inquirer.prompt(promptQuestions)
      ).selectedContractMethod;

      for (const contractMethod of selectedContractMethod) {
        if (contractMethod === `Deploy new contract`) {
          await middleware.deployContract(blockchain);
        } else {
          const contractAddress = await this.getInput(`Address of existing contract:`,``);
          middleware.setContractAddress(blockchain, contractAddress);
        }
      }
    }
  }

  async getInput(promptMessage: string, prevAnswer: string): Promise<string> {
    const inputQuestion: inquirer.QuestionCollection = [
      {
        type: 'input',
        name: 'input',
        message: promptMessage,
        default: prevAnswer,
      },
    ];

    const confirmQuestion: inquirer.QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmed',
        message: CliStrings.NFTMintingInputConfirmationQuestion,
      },
    ];

    let input: string;
    let showPrompt = true;
    while (showPrompt) {
      input = (await inquirer.prompt(inputQuestion)).input;
      console.log(CliStrings.NFTMintingConfirmationInput + input);
      const confirmAnswer = await inquirer.prompt(confirmQuestion);
      if (confirmAnswer.confirmed) {
        showPrompt = false;
      }
    }

    return input;
  }
}
