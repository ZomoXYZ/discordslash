import { ChannelTypes, CommandOption, OptionChoices, OptionTypes } from "../../types/commands";
import optionNormal from "../../util/optionNormal";

export default class CommandOptionsGenerator {
    type: OptionTypes;
    name: string;
    description: string;
    required?: boolean;
    choices?: OptionChoices[];
    options?: CommandOption[];
    channel_types?: ChannelTypes[];
    min_value?: number;
    max_value?: number;
    autocomplete?: boolean;

    constructor() {
        this.type = OptionTypes.STRING;
        this.name = "";
        this.description = "";
        this.required = false;
        this.choices = [];
        this.options = [];
        this.channel_types = [];
        this.min_value = undefined;
        this.max_value = undefined;
        this.autocomplete = false;
    }

    setType(type: OptionTypes) {
        this.type = type;
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
    setRequired(required: boolean) {
        this.required = required;
        return this;
    }
    addChoice(arg1: OptionChoices | OptionChoices[] | string, arg2?: string|number) {
        if (typeof arg1 === "string") {
            
            if (arg2 !== undefined) {
                this.choices.push({
                    name: arg1,
                    value: arg2
                });
            }

        } else {
            this.choices.push(...optionNormal(arg1));
        }
        return this;
    }
    addOption(options: CommandOption | CommandOptionsGenerator | CommandOption[] | CommandOptionsGenerator[]) {
        this.options.push(...optionNormal(options));
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
    setAutocomplete(autocomplete: boolean) {
        this.autocomplete = autocomplete;
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