import inquirer = require('inquirer');
import { Command } from './Command';
import { SettingsData } from '../SettingsData';
import { CliStrings } from '../CliStrings';

export class NFTSettingsCommand implements Command {
  name = CliStrings.NFTSettingsCommandLabel;
  help = CliStrings.NFTSettingsCommandHelp;

  async execute() {
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.NFTSettingsMenuHeader);
    console.log(CliStrings.horizontalHashLine);

    SettingsData.nft_name = await this.getInput(
      CliStrings.NFTSettingsQuestionName,
      SettingsData.nft_name
    );
    SettingsData.nft_symbol = await this.getInput(
      CliStrings.NFTSettingsQuestionSymbol,
      SettingsData.nft_symbol
    );
    SettingsData.nft_link = await this.getInput(
      CliStrings.NFTSettingsQuestionLink,
      SettingsData.nft_link
    );
    SettingsData.priv_key_contract_owner = await this.getInput(
      CliStrings.NFTSettingsQuestionContractOwner,
      SettingsData.priv_key_contract_owner
    );
    SettingsData.priv_key_NFT_transmitter = await this.getInput(
      CliStrings.NFTSettingsQuestionNFTTransmitter,
      SettingsData.priv_key_NFT_transmitter
    );
    SettingsData.pub_key_NFT_receiver = await this.getInput(
      CliStrings.NFTSettingsQuestionNFTReceiver,
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
