import { CliStrings } from '../CliStrings';
import { Command, getInput, showException, sleep } from './Command';
import fs = require('fs');
import {
  middleware,
  NftPlaybookException,
  PinataClient,
} from '@nft-playbook/middleware';
import inquirer = require('inquirer');
import chalk = require('chalk');

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
    if (middleware.getSelectedBlockchains().length === 0) {
      console.log(CliStrings.CliStructure);
      await sleep(8000);
      return;
    }
    const path = await getInput(CliStrings.BulkMintingConfirmationQuestion, '');
    if (path === null) return;
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

    if (
      process.env.PINATA_API_KEY === undefined ||
      process.env.PINATA_API_KEY.length === 0 ||
      process.env.PINATA_API_SEC === undefined ||
      process.env.PINATA_API_SEC.length === 0
    ) {
      if (
        PinataClient.apiKey === null ||
        PinataClient.apiKey === undefined ||
        PinataClient.apiSec === null ||
        PinataClient.apiSec === undefined
      ) {
        PinataClient.apiKey = await getInput(CliStrings.IPFSQuestionApiKey, '');
        if (PinataClient.apiKey === null) return;
        PinataClient.apiSec = await getInput(CliStrings.IPFSQuestionApiSec, '');
        if (PinataClient.apiSec === null) return;
      }
    } else {
      PinataClient.apiKey = process.env.PINATA_API_KEY;
      PinataClient.apiSec = process.env.PINATA_API_SEC;
    }

    const file: string = fs.readFileSync(path, 'utf-8');

    const nfts: {
      nfts: [
        {
          name: string;
          path: string;
          blockchains: [{ name: string; receiver: string }];
        }
      ];
    } = JSON.parse(file);

    const nftSettings: {
      [nft: string]: {
        hash: string;
        link: string;
      };
    } = {};

    let estimateGasFeeEthereum = 0;
    let estimateGasFeeEthereumInEuro = 0;
    let estimateGasFeeSolana = 0;
    let estimateGasFeeSolanaInEuro = 0;
    let countOfEthereumNfts = 0;
    let countOfSolanaNfts = 0;

    for (const nft of nfts.nfts) {
      let hash: string | undefined = undefined;
      try {
        hash = await PinataClient.uploadImage(
          nft.path,
          PinataClient.apiKey,
          PinataClient.apiSec
        );
      } catch (e: unknown) {
        if (await showException(<NftPlaybookException>e)) {
          return;
        }
      }
      if (hash == undefined) {
        //TODO: Show error message!
        return;
      }
      middleware.setNftHash(hash);
      const link = `https://gateway.ipfs.io/ipfs/${hash}`;
      middleware.setNftLink(link);
      nftSettings[nft.name] = { hash, link };

      middleware.setNftName(nft.name);
      middleware.getSelectedBlockchains().forEach((x) => {
        middleware.deselectBlockchain(x);
      });

      for (const blockchain of nft.blockchains) {
        middleware.selectBlockchain(blockchain.name);
        middleware.setPublicKeyNftReceiver(
          blockchain.receiver,
          blockchain.name
        );
      }
      console.log(CliStrings.NFTMintingFeedbackSelectedBlockchains);
      console.log(CliStrings.NFTMintingFeedbackNFTName);
      console.log(CliStrings.NFTMintingFeedbackNFTHash);
      console.log(CliStrings.NFTMintingFeedbackNFTLink);
      if (middleware.getSelectedBlockchains().length === 0) {
        console.log(`No blockchains selected`);
      }
      for (const blockchain of middleware.getSelectedBlockchains()) {
        console.log();
        if (blockchain !== 'Solana') {
          console.log(CliStrings.NFTMintingFeedbackGasLimit(blockchain));
        }
        try {
          const estimateGasFee = await middleware.estimateGasFeeMint(
            blockchain
          );
          console.log(
            `${blockchain} Estimated gas fee: ${chalk.cyan(
              `${estimateGasFee.crypto} => ${estimateGasFee.fiat}`
            )}`
          );
          if (blockchain === 'Solana') {
            countOfSolanaNfts++;
            estimateGasFeeSolana += Number(estimateGasFee.crypto.split(' ')[0]);
            estimateGasFeeSolanaInEuro += Number(
              estimateGasFee.fiat.split(' ')[0]
            );
          } else if (blockchain === 'Ethereum') {
            countOfEthereumNfts++;
            estimateGasFeeEthereum += Number(
              estimateGasFee.crypto.split(' ')[0]
            );
            estimateGasFeeEthereumInEuro += Number(
              estimateGasFee.fiat.split(' ')[0]
            );
          }
        } catch (e: unknown) {
          if (await showException(<NftPlaybookException>e)) {
            return;
          }
        }
        console.log(CliStrings.NFTMintingFeedbackServerUri(blockchain));
        console.log(CliStrings.NFTMintingFeedbackNFTReceiver(blockchain));
      }
      console.log(CliStrings.horizontalHashLine);
    }
    console.log(`Minted ${countOfEthereumNfts} NFTs on Ethereum`);
    console.log(
      `Total gas fee Ethereum: ${estimateGasFeeEthereum} Gwei => ${estimateGasFeeEthereumInEuro.toFixed(
        5
      )} Euro`
    );
    console.log(`Minted ${countOfSolanaNfts} NFTs on Solana`);
    console.log(
      `Total gas fee Solana: ${estimateGasFeeSolana} Lamport => ${estimateGasFeeSolanaInEuro.toFixed(
        5
      )} Euro`
    );

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
        const totalNfts = nfts.nfts.length;
        let mintedNfts = 0;
        for (const nft of nfts.nfts) {
          middleware.setNftHash(nftSettings[nft.name].hash);
          middleware.setNftLink(nftSettings[nft.name].link);
          middleware.setNftName(nft.name);
          middleware.getSelectedBlockchains().forEach((x) => {
            middleware.deselectBlockchain(x);
          });
          nft.blockchains.forEach((blochchain) => {
            middleware.selectBlockchain(blochchain.name);
            middleware.setPublicKeyNftReceiver(
              blochchain.receiver,
              blochchain.name
            );
          });
          await middleware.mintNft();
          mintedNfts++;
          console.log(
            CliStrings.BulkMintingCommandProgress(mintedNfts, totalNfts)
          );
          await sleep(1000);
        }
      } catch (e: unknown) {
        if (await showException(<NftPlaybookException>e)) {
          return;
        }
      }
      const promptQuestion: inquirer.QuestionCollection = [
        {
          type: 'confirm',
          name: 'confirmed',
          message: CliStrings.BulkMintingCommandSucsessMessage,
        },
      ];
      await inquirer.prompt(promptQuestion);
    } else {
      // prompt denied
      console.log(CliStrings.NFTMintingFeedbackAbort);
      await sleep(2000);
    }
  }
}
