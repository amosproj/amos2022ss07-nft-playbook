import * as inquirer from 'inquirer';
import { Command } from '../Command';
import { CliStrings } from '../../CliStrings';
import { middleware } from '@nft-playbook/middleware';

export class NFTSettingsCommand implements Command {
  name = CliStrings.NFTSettingsCommandLabel;
  help = CliStrings.NFTSettingsCommandHelp;

  async execute() {
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.NFTSettingsMenuHeader);
    console.log(CliStrings.horizontalHashLine);

    middleware.setNftName(
      await this.getInput(
        CliStrings.NFTSettingsQuestionName,
        middleware.getNftName()
      )
    );
    middleware.setNftLink(
      await this.getInput(
        CliStrings.NFTSettingsQuestionLink,
        middleware.getNftLink()
      )
    );

    for (const blockchain of middleware.getSelectedBlockchains()) {
      middleware.setPrivateKeyContractOwner(
        await this.getInput(
          CliStrings.NFTSettingsQuestionContractOwner(blockchain),
          middleware.getPrivateKeyContractOwner(blockchain)
        ),
        blockchain
      );
      3;
      middleware.setPrivateKeyNftTransmitter(
        await this.getInput(
          CliStrings.NFTSettingsQuestionNFTTransmitter(blockchain),
          middleware.getPrivateKeyNftTransmitter(blockchain)
        ),
        blockchain
      );

      middleware.setPublicKeyNftReceiver(
        await this.getInput(
          CliStrings.NFTSettingsQuestionNFTReceiver(blockchain),
          middleware.getPublicKeyNftReceiver(blockchain)
        ),
        blockchain
      );
    }
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
