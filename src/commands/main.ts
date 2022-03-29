import { Client, CommandInteraction } from "discord.js";
import { CommandRunnable } from "../types/commands";
import { emsg, errorMessage } from "../util/errorMessage";
import { normalizeOption, optionsType } from "../util/normalizeOption";
import { CommandGenerator } from "./generator/command";
import { CommandOptionGenerator } from "./generator/option";

//command creation
const Commands: Map<string, (interaction: CommandInteraction) => void|Promise<void>> = new Map();

export function addCommand(command: optionsType<CommandRunnable, CommandGenerator>) {
    let command_n = normalizeOption(command, 'toJsonRunnable');
    command_n.forEach(c => {
        Commands.set(c.name, c.run);
    });
}

export {
    CommandGenerator,
    CommandOptionGenerator
}

//command execution
export function initClient(client: Client) {
    
    //client isn't ready
    if (!client.isReady)
        client.once('ready', () => initClient(client));
    else {

        client.on('interactionCreate', async interaction => {

            if (!interaction.isCommand()) return;

            try {

                var commandsFound = Commands.get(interaction.commandName);

                if (!commandsFound) {
                    // interaction.reply(Lang.get('error.command.notFound', {
                    //     command: interaction.commandName
                    // }));
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

}
