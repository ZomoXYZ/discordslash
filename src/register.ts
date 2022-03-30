import { Command } from "./types/commands";
import { REST } from '@discordjs/rest';
import { APIApplicationCommand, Routes } from 'discord-api-types/v10';
import { findInArray } from "./util/array";

export async function registerCommands(commands: Command[], token: string, clientID: string) {

    const rest = new REST({ version: '10' }).setToken(token),
        commandsToRegister = await checkCommands(commands, rest, clientID);

    await rest.put(
        Routes.applicationCommands(clientID),
        { body: commandsToRegister }
    );
    
}

const str = (s: string) => s.replace(/\n/g, '');

async function checkCommands(commandsOrig: Command[], rest: REST, clientID: string) {

    let commands = commandsOrig;
    
    let foundCommands = await rest.get(
        Routes.applicationCommands(clientID)
    ) as APIApplicationCommand[];

    foundCommands.forEach((foundCmd: APIApplicationCommand) => {

        let { data, index } = findInArray(commands, cmd => cmd.name === foundCmd.name),
            cmd = data as Command;

        // if the command exists and is the same, delete from list
        // @ts-ignore ts(2367)
        if (cmd && str(cmd.description) === str(foundCmd.description) && str(cmd.type) === str(foundCmd.type) && str(cmd.default_permission) === str(foundCmd.default_permission)) {
            commands.splice(index, 1);
        } else {
            console.log(`Registering Command ${foundCmd.name}`);
        }

    });

    return commands;

}