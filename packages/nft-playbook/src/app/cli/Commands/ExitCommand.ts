import { Command } from "./Command";

export class ExitCommand implements Command {
    name: string = 'exit';
    execute(): void {
        console.log("EXIT");
        process.exit(0);
    }

}