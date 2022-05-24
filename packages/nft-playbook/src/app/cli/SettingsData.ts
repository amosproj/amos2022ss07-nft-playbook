import fs = require('fs');

export class SettingsData {
  private static configFilePath = './packages/nft-playbook/src/info.json';

  private static _GAS_LIMIT: number;
  private static _server_uri: string;
  private static _priv_key_contract_owner: string;
  private static _priv_key_NFT_transmitter: string;
  private static _pub_key_NFT_receiver: string;
  private static _nft_name: string;
  private static _nft_symbol: string;
  private static _nft_link: string;
  private static _selectedBlockchains: string[] = [];

  static readSettingsFile(): boolean {
    let file: string;
    try {
      file = fs.readFileSync(SettingsData.configFilePath, 'utf-8');
    } catch (e) {
      console.error(
        `Error reading config file: ${SettingsData.configFilePath}`
      );
      return false;
    }
    let info: { GAS_LIMIT: number; server_uri: string };
    try {
      info = JSON.parse(file);
    } catch (error) {
      console.error('Error parsing json file');
      return false;
    }

    SettingsData._GAS_LIMIT = info.GAS_LIMIT;
    SettingsData._server_uri = info.server_uri;
    return true;
  }

  public static get GAS_LIMIT(): number {
    return SettingsData._GAS_LIMIT;
  }

  public static get server_uri(): string {
    return SettingsData._server_uri;
  }

  public static get priv_key_contract_owner(): string {
    return SettingsData._priv_key_contract_owner;
  }

  public static set priv_key_contract_owner(v: string) {
    SettingsData._priv_key_contract_owner = v;
  }

  public static get priv_key_NFT_transmitter(): string {
    return SettingsData._priv_key_NFT_transmitter;
  }

  public static set priv_key_NFT_transmitter(v: string) {
    SettingsData._priv_key_NFT_transmitter = v;
  }

  public static get pub_key_NFT_receiver(): string {
    return SettingsData._pub_key_NFT_receiver;
  }

  public static set pub_key_NFT_receiver(v: string) {
    SettingsData._pub_key_NFT_receiver = v;
  }

  public static get nft_name(): string {
    return SettingsData._nft_name;
  }

  public static set nft_name(v: string) {
    SettingsData._nft_name = v;
  }

  public static get nft_symbol(): string {
    return SettingsData._nft_symbol;
  }

  public static set nft_symbol(v: string) {
    SettingsData._nft_symbol = v;
  }

  public static get nft_link(): string {
    return SettingsData._nft_link;
  }

  public static set nft_link(v: string) {
    SettingsData._nft_link = v;
  }

  public static get selectedBlockchains(): string[] {
    return SettingsData._selectedBlockchains;
  }

  public static set selectedBlockchains(v: string[]) {
    SettingsData._selectedBlockchains = v;
  }
}
