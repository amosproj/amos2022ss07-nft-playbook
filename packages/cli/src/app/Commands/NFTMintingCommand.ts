import * as inquirer from 'inquirer';
//import { Chalk } from 'chalk';
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { BackCommand } from './BackCommand';
import { CliStrings } from '../CliStrings';
import { NFTSettingsCommand } from './StartMintingCommands/NFTSettingsCommand';
import { StartMintingCommand } from './StartMintingCommands/StartMintingCommand';

//const chalk = new Chalk();


const NMRun = {
  run: false,
};

const helpCommand = new HelpCommand();
const CommandIndex: Command[] = [
  helpCommand,
  new NFTSettingsCommand(),
  new StartMintingCommand(),
  new BackCommand(NMRun),
];
helpCommand.commandIndex = CommandIndex;

export class NFTMintingCommand implements Command {
  name = CliStrings.NFTMintingCommandLabel;
  help = CliStrings.NFTMintingCommandHelp;

  async execute() {
    NMRun.run = true;

    const commandChoices: string[] = [];

    for (const command of CommandIndex) {
      commandChoices.push(command.name);
    }

    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'list',
        name: 'selectedCommand',
        message: (CliStrings.NFTMintingCommandMenuQuestion),//chalk.yellow(CliStrings.NFTMintingCommandMenuQuestion),
        choices: commandChoices,
      },
    ];

    while (NMRun.run) {
      console.log((CliStrings.horizontalHashLine));//chalk.green(CliStrings.horizontalHashLine));
      console.log((CliStrings.NFTMintingCommandMenuHeader));//chalk.green(CliStrings.NFTMintingCommandMenuHeader));
      console.log((CliStrings.horizontalHashLine));//chalk.green(CliStrings.horizontalHashLine));

      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
