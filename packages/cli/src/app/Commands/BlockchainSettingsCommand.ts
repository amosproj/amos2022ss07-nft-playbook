import * as inquirer from 'inquirer';
import { Command } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware } from '@nft-playbook/middleware';

export class BlockchainSettingsCommand implements Command {
  name = CliStrings.BlockchainSettingsCommandLabel;
  help = CliStrings.BlockchainSettingsCommandHelp;

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
      middleware.setPrivateKeyUser(
        await this.getInput(
          `1. Please provide your private key for ${blockchain}`,
          middleware.getPrivateKeyUser(blockchain)
        ),
        blockchain
      );

      const promptQuestions: inquirer.QuestionCollection = [
        {
          type: 'rawlist',
          name: 'selectedContractMethod',
          message:
            '2. Do you want to create a new contract or provide an existing contract address?',
          choices: [
            `Deploy new contract`,
            `Address of existing contract`,
            `Cancel`,
          ],
        },
      ];

      const selectedContractMethod: string = (
        await inquirer.prompt(promptQuestions)
      ).selectedContractMethod;

      // for (const contractMethod of selectedContractMethod) {
      if (selectedContractMethod === `Deploy new contract`) {
        await middleware.deployContract(blockchain);
      } else if (selectedContractMethod === `Address of existing contract`) {
        const contractAddress = await this.getInput(
          `Address of existing contract:`,
          ``
        );
        middleware.setContractAddress(blockchain, contractAddress);
      }
      // }

      console.clear();
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
