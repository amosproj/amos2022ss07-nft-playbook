import { SettingsData } from './SettingsData';

const program_information = {
  name: 'nft-playbook',
  version: '0.0.1',
};

export const CliStrings = {
  // UNIVERSAL
  horizontalHashLine: `##################################################`, // # x 50

  // Main Menu
  get MainMenuHeader(): string {
    return `The ${program_information.name} is an easy tool to mint your NFT.`;
  },
  MainMenuQuestion: `What would you like to do?`,
  MainMenuBackButtonLabel: `Exit`,
  MainMenuBackButtonHelp: `\tExit the program`,

  // COMMANDS

  // Help
  HelpCommandLabel: `Help`,
  HelpCommandMenuQuestion: `Want to go back?`,
  HelpCommandMenuBackButtonLabel: `Back`,

  // Blockchain Settings
  BlockchainSettingsCommandLabel: `Blockchain Settings`,
  BlockchainSettingsCommandHelp: `\tHere you can configure everything related to the used blockchains`,
  BlockchainSettingsMenuHeader: `Blockchain Settings`,
  BlockchainSettingsMenuQuestion: `Select blockchain(s), multiselect possible:`,
  get BlockchainSettingsMenuSelectionInfo(): string {
    return `Selected BlockChains: ${SettingsData.selectedBlockchains}`;
  },

  // Blockchain Selector
  BlockchainSelectorCommandLabel: `Blockchain Selector`,
  BlockchainSelectorCommandHelp: `\tCheck the blockchains you want to use`,
  BlockchainSelectorMenuQuestion: `Please select the blockchains you want to use`,

  // NFT Settings
  NFTSettingsCommandLabel: `NFT Settings`,
  NFTSettingsCommandHelp: `\tHere you can configure everything related to NFTs`,
  NFTSettingsMenuHeader: `NFT Settings`,
  NFTSettingsQuestionName: `Name`,
  NFTSettingsQuestionSymbol: `Symbol`,
  NFTSettingsQuestionLink: `NFT Link`,
  NFTSettingsQuestionContractOwner: `Contract Owner`,
  NFTSettingsQuestionNFTTransmitter: `NFT Transmitter`,
  NFTSettingsQuestionNFTReceiver: 'NFT Receiver',
  NFTSettingsMenuConfirmationQuestion: `Would you like to continue with this input?`,
  NFTSettingsMenuConfirmationInput: `Input: `,

  // Start Minting
  StartMintingCommandLabel: `Start Minting`,
  StartMintingCommandHelp: `\tStart the minting process`,
  StartMintingMenuHeader: `Start Minting`,
  StartMintingMenuConfirmationQuestion: `Are you sure you want to continue with these settings?`,
  StartMintingMenuMissingParameter: `Neccessary parameter missing. Please provide all required parameters.`,
  StartMintingFeedback01: `You chose the following parameters: `,
  get StartMintingFeedback02(): string {
    return `Selected blockchains: ${SettingsData.selectedBlockchains}`;
  },
  get StartMintingFeedback03(): string {
    return `Gas Limit: ${SettingsData.GAS_LIMIT}`;
  },
  get StartMintingFeedback04(): string {
    return `Server uri: ${SettingsData.server_uri}`;
  },
  StartMintingFeedback05: `NFT Parameters: `,
  get StartMintingFeedback06(): string {
    return `Key contract owner: ${SettingsData.priv_key_contract_owner}`;
  },
  get StartMintingFeedback07(): string {
    return `Key NFT transmitter: ${SettingsData.priv_key_NFT_transmitter}`;
  },
  get StartMintingFeedback08(): string {
    return `Key NFT receiver: ${SettingsData.pub_key_NFT_receiver}`;
  },
  get StartMintingFeedback09(): string {
    return `NFT Name: ${SettingsData.nft_name}`;
  },
  get StartMintingFeedback10(): string {
    return `NFT Symbol: ${SettingsData.nft_symbol}`;
  },
  get StartMintingFeedback11(): string {
    return `NFT Link: ${SettingsData.nft_link}`;
  },

  // Version
  VersionCommandLabel: `Version`,
  VersionCommandHelp: `\tVersion will provide you with the current version of the program.`,
  get VersionCommandOutput(): string {
    return `${program_information.version}`;
  },

  VersionMenuHeader: `Version`,
  VersionMenuQuestion: `Want to go back?`,
  VersionMenuBackButtonLabel: `Back`,

  // Back
  BackCommandLabel: `Back`,
  BackCommandHelp: `\tGo back`,
};
