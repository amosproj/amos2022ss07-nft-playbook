import { NftPlaybookException, PinataClient } from '@nft-playbook/middleware';
import { CliStrings } from '../CliStrings';
import {
  checkPinataCredentials,
  Command,
  getInput,
  showException,
  sleep,
} from './Command';
import { middleware } from '@nft-playbook/middleware';
import fs = require('fs');
import { Worker } from 'worker_threads';

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
    if (!(await checkPinataCredentials())) {
      return;
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
    const worker = new Worker('./packages/cli/src/app/Commands/CliWorker.ts');
    try {
      hash = await PinataClient.uploadImage(
        path,
        PinataClient.apiKey,
        PinataClient.apiSec
      );
    } catch (e: unknown) {
      worker.terminate();
      console.log();
      await showException(<NftPlaybookException>e);
      return;
    }
    worker.terminate();
    console.log();
    middleware.setNftHash(hash);
    const link = `https://gateway.ipfs.io/ipfs/${hash}`;
    middleware.setNftLink(link);
    console.log(CliStrings.IPFSSuccessMessage(link));

    await sleep(5000);
  }
}
