import {
    APIApplicationCommandOption,
    ApplicationCommandType,
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
    options?: APIApplicationCommandOption[];
    default_member_permissions?: string;
    dm_permission?: boolean;
}

export type CommandRunnableFn = (
    interaction: CommandInteraction
) => any | Promise<any>;
export interface CommandRunnable extends POSTAPIApplicationCommand {
    run: CommandRunnableFn;
}
export interface CommandInterRunnable extends POSTAPIApplicationCommand {
    run?: CommandRunnableFn;
}
