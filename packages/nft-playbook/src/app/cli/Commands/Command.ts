import { HelpCommand } from './HelpCommand';
import { BlockchainSettingsCommand } from './BlockchainSettingsCommand';
import { NFTSettingsCommand } from './NFTSettingsCommand';
import { StartMintingCommand } from './StartMintingCommand';
import { VersionCommand } from './VersionCommand';
import { BackCommand } from './BackCommand';

export interface Command {
  name: string;
  help: string;
  execute(): Promise<void>;
}

export const MainRun = {
  run: false,
};

const topLevelHelpCommand = new HelpCommand();
topLevelHelpCommand.help = `Top Level Menu Help Text:
  abc
  def
  ghi.`;
export const TopLevelCommandIndex: Command[] = [
  topLevelHelpCommand,
  new BlockchainSettingsCommand(),
  new NFTSettingsCommand(),
  new StartMintingCommand(),
  new VersionCommand(),
  new BackCommand(MainRun, 'Exit', '\tExit the program'),
];
topLevelHelpCommand.commandIndex = TopLevelCommandIndex;

export function sleep(ms: number) {
  return new Promise((x) => setTimeout(x, ms));
}
