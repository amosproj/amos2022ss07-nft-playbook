import { HelpCommand } from './HelpCommand';
import { BlockchainSettingsCommand } from './BlockchainSettingsCommand';
import { VersionCommand } from './VersionCommand';
import { BackCommand } from './BackCommand';
import { CliStrings } from '../CliStrings';
import { NFTMintingCommand } from './NFTMintingCommand';
import { IPFSCommand } from './IPFSCommand';
import inquirer = require('inquirer');
import chalk = require('chalk');
import { NftPlaybookException, PinataClient } from '@nft-playbook/middleware';
import { BulkMintingCommand } from './BulkMintingCommand';

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
  new BulkMintingCommand(),
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
  prevAnswer: string,
  hidden = false
): Promise<string | null> {
  let inputQuestion: inquirer.QuestionCollection;
  if (hidden) {
    inputQuestion = [
      {
        type: 'password',
        name: 'input',
        message: promptMessage,
        default: prevAnswer,
      },
    ];
  } else {
    inputQuestion = [
      {
        type: 'input',
        name: 'input',
        message: promptMessage,
        default: prevAnswer,
      },
    ];
  }

  const confirmQuestion: inquirer.QuestionCollection = [
    {
      type: 'rawlist',
      name: 'confirmed',
      message: CliStrings.GetInputConfirmationQuestion,
      choices: [
        'yes',
        'no',
        CliStrings.BlockchainSettingsMenuQuestionChoices03,
      ],
    },
  ];

  let input = '';
  let showPrompt = true;
  while (showPrompt) {
    input = (await inquirer.prompt(inputQuestion)).input;

    const confirmAnswer = await inquirer.prompt(confirmQuestion);
    if (
      confirmAnswer.confirmed ===
      CliStrings.BlockchainSettingsMenuQuestionChoices03
    ) {
      return null;
    }
    if (confirmAnswer.confirmed === 'yes') {
      showPrompt = false;
    }
  }
  return input;
}

export async function checkPinataCredentials(): Promise<boolean> {
  if (
    process.env.PINATA_API_KEY === undefined ||
    process.env.PINATA_API_KEY.length === 0 ||
    process.env.PINATA_API_SEC === undefined ||
    process.env.PINATA_API_SEC.length === 0
  ) {
    if (PinataClient.apiKey.length === 0 || PinataClient.apiKey.length === 0) {
      console.log(CliStrings.IPFSWarningMessage);
      const promptQuestion: inquirer.QuestionCollection = [
        {
          type: 'confirm',
          name: 'confirmed',
          message: CliStrings.IPFSConfirmationQuestion,
        },
      ];
      const answer = await inquirer.prompt(promptQuestion);
      if (answer.confirmed) {
        const key = await getInput(CliStrings.IPFSQuestionApiKey, '');
        if (key === null) return false;
        PinataClient.apiKey = key;

        const sec = await getInput(CliStrings.IPFSQuestionApiSec, '');
        if (sec === null) return false;
        PinataClient.apiSec = sec;
      } else {
        return false;
      }
    }
  } else {
    console.log(CliStrings.IPFSEnvFile);
    PinataClient.apiKey = process.env.PINATA_API_KEY;
    PinataClient.apiSec = process.env.PINATA_API_SEC;
  }
  return true;
}
