import { BlockChainConfigReadUserDataFromSmartContract } from '../../BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';

export class EthereumConfigReadUserDataFromSmartContract extends BlockChainConfigReadUserDataFromSmartContract {
  server_uri: string;
  address_of_contract: string;
  pub_key_user: string;
  constructor(
    server_uri: string,
    address_of_contract: string,
    pub_key_user: string
  ) {
    super('EthereumConfigReadUserDataFromSmartContract');
    this.server_uri = server_uri;
    this.address_of_contract = address_of_contract;
    this.pub_key_user = pub_key_user;
  }
}
