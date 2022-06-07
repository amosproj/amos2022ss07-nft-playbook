import { CliStrings } from '../CliStrings';
import { BackCommand } from './BackCommand';
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { AddWalletCommand } from './SelectWalletCommands/AddWalletCommand';
import * as inquirer from 'inquirer';

const SWRun = {
  run: false,
};

const helpCommand = new HelpCommand();
const CommandIndex: Command[] = [
  helpCommand,
  new AddWalletCommand(),
  new BackCommand(SWRun),
];
helpCommand.commandIndex = CommandIndex;

export class SelectWalletCommand implements Command {
  name: string = CliStrings.SelectWalletCommandLabel;
  help: string = CliStrings.SelectWalletCommandHelp;
  async execute(): Promise<void> {
    SWRun.run = true;

    const commandChoices: string[] = [];

    for (const command of CommandIndex) {
      commandChoices.push(command.name);
    }

    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'list',
        name: 'selectedCommand',
        message: CliStrings.SelectWalletCommandMenuQuestion,
        choices: commandChoices,
      },
    ];

    while (SWRun.run) {
      console.log(CliStrings.horizontalHashLine);
      console.log(CliStrings.SelectWalletCommandMenuHeader);
      console.log(CliStrings.horizontalHashLine);

      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
