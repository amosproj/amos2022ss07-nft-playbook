import {
  Ethereum,
  EthereumConfigMintNFT,
  EthereumConfigDeployContract,
  EthereumConfigReadTokenData,
  EthereumConfigReadSmartContract,
  EthereumConfigReadUserDataFromSmartContract,
  SolanaConfigMintNFT,
  Solana,
} from '@nft-playbook/backend';
import { NftPlaybookException } from './NftPlaybookException';
import { SettingsData } from './SettingsData';
import fs = require('fs');

export class Middleware {
  private _selectedBlockchains: { [blockchain: string]: SettingsData } = {};

  public init(configFilePath: string) {
    this.addBlockchain('Ethereum', configFilePath);
    this.addBlockchain('Solana', configFilePath);
  }

  private addBlockchain(blockchain: string, configFilePath: string) {
    try {
      this._selectedBlockchains[blockchain] = new SettingsData(
        blockchain,
        configFilePath
      );
    } catch (e: unknown) {
      throw new NftPlaybookException(
        `Error reading config for ${blockchain}`,
        e
      );
    }
  }

  public selectBlockchain(blockchain: string) {
    this._selectedBlockchains[blockchain].isSelected = true;
  }

  public deselectBlockchain(blockchain: string) {
    this._selectedBlockchains[blockchain].isSelected = false;
  }

  public getAllBlockchains(): string[] {
    try {
      return Object.keys(this._selectedBlockchains);
    } catch (e: unknown) {
      return [];
    }
  }

  public getSelectedBlockchains(): string[] {
    try {
      return Object.keys(this._selectedBlockchains).filter(
        (blockchain) => this._selectedBlockchains[blockchain].isSelected
      );
    } catch (e: unknown) {
      return [];
    }
  }

  public async estimateGasFeeMint(
    blockchain: string
  ): Promise<{ crypto: string; fiat: string }> {
    const data: SettingsData = this._selectedBlockchains[blockchain];

    try {
      switch (blockchain) {
        case 'Ethereum': {
          const estimateGasFeeMintEthereum =
            await this._estimateGasFeeMintGweiAndEuroEthereum(
              SettingsData.nftName,
              data.SERVER_URI,
              data.userPrivKey,
              data.smartContractAddress,
              data.pubKeyNftReceiver,
              SettingsData.nftHash,
              SettingsData.nftLink,
              data.GAS_LIMIT
            );

          return estimateGasFeeMintEthereum;
        }
        case 'Solana': {
          const estimateGasFeeMintSolana =
            await this._estimateGasFeeMintLamportAndEuroSolana();

          return estimateGasFeeMintSolana;
        }
        default: {
          break;
        }
      }
    } catch (e: unknown) {
      throw new NftPlaybookException(
        `Error estimating gas fee on ${blockchain}`,
        e
      );
    }
    return { crypto: '', fiat: '' };
  }

  public async mintNft() {
    const nftPlaybookExceptions: NftPlaybookException[] = [];

    await Promise.all(
      this.getSelectedBlockchains().map(async (blockchain) => {
        const data: SettingsData = this._selectedBlockchains[blockchain];
        try {
          switch (blockchain) {
            case 'Ethereum': {
              await this._mintNftEthereum(
                SettingsData.nftName,
                data.SERVER_URI,
                data.userPrivKey,
                data.smartContractAddress,
                data.pubKeyNftReceiver,
                SettingsData.nftHash,
                SettingsData.nftLink,
                data.GAS_LIMIT
              );
              break;
            }
            case 'Solana': {
              await this._mintNftSolana(
                SettingsData.nftName,
                data.SERVER_URI,
                data.userPrivKey,
                data.pubKeyNftReceiver,
                SettingsData.nftHash,
                SettingsData.nftLink
              );
              break;
            }
            default: {
              break;
            }
          }

          this.nftLog(
            `[mint] [${blockchain}:${data.SERVER_URI}] mint successfull ${SettingsData.nftName} on ${data.smartContractAddress}`
          );
        } catch (e: unknown) {
          this.nftLog(`[mint] [${blockchain}:${data.SERVER_URI}] mint failed`);
          nftPlaybookExceptions.push(new NftPlaybookException(blockchain, e));
        }

        this._selectedBlockchains[blockchain] = data;
      })
    );
    if (nftPlaybookExceptions.length !== 0) {
      throw new NftPlaybookException('Mint NFT Error', nftPlaybookExceptions);
    }
  }

  /* deployContract will be called for each specific blockchain individually */
  public async deployContract(blockchain: string) {
    const data: SettingsData = this._selectedBlockchains[blockchain];

    try {
      switch (blockchain) {
        case 'Ethereum': {
          data.smartContractAddress = await this._deployContractEthereum(
            data.SERVER_URI,
            './packages/backend/src/lib/contracts/simple_amos_nft_contract.sol', // path to smart contract
            data.userPrivKey,
            'CONTRAC-NAME', // TODO
            'CONTRACT-SYMBOL', // TODO
            'BASE-URI' // TODO
          );
          break;
        }
        case 'Solana': {
          // this._deployContractFlow();
          break;
        }
        default: {
          break;
        }
      }

      this.nftLog(
        `[deploy] [${blockchain}:${data.SERVER_URI}] deployed contract ${data.smartContractAddress}`
      );
    } catch (e: unknown) {
      this.nftLog(`[deploy] [${blockchain}:${data.SERVER_URI}] deploy failed`);
      throw new NftPlaybookException(
        `Error deploying contract on ${blockchain}`,
        e
      );
    }
    this._selectedBlockchains[blockchain] = data;
  }

  /* public readUserData() {
    const nftPlaybookExceptions: NftPlaybookException[] = [];

    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];

      try {
        switch (blockchain) {
          case 'Ethereum': {
            this._readUserData(
              data.SERVER_URI,
              data.smartContractAddress,
              'User-Private-Key' //TODO
            );
            break;
          }
          case 'Flow': {
            //this._deployContractFlow();
            break;
          }
          default: {
            break;
          }
        }
      } catch (e) {
        nftPlaybookExceptions.push(new NftPlaybookException(blockchain, e));
      }
      this._selectedBlockchains[blockchain] = data;
    });

    if (nftPlaybookExceptions.length !== 0) {
      throw new NftPlaybookException(
        'Error reading user data',
        nftPlaybookExceptions
      );
    }
  }

  public readSmartContract() {
    const nftPlaybookExceptions: NftPlaybookException[] = [];

    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];
      try {
        switch (blockchain) {
          case 'Ethereum': {
            this._readSmartContract(data.SERVER_URI, data.smartContractAddress);
            break;
          }
          case 'Flow': {
            //this._deployContractFlow();
            break;
          }
          default: {
            break;
          }
        }
      } catch (e) {
        nftPlaybookExceptions.push(new NftPlaybookException(blockchain, e));
      }
      this._selectedBlockchains[blockchain] = data;
    });
    if (nftPlaybookExceptions.length !== 0) {
      throw new NftPlaybookException(
        'Error reading smart contract',
        nftPlaybookExceptions
      );
    }
  }

  public readTokenData() {
    const nftPlaybookExceptions: NftPlaybookException[] = [];

    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];

      try {
        switch (blockchain) {
          case 'Ethereum': {
            this._readTokenData(
              data.SERVER_URI,
              data.smartContractAddress,
              -1 // Token-ID --> TODO
            );
            break;
          }
          case 'Flow': {
            //this._deployContractFlow();
            break;
          }
          default: {
            break;
          }
        }
      } catch (e) {
        nftPlaybookExceptions.push(new NftPlaybookException(blockchain, e));
      }
      this._selectedBlockchains[blockchain] = data;
    });
    if (nftPlaybookExceptions.length !== 0) {
      throw new NftPlaybookException(
        'Error reading token data',
        nftPlaybookExceptions
      );
    }
  }*/

  // setter
  public setNftName(val: string) {
    SettingsData.nftName = val;
  }

  public setNftHash(val: string) {
    SettingsData.nftHash = val;
  }

  public setNftLink(val: string) {
    SettingsData.nftLink = val;
  }

  public setPrivateKeyUser(val: string, blockchain: string) {
    this._selectedBlockchains[blockchain].userPrivKey = val;
  }

  public setSmartContractAddress(val: string, blockchain: string) {
    this._selectedBlockchains[blockchain].smartContractAddress = val;
  }

  public setPublicKeyNftReceiver(val: string, blockchain: string) {
    this._selectedBlockchains[blockchain].pubKeyNftReceiver = val;
  }

  public setContractAddress(blockchain: string, contract_addr: string) {
    const data: SettingsData = this._selectedBlockchains[blockchain];

    switch (blockchain) {
      case 'Ethereum': {
        data.smartContractAddress = contract_addr;
        break;
      }
      case 'Solana': {
        data.smartContractAddress = contract_addr;
        break;
      }
      default: {
        break;
      }
    }

    this._selectedBlockchains[blockchain] = data;
  }

  // getter
  public getNftName() {
    return SettingsData.nftName;
  }

  public getNftHash() {
    return SettingsData.nftHash;
  }

  public getNftLink() {
    return SettingsData.nftLink;
  }

  public getSmartContractAddress(blockchain: string) {
    return this._selectedBlockchains[blockchain].smartContractAddress;
  }

  public getPublicKeyNftReceiver(blockchain: string) {
    return this._selectedBlockchains[blockchain].pubKeyNftReceiver;
  }

  public getPrivateKeyUser(blockchain: string) {
    return this._selectedBlockchains[blockchain].userPrivKey;
  }

  public getGasLimit(blockchain: string) {
    return this._selectedBlockchains[blockchain].GAS_LIMIT;
  }

  public getServerUri(blockchain: string) {
    return this._selectedBlockchains[blockchain].SERVER_URI;
  }

  public getLogFile(): string {
    return SettingsData.logFile;
  }

  public nftLog(input: string, date = true) {
    if (date) {
      fs.appendFileSync(this.getLogFile(), `${Date()}: ${input}`);
    } else {
      fs.appendFileSync(this.getLogFile(), input);
    }
    fs.appendFileSync(this.getLogFile(), '\n');
  }

  /* mint an NFT on Ethereum */
  private async _mintNftEthereum(
    nft_name: string,
    server_uri: string,
    priv_key_NFT_transmitter: string,
    addr: string,
    pub_key_NFT_receiver: string,
    nft_hash: string,
    nft_link: string,
    GAS_LIMIT: number
  ): Promise<string> {
    const ethereumConfigMintNFT = new EthereumConfigMintNFT(
      nft_name,
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      nft_hash,
      nft_link,
      GAS_LIMIT
    );

    //mint nft on given contract
    return await new Ethereum().mint_nft(ethereumConfigMintNFT);
  }

  /* deploy an contract on Ethereum */
  private async _deployContractEthereum(
    server_uri: string,
    contract_path: string,
    priv_key_contract_owner: string,
    name_of_contract: string,
    symbol_of_contract: string,
    baseuri_of_contract: string
  ): Promise<string> {
    const ethereumConfigDeployContract = new EthereumConfigDeployContract(
      server_uri,
      contract_path, //'./packages/backend/src/lib/contracts/simple_amos_nft_contract.sol',
      priv_key_contract_owner,
      name_of_contract, // 'NFT-DEMO-CONTRACT',
      symbol_of_contract,
      baseuri_of_contract
    );

    // deploy contract on ethereum blockchain
    return await new Ethereum().deploy_contract(ethereumConfigDeployContract);
  }

  private async _estimateGasFeeMintGweiAndEuroEthereum(
    nft_name: string,
    server_uri: string,
    priv_key_NFT_transmitter: string,
    addr: string,
    pub_key_NFT_receiver: string,
    nft_hash: string,
    nft_link: string,
    GAS_LIMIT: number
  ): Promise<{ crypto: string; fiat: string }> {
    const ethereumConfigMintNFT = new EthereumConfigMintNFT(
      nft_name,
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      nft_hash,
      nft_link,
      GAS_LIMIT
    );
    const ANZ_DIGITS = 5;

    // get amount of gwei and euro
    const amount_of_gwei: number = await new Ethereum().estimate_gas_fee_mint(
      ethereumConfigMintNFT
    );
    const amount_of_euro: number = await new Ethereum().convert_gwei_to_euro(
      Math.floor(amount_of_gwei)
    );

    return {
      crypto: amount_of_gwei.toFixed(0) + ' Gwei',
      fiat: amount_of_euro.toFixed(ANZ_DIGITS) + ' Euro',
    };
  }

  /* read token data from Ethereum */
  private async _readTokenData(
    server_uri: string,
    addr: string,
    token_id: number
  ) {
    const ethereumConfigReadTokenData = new EthereumConfigReadTokenData(
      server_uri,
      addr,
      token_id
    );

    await new Ethereum().read_pic_data_from_smart_contract(
      ethereumConfigReadTokenData
    );
  }

  /* read smart contract data from Ethereum */
  private async _readSmartContract(server_uri: string, addr: string) {
    const ethereumConfigReadSmartContract = new EthereumConfigReadSmartContract(
      server_uri,
      addr
    );

    await new Ethereum().read_smart_contract(ethereumConfigReadSmartContract);
  }

  /* read user data from Ethereum */
  private async _readUserData(
    server_uri: string,
    addr: string,
    pub_key_user: string
  ) {
    const ethereumConfigReadUserDataFromSmartContract =
      new EthereumConfigReadUserDataFromSmartContract(
        server_uri,
        addr,
        pub_key_user
      );

    await new Ethereum().read_user_data_from_smart_contract(
      ethereumConfigReadUserDataFromSmartContract
    );
  }

  /* mint an NFT on Solana*/
  private async _mintNftSolana(
    nft_name: string,
    server_uri: string,
    priv_key_NFT_transmitter: string,
    pub_key_NFT_receiver: string,
    nft_hash: string,
    nft_link: string
  ): Promise<string> {
    const solanaConfigMintNFT = new SolanaConfigMintNFT(
      nft_name,
      server_uri,
      priv_key_NFT_transmitter,
      pub_key_NFT_receiver,
      nft_hash,
      nft_link
    );

    return await new Solana().mint_nft(solanaConfigMintNFT);
  }

  private async _estimateGasFeeMintLamportAndEuroSolana(): Promise<{
    crypto: string;
    fiat: string;
  }> {
    const ANZ_DIGITS = 5;

    // get amount of lamport and euro
    const amount_of_lamport: number = await new Solana().estimate_gas_fee_mint(
      new SolanaConfigMintNFT('', '', '', '', '', '')
    );

    const amount_of_euro: number = await new Solana().convert_lamport_to_euro(
      amount_of_lamport
    );

    return {
      crypto: amount_of_lamport.toFixed(0) + ' Lamport',
      fiat: amount_of_euro.toFixed(ANZ_DIGITS) + ' Euro',
    };
  }
}
