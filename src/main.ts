import { Client, CommandInteraction } from 'discord.js';
import {
    CommandOptionRunnable,
    CommandRunnable,
    POSTAPIApplicationCommand,
    POSTAPIApplicationCommandOption,
} from './types/commands';
import { emsg, errorMessage, setEmsgShim } from './util/errorMessage';
import { normalizeOption, optionsType } from './util/normalizeOption';
import { CommandGenerator } from './generator/command';
import { CommandOptionGenerator } from './generator/option';
import { registerCommands } from './register';

export { emsg, errorMessage, setEmsgShim };
export * from './types/commands';

export { CommandGenerator, CommandOptionGenerator };
type CommandFn = (interaction: CommandInteraction) => void | Promise<void>;

const CommandsRaw: POSTAPIApplicationCommand[] = [];

/**
 * key: command split by '-'
 *
 *     key example: 'command'
 *                  'command-subcommand'
 *                  'guildID-command'
 *                  'guildID-command-subcommand'
 */
const Commands: Map<string, CommandFn> = new Map();

var ClientReady = false,
    ClientToken = '',
    ClientID = '';

function setCommandsLoop(
    options: (CommandRunnable | CommandOptionRunnable)[],
    key: string[] = [],
    guild?: string
) {
    for (const option of options) {
        let newkey = [...key, option.name];
        if ('guild_id' in option) {
            guild = option.guild_id;
        }
        let optionName = newkey.join('-');
        if (guild !== undefined) {
            optionName = `${guild}-${optionName}`;
        }
        if (option.run !== undefined) {
            Commands.set(optionName, option.run);
        } else {
        }
        if (option.options) {
            setCommandsLoop(option.options, newkey);
        }
    }
}

export function addCommand(
    commandRaw: optionsType<CommandRunnable, CommandGenerator>
) {
    let commands = normalizeOption(commandRaw),
        commands_n = normalizeOption(commandRaw, 'toJsonRunnable');

    CommandsRaw.push(...commands);
    setCommandsLoop(commands_n);

    if (ClientReady) {
        registerCommands(CommandsRaw, ClientToken, ClientID);
    }
}

//command execution
export function initClient(client: Client, forceRegister = false) {
    //client isn't ready
    if (client.readyAt !== null) {
        _initClient(client, forceRegister);
    } else {
        client.once('ready', (clientReady) =>
            _initClient(clientReady, forceRegister)
        );
    }
}

function _initClient(client: Client<true>, forceRegister = false) {
    ClientReady = true;
    ClientToken = client.token;
    ClientID = client.user.id;

    registerCommands(CommandsRaw, ClientToken, ClientID, forceRegister);

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        try {
            var commandFound = getRun(
                [interaction.commandName, interaction.options.getSubcommand()],
                interaction.guild?.id
            );

            if (commandFound === null) {
                return;
            }

            await commandFound(interaction as CommandInteraction);
        } catch (e) {
            if (e instanceof errorMessage) {
                if (interaction.deferred || interaction.replied)
                    interaction.editReply(e.content);
                else interaction.reply(e);
            } else console.error(e);
        }
    });
}

function getRun(
    commandOrig: (string | null | undefined)[],
    guild?: string | null
): CommandFn | null {
    const command = commandOrig.filter(
        (c) => c !== null && c !== undefined
    ) as string[];
    let commandName = command.join('-');
    let fn = Commands.get(commandName);
    if (guild !== null && guild !== undefined) {
        let guildCommand = Commands.get(`${guild}-${commandName}`);
        if (guildCommand) fn = guildCommand;
    }
    if (fn === undefined) {
        if (command.length === 1) {
            return null;
        } else {
            return getRun(command.slice(0, command.length - 1), guild);
        }
    }
    return fn;
}
