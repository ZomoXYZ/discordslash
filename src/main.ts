import { Client, CommandInteraction } from 'discord.js';
import { CommandRunnable, POSTAPIApplicationCommand } from './types/commands';
import { emsg, errorMessage, setEmsgShim } from './util/errorMessage';
import { normalizeOption, optionsType } from './util/normalizeOption';
import { CommandGenerator } from './generator/command';
import { CommandOptionGenerator } from './generator/option';
import { registerCommands } from './register';

export { emsg, errorMessage, setEmsgShim };
export * from './types/commands';

export { CommandGenerator, CommandOptionGenerator };

const CommandsRaw: POSTAPIApplicationCommand[] = [],
    Commands: Map<
        string,
        (interaction: CommandInteraction) => void | Promise<void>
    > = new Map();

var ClientReady = false,
    ClientToken = '',
    ClientID = '';

export function addCommand(
    commandRaw: optionsType<CommandRunnable, CommandGenerator>
) {
    let commands = normalizeOption(commandRaw),
        commands_n = normalizeOption(commandRaw, 'toJsonRunnable');

    CommandsRaw.push(...commands);

    commands_n.forEach((c) => {
        let name = c.name;
        if (c.guild_id) name += `-${c.guild_id}`;
        Commands.set(name, c.run);
    });

    if (ClientReady) {
        registerCommands(CommandsRaw, ClientToken, ClientID);
    }
}

//command execution
export function initClient(client: Client, forceRegister = false) {
    //client isn't ready
    if (client.readyAt !== null) _initClient(client, forceRegister);
    else
        client.once('ready', (clientReady) =>
            _initClient(clientReady, forceRegister)
        );
}

function _initClient(client: Client<true>, forceRegister = false) {
    ClientReady = true;
    ClientToken = client.token;
    ClientID = client.user.id;

    registerCommands(CommandsRaw, ClientToken, ClientID, forceRegister);

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        try {
            var commandFound = Commands.get(interaction.commandName);
            if (interaction.guild) {
                let guildCommand = Commands.get(
                    `${interaction.commandName}-${interaction.guild.id}`
                );
                if (guildCommand) commandFound = guildCommand;
            }

            if (commandFound === undefined) {
                return;
                // throw emsg(
                //     `Command ${interaction.commandName} not found`,
                //     true,
                //     true
                // );
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
