/**
 * Abstract Config for Minting a NFT
 */
export abstract class BlockchainConfigMintNFT {
  private type: string;
  nftName: string;
  nftHash: string;
  nftLink: string;

  constructor(nftName: string, type: string, nftLink: string, nftHash: string) {
    this.nftName = nftName;
    this.type = type;
    this.nftLink = nftLink;
    this.nftHash = nftHash;
  }

  getType(): string {
    return this.type;
  }
}
