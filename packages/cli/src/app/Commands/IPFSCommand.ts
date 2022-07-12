import { NftPlaybookException, PinataClient } from '@nft-playbook/middleware';
import { CliStrings } from '../CliStrings';
import { Command, getInput, showException, sleep } from './Command';
import { middleware } from '@nft-playbook/middleware';
import fs = require('fs');

export class IPFSCommand implements Command {
  name = CliStrings.IPFSCommandLabel;
  help = CliStrings.IPFSCommandHelp;

  private print_header() {
    console.clear();
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.IPFSMenuHeader);
    console.log(CliStrings.horizontalHashLine);
  }

  async execute() {
    this.print_header();
    let apiKey: string;
    let apiSec: string;
    if (
      process.env.PINATA_API_KEY === undefined ||
      process.env.PINATA_API_KEY.length === 0 ||
      process.env.PINATA_API_SEC === undefined ||
      process.env.PINATA_API_SEC.length === 0
    ) {
      //console.log(CliStrings.IPFSCommandHelp, '');
      console.log(CliStrings.IPFSClarification);
      apiKey = await getInput(CliStrings.IPFSQuestionApiKey, '');
      if(apiKey === null) return;
      apiSec = await getInput(CliStrings.IPFSQuestionApiSec, '');
      if(apiSec === null) return;
    } else {
      apiKey = process.env.PINATA_API_KEY;
      apiSec = process.env.PINATA_API_SEC;
    }
    const path = await getInput(CliStrings.IPFSFileConfirmationQuestion, '');
    if (path === null) return;

    try {
      fs.accessSync(path, fs.constants.R_OK);
      if (!fs.statSync(path).isFile()) {
        console.log(CliStrings.IPFSErrorMessageNotFile);
        await sleep(2000);
        return;
      }
    } catch (err) {
      console.log(CliStrings.IPFSErrorMessageNoAccess);
      await sleep(2000);
      return;
    }

    let hash: string;
    try {
      hash = await PinataClient.uploadImage(path, apiKey, apiSec);
    } catch (e: unknown) {
      await showException(<NftPlaybookException>e);
      return;
    }
    middleware.setNftHash(hash);
    const link = `https://gateway.ipfs.io/ipfs/${hash}`;
    middleware.setNftLink(link);
    console.log(CliStrings.IPFSSuccessMessage(link));

    await sleep(5000);
  }
}
