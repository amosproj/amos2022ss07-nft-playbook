import { Blockchain } from '../Blockchain';
import { BlockchainConfigDeployContract } from '../BlockchainConfig/BlockchainConfigDeployContract';
import { SolanaConfigMintNFT } from './SolanaConfig/SolanaConfigMintNFT';
import { BlockchainConfigReadSmartContract } from '../BlockchainConfig/BlockchainConfigReadSmartContract';
import { BlockChainConfigReadTokenData } from '../BlockchainConfig/BlockChainConfigReadTokenData';
import { BlockChainConfigReadUserDataFromSmartContract } from '../BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';
// TODO: Check the type of the ConfigArguments!!!!!
import CoinGecko = require('coingecko-api');
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from '@metaplex-foundation/js';

// this hardcoded value was calculated many times for the create function call. (07.10.2022)
// It will be adjusted while the program runs (for better approximations)
let estimated_lamport_per_mint = 11987475;

export class Solana implements Blockchain {
  deploy_contract(config: BlockchainConfigDeployContract): Promise<string> {
    config;
    throw new Error('Method not implemented.');
  }
  estimate_gas_fee_mint(config: SolanaConfigMintNFT): Promise<number> {
    config;
    return new Promise<number>((resolve) => {
      resolve(estimated_lamport_per_mint);
    });
  }
  async mint_nft(config: SolanaConfigMintNFT): Promise<string> {
    const connection = new Connection(config.server_uri, 'confirmed');
    const privKey: Uint8Array = Uint8Array.from(
      config.private_key_transmitter.split(',').map((s) => Number(s))
    );
    const pub_key = Keypair.fromSecretKey(
      Uint8Array.from(
        config.private_key_transmitter.split(',').map((item) => Number(item))
      )
    ).publicKey;
    const balance_before_create: number = await connection.getBalance(pub_key);

    const wallet = Keypair.fromSecretKey(privKey);

    // Global metaplex object, for communication with Metaplex program (aka Contract) system for minting NFTs
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(
        bundlrStorage({
          address: 'https://devnet.bundlr.network', //TODO: Set to public net
          providerUrl: config.server_uri,
          timeout: 60000,
        })
      );

    const { uri } = await metaplex.nfts().uploadMetadata({
      name: config.nftName,
      hash: config.nftHash,
      url: config.nftLink,
    });

    const { nft } = await metaplex
      .nfts()
      .create({ uri: uri, owner: new PublicKey(config.pub_key_NFT_receiver) });

    const balance_after_create: number = await connection.getBalance(pub_key);
    estimated_lamport_per_mint =
      (estimated_lamport_per_mint +
        (balance_before_create - balance_after_create)) /
      2;

    return nft.metadataAccount.data.mint.toString();
  }
  read_smart_contract(
    config: BlockchainConfigReadSmartContract
  ): Promise<void> {
    config;
    throw new Error('Method not implemented.');
  }
  read_user_data_from_smart_contract(
    config: BlockChainConfigReadUserDataFromSmartContract
  ): Promise<void> {
    config;
    throw new Error('Method not implemented.');
  }
  read_pic_data_from_smart_contract(
    config: BlockChainConfigReadTokenData
  ): Promise<void> {
    config;
    throw new Error('Method not implemented.');
  }

  async convert_lamport_to_euro(amount_of_lamport: number): Promise<number> {
    // Get CoinGecko object
    const CoinGeckoClient = new CoinGecko();

    // retrieve cryptocurrency price data for solana in euro
    const data = await CoinGeckoClient.simple.price({
      ids: ['solana'],
      vs_currencies: ['eur'],
    });

    // return the price in euro mit the maximum amount of digits
    return (data.data.solana.eur / Math.pow(10, 9)) * amount_of_lamport;
  }
}
