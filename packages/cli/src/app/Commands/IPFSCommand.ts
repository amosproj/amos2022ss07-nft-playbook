import { NftPlaybookException, PinataClient } from '@nft-playbook/middleware';
import { CliStrings } from '../CliStrings';
import { Command, getInput, showException, sleep } from './Command';
import { middleware } from '@nft-playbook/middleware';
import fs = require('fs');

export class IPFSCommand implements Command {
  name = CliStrings.IPFSCommandLabel;
  help = CliStrings.IPFSCommandHelp;

  async execute() {
    let apiKey: string;
    let apiSec: string;
    if (
      process.env.API_KEY === undefined ||
      process.env.API_KEY === undefined
    ) {
      apiKey = await getInput(CliStrings.IPFSQuestionApiKey, undefined);
      apiSec = await getInput(CliStrings.IPFSQuestionApiSec, undefined);
    } else {
      apiKey = process.env.API_KEY;
      apiSec = process.env.API_SEC;
    }
    const path = await getInput(
      CliStrings.IPFSFileConfirmationQuestion,
      undefined
    );

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

    let link: string;
    try {
      link = await PinataClient.uploadImage(path, apiKey, apiSec);
    } catch (e: unknown) {
      await showException(<NftPlaybookException>e);
      return;
    }
    middleware.setNftLink(link);
    middleware.setNftHash(link);
    console.log(CliStrings.IPFSSuccessMessage(link));

    await sleep(5000);
  }
}
