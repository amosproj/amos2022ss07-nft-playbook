import inquirer = require('inquirer');
import { CliStrings } from './app/cli/CliStrings';
import { TopLevelCommandIndex } from './app/cli/Commands';
import { MainRun } from './app/cli/Commands/Command';
import { SettingsData } from './app/cli/SettingsData';

function greet() {
  console.clear();

  console.log(CliStrings.horizontalHashLine);
  console.log(CliStrings.MainMenuHeader);
  console.log(CliStrings.horizontalHashLine);
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
