import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    LocalizationMap,
    PermissionsString,
} from 'discord.js';
import {
    CommandRunnableFn,
    CommandRunnable,
    POSTAPIApplicationCommand,
    CommandOptionRunnable,
} from '../types/commands';
import { normalizeOption, optionsType } from '../util/normalizeOption';
import { CommandOpt, CommandOptionGenerator } from './option';
import { BitfieldToString } from '../util/general';

export class CommandGenerator {
    type: ApplicationCommandType = ApplicationCommandType.ChatInput;
    guild_id?: string;
    name: string = '';
    name_localizations?: LocalizationMap;
    description?: string;
    description_localizations?: LocalizationMap;
    options: CommandOptionRunnable[] = [];
    default_member_permissions?: string;
    dm_permission?: boolean;
    run: CommandRunnableFn = () => {};

    setType(type: ApplicationCommandType) {
        this.type = type;
        return this;
    }

    setGuildID(id: string) {
        this.guild_id = id;
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
    /**
     * overloads
     * ```
     * addOption(options: optionsType<CommandOption, CommandOptionGenerator>)
     * addOption(name: string, type: OptionTypes|OptionTypesString, description?: string, required?: boolean, min_value?: number, max_value?: number)
     * ```
     */
    addOption(
        options:
            | optionsType<CommandOptionRunnable, CommandOptionGenerator>
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
                const opt = CommandOpt(
                    options,
                    type,
                    description,
                    required,
                    min_value,
                    max_value
                );
                this.options.push(opt);
            }
        } else {
            const opts = normalizeOption(
                options,
                CommandOptionGenerator,
                'toJsonRunnable'
            );
            this.options.push(...opts);
        }
        return this;
    }

    setMemberPermissions(require: PermissionsString[]) {
        this.default_member_permissions = BitfieldToString(require);
        return this;
    }

    setDMPermission(allow: boolean) {
        this.dm_permission = allow;
        return this;
    }

    setRun(fn: CommandRunnableFn) {
        this.run = fn;
        return this;
    }

    toJson(): POSTAPIApplicationCommand {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            dm_permission: this.dm_permission,
            default_member_permissions: this.default_member_permissions,
            type: this.type,
        };
    }

    toJsonRunnable(): CommandRunnable {
        return {
            ...this.toJson(),
            run: this.run,
        };
    }
}
