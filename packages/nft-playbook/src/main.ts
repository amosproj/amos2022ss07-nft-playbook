import inquirer = require("inquirer");
import { CommandIndex } from "./app/cli/Commands";

function greet() {
    console.clear();
    console.log("Welcome to 'nft-playbook'")
    console.log('\x1b[36m%s\x1b[0m', 'I am cyan');
}

async function main() {
    greet();

    let topLevelCommands: string[] = [];

    for (let x of CommandIndex) {
        topLevelCommands.push(x.name);
    }

    const topLevelQuestion: inquirer.QuestionCollection = [
        { type: 'list', name: 'topLevelCommand', message: 'Please select a command', choices: topLevelCommands }
    ];

    while (true) {
        let x = inquirer.prompt(topLevelQuestion);
        await x.then(answers => {

            let index = topLevelCommands.indexOf(answers.topLevelCommand)

            CommandIndex.at(index).execute();
        })
    }

}


main();