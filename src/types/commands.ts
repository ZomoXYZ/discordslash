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