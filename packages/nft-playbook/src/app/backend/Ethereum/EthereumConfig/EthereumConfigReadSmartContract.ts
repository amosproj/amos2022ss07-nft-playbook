import { BlockchainConfigReadSmartContract } from '../../BlockchainConfig/BlockchainConfigReadSmartContract';

export class EthereumConfigReadSmartContract extends BlockchainConfigReadSmartContract {
  server_uri: string;
  address_of_contract: string;
  constructor(server_uri: string, address_of_contract: string) {
    super('EthereumConfigReadSmartContract');
    this.server_uri = server_uri;
    this.address_of_contract = address_of_contract;
  }
}
