import fs = require('fs');

export class SettingsData {
  // overall blockchain information
  private static _nft_name: string;
  private static _nft_link: string;
  private static _nft_hash: string;
  
  // blockchain specific information
  private _smart_contract_address: string;
  private _GAS_LIMIT: number;
  private _server_uri: string;
  private _user_priv_key: string;
  private _pub_key_NFT_receiver: string;

  private _isSelected = false;

  constructor(configFilePath: string) {
    //'./packages/cli/src/info.json'
    // if (configFilePath != undefined)
    this.readSettingsFile(configFilePath);
    this.fillEmptySettings();
  }
  private fillEmptySettings() {
    this._smart_contract_address = '';
    this._user_priv_key = '';
    this._pub_key_NFT_receiver = '';
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

  public static get nft_hash(): string {
    return SettingsData._nft_hash;
  }

  public static set nft_hash(v: string) {
    SettingsData._nft_hash = v;
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

  public get user_priv_key(): string {
    return this._user_priv_key;
  }

  public set user_priv_key(v: string) {
    this._user_priv_key = v;
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
