import { Command } from './Command';

export class BackCommand implements Command {
  name: string;
  help: string;

  private handler: { run: boolean };

  constructor(handler: { run: boolean }, name = `Back`, help = `\tGo back`) {
    this.handler = handler;
    this.name = name;
    this.help = help;
  }

  async execute() {
    this.handler.run = false;
  }
}
