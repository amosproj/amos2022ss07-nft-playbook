import inquirer = require('inquirer');
import { TopLevelCommandIndex } from './app/cli/Commands';
import { MainRun } from './app/cli/Commands/Command';
import { SettingsData } from './app/cli/SettingsData';

export const program_information = {
  name: 'nft-playbook',
  version: '0.0.1',
};

function greet() {
  console.clear();
  console.log(`Welcome to ${program_information.name}`);
}

async function main() {
  if (!SettingsData.readSettingsFile()) {
    return;
  }

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
