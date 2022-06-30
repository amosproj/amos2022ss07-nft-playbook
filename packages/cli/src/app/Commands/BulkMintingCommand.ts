import { CliStrings } from '../CliStrings';
import { Command, getInput, showException, sleep } from './Command';
import fs = require('fs');
import {
  middleware,
  NftPlaybookException,
  PinataClient,
} from '@nft-playbook/middleware';
import inquirer = require('inquirer');

export class BulkMintingCommand implements Command {
  name: string = CliStrings.BulkMintingCommandLabel;
  help: string = CliStrings.BulkMintingCommandHelp;

  private print_header() {
    console.clear();
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.BulkMintingCommandMenuHeader);
    console.log(CliStrings.horizontalHashLine);
  }

  async execute(): Promise<void> {
    this.print_header();
    const path = await getInput(
      CliStrings.BulkMintingConfirmationQuestion,
      undefined
    );
    try {
      fs.accessSync(path, fs.constants.R_OK);
      if (!fs.statSync(path).isFile()) {
        console.log(CliStrings.BulkMintingErrorMessageNotFile);
        await sleep(2000);
        return;
      }
    } catch (err) {
      console.log(CliStrings.BulkMintingErrorMessageNoAccess);
      await sleep(2000);
      return;
    }
    let apiKey: string;
    let apiSec: string;
    if (
      process.env.PINATA_API_KEY === undefined ||
      process.env.PINATA_API_KEY.length === 0 ||
      process.env.PINATA_API_SEC === undefined ||
      process.env.PINATA_API_SEC.length === 0
    ) {
      apiKey = await getInput(CliStrings.IPFSQuestionApiKey, undefined);
      apiSec = await getInput(CliStrings.IPFSQuestionApiSec, undefined);
    } else {
      apiKey = process.env.PINATA_API_KEY;
      apiSec = process.env.PINATA_API_SEC;
    }

    const file: string = fs.readFileSync(path, 'utf-8');

    const nfts: {
      nfts: [
        {
          name: string;
          path: string;
          blockchains: [{ name: string; transmitter: string }];
        }
      ];
    } = JSON.parse(file);

    for (const nft of nfts.nfts) {
      let hash: string;
      try {
        hash = await PinataClient.uploadImage(nft.path, apiKey, apiSec);
      } catch (e: unknown) {
        await showException(<NftPlaybookException>e);
        return;
      }
      middleware.setNftHash(hash);
      const link = `https://gateway.ipfs.io/ipfs/${hash}`;
      middleware.setNftLink(link);

      middleware.setNftName(nft.name);
      middleware.getSelectedBlockchains().forEach((x) => {
        middleware.deselectBlockchain(x);
      });
      nft.blockchains.forEach((blochchain) => {
        middleware.selectBlockchain(blochchain.name);
        middleware.setPublicKeyNftReceiver(
          blochchain.transmitter,
          blochchain.name
        );
      });
      this.print_header();
      console.log(CliStrings.NFTMintingFeedbackSelectedBlockchains);
      console.log(CliStrings.NFTMintingFeedbackNFTName);
      console.log(CliStrings.NFTMintingFeedbackNFTHash);
      console.log(CliStrings.NFTMintingFeedbackNFTLink);

      console.log(CliStrings.horizontalHashLine);

      for (const blockchain of middleware.getSelectedBlockchains()) {
        console.log();
        if (blockchain === 'Solana') {
          console.log('Gas Limit: Not implemented yet');
        } else {
          console.log(CliStrings.NFTMintingFeedbackGasLimit(blockchain));
        }
        try {
          if (blockchain === 'Solana') {
            console.log('Estimated gas fee: Not implemented yet');
          } else {
            console.log(
              await CliStrings.NFTMintingFeedbackEstimatedGasFeeGwei(blockchain)
            );
          }
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
}
