import { Client, CommandInteraction } from "discord.js";
import { Command, CommandRunnable } from "./types/commands";
import { emsg, errorMessage } from "./util/errorMessage";
import { normalizeOption, optionsType } from "./util/normalizeOption";
import { CommandGenerator } from "./generator/command";
import { CommandOptionGenerator } from "./generator/option";
import { registerCommands } from "./register";

export { emsg, errorMessage };

const CommandsRaw: Command[] = [],
    Commands: Map<string, (interaction: CommandInteraction) => void|Promise<void>> = new Map();
    
var ClientReady = false,
    ClientToken = '',
    ClientID = '';

export function addCommand(commandRaw: optionsType<CommandRunnable, CommandGenerator>) {

    let commands = normalizeOption(commandRaw),
        commands_n = normalizeOption(commandRaw, 'toJsonRunnable');

    CommandsRaw.push(...commands);
    
    commands_n.forEach(c => {
        Commands.set(c.name, c.run);
    });

    if (ClientReady) {
        registerCommands(CommandsRaw, ClientToken, ClientID);
    }

}

export {
    CommandGenerator,
    CommandOptionGenerator
}

//command execution
export function initClient(client: Client) {
    
    //client isn't ready
    if (client.readyAt !== null)
        _initClient(client);
    else
        client.once('ready', clientReady => _initClient(clientReady));

}

function _initClient(client: Client<true>) {

    ClientReady = true;
    ClientToken = client.token;
    ClientID = client.user.id;

    registerCommands(CommandsRaw, ClientToken, ClientID);

    client.on('interactionCreate', async interaction => {

        if (!interaction.isCommand()) return;

        try {

            var commandsFound = Commands.get(interaction.commandName);

            if (!commandsFound) {
                // TODO Lang
                throw emsg(`Command ${interaction.commandName} not found`);
            }

            await commandsFound(interaction as CommandInteraction);

        } catch (e) {

            if (e instanceof errorMessage) {

                if (interaction.deferred || interaction.replied)
                    interaction.editReply(e.content);
                else
                    interaction.reply(e);
                
            } else console.error(e);

        }
    });

}
