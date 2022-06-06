import { PinataClient } from '@nft-playbook/middleware';
import * as inquirer from 'inquirer';
import { CliStrings } from '../CliStrings';
import { Command } from './Command';

export class IPFSCommand implements Command {
  name = `CliStrings.IPFSCommandLabel`;
  help = `CliStrings.IPFSCommandHelp`;
  async execute() {
    const api_key = await this.getInput(`api-key`, ``);
    const api_sec = await this.getInput(`api-sec`, ``);

    const promptQuestions: inquirer.QuestionCollection = [
      {
        type: 'file-tree-selection',
        name: 'selectedfile',
        message: `ABC`,
        enableGoUpperDirectory: true,
      },
    ];

    PinataClient.uploadImage(
      (await inquirer.prompt(promptQuestions)).selectedfile,
      api_key,
      api_sec
    );
  }

  async getInput(promptMessage: string, prevAnswer: string): Promise<string> {
    const inputQuestion: inquirer.QuestionCollection = [
      {
        type: 'input',
        name: 'input',
        message: promptMessage,
        default: prevAnswer,
      },
    ];

    const confirmQuestion: inquirer.QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmed',
        message: CliStrings.NFTSettingsMenuConfirmationQuestion,
      },
    ];

    let input: string;
    let showPrompt = true;
    while (showPrompt) {
      input = (await inquirer.prompt(inputQuestion)).input;
      console.log(CliStrings.NFTSettingsMenuConfirmationInput + input);
      const confirmAnswer = await inquirer.prompt(confirmQuestion);
      if (confirmAnswer.confirmed) {
        showPrompt = false;
      }
    }

    return input;
  }
}
