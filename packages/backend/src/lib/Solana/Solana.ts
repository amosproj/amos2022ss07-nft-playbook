import { Blockchain } from '../Blockchain';
import { BlockchainConfigDeployContract } from '../BlockchainConfig/BlockchainConfigDeployContract';
import { BlockchainConfigMintNFT } from '../BlockchainConfig/BlockchainConfigMintNFT';
import { BlockchainConfigReadSmartContract } from '../BlockchainConfig/BlockchainConfigReadSmartContract';
import { BlockChainConfigReadTokenData } from '../BlockchainConfig/BlockChainConfigReadTokenData';
import { BlockChainConfigReadUserDataFromSmartContract } from '../BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';

export class Solana implements Blockchain {
  deploy_contract(config: BlockchainConfigDeployContract): Promise<string> {
    throw new Error('Method not implemented.');
  }
  estimate_gas_fee_mint(config: BlockchainConfigMintNFT): Promise<number> {
    throw new Error('Method not implemented.');
  }
  mint_nft(config: BlockchainConfigMintNFT): Promise<number> {
    throw new Error('Method not implemented.');
  }
  read_smart_contract(
    config: BlockchainConfigReadSmartContract
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  read_user_data_from_smart_contract(
    config: BlockChainConfigReadUserDataFromSmartContract
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  read_pic_data_from_smart_contract(
    config: BlockChainConfigReadTokenData
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
