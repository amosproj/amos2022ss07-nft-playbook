import * as inquirer from 'inquirer';
import { Command, getInput, showException, sleep } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware, NftPlaybookException } from '@nft-playbook/middleware';

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
      await getInput(CliStrings.NFTMintingQuestionName, middleware.getNftName())
    );
    // get link
    middleware.setNftLink(
      await getInput(CliStrings.NFTMintingQuestionLink, middleware.getNftLink())
    );
    middleware.setNftHash(
      middleware.getNftLink() // FIXME
    );
    // get blockchain specific nft receiver
    for (const blockchain of middleware.getSelectedBlockchains()) {
      middleware.setPublicKeyNftReceiver(
        await getInput(
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
      try {
        console.log(
          await CliStrings.NFTMintingFeedbackEstimatedGasFeeGwei(blockchain)
        );
      } catch (e: unknown) {
        if (await showException(<NftPlaybookException>e)) {
          return;
        }
      }

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
      try {
        await middleware.mintNft();
      } catch (e: unknown) {
        if (await showException(<NftPlaybookException>e)) {
          return;
        }
      }
    } else {
      // prompt denied
      console.log(CliStrings.NFTMintingFeedbackAbort);
      await sleep(2000);
    }
  }
}
