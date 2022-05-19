import { BlockchainConfigDeployContract } from './BlockchainConfig/BlockchainConfigDeployContract';
import { BlockchainConfigMintNFT } from './BlockchainConfig/BlockchainConfigMintNFT';
import { BlockchainConfigReadSmartContract } from './BlockchainConfig/BlockchainConfigReadSmartContract';
import { BlockChainConfigReadUserDataFromSmartContract } from './BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';

export interface Blockchain {
  deploy_contract(config: BlockchainConfigDeployContract): Promise<string>;
  mint_nft(config: BlockchainConfigMintNFT): Promise<void>;
  read_smart_contract(config: BlockchainConfigReadSmartContract): Promise<void>;
  read_user_data_from_smart_contract(
    config: BlockChainConfigReadUserDataFromSmartContract
  ): Promise<void>;
}
