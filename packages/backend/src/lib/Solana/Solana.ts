import { Blockchain } from '../Blockchain';
import { BlockchainConfigDeployContract } from '../BlockchainConfig/BlockchainConfigDeployContract';
import { SolanaConfigMintNFT } from './SolanaConfig/SolanaConfigMintNFT';
import { BlockchainConfigReadSmartContract } from '../BlockchainConfig/BlockchainConfigReadSmartContract';
import { BlockChainConfigReadTokenData } from '../BlockchainConfig/BlockChainConfigReadTokenData';
import { BlockChainConfigReadUserDataFromSmartContract } from '../BlockchainConfig/BlockChainConfigReadUserDataFromSmartContract';

// TODO: Check the type of the ConfigArguments!!!!!

import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { bundlrStorage, keypairIdentity, Metaplex } from "@metaplex-foundation/js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  transfer,
} from '@solana/spl-token';
import InputPrompt = require('inquirer/lib/prompts/input');

export class Solana implements Blockchain {
  deploy_contract(config: BlockchainConfigDeployContract): Promise<string> {
    throw new Error('Method not implemented.');
  }
  estimate_gas_fee_mint(config: SolanaConfigMintNFT): Promise<number> {
    throw new Error('Method not implemented.');
  }
 async mint_nft(config: SolanaConfigMintNFT): Promise<string> {
    const connection = new Connection(config.server_uri, 'confirmed');
    const privKey : Uint8Array  = Uint8Array.from(config.private_key_transmitter.split(",").map(s=> Number(s)));
    const wallet = Keypair.fromSecretKey(privKey);

    // (only for testing purposes) -> add some SOL to the user wallet
    const fromAirDropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL //lamport: A fractional native token with the value of 0.000000001 sol.
    );
     //Wait for airdrop confirmation
     await connection.confirmTransaction(fromAirDropSignature);   
    
     const metaplex = Metaplex.make(connection)
     .use(keypairIdentity(wallet)).use(bundlrStorage({
       address: 'https://devnet.bundlr.network',
       providerUrl: config.server_uri,
       timeout: 60000,
    }));

    const { uri } = await metaplex.nfts().uploadMetadata({
      name: "My NFT",
      description: "My description",
      image: "IPFS://DASKLAPPT",
    });

    console.log(JSON.stringify(uri));

    const {nft} = await metaplex.nfts().create({uri: uri});

    console.log("NFT minted: " + nft.metadata.image);
    return null;

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








  

  //Tutorial from https://www.quicknode.com/guides/web3-sdks/how-to-mint-an-nft-on-solana
  //Usefull solana terminology https://docs.solana.com/de/terminology
  async test_minting_to_solana() {
    // Connect to dev-cluster --> Solana provides online devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    //Generate a new wallet keypair and airdrop SOL --> airdropping is a mechanism in solana dev-net which provides free SOL tokens for testing reasons
    const fromWallet = Keypair.generate(); //Keypair: A public key and corresponding private key for accessing an account.

    const fromAirDropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
      LAMPORTS_PER_SOL //lamport: A fractional native token with the value of 0.000000001 sol.
    );
    console.log('hallofrom solana.ts');

    //Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirDropSignature);

    //Creating a new token called mint
    const mint = await createMint(
      connection,
      fromWallet, //payer of the tx
      fromWallet.publicKey, //Account that will control the minting
      null, //Account that will control the freezing of the token
      0 //Location of the decimal place
    ); //more information on https://solana-labs.github.io/solana-program-library/token/js/modules.html

    // Get the token account of the "fromWallet" Solana address. If it does not exist, create it.
    // You can think about the chain of custody like this: the NFT resides in the account, and your wallet owns this account.

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );

    //We have an account to send the NFT from; now, we need an account to send the NFT to.
    //Generate a new wallte to receive the newly minted token
    const toWallet = Keypair.generate();

    //Get the token account of the toWallet solana adress. If it does not exist, create a new one.
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet.publicKey
    );

    // Minting 1 new token to the "fromTokenAccount" account we just returned/created.
    let signature = await mintTo(
      connection,
      fromWallet, // Payer of the transaction fees
      mint, // Mint for the account
      fromTokenAccount.address, // Address of the account to mint to
      fromWallet.publicKey, // Minting authority
      1 // Amount to mint
    );

    await setAuthority(
      connection,
      fromWallet, // Payer of the transaction fees
      mint, // Account
      fromWallet.publicKey, // Current authority
      0, // Authority type: "0" represents Mint Tokens
      null // Setting the new Authority to null
    );

    signature = await transfer(
      connection,
      fromWallet, // Payer of the transaction fees
      fromTokenAccount.address, // Source account
      toTokenAccount.address, // Destination account
      fromWallet.publicKey, // Owner of the source account
      1 // Number of tokens to transfer
    );

    console.log('SIGNATURE', signature);
    return signature;
    //Find the minted NFT here: https://explorer.solana.com/?cluster=devnet
  }
}
