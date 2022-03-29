import { Client, CommandInteraction } from "discord.js";
import { Command, CommandRunnable, CommandInterRunnable } from "../types/commands";
import { emsg, errorMessage } from "../util/errorMessage";
import { normalizeOption, optionsType } from "../util/normalizeOption";
import { CommandGenerator } from "./generator/command";
import { CommandOptionGenerator } from "./generator/option";
import { registerCommands } from "./register";

//command creation
const CommandsRaw: Command[] = [],
    Commands: Map<string, (interaction: CommandInteraction) => void|Promise<void>> = new Map();

export function addCommand(command: optionsType<CommandRunnable, CommandGenerator>) {

    let command_n = normalizeOption(command, 'toJsonRunnable');
    command_n.forEach(c => {
        Commands.set(c.name, c.run);
    });

    //push command without `run` method
    CommandsRaw.push(...command_n.map((c: CommandInterRunnable) => {
        delete c.run;
        return c;
    }));

}

export {
    CommandGenerator,
    CommandOptionGenerator
}

//command execution
export function initClient(client: Client, token: string) {
    
    //client isn't ready
    if (!client.isReady)
        client.once('ready', clientReady => _initClient(clientReady, token));
    else
        _initClient(client, token);

}

function _initClient(client: Client<true>, token: string) {

    registerCommands(CommandsRaw, token, client.user.id);

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
