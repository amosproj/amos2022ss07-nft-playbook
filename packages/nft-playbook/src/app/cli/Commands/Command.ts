import { ExampleSubprogram } from './ExampleSubprogram';
import { ExitCommand } from './ExitCommand';
import { HelpCommand } from './HelpCommand';
import { VersionCommand } from './VersionCommand';

export interface Command {
  name: string;
  help: string;
  execute(): Promise<void>;
}

export const TopLevelCommandIndex: Command[] = [
  new HelpCommand(),
  new ExampleSubprogram(),
  //...
  new VersionCommand(),
  new ExitCommand(),
];

export function sleep(ms: number) {
  return new Promise((x) => setTimeout(x, ms));
}
