import { Command, CommandOption, CommandTypes, CommandRunnableFn, CommandRunnable, OptionTypes, OptionTypesString } from "../types/commands";
import { normalizeOption, optionsType } from "../util/normalizeOption";
import { CommandOpt, CommandOptionGenerator } from "./option";

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
    /**
     * overloads
     * ```
     * addOption(options: optionsType<CommandOption, CommandOptionGenerator>)
     * addOption(name: string, type: OptionTypes|OptionTypesString, description?: string, required?: boolean, min_value?: number, max_value?: number)
     * ```
     */
    addOption(options: optionsType<CommandOption, CommandOptionGenerator>|string, type?: OptionTypes|OptionTypesString, description?: string, required?: boolean, min_value?: number, max_value?: number) {
        if (typeof options === 'string') {
            if (type !== undefined) {
                this.options.push(CommandOpt(options, type, description, required, min_value, max_value));
            }
        } else {
            this.options.push(...normalizeOption(options));
        }
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