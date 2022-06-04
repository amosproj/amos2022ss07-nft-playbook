import * as inquirer from 'inquirer';
import { Chalk } from 'chalk';

import { CliStrings } from './app/CliStrings';
import { TopLevelCommandIndex } from './app/Commands';
import { MainRun } from './app/Commands/Command';
import { SettingsData } from './app/SettingsData';

const chalk = new Chalk();


function greet() {
  console.clear();

  console.log(chalk.green(CliStrings.horizontalHashLine));
  console.log(chalk.green(CliStrings.MainMenuHeader));
  console.log(chalk.green(CliStrings.horizontalHashLine));
}

async function main() {
  if (!SettingsData.readSettingsFile()) {
    return;
  }

  const commandChoices: string[] = [];

  for (const command of TopLevelCommandIndex) {
    if (command.name === `Exit`) {
      commandChoices.push(chalk.red(command.name));
    } else {
      commandChoices.push(command.name);
    }
  }

  const promptQuestions: inquirer.QuestionCollection = [
    {
      type: 'list',
      name: 'selectedCommand',
      message: chalk.yellow(CliStrings.MainMenuQuestion),
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
