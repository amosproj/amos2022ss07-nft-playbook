import * as inquirer from 'inquirer';
import { Command, sleep } from '../Command';
import { CliStrings } from '../../CliStrings';
import { middleware } from '@nft-playbook/middleware';

export class StartMintingCommand implements Command {
  name = CliStrings.StartMintingCommandLabel;
  help = CliStrings.StartMintingCommandHelp;

  async execute() {
    console.log(CliStrings.StartMintingFeedbackSelectedBlockchains);
    console.log(CliStrings.StartMintingFeedbackNFTName);
    console.log(CliStrings.StartMintingFeedbackNFTLink);

    console.log(CliStrings.horizontalHashLine);

    for (const blockchain of middleware.getSelectedBlockchains()) {
      console.log();
      console.log(CliStrings.StartMintingFeedbackGasLimit(blockchain));
      console.log(CliStrings.StartMintingFeedbackServerUri(blockchain));
      console.log(CliStrings.StartMintingFeedbackContractOwner(blockchain));
      console.log(CliStrings.StartMintingFeedbackNFTTransmitter(blockchain));
      console.log(CliStrings.StartMintingFeedbackNFTReceiver(blockchain));
    }
    console.log(CliStrings.horizontalHashLine);

    const promptQuestion: inquirer.QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmed',
        message: CliStrings.StartMintingMenuConfirmationQuestion,
      },
    ];
    const answer = await inquirer.prompt(promptQuestion);
    if (answer.confirmed) {
      middleware.setSmartContractAddress(
        './packages/backend/src/lib/contracts/simple_amos_nft_contract.sol',
        'Ethereum'
      );
      middleware.deployContract();
      middleware.mintNFT();
    } else {
      console.log(CliStrings.StartMintingFeedbackAbort);
    }

    await sleep(2000);
  }
}
