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
  IPFSCommandHelp: `\tUpload files to IPFS via pinata.\n\tLearn more about pinata at: https://www.pinata.cloud/`,
  IPFSQuestionApiKey: `Please provide your Pinata API-Key.`,
  IPFSQuestionApiSec: `Please provide your Pinata API-Sec.`,
  IPFSFileConfirmationQuestion: chalk.yellow(
    `Please provide the path to the file you want to upload.`
  ),
  IPFSMenuHeader: chalk.green(`IPFS/Pinata`),
  IPFSErrorMessageNoAccess: chalk.red("No access or file doesn't exist!"),
  IPFSErrorMessageNotFile: chalk.red(`Given path is not a file`),
  IPFSErrorMessageUpload: chalk.red(`Upload failed`),
  IPFSSuccessMessage(link: string): string {
    return chalk.blue(`Upload successful: ${link}`);
  },
  IPFSClarification: chalk.yellow(
    `Please provide your Pinata API-Key and API-Sec in this section. Alternatively you could provide your API-Key and API-Sec in a .env file. That way those variables can be read automatically.`
  ),

  // Blockchain Settings
  BlockchainSettingsCommandLabel: `Blockchain Settings`,
  BlockchainSettingsCommandHelp: `\tPlease use the 'Blockchain Settings' command to configure all settings related to your used blockchains.`,
  BlockchainSettingsMenuHeader: chalk.green(`Blockchain Settings`),
  BlockchainSettingsMenuQuestion01: chalk.yellow(
    `Please select your desired blockchain(s), multiselection is possible.`
  ),
  BlockchainSettingsMenuQuestion02(blockchain: string): string {
    return `Please provide your private key for ${blockchain}`;
  },
  BlockchainSettingsMenuQuestion03: chalk.yellow(
    'Do you want to create a new contract or provide an existing contract address?'
  ),
  BlockchainSettingsMenuQuestionChoices01: `Deploy new contract`,
  BlockchainSettingsMenuQuestionChoices02: `Address of existing contract`,
  BlockchainSettingsMenuQuestionChoices03: `Cancel`,

  BlockchainSettingsEnterContractAddress: `Address of existing contract:`,

  get BlockchainSettingsMenuSelectionInfo(): string {
    return (
      `Selected BlockChain(s): ` +
      chalk.cyan(`${middleware.getSelectedBlockchains()}`)
    );
  },

  // NFT Minting
  NFTMintingCommandLabel: `NFT Minting`,
  NFTMintingCommandHelp: `\tIn the NFT Minting Menu you can specify all information concerning your NFT including Name and Link (which is already prefilled if you upload a file via Pinata).`,
  NFTMintingCommandMenuHeader: chalk.green(`NFT Minting`),
  NFTMintingQuestionName: `Please provide the name of your NFT.`,
  NFTMintingQuestionLink: `Please provide the link to or location of your NFT.`,
  NFTMintingQuestionNFTReceiver: (blockchain: string): string => {
    return `${blockchain} NFT Receiver`;
  },
  NFTMintingClarification: chalk.yellow(
    `In this section you can specify all information concerning your NFT including Name and Link (which is already prefilled if you upload a file via Pinata).`
  ),
  NFTMintingWarning: chalk.red(
    `Minting cannot be proceed without at least one selected blockchain. Please select a blockchain via the 'Blockchain Settings' command if you'd like to proceed the minting process.`
  ),

  get NFTMintingFeedbackSelectedBlockchains(): string {
    return (
      `Selected blockchains: ` +
      chalk.cyan(`${middleware.getSelectedBlockchains()}`)
    );
  },
  get NFTMintingFeedbackNFTName(): string {
    return `NFT Name: ` + chalk.cyan(`${middleware.getNftName()}`);
  },
  get NFTMintingFeedbackNFTHash(): string {
    return `NFT Hash: ` + chalk.cyan(`${middleware.getNftHash()}`);
  },
  get NFTMintingFeedbackNFTLink(): string {
    return `NFT Link: ` + chalk.cyan(`${middleware.getNftLink()}\n`);
  },
  NFTMintingFeedbackGasLimit: (blockchain: string): string => {
    return (
      `${blockchain} Gas Limit: ` +
      chalk.cyan(`${middleware.getGasLimit(blockchain)}`)
    );
  },
  NFTMintingFeedbackEstimatedGasFeeGwei: async (
    blockchain: string
  ): Promise<string> => {
    return (
      `${blockchain} Estimated gas fee: ` +
      chalk.cyan(`${await middleware.estimateGasFeeMintGwei(blockchain)} Gwei`)
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
  GetInputConfirmationQuestion: chalk.yellow(
    `Would you like to continue with this input?`
  ),
  GetInputConfirmationInput: `Input: `,

  // Bulk Minting
  BulkMintingCommandLabel: `Bulk Minting`,
  BulkMintingCommandHelp: `\tWithin the 'Bulk Minting' command please provide a JSON file to mint multiple NFTs at once.`,
  BulkMintingCommandMenuHeader: chalk.green(`Bulk Minting`),
  BulkMintingConfirmationQuestion: chalk.yellow(
    `Please provide the path to the file you want to minting.`
  ),
  BulkMintingErrorMessageNotFile: chalk.red(`Given path is not a file`),
  BulkMintingErrorMessageNoAccess: chalk.red(
    "No access or file doesn't exist!"
  ),

  // Start Minting
  TestMintingCommandLabel: `Test Minting`,
  TestMintingCommandHelp: `Test the minting process`,

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
