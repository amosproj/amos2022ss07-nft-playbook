import { BlockchainConfigDeployContract } from '../../BlockchainConfig/BlockchainConfigDeployContract';

export class EthereumConfigDeployContract extends BlockchainConfigDeployContract {
  server_uri: string;
  path_to_contract: string;
  private_key_of_contract_owner: string;
  name_of_contract: string;
  symbol_of_contract: string;
  baseuri_of_contract: string;

  constructor(
    server_uri: string,
    path_to_contract: string,
    private_key_of_contract_owner: string,
    name_of_contract: string,
    symbol_of_contract: string,
    baseuri_of_contract: string
  ) {
    super('EthereumConfigDeployContract');
    this.server_uri = server_uri;
    this.path_to_contract = path_to_contract;
    this.private_key_of_contract_owner = private_key_of_contract_owner;
    this.name_of_contract = name_of_contract;
    this.symbol_of_contract = symbol_of_contract;
    this.baseuri_of_contract = baseuri_of_contract;
  }
}
