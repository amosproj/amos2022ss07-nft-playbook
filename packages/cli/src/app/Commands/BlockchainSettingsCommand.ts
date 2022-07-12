import * as inquirer from 'inquirer';
import { Command, getInput, showException } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware, NftPlaybookException } from '@nft-playbook/middleware';

export class BlockchainSettingsCommand implements Command {
  name = CliStrings.BlockchainSettingsCommandLabel;
  help = CliStrings.BlockchainSettingsCommandHelp;

  private print_header() {
    console.clear();
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.BlockchainSettingsMenuHeader);
    console.log(CliStrings.horizontalHashLine);
  }

  async execute() {
    this.print_header();
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
      const input = await getInput(
        CliStrings.BlockchainSettingsMenuQuestion02(blockchain),
        middleware.getPrivateKeyUser(blockchain)
      );
      if (input === null) return;
      middleware.setPrivateKeyUser(input, blockchain);

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

      if (blockchain === 'Solana') {
        middleware.setContractAddress(
          blockchain,
          'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        );
        return;
      }
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
        if (contractAddress === null) return;
        middleware.setContractAddress(blockchain, contractAddress);
      }
      // }
      console.clear();
    }
  }
}
