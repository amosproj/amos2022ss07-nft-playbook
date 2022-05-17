import inquirer = require('inquirer');
import { Command } from '../Command';

export class BlockchainSelector implements Command {
  name = 'Select Blockchain';
  help = `\tCheck the blockchains you want to use`;

  prevAnswers: string[] = [];

  async execute() {
    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'checkbox',
        name: 'selectedBlockchains',
        message: 'Please select the blockchains you want to use',
        choices: ['Ethereum', 'Flow'], // TODO diese Infos sollten dynamisch aus dem Backend kommen
        default: this.prevAnswers,
      },
    ];
    this.prevAnswers = (
      await inquirer.prompt(promptQuestions)
    ).selectedBlockchains;
  }
}
