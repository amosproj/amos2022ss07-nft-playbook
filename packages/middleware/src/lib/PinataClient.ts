import fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinataSDK = require('@pinata/sdk');

export class PinataClient {
  public static async uploadImage(
    path: string,
    api_key: string,
    api_sec: string
  ): Promise<string> {
    const pinata = pinataSDK(api_key, api_sec);
    console.log('Upload Image started');

    const res = await pinata.pinFileToIPFS(fs.createReadStream(path));
    return res['IpfsHash'];
  }
}
