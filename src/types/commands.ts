import {
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChannelType,
    CommandInteraction,
    LocalizationMap,
} from 'discord.js';

export interface POSTAPIApplicationCommand {
    type: ApplicationCommandType;
    guild_id?: string;
    name: string;
    name_localizations?: LocalizationMap;
    description?: string;
    description_localizations?: LocalizationMap;
    options?: POSTAPIApplicationCommandOption[];
    default_member_permissions?: string;
    dm_permission?: boolean;
}

export interface POSTAPIApplicationCommandOption<T = string | number> {
    type: ApplicationCommandOptionType;
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice<T>[];
    options?: POSTAPIApplicationCommandOption[];
    channel_types?: ChannelType[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export type CommandRunnableFn = (
    interaction: CommandInteraction
) => any | Promise<any>;
export interface CommandOptionRunnable<T = string | number>
    extends POSTAPIApplicationCommandOption<T> {
    run?: CommandRunnableFn;
}
export interface CommandRunnable extends POSTAPIApplicationCommand {
    run?: CommandRunnableFn;
}
