import { APIApplicationCommandOptionChoice, LocalizationMap } from 'discord.js';

export class CommandChoiceGenerator {
    name: string = '';
    name_localizations?: LocalizationMap;
    value: string | number = '';

    setName(name: string) {
        this.name = name;
        return this;
    }
    setNameLocalizations(localizations: LocalizationMap) {
        this.name_localizations = localizations;
        return this;
    }
    setValue(value: string | number) {
        this.value = value;
        return this;
    }

    toJson(): APIApplicationCommandOptionChoice {
        return {
            name: this.name,
            name_localizations: this.name_localizations,
            value: this.value,
        };
    }
}
