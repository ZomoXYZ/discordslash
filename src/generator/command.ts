import { Command, CommandOption, CommandTypes, CommandRunnableFn, CommandRunnable } from "../types/commands";
import { normalizeOption, optionsType } from "../util/normalizeOption";
import { CommandOptionGenerator } from "./option";

export class CommandGenerator {
    name: string;
    description: string;
    options: CommandOption[];
    default_permission: boolean;
    type: CommandTypes;
    run: CommandRunnableFn;

    constructor() {
        this.name = "";
        this.description = "";
        this.options = [];
        this.default_permission = true;
        this.type = CommandTypes.CHAT_INPUT;
        this.run = () => {};
    }

    setName(name: string) {
        this.name = name;
        return this;
    }
    setDescription(description: string) {
        this.description = description;
        return this;
    }
    addOption(option: optionsType<CommandOption, CommandOptionGenerator>) {
        this.options.push(...normalizeOption(option));
        return this;
    }
    setPrivate() {
        this.default_permission = true;
        return this;
    }
    setType(type: CommandTypes) {
        this.type = type;
        return this;
    }

    setRun(fn: CommandRunnableFn) {
        this.run = fn;
        return this;
    }

    toJson(): Command {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_permission: this.default_permission,
            type: this.type
        }
    }

    toJsonRunnable(): CommandRunnable {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_permission: this.default_permission,
            type: this.type,
            run: this.run
        }
    }

}