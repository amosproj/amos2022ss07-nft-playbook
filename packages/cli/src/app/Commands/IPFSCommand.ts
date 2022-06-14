import { PinataClient } from '@nft-playbook/middleware';
import { CliStrings } from '../CliStrings';
import { Command, getInput, sleep } from './Command';
import { middleware } from '@nft-playbook/middleware';
import fs = require('fs');

export class IPFSCommand implements Command {
  name = CliStrings.IPFSCommandLabel;
  help = CliStrings.IPFSCommandHelp;

  async execute() {
    const api_key = await getInput(CliStrings.IPFSQuestionApiKey, undefined);
    const api_sec = await getInput(CliStrings.IPFSQuestionApiSec, undefined);
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
      link = await PinataClient.uploadImage(path, api_key, api_sec);
    } catch (err) {
      console.error(CliStrings.IPFSErrorMessageUpload);
      await sleep(2000);
      return;
    }
    middleware.setNftLink(link);
    middleware.setNftHash(link);
    console.log(link);
    await sleep(2000);
  }
}
