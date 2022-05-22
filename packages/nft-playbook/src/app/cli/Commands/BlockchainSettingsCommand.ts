import inquirer = require('inquirer');
import { Command } from './Command';
import { HelpCommand } from './HelpCommand';
import { BackCommand } from './BackCommand';
import { BlockchainSelector } from './BlockchainSettingsCommands/BlockchainSelector';
import { SettingsData } from '../SettingsData';

const BSRun = {
  run: false,
};

const helpCommand = new HelpCommand();
helpCommand.help = `This is the help text for the Blockchain Settings menu`;
const CommandIndex: Command[] = [
  helpCommand,
  new BlockchainSelector(),
  new BackCommand(BSRun),
];
helpCommand.commandIndex = CommandIndex;

export class BlockchainSettingsCommand implements Command {
  name = 'Blockchain Settings';
  help = `\tHere you can configure everything related to the used blockchains`;

  async execute() {
    BSRun.run = true;

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

    while (BSRun.run) {
      console.log(`Selected BlockChains: ${SettingsData.selectedBlockchains}`);

      const answers = await inquirer.prompt(promptQuestions);
      const index = commandChoices.indexOf(answers.selectedCommand);
      console.clear();
      await CommandIndex.at(index).execute();
      console.clear();
    }
  }
}
