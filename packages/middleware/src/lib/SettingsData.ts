import fs = require('fs');

export class SettingsData {
  private _blockchain: string;

  // overall blockchain information
  private static _nftName: string;
  private static _nftLink: string;
  private static _nftHash: string;
  private static _logFile: string;

  // blockchain specific information
  private _smartContractAddress: string;
  private _GAS_LIMIT: number;
  private _SERVER_URI: string;
  private _userPrivKey: string;
  private _pubKeyNftReceiver: string;

  private _isSelected = false;

  constructor(blockchain: string, configFilePath: string) {
    this._blockchain = blockchain;
    //'./packages/cli/src/info.json'
    // if (configFilePath != undefined)
    this._pubKeyNftReceiver = '';
    this._userPrivKey = '';
    this._SERVER_URI = '';
    this._GAS_LIMIT = 0;
    this._smartContractAddress = '';
    this.readSettingsFile(configFilePath);
  }

  private readSettingsFile(configFilePath: string): boolean {
    const file: string = fs.readFileSync(configFilePath, 'utf-8');

    const info: {
      config: [
        {
          blockchain: string;
          settings: { GAS_LIMIT: number; end_point: string };
        }
      ];
      log_file: string;
    } = JSON.parse(file);

    info.config.forEach((entry) => {
      if (entry.blockchain == this._blockchain) {
        this._GAS_LIMIT = entry.settings.GAS_LIMIT;
        this._SERVER_URI = entry.settings.end_point;
      }
    });

    SettingsData._logFile = info.log_file;
    return true;
  }

  public static get logFile(): string {
    return SettingsData._logFile;
  }

  public static get nftHash(): string {
    return SettingsData._nftHash;
  }

  public static set nftHash(v: string) {
    SettingsData._nftHash = v;
  }

  public static get nftName(): string {
    return SettingsData._nftName;
  }

  public static set nftName(v: string) {
    SettingsData._nftName = v;
  }

  public static get nftLink(): string {
    return SettingsData._nftLink;
  }

  public static set nftLink(v: string) {
    SettingsData._nftLink = v;
  }

  public get GAS_LIMIT(): number {
    return this._GAS_LIMIT;
  }

  public get SERVER_URI(): string {
    return this._SERVER_URI;
  }

  public get userPrivKey(): string {
    return this._userPrivKey;
  }

  public set userPrivKey(v: string) {
    this._userPrivKey = v;
  }

  public get smartContractAddress(): string {
    return this._smartContractAddress;
  }

  public set smartContractAddress(v: string) {
    this._smartContractAddress = v;
  }

  public get pubKeyNftReceiver(): string {
    return this._pubKeyNftReceiver;
  }

  public set pubKeyNftReceiver(v: string) {
    this._pubKeyNftReceiver = v;
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  public set isSelected(v: boolean) {
    this._isSelected = v;
  }
}
