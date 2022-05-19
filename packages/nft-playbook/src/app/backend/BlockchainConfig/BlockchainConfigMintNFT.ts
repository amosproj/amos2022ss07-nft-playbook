export abstract class BlockchainConfigMintNFT {
  private type: string;
  NFT_name: string;
  hash: string;
  url_to_file: string;

  constructor(
    NFT_name: string,
    type: string,
    url_to_file: string,
    hash: string
  ) {
    this.NFT_name = NFT_name;
    this.type = type;
    this.url_to_file = url_to_file;
    this.hash = hash;
  }

  getType(): string {
    return this.type;
  }
}
