import { Blockchain } from '../Blockchain';
import { BlockchainConfigDeployContract } from '../BlockchainConfig/BlockchainConfigDeployContract';
import { SolanaConfigMintNFT } from './SolanaConfig/SolanaConfigMintNFT';
import { BlockchainConfigReadSmartContract } from '../BlockchainConfig/BlockchainConfigReadSmartContract';
import { BlockChainConfigReadTokenData } from '../BlockchainConfig/BlockChainConfigReadTokenData';
import { BlockChainConfigReadUserDataFromSmartContract } from '../BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';

// TODO: Check the type of the ConfigArguments!!!!!

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from '@metaplex-foundation/js';

export class Solana implements Blockchain {
  deploy_contract(config: BlockchainConfigDeployContract): Promise<string> {
    throw new Error('Method not implemented.');
  }
  estimate_gas_fee_mint(config: SolanaConfigMintNFT): Promise<number> {
    throw new Error('Method not implemented.');
  }
  async mint_nft(config: SolanaConfigMintNFT): Promise<string> {
    const connection = new Connection(config.server_uri, 'confirmed');
    const privKey: Uint8Array = Uint8Array.from(
      config.private_key_transmitter.split(',').map((s) => Number(s))
    );
    const wallet = Keypair.fromSecretKey(privKey);

    // (only for testing purposes) -> add some SOL to the user wallet
    const fromAirDropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL //lamport: A fractional native token with the value of 0.000000001 sol.
    );
    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirDropSignature);

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
    return nft.metadataAccount.data.mint.toString();
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
