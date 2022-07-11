import { POSClient, use } from '@maticnetwork/maticjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { Blockchain } from "@nft-playbook/backend";
import { providers, Wallet } from "ethers";
import { BlockchainConfigDeployContract } from "../BlockchainConfig/BlockchainConfigDeployContract";
import { BlockchainConfigMintNFT } from "../BlockchainConfig/BlockchainConfigMintNFT";
import { BlockchainConfigReadSmartContract } from "../BlockchainConfig/BlockchainConfigReadSmartContract";
import { BlockChainConfigReadTokenData } from "../BlockchainConfig/BlockChainConfigReadTokenData";
import { BlockChainConfigReadUserDataFromSmartContract } from "../BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract";

use(Web3ClientPlugin);

export class Polygon implements Blockchain {
    deploy_contract(config: BlockchainConfigDeployContract): Promise<string> {
        throw new Error("Method not implemented.");
    }
    estimate_gas_fee_mint(config: BlockchainConfigMintNFT): Promise<number> {
        throw new Error("Method not implemented.");
    }
    mint_nft(config: BlockchainConfigMintNFT): Promise<string> {
        throw new Error("Method not implemented.");
    }
    read_smart_contract(config: BlockchainConfigReadSmartContract): Promise<void> {
        throw new Error("Method not implemented.");
    }
    read_user_data_from_smart_contract(config: BlockChainConfigReadUserDataFromSmartContract): Promise<void> {
        throw new Error("Method not implemented.");
    }
    read_pic_data_from_smart_contract(config: BlockChainConfigReadTokenData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    posClient = new POSClient();
}