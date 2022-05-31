import fs = require('fs');

export class SettingsData {
  private static _nft_name: string;
  private static _nft_link: string;

  private _smart_contract_address: string;
  private _GAS_LIMIT: number;
  private _server_uri: string;
  private _priv_key_contract_owner: string;
  private _priv_key_NFT_transmitter: string;
  private _pub_key_NFT_receiver: string;

  private _isSelected = false;

  constructor(configFilePath: string) {
    //'./packages/cli/src/info.json'
    // if (configFilePath != undefined)
    this.readSettingsFile(configFilePath);
  }

  private readSettingsFile(configFilePath: string): boolean {
    let file: string;
    try {
      file = fs.readFileSync(configFilePath, 'utf-8');
    } catch (e) {
      console.error(`Error reading config file: ${configFilePath}`);
      return false;
    }
    let info: { GAS_LIMIT: number; server_uri: string };
    try {
      info = JSON.parse(file);
    } catch (error) {
      console.error('Error parsing json file');
      return false;
    }

    this._GAS_LIMIT = info.GAS_LIMIT;
    this._server_uri = info.server_uri;
    return true;
  }

  public static get nft_name(): string {
    return SettingsData._nft_name;
  }

  public static set nft_name(v: string) {
    SettingsData._nft_name = v;
  }

  public static get nft_link(): string {
    return SettingsData._nft_link;
  }

  public static set nft_link(v: string) {
    SettingsData._nft_link = v;
  }

  public get GAS_LIMIT(): number {
    return this._GAS_LIMIT;
  }

  public get server_uri(): string {
    return this._server_uri;
  }

  public get priv_key_contract_owner(): string {
    return this._priv_key_contract_owner;
  }

  public set priv_key_contract_owner(v: string) {
    this._priv_key_contract_owner = v;
  }

  public get priv_key_NFT_transmitter(): string {
    return this._priv_key_NFT_transmitter;
  }

  public set priv_key_NFT_transmitter(v: string) {
    this._priv_key_NFT_transmitter = v;
  }

  public get smart_contract_address(): string {
    return this._smart_contract_address;
  }

  public set smart_contract_address(v: string) {
    this._smart_contract_address = v;
  }

  public get pub_key_NFT_receiver(): string {
    return this._pub_key_NFT_receiver;
  }

  public set pub_key_NFT_receiver(v: string) {
    this._pub_key_NFT_receiver = v;
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  public set isSelected(v: boolean) {
    this._isSelected = v;
  }
}
