import * as inquirer from 'inquirer';
import { Command, getInput, showException } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware, NftPlaybookException } from '@nft-playbook/middleware';

export class BlockchainSettingsCommand implements Command {
  name = CliStrings.BlockchainSettingsCommandLabel;
  help = CliStrings.BlockchainSettingsCommandHelp;

  async execute() {
    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'checkbox',
        name: 'selectedBlockchains',
        message: CliStrings.BlockchainSettingsMenuQuestion01,
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
        await getInput(
          CliStrings.BlockchainSettingsMenuQuestion02(blockchain),
          middleware.getPrivateKeyUser(blockchain)
        ),
        blockchain
      );

      const promptQuestions: inquirer.QuestionCollection = [
        {
          type: 'rawlist',
          name: 'selectedContractMethod',
          message: CliStrings.BlockchainSettingsMenuQuestion03,
          choices: [
            CliStrings.BlockchainSettingsMenuQuestionChoices01,
            CliStrings.BlockchainSettingsMenuQuestionChoices02,
            CliStrings.BlockchainSettingsMenuQuestionChoices03,
          ],
        },
      ];

      const selectedContractMethod: string = (
        await inquirer.prompt(promptQuestions)
      ).selectedContractMethod;

      // for (const contractMethod of selectedContractMethod) {
      if (
        selectedContractMethod ===
        CliStrings.BlockchainSettingsMenuQuestionChoices01
      ) {
        try {
          await middleware.deployContract(blockchain);
        } catch (e: unknown) {
          if (await showException(<NftPlaybookException>e)) {
            return;
          }
        }
      } else if (
        selectedContractMethod ===
        CliStrings.BlockchainSettingsMenuQuestionChoices02
      ) {
        const contractAddress = await getInput(
          CliStrings.BlockchainSettingsEnterContractAddress,
          ``
        );
        middleware.setContractAddress(blockchain, contractAddress);
      }
      // }
      console.clear();
    }
  }
}
