import * as inquirer from 'inquirer';
import { Command, getInput, showException, sleep } from './Command';
import { CliStrings } from '../CliStrings';
import { middleware, NftPlaybookException } from '@nft-playbook/middleware';
import { Worker } from 'worker_threads';

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
    if (middleware.getSelectedBlockchains().length === 0) {
      console.log(CliStrings.CliStructure);
      await sleep(8000);
      return;
    }
    console.log(CliStrings.NFTMintingClarification);

    // get name
    const inputSetNftName = await getInput(
      CliStrings.NFTMintingQuestionName,
      middleware.getNftName()
    );
    if (inputSetNftName === null) return;
    middleware.setNftName(inputSetNftName);
    // get hash
    middleware.setNftHash(middleware.getNftHash());
    // get link
    const inputSetNftLink = await getInput(
      CliStrings.NFTMintingQuestionLink,
      middleware.getNftLink()
    );
    if (inputSetNftLink === null) return;
    middleware.setNftLink(inputSetNftLink);
    // get blockchain specific nft receiver
    for (const blockchain of middleware.getSelectedBlockchains()) {
      const inputSetPublicKeyNftReceiver = await getInput(
        CliStrings.NFTMintingQuestionNFTReceiver(blockchain),
        middleware.getPublicKeyNftReceiver(blockchain)
      );
      if (inputSetPublicKeyNftReceiver === null) return;
      middleware.setPublicKeyNftReceiver(
        inputSetPublicKeyNftReceiver,
        blockchain
      );
    }
    // print summary
    this.print_header();
    console.log(CliStrings.NFTMintingFeedbackSelectedBlockchains);
    console.log(CliStrings.NFTMintingFeedbackNFTName);
    console.log(CliStrings.NFTMintingFeedbackNFTHash);
    console.log(CliStrings.NFTMintingFeedbackNFTLink);

    console.log(CliStrings.horizontalHashLine);
    if (middleware.getSelectedBlockchains().length === 0) {
      console.log(`No blockchains selected`);
      console.log(CliStrings.NFTMintingWarning);
    }
    for (const blockchain of middleware.getSelectedBlockchains()) {
      console.log();
      if (blockchain === 'Solana') {
        // console.log('Gas Limit: Not implemented yet');
      } else {
        console.log(CliStrings.NFTMintingFeedbackGasLimit(blockchain));
      }
      try {
        console.log(
          await CliStrings.NFTMintingFeedbackEstimatedGasFee(blockchain)
        );
      } catch (e: unknown) {
        if (await showException(<NftPlaybookException>e)) {
          return;
        }
      }

      console.log(CliStrings.NFTMintingFeedbackServerUri(blockchain));
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
      const worker = new Worker('./packages/cli/src/app/Commands/CliWorker.ts');
      try {
        await middleware.mintNft();
      } catch (e: unknown) {
        console.log();
        worker.terminate();
        if (await showException(<NftPlaybookException>e)) {
          return;
        }
      }
      worker.terminate();
    } else {
      // prompt denied
      console.log(CliStrings.NFTMintingFeedbackAbort);
      await sleep(2000);
    }
  }
}
