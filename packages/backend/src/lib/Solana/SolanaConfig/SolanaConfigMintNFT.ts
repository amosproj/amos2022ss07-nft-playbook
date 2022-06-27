import { BlockchainConfigMintNFT } from '../../BlockchainConfig/BlockchainConfigMintNFT';

export class SolanaConfigMintNFT extends BlockchainConfigMintNFT {
  server_uri: string;
  private_key_transmitter: string;
  pub_key_NFT_receiver: string;
  constructor(
    NFT_name: string,
    server_uri: string,
    private_key_transmitter: string,
    pub_key_NFT_receiver: string,
    nftHash: string,
    nftLink: string
  ) {
    super(NFT_name, 'SolanaConfigMintNFT', nftLink, nftHash);
    this.server_uri = server_uri;
    this.private_key_transmitter = private_key_transmitter;
    this.pub_key_NFT_receiver = pub_key_NFT_receiver;
  }
}
