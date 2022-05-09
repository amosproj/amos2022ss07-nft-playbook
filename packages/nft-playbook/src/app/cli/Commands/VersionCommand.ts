import { Command } from "./Command";

const program_information = {
    name: 'nft-playbook',
    version: '0.0.1',
};

export class VersionCommand implements Command {
    name: string = 'version';
    execute(): void {
        console.log("VERSION");
        console.log(`${program_information.version}`);
    }

}