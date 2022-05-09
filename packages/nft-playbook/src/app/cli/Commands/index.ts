import { Command } from "./Command";
import { ExampleSubprogram } from "./ExampleSubprogram";
import { ExitCommand } from "./ExitCommand";
import { HelpCommand } from "./HelpCommand";
import { VersionCommand } from "./VersionCommand";

export * from './Command'
export var CommandIndex: Command[] = [
    new HelpCommand(),
    new VersionCommand(),
    new ExampleSubprogram(),
    new ExitCommand()
]