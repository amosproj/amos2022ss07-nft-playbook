import chalk = require('chalk');
import fs = require('fs');
import { NftPlaybookException } from './NftPlaybookException';
import { middleware } from '../';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinataSDK = require('@pinata/sdk');

export class PinataClient {
  public static apiKey = '';
  public static apiSec = '';

  public static async uploadImage(
    path: string,
    api_key: string,
    api_sec: string
  ): Promise<string> {
    const pinata = pinataSDK(api_key, api_sec);
    console.log('Upload Image started');
    try {
      const res = await pinata.pinFileToIPFS(fs.createReadStream(path));
      middleware.nftLog(`[pinata] upload successfull: ${res['IpfsHash']}`);
      return res['IpfsHash'];
    } catch (e: unknown) {
      middleware.nftLog(`[pinata] upload failed`);
      throw new NftPlaybookException(chalk.red(`Upload failed`), e);
    }
  }
}
