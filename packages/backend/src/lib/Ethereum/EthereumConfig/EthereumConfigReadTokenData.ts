import { BlockChainConfigReadTokenData } from '../../BlockchainConfig/BlockChainConfigReadTokenData';

/**
 * Abstract Config for reading user data from a smart contract
 */
export class EthereumConfigReadTokenData extends BlockChainConfigReadTokenData {
  server_uri: string;
  address_of_contract: string;
  token_id: number;

  constructor(
    server_uri: string,
    address_of_contract: string,
    token_id: number
  ) {
    super('EthereumConfigReadTokenData');
    this.server_uri = server_uri;
    this.address_of_contract = address_of_contract;
    this.token_id = token_id;
  }
}
