import { ChannelTypes, CommandOption, OptionChoices, OptionTypes, OptionTypesString, OptionTypesStringMap } from "../types/commands";
import { normalizeOption, optionsType } from "../util/normalizeOption";

//TODO functions that use this generator for main OptionTypes

export class CommandOptionGenerator {
    type: OptionTypes;
    name: string;
    description: string;
    required: boolean;
    choices: OptionChoices[];
    options: CommandOption[];
    channel_types: ChannelTypes[];
    min_value?: number;
    max_value?: number;
    autocomplete: boolean;

    constructor() {
        this.type = OptionTypes.STRING;
        this.name = "";
        this.description = "";
        this.required = false;
        this.choices = [];
        this.options = [];
        this.channel_types = [];
        this.autocomplete = false;
    }

    setType(type: OptionTypes | OptionTypesString) {

        if (typeof type === 'number') {
            this.type = type;
        } else {
            this.type = OptionTypesStringMap[type];
        }

        return this;
    }
    setName(name: string) {
        this.name = name;
        return this;
    }
    setDescription(description: string) {
        this.description = description;
        return this;
    }
    setRequired() {
        this.required = true;
        return this;
    }
    /**
     * overloads
     * ```
     * addChoice(choices: OptionChoices | OptionChoices[])
     * addChoice(name: string, value: string|number)
     * ```
     */
    addChoice(arg1: OptionChoices | OptionChoices[] | string, arg2?: string|number) {
        if (typeof arg1 === "string") {
            
            if (arg2 !== undefined) {
                this.choices.push({
                    name: arg1,
                    value: arg2
                });
            }

        } else {
            this.choices.push(...normalizeOption(arg1));
        }
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
    setChannelTypes(channel_types: ChannelTypes[]) {
        this.channel_types = channel_types;
        return this;
    }
    setMinValue(min_value: number) {
        this.min_value = min_value;
        return this;
    }
    setMaxValue(max_value: number) {
        this.max_value = max_value;
        return this;
    }
    setAutocomplete() {
        this.autocomplete = true;
        return this;
    }

    toJson(): CommandOption {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
            choices: this.choices,
            options: this.options,
            channel_types: this.channel_types,
            min_value: this.min_value,
            max_value: this.max_value,
            autocomplete: this.autocomplete
        }
    }

}
export function CommandOpt(name: string, type: OptionTypes|OptionTypesString, description?: string, required?: boolean, min_value?: number, max_value?: number) {
    let option = new CommandOptionGenerator()
        .setName(name)
        .setType(type)

    if (description)
        option.setDescription(description)
    if (required)
        option.setRequired()
    if (min_value)
        option.setMinValue(min_value)
    if (max_value)
        option.setMaxValue(max_value);

    return option;
}