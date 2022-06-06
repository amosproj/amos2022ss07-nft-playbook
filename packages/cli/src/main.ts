import * as inquirer from 'inquirer';
import { CliStrings } from './app/CliStrings';
import { TopLevelCommandIndex } from './app/Commands';
import { MainRun } from './app/Commands/Command';

// const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt');

function greet() {
  console.clear();

  console.log(CliStrings.horizontalHashLine);
  console.log(CliStrings.MainMenuHeader);
  console.log(CliStrings.horizontalHashLine);
}

async function main() {
  // inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

  const commandChoices: string[] = [];

  for (const command of TopLevelCommandIndex) {
    if (command.name === `Exit`) {
      commandChoices.push(command.name);
    } else {
      commandChoices.push(command.name);
    }
  }

  const promptQuestions: inquirer.QuestionCollection = [
    {
      type: 'list',
      name: 'selectedCommand',
      message: CliStrings.MainMenuQuestion,
      choices: commandChoices,
    },
  ];

  MainRun.run = true;
  while (MainRun.run) {
    greet();

    const answers = await inquirer.prompt(promptQuestions);
    const index = commandChoices.indexOf(answers.selectedCommand);
    console.clear();
    await TopLevelCommandIndex.at(index).execute();
    console.clear();
  }
}

main();
