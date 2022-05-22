import inquirer = require('inquirer');
import { Command } from './Command';
import { SettingsData } from '../SettingsData';

export class NFTSettingsCommand implements Command {
  name = 'NFT Settings';
  help = `\tHere you can configure everything related to NFTs`;

  async execute() {
    SettingsData.nft_name = await this.getInput('Name', SettingsData.nft_name);
    SettingsData.nft_symbol = await this.getInput(
      'Symbol',
      SettingsData.nft_symbol
    );
    SettingsData.nft_link = await this.getInput(
      'NFT Link',
      SettingsData.nft_link
    );
    SettingsData.priv_key_contract_owner = await this.getInput(
      'Wallet that pays for gas fees',
      SettingsData.priv_key_contract_owner
    );
    SettingsData.priv_key_NFT_transmitter =
      SettingsData.priv_key_contract_owner; // TODO
    SettingsData.pub_key_NFT_receiver = await this.getInput(
      'Receiver',
      SettingsData.pub_key_NFT_receiver
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
        message: 'Would you like to continue with this input?',
      },
    ];

    let input: string;
    let showPrompt = true;
    while (showPrompt) {
      input = (await inquirer.prompt(inputQuestion)).input;
      console.log(`Input: ${input}`);
      const confirmAnswer = await inquirer.prompt(confirmQuestion);
      if (confirmAnswer.confirmed) {
        showPrompt = false;
      }
    }

    return input;
  }
}
