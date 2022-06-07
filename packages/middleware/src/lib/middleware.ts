import {
  Ethereum,
  EthereumConfigMintNFT,
  EthereumConfigDeployContract,
  EthereumConfigReadTokenData,
  EthereumConfigReadSmartContract,
  EthereumConfigReadUserDataFromSmartContract,
} from '@nft-playbook/backend';
import { SettingsData } from './SettingsData';

export class Middleware {
  constructor() {
    this.addBlockchain('Ethereum');
    this.addBlockchain('Flow');
  }

  private _selectedBlockchains = {};

  private addBlockchain(blockchain: string) {
    this._selectedBlockchains[blockchain] = new SettingsData(
      'packages/middleware/settings.json'
    ); // TODO: Pfad pruefen
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
    } catch (e) {
      return [];
    }
  }

  public getSelectedBlockchains(): string[] {
    try {
      return Object.keys(this._selectedBlockchains).filter(
        (blockchain) => this._selectedBlockchains[blockchain].isSelected
      );
    } catch (e) {
      return [];
    }
  }

  public async estimateGasFeeMint(blockchain: string): Promise<number> {
    const data: SettingsData = this._selectedBlockchains[blockchain];

    switch (blockchain) {
      case 'Ethereum': {
        return await this._estimateGasFeeMintEthereum(
          SettingsData.nft_name,
          data.server_uri,
          data.user_priv_key,
          data.smart_contract_address,
          data.pub_key_NFT_receiver,
          SettingsData.nft_hash,
          SettingsData.nft_link,
          data.GAS_LIMIT
        );
        break;
      }
      case 'Flow': {
        //this._mintNftFlow();
        break;
      }
      default: {
        break;
      }
    }
  }

  public mintNFT() {
    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];

      switch (blockchain) {
        case 'Ethereum': {
          this._mintNftEthereum(
            SettingsData.nft_name,
            data.server_uri,
            data.user_priv_key,
            data.smart_contract_address,
            data.pub_key_NFT_receiver,
            SettingsData.nft_hash,
            SettingsData.nft_link,
            data.GAS_LIMIT
          );
          break;
        }
        case 'Flow': {
          //this._mintNftFlow();
          break;
        }
        default: {
          break;
        }
      }

      this._selectedBlockchains[blockchain] = data;
    });
  }

  /* deployContract will be called for each specific blockchain individually */
  public async deployContract(blockchain: string) {
    const data: SettingsData = this._selectedBlockchains[blockchain];
    switch (blockchain) {
      case 'Ethereum': {
        data.smart_contract_address = await this._deployContractEthereum(
          data.server_uri,
          './packages/backend/src/lib/contracts/simple_amos_nft_contract.sol', // path to smart contract
          data.user_priv_key,
          'CONTRAC-NAME', //TODO
          'CONTRACT-SYMBOL', //TODO
          'BASE-URI' //TODO
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

    this._selectedBlockchains[blockchain] = data;
  }

  public setContractAddress(blockchain: string, contract_addr: string) {
    const data: SettingsData = this._selectedBlockchains[blockchain];

    switch (blockchain) {
      case 'Ethereum': {
        data.smart_contract_address = contract_addr;
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

    this._selectedBlockchains[blockchain] = data;
  }

  public readUserData() {
    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];

      switch (blockchain) {
        case 'Ethereum': {
          this._readUserData(
            data.server_uri,
            data.smart_contract_address,
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

      this._selectedBlockchains[blockchain] = data;
    });
  }

  public readSmartContract() {
    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];

      switch (blockchain) {
        case 'Ethereum': {
          this._readSmartContract(data.server_uri, data.smart_contract_address);
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

      this._selectedBlockchains[blockchain] = data;
    });
  }

  public readTokenData() {
    this.getSelectedBlockchains().forEach((blockchain) => {
      const data: SettingsData = this._selectedBlockchains[blockchain];

      switch (blockchain) {
        case 'Ethereum': {
          this._readTokenData(
            data.server_uri,
            data.smart_contract_address,
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

      this._selectedBlockchains[blockchain] = data;
    });
  }

  // setter
  public setNftName(val: string) {
    SettingsData.nft_name = val;
  }

  public setNftHash(val: string) {
    SettingsData.nft_hash = val;
  }

  public setNftLink(val: string) {
    SettingsData.nft_link = val;
  }

  public setPrivateKeyUser(val: string, blockchain: string) {
    this._selectedBlockchains[blockchain].user_priv_key = val;
  }

  public setSmartContractAddress(val: string, blockchain: string) {
    this._selectedBlockchains[blockchain].smart_contract_address = val;
  }

  public setPublicKeyNftReceiver(val: string, blockchain: string) {
    this._selectedBlockchains[blockchain].pub_key_NFT_receiver = val;
  }

  // getter
  public getNftName() {
    return SettingsData.nft_name;
  }

  public getNftHash() {
    return SettingsData.nft_hash;
  }

  public getNftLink() {
    return SettingsData.nft_link;
  }

  public getSmartContractAddress(blockchain: string) {
    return this._selectedBlockchains[blockchain].smart_contract_address;
  }

  public getPublicKeyNftReceiver(blockchain: string) {
    return this._selectedBlockchains[blockchain].pub_key_NFT_receiver;
  }

  public getPrivateKeyUser(blockchain: string) {
    return this._selectedBlockchains[blockchain].user_priv_key;
  }

  public getGasLimit(blockchain: string) {
    return this._selectedBlockchains[blockchain].GAS_LIMIT;
  }

  public getServerUri(blockchain: string) {
    return this._selectedBlockchains[blockchain].server_uri;
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
  ): Promise<number> {
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

  private async _estimateGasFeeMintEthereum(
    nft_name: string,
    server_uri: string,
    priv_key_NFT_transmitter: string,
    addr: string,
    pub_key_NFT_receiver: string,
    nft_hash: string,
    nft_link: string,
    GAS_LIMIT: number
  ): Promise<number> {
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
    return await new Ethereum().estimate_gas_fee_mint(ethereumConfigMintNFT);
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
}
