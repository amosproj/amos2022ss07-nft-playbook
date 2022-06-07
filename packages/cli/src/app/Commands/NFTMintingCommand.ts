import * as inquirer from 'inquirer';
import { Command, sleep } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware } from '@nft-playbook/middleware';

export class NFTMintingCommand implements Command {
  name = CliStrings.NFTMintingCommandLabel;
  help = CliStrings.NFTMintingCommandHelp;

  private print_header() {
    console.clear();
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.NFTMintingCommandMenuHeader);
    console.log(CliStrings.horizontalHashLine);
  }

  async execute() {
    this.print_header();

    // get name
    middleware.setNftName(
      await this.getInput(
        CliStrings.NFTMintingQuestionName,
        middleware.getNftName()
      )
    );
    // get link
    middleware.setNftLink(
      await this.getInput(
        CliStrings.NFTMintingQuestionLink,
        middleware.getNftLink()
      )
    );
    middleware.setNftHash(
      middleware.getNftLink() // FIXME
    );
    // get blockchain specific nft receiver
    for (const blockchain of middleware.getSelectedBlockchains()) {
      middleware.setPublicKeyNftReceiver(
        await this.getInput(
          CliStrings.NFTMintingQuestionNFTReceiver(blockchain),
          middleware.getPublicKeyNftReceiver(blockchain)
        ),
        blockchain
      );
    }
    // print summary
    this.print_header();
    console.log(CliStrings.NFTMintingFeedbackSelectedBlockchains);
    console.log(CliStrings.NFTMintingFeedbackNFTName);
    console.log(CliStrings.NFTMintingFeedbackNFTLink);

    console.log(CliStrings.horizontalHashLine);
    if (middleware.getSelectedBlockchains().length === 0) {
      console.log(`No blockchains selected`);
    }
    for (const blockchain of middleware.getSelectedBlockchains()) {
      console.log();
      console.log(CliStrings.NFTMintingFeedbackGasLimit(blockchain));
      console.log(
        await CliStrings.NFTMintingFeedbackEstimatedGasFeeGwei(blockchain)
      );
      console.log(CliStrings.NFTMintingFeedbackServerUri(blockchain));
      console.log(CliStrings.NFTMintingFeedbackPrivateKey(blockchain));
      console.log(CliStrings.NFTMintingFeedbackNFTReceiver(blockchain));
    }
    console.log(CliStrings.horizontalHashLine);

    // continue prompt
    const promptQuestion: inquirer.QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmed',
        message: CliStrings.NFTMintingSummaryConfirmationQuestion,
      },
    ];
    const answer = await inquirer.prompt(promptQuestion);
    if (answer.confirmed) {
      // prompt accepted
      middleware.mintNFT();
    } else {
      // prompt denied
      console.log(CliStrings.NFTMintingFeedbackAbort);
    }

    await sleep(2000);
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
