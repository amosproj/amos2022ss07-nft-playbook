import { Command } from './Command';
import { program_information } from '../../../main';
import inquirer = require('inquirer');

export class VersionCommand implements Command {
  name = 'Version';
  help = '\tVersion will provide you with the current version of the program.';
  async execute() {
    console.log(`${program_information.version}`);

    await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Want to go back?',
        choices: ['Back'],
      },
    ]);
  }
}
