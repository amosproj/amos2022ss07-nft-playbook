/* eslint-disable no-constant-condition */

import inquirer = require('inquirer');
import { TopLevelCommandIndex } from './app/cli/Commands';

export const program_information = {
  name: 'nft-playbook',
  version: '0.0.1',
};

function greet() {
  console.clear();
  console.log(`Welcome to ${program_information.name}`);
}

async function main() {
  const commandChoices: string[] = [];

  for (const command of TopLevelCommandIndex) {
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

  while (true) {
    greet();

    await inquirer.prompt(promptQuestions).then(async (answers) => {
      const index = commandChoices.indexOf(answers.selectedCommand);

      console.clear();
      await TopLevelCommandIndex.at(index).execute();
    });
  }
}

main();
