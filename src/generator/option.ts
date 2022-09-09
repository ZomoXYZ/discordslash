import {
    APIApplicationCommandOption,
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    ChannelType,
    LocalizationMap,
} from 'discord.js';
import { normalizeOption, optionsType } from '../util/normalizeOption';

export class CommandOptionGenerator<T = string | number> {
    type: ApplicationCommandOptionType = ApplicationCommandOptionType.String;
    name: string = '';
    name_localizations?: LocalizationMap;
    description: string = '';
    description_localizations?: LocalizationMap;
    required: boolean = false;
    choices: APIApplicationCommandOptionChoice<T>[] = [];
    options: APIApplicationCommandOption[] = [];
    channel_types: ChannelType[] = [];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete: boolean = false;

    setType(
        type:
            | ApplicationCommandOptionType
            | keyof typeof ApplicationCommandOptionType
    ) {
        if (typeof type === 'number') {
            this.type = type;
        } else {
            this.type = ApplicationCommandOptionType[type];
        }

        return this;
    }
    setName(name: string) {
        this.name = name;
        return this;
    }
    setNameLocalizations(localizations: LocalizationMap) {
        this.name_localizations = localizations;
        return this;
    }
    setDescription(description: string) {
        this.description = description;
        return this;
    }
    setDescriptionLocalizations(localizations: LocalizationMap) {
        this.description_localizations = localizations;
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
    addChoice(
        arg1:
            | APIApplicationCommandOptionChoice<T>
            | APIApplicationCommandOptionChoice<T>[]
            | string,
        arg2?: T
    ) {
        if (typeof arg1 === 'string') {
            if (arg2 !== undefined) {
                this.choices.push({
                    name: arg1,
                    value: arg2,
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
    addOption(
        options:
            | optionsType<APIApplicationCommandOption, CommandOptionGenerator>
            | string,
        type?:
            | ApplicationCommandOptionType
            | keyof typeof ApplicationCommandOptionType,
        description?: string,
        required?: boolean,
        min_value?: number,
        max_value?: number
    ) {
        if (typeof options === 'string') {
            if (type !== undefined) {
                this.options.push(
                    CommandOpt(
                        options,
                        type,
                        description,
                        required,
                        min_value,
                        max_value
                    )
                );
            }
        } else {
            this.options.push(...normalizeOption(options));
        }
        return this;
    }
    setChannelTypes(channel_types: ChannelType[]) {
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

    toJson(): APIApplicationCommandOption {
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
            autocomplete: this.autocomplete,
        } as APIApplicationCommandOption;
    }
}
export function CommandOpt(
    name: string,
    type:
        | ApplicationCommandOptionType
        | keyof typeof ApplicationCommandOptionType,
    description?: string,
    required?: boolean,
    min_value?: number,
    max_value?: number
): APIApplicationCommandOption {
    let option = new CommandOptionGenerator().setName(name).setType(type);

    if (description) option.setDescription(description);
    if (required) option.setRequired();
    if (min_value) option.setMinValue(min_value);
    if (max_value) option.setMaxValue(max_value);

    return option.toJson();
}
