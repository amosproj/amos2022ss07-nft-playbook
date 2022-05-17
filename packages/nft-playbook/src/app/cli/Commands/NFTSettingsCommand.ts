import inquirer = require('inquirer');
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { BackCommand } from './BackCommand';

const NFTRun = {
  run: false,
};

const helpCommand = new HelpCommand();
helpCommand.help = `This is the help text for the NFT Settings menu`;
const CommandIndex: Command[] = [helpCommand, new BackCommand(NFTRun)];
helpCommand.commandIndex = CommandIndex;

export class NFTSettingsCommand implements Command {
  name = 'NFT Settings';
  help = `\tHere you can configure everything related to NFTs`;

  async execute() {
    NFTRun.run = true;

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

    while (NFTRun.run) {
      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
