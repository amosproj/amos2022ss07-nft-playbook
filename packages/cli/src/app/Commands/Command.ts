import { HelpCommand } from './HelpCommand';
import { BlockchainSettingsCommand } from './BlockchainSettingsCommand';
import { VersionCommand } from './VersionCommand';
import { BackCommand } from './BackCommand';
import { CliStrings } from '../CliStrings';
import { NFTMintingCommand } from './NFTMintingCommand';
import { IPFSCommand } from './IPFSCommand';
import inquirer = require('inquirer');
import chalk = require('chalk');
import { NftPlaybookException } from '@nft-playbook/middleware';

// import { SelectWalletCommand } from './SelectWalletCommand';

export interface Command {
  name: string;
  help: string;
  execute(): Promise<void>;
}

export const MainRun = {
  run: false,
};

const topLevelHelpCommand = new HelpCommand();
export const TopLevelCommandIndex: Command[] = [
  topLevelHelpCommand,
  // new SelectWalletCommand(),
  new IPFSCommand(),
  new BlockchainSettingsCommand(),
  new NFTMintingCommand(),
  new VersionCommand(),
  // new TestMintingCommand(),
  new BackCommand(
    MainRun,
    CliStrings.MainMenuBackButtonLabel,
    CliStrings.MainMenuBackButtonHelp
  ),
];
topLevelHelpCommand.commandIndex = TopLevelCommandIndex;

export function sleep(ms: number) {
  return new Promise((x) => setTimeout(x, ms));
}

export async function showException(e: NftPlaybookException) {
  console.error(e.errorMessage);
  console.error(e.error);

  const confirmQuestion: inquirer.QuestionCollection = [
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.red(`Go back to previous Menu.`),
    },
  ];
  const confirmAnswer = await inquirer.prompt(confirmQuestion);
  if (confirmAnswer.confirmed) return true;
  else return false;
}

export async function getInput(
  promptMessage: string,
  prevAnswer: string
): Promise<string> {
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
      message: CliStrings.GetInputConfirmationQuestion,
    },
  ];

  let input: string;
  let showPrompt = true;
  while (showPrompt) {
    input = (await inquirer.prompt(inputQuestion)).input;
    console.log(CliStrings.GetInputConfirmationInput + input);
    const confirmAnswer = await inquirer.prompt(confirmQuestion);
    if (confirmAnswer.confirmed) {
      showPrompt = false;
    }
  }
  return input;
}
