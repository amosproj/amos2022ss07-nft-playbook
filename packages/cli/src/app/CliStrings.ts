import { middleware } from '@nft-playbook/middleware';
import chalk = require('chalk');

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
    return chalk.green(
      `The ${program_information.name} is an easy tool to mint your NFT.`
    );
  },
  MainMenuQuestion: chalk.yellow(
    `Welcome to the ${program_information.name}! Please select your desired action.`
  ),
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
  AddWalletMenuQuestion: chalk.yellow(
    `Please select the wallet you'd like to add`
  ),

  // IPFS
  IPFSCommandLabel: `IPFS/Pinata`,
  IPFSCommandHelp: `\tUpload files to IPFS via pinata`,
  IPFSQuestionSymbol: `DAS IST EIN TEST`, // FIXME

  // Blockchain Settings
  BlockchainSettingsCommandLabel: `Blockchain Settings`,
  BlockchainSettingsCommandHelp: `\tPLease use the 'Blockchain Settings' command to configure all settings related to your used blockchains.`,
  BlockchainSelectorMenuQuestion: chalk.yellow(
    `Please select the blockchain(s) you'd like to use.`
  ),




  BlockchainSettingsMenuHeader: chalk.green(`Blockchain Settings`),
  BlockchainSettingsMenuQuestion: chalk.yellow(
    `Please select your desired blockchain(s), multiselection is possible.`
  ),
  get BlockchainSettingsMenuSelectionInfo(): string {
    return (
      `Selected BlockChain(s): ` +
      chalk.cyan(`${middleware.getSelectedBlockchains()}`)
    );
  },

  // Blockchain Selector
  BlockchainSelectorCommandLabel: `Blockchain Selector`,
  BlockchainSelectorCommandHelp: `\tPlease select and check the blockchain(s) you'd like to use for the minting process.`,

  // NFT Minting
  NFTMintingCommandLabel: `NFT Minting`,
  NFTMintingCommandHelp: `\tThe 'NFT Minting' folder provides you with the 'NFT Settings' command to configure your NFT settings as well as the 'Start Minting' command to start your minting process.`,
  NFTMintingCommandMenuHeader: chalk.green(`NFT Minting`),
  NFTMintingQuestionName: `Name`,
  NFTMintingQuestionLink: `NFT Link`,
  NFTMintingQuestionNFTReceiver: (blockchain: string): string => {
    return `${blockchain} NFT Receiver`;
  },

  get NFTMintingFeedbackSelectedBlockchains(): string {
    return (
      `Selected blockchains: ` +
      chalk.cyan(`${middleware.getSelectedBlockchains()}`)
    );
  },
  get NFTMintingFeedbackNFTName(): string {
    return `NFT Name: ` + chalk.cyan(`${middleware.getNftName()}`);
  },
  get NFTMintingFeedbackNFTLink(): string {
    return `NFT Link: ` + chalk.cyan(`${middleware.getNftLink()}`);
  },
  NFTMintingFeedbackGasLimit: (blockchain: string): string => {
    return (
      `${blockchain} Gas Limit: ` +
      chalk.cyan(`${middleware.getGasLimit(blockchain)}`)
    );
  },
  NFTMintingFeedbackServerUri: (blockchain: string): string => {
    return (
      `${blockchain} Server uri: ` +
      chalk.cyan(`${middleware.getServerUri(blockchain)}`)
    );
  },
  NFTMintingFeedbackPrivateKey: (blockchain: string): string => {
    return (
      `${blockchain} Key contract owner: ` +
      chalk.cyan(`${middleware.getPrivateKeyUser(blockchain)}`)
    );
  },
  NFTMintingFeedbackNFTReceiver: (blockchain: string): string => {
    return (
      `${blockchain} Key NFT receiver: ` +
      chalk.cyan(`${middleware.getPublicKeyNftReceiver(blockchain)}`)
    );
  },
  NFTMintingSummaryConfirmationQuestion: chalk.yellow(
    `Are you sure you want to continue the minting process with these settings?`
  ),
  NFTMintingFeedbackAbort: chalk.red(`abort`),
  NFTMintingInputConfirmationQuestion: chalk.yellow(
    `Would you like to continue with this input?`
  ),
  NFTMintingConfirmationInput: `Input: `,

  // Version
  VersionCommandLabel: `Version`,
  VersionCommandHelp: `\tThe 'Version' command provides you with the current version number of the program.`,
  get VersionCommandOutput(): string {
    return `${program_information.version}`;
  },

  VersionMenuHeader: chalk.green(`Version`),
  VersionMenuQuestion: chalk.yellow(
    `Would you like to display the program's most recent version number?`
  ),
  VersionMenuBackButtonLabel: `Back`,

  // Back
  BackCommandLabel: `Back`,
  BackCommandHelp: `\tReturn to the last page.`,
};
