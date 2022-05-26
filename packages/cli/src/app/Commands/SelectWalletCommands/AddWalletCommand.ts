import { CliStrings } from '../../CliStrings';
import { Command, sleep } from '../Command';

export class AddWalletCommand implements Command {
  name = CliStrings.AddWalletCommandLabel;
  help = CliStrings.AddWalletCommandHelp;
  async execute() {
    console.log(`Need to implement`);
    await sleep(3000);
  }
}
