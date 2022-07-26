import * as inquirer from 'inquirer';
import { Command, getInput, showException } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware, NftPlaybookException } from '@nft-playbook/middleware';
import { Worker } from 'worker_threads';

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
        choices: middleware.getAllBlockchains(), //[middleware.getAllBlockchains(), CliStrings.BlockchainSettingsMenuQuestionChoices03],
        default: middleware.getSelectedBlockchains(),
      },
    ];
    const selectedBlockchains: string[] = (
      await inquirer.prompt(promptQuestions)
    ).selectedBlockchains;

    //if(selectedBlockchains.some(x => x === CliStrings.BlockchainSettingsMenuQuestionChoices03)) return;

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
        '',
        true
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
        const worker = new Worker(
          './packages/cli/src/app/Commands/CliWorker.ts'
        );
        try {
          await middleware.deployContract(blockchain);
        } catch (e: unknown) {
          worker.terminate();
          console.log();
          if (await showException(<NftPlaybookException>e)) {
            return;
          }
        }
        worker.terminate();
        console.log();
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
      // console.clear();
    }
  }
}
