import { Command } from "./Command";

export class HelpCommand implements Command {
    name: string = 'help';
    execute(): void {
        console.log("HELP");
    }

}