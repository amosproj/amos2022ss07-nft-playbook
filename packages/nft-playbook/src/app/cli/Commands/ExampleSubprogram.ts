import inquirer = require("inquirer");
import { Command } from "./Command";

export class ExampleSubprogram implements Command {
    name: string = 'example-routine';
    execute(): void {
        // inquirer.prompt([{
        //     type: 'input',
        //     name: 'username',
        //     message: 'Wer bist du?',
        // }]).then(a => { console.log(a) })
    }

}