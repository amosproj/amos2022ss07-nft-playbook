import { HelpCommand } from './HelpCommand';
import { BlockchainSettingsCommand } from './BlockchainSettingsCommand';
// import { NFTSettingsCommand } from './NFTSettingsCommand';
// import { StartMintingCommand } from './StartMintingCommands/StartMintingCommand';
import { VersionCommand } from './VersionCommand';
import { BackCommand } from './BackCommand';
import { CliStrings } from '../CliStrings';
import { NFTMintingCommand } from './NFTMintingCommand';
import { IPFSCommand } from './IPFSCommand';
// import { SelectWalletCommand } from './SelectWalletCommand';

export interface Command {
  name: string;
  help: string;
  execute(): Promise<void>;
}

export const MainRun = {
  run: false,
};

const topLevelHelpCommand = new HelpCommand();
export const TopLevelCommandIndex: Command[] = [
  topLevelHelpCommand,
  // new SelectWalletCommand(),
  new IPFSCommand(),
  new BlockchainSettingsCommand(),
  // new NFTSettingsCommand(),
  new NFTMintingCommand(),
  // new StartMintingCommand(),
  new VersionCommand(),
  new BackCommand(
    MainRun,
    CliStrings.MainMenuBackButtonLabel,
    CliStrings.MainMenuBackButtonHelp
  ),
];
topLevelHelpCommand.commandIndex = TopLevelCommandIndex;

export function sleep(ms: number) {
  return new Promise((x) => setTimeout(x, ms));
}
