import * as Chalk from 'chalk';
import { SettingsData } from './SettingsData';

export const chalk = new Chalk.Instance();


const program_information = {
  name: 'nft-playbook',
  version: '0.0.1',
};

export const CliStrings = {
  // UNIVERSAL
  horizontalHashLine: chalk.green(
    `##################################################`
  ), // # x 50

  // Main Menu
  get MainMenuHeader(): string {
    return chalk.green(`The ${program_information.name} is an easy tool to mint your NFT.`);
  },
  MainMenuQuestion: chalk.yellow(`Welcome to the ${program_information.name}! Please select your desired action.`),
  MainMenuBackButtonLabel: chalk.red(`Exit`),
  MainMenuBackButtonHelp: `\tExit the program`,

  // COMMANDS

  // Help
  HelpCommandLabel: `Help`,
  HelpCommandMenuQuestion: chalk.yellow(`Would you like to go back?`),
  HelpCommandMenuBackButtonLabel: `Back`,

  // Select Wallet
  SelectWalletCommandLabel: `Select Wallet`,
  SelectWalletCommandHelp: `\tPlease select and check the wallet you'd like to use.`,
  SelectWalletCommandMenuHeader: chalk.green(`Select Wallet`),
  SelectWalletCommandMenuQuestion: `Please select the wallet you'd like to use.`, //`Which wallet would you like to use?`,

  // Add Wallet
  AddWalletCommandLabel: `Add Wallet`,
  AddWalletCommandHelp: `\tPlease check the wallet you'd like to add and use for the minting process.`,
  AddWalletMenuQuestion: chalk.yellow(`Please select the wallet you'd like to add`),

  // Blockchain Settings
  BlockchainSettingsCommandLabel: `Blockchain Settings`,
  BlockchainSettingsCommandHelp: `\tPLease use the 'Blockchain Settings' command to configure all settings related to your used blockchains.`,
  BlockchainSettingsMenuHeader: chalk.green(`Blockchain Settings`),
  BlockchainSettingsMenuQuestion: chalk.yellow(`Please select your desired blockchain(s), multiselection is possible.`),
  get BlockchainSettingsMenuSelectionInfo(): string {
    return `Selected BlockChain(s): `+ chalk.cyan(`${SettingsData.selectedBlockchains}`);
  },

  // Blockchain Selector
  BlockchainSelectorCommandLabel: `Blockchain Selector`,
  BlockchainSelectorCommandHelp: `\tPlease select and check the blockchain(s) you'd like to use for the minting process.`,
  BlockchainSelectorMenuQuestion: chalk.yellow(`Please select the blockchain(s) you'd like to use.`),

  // NFT Minting
  NFTMintingCommandLabel: `NFT Minting`,
  NFTMintingCommandHelp: `\tThe 'NFT Minting' folder provides you with the 'NFT Settings' command to configure your NFT settings as well as the 'Start Minting' command to start your minting process.`,
  NFTMintingCommandMenuQuestion: chalk.yellow(`Please configure you NFT's settings if needed and proceed with the minting process.`),
  NFTMintingCommandMenuHeader: chalk.green(`NFT Minting`),

  // NFT Settings
  NFTSettingsCommandLabel: `NFT Settings`,
  NFTSettingsCommandHelp: `\tUsing the 'NFT Setting' command, you can configure all settings related to your NFTs`,
  NFTSettingsMenuHeader: chalk.green(`NFT Settings`),
  NFTSettingsQuestionName: `Name`,
  NFTSettingsQuestionSymbol: `Symbol`,
  NFTSettingsQuestionLink: `NFT Link`,
  NFTSettingsQuestionContractOwner: `Contract Owner`,
  NFTSettingsQuestionNFTTransmitter: `NFT Transmitter`,
  NFTSettingsQuestionNFTReceiver: 'NFT Receiver',
  NFTSettingsMenuConfirmationQuestion: chalk.yellow(`Would you like to continue with this input?`),
  NFTSettingsMenuConfirmationInput: `Input: `,

  // Start Minting
  StartMintingCommandLabel: `Start Minting`,
  StartMintingCommandHelp: `\tThe 'Start Minting' command starts the minting process using the NFT settings priorly configured using the 'NFT Settings' command. `,
  StartMintingMenuHeader: chalk.green(`Start Minting`),
  StartMintingMenuConfirmationQuestion: chalk.yellow(`Are you sure you want to continue the minting process with these settings?`),
  StartMintingMenuMissingParameter: chalk.red(`Neccessary parameter missing for the minting process. Please provide all required parameters. You can configure your NFT settings using the command 'NFT Settings'.`),
  StartMintingFeedback01: `You chose the following parameters: `,
  get StartMintingFeedback02(): string {
    return `Selected blockchains: ` + chalk.cyan(`${SettingsData.selectedBlockchains}`);
  },
  get StartMintingFeedback03(): string {
    return `Gas Limit: ` + chalk.cyan(`${SettingsData.GAS_LIMIT}`);
  },
  get StartMintingFeedback04(): string {
    return `Server uri: ` + chalk.cyan(`${SettingsData.server_uri}`);
  },
  StartMintingFeedback05: `NFT Parameters: `,
  get StartMintingFeedback06(): string {
    return `Key contract owner: ` + chalk.cyan(`${SettingsData.priv_key_contract_owner}`);
  },
  get StartMintingFeedback07(): string {
    return `Key NFT transmitter: ` + chalk.cyan(`${SettingsData.priv_key_NFT_transmitter}`);
  },
  get StartMintingFeedback08(): string {
    return `Key NFT receiver: ` + chalk.cyan(`${SettingsData.pub_key_NFT_receiver}`);
  },
  get StartMintingFeedback09(): string {
    return `NFT Name: ` + chalk.cyan(`${SettingsData.nft_name}`);
  },
  get StartMintingFeedback10(): string {
    return `NFT Symbol: ` + chalk.cyan(`${SettingsData.nft_symbol}`);
  },
  get StartMintingFeedback11(): string {
    return `NFT Link: ` + chalk.cyan(`${SettingsData.nft_link}`);
  },
  StartMintingFeedback12: chalk.red(`abort`),
  StartMintingFeedbackMinting: chalk.cyan(`minting`),
  StartMintingFeedbackFirstNFT: chalk.cyan(`first NFT minted`),
  StartMintingFeedbackContractDeployed: chalk.cyan(`contract deployed`),

  // Version
  VersionCommandLabel: `Version`,
  VersionCommandHelp: `\tThe 'Version' command provides you with the current version number of the program.`,
  get VersionCommandOutput(): string {
    return `${program_information.version}`;
  },

  VersionMenuHeader: chalk.green(`Version`),
  VersionMenuQuestion: chalk.yellow(`Would you like to display the program's most recent version number?`),
  VersionMenuBackButtonLabel: `Back`,

  // Back
  BackCommandLabel: `Back`,
  BackCommandHelp: `\tReturn to the last page.`,
};
