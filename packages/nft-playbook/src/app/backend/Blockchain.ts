import { BlockchainConfigDeployContract } from './BlockchainConfig/BlockchainConfigDeployContract';
import { BlockchainConfigMintNFT } from './BlockchainConfig/BlockchainConfigMintNFT';
import { BlockchainConfigReadSmartContract } from './BlockchainConfig/BlockchainConfigReadSmartContract';
import { BlockChainConfigReadUserDataFromSmartContract } from './BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';

export interface Blockchain {
  /**
   * Deploys a contract to blockchain defined in config
   * @param config
   */
  deploy_contract(config: BlockchainConfigDeployContract): Promise<string>;

  /**
   * Mints an NFT to a smartcontract, which is defined in config
   * @param config
   */
  mint_nft(config: BlockchainConfigMintNFT): Promise<void>;

  /**
   * Reads a smart contract, defined in config
   * @param config
   */
  read_smart_contract(config: BlockchainConfigReadSmartContract): Promise<void>;

  /**
   * Reads user data from a smart contract, defined in config
   * @param config
   */
  read_user_data_from_smart_contract(
    config: BlockChainConfigReadUserDataFromSmartContract
  ): Promise<void>;
}
