import inquirer = require('inquirer');
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { BackCommand } from './BackCommand';

const SMRun = {
  run: false,
};

const helpCommand = new HelpCommand();
helpCommand.help = `This is the help text for the Minting menu`;
const CommandIndex: Command[] = [helpCommand, new BackCommand(SMRun)];
helpCommand.commandIndex = CommandIndex;

export class StartMintingCommand implements Command {
  name = 'Start Minting';
  help = `\tStart the minting process`;

  async execute() {
    SMRun.run = true;

    const commandChoices: string[] = [];

    for (const command of CommandIndex) {
      commandChoices.push(command.name);
    }

    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Please select a command',
        choices: commandChoices,
      },
    ];

    while (SMRun.run) {
      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
