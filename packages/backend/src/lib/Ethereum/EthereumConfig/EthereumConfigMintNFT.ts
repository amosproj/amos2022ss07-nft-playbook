import { BlockchainConfigMintNFT } from '../../BlockchainConfig/BlockchainConfigMintNFT';

export class EthereumConfigMintNFT extends BlockchainConfigMintNFT {
  endPoint: string;
  private_key_transmitter: string;
  address_of_contract: string;
  pub_key_NFT_receiver: string;
  gas_limit: number;
  constructor(
    NFT_name: string,
    endPoint: string,
    private_key_transmitter: string,
    address_of_contract: string,
    pub_key_NFT_receiver: string,
    hash: string,
    url_to_file: string,
    gas_limit: number
  ) {
    super(NFT_name, 'EthereumConfigMintNFT', url_to_file, hash);
    this.endPoint = endPoint;
    this.private_key_transmitter = private_key_transmitter;
    this.address_of_contract = address_of_contract;
    this.pub_key_NFT_receiver = pub_key_NFT_receiver;
    this.gas_limit = gas_limit;
  }
}
