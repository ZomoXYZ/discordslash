import { CommandInteraction } from "discord.js";

export enum OptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT
}

export type OptionTypesString = 'subcommand' | 'subcommand_group' | 'string' | 'integer' | 'boolean' | 'user' | 'channel' | 'role' | 'mentionable' | 'number' | 'attachment';

export const OptionTypesStringMap = {
    'subcommand': OptionTypes.SUB_COMMAND,
    'subcommand_group': OptionTypes.SUB_COMMAND_GROUP,
    'string': OptionTypes.STRING,
    'integer': OptionTypes.INTEGER,
    'boolean': OptionTypes.BOOLEAN,
    'user': OptionTypes.USER,
    'channel': OptionTypes.CHANNEL,
    'role': OptionTypes.ROLE,
    'mentionable': OptionTypes.MENTIONABLE,
    'number': OptionTypes.NUMBER,
    'attachment': OptionTypes.ATTACHMENT
};

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM,
    GUILD_VOICE,
    GROUP_DM,
    GUILD_CATEGORY,
    GUILD_NEWS,
    GUILD_STORE,
    GUILD_NEWS_THREAD = 10,
    GUILD_PUBLIC_THREAD,
    GUILD_PRIVATE_THREAD,
    GUILD_STAGE_VOICE
}

export enum CommandTypes {
    CHAT_INPUT = 1,
    USER,
    MESSAGE
}

export interface OptionChoices {
    name: string;
    value: string|number;
}

export interface CommandOption {
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
}

export interface Command {
    name: string;
    description: string;
    options?: CommandOption[];
    /**
     * default: true
     */
    default_permission?: boolean;
    type?: CommandTypes;
}

export type CommandRunnableFn = (interaction: CommandInteraction) => void|Promise<void>;
export interface CommandRunnable extends Command {
    run: CommandRunnableFn;
}
export interface CommandInterRunnable extends Command {
    run?: CommandRunnableFn;
}