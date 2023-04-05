import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { POSTAPIApplicationCommand } from './types/commands';
import { compareValues } from './util/general';

export async function registerCommands(
    commands: POSTAPIApplicationCommand[],
    token: string,
    clientID: string,
    forceRegister = false
) {
    if (commands.length === 0) {
        return;
    }
    const rest = new REST({ version: '10' }).setToken(token);
    const { newCommands, updatedCommands, existingCommands } =
        await shouldRegister(commands, rest, clientID);

    for (const update of updatedCommands) {
        console.log(
            `Updating application command ${update.cmd.name} (${update.id})`
        );
        await rest.patch(Routes.applicationCommand(clientID, update.id), {
            body: update.cmd,
        });
        console.log(`Successfully updated application command.`);
    }

    if (forceRegister) {
        console.log(
            `(FORCE) Adding commands to register queue: ${existingCommands
                .map((cmd) => cmd.name)
                .join(', ')}`
        );
        newCommands.push(...existingCommands);
    }

    for (const cmd of newCommands) {
        const commandNames = newCommands.map((cmd) => cmd.name).join(', ');
        console.log(`Registering application commands: ${commandNames}`);
        await rest.post(Routes.applicationCommands(clientID), {
            body: cmd,
        });
        console.log('Successfully registered application commands.');
    }
}

interface updateCommand {
    cmd: POSTAPIApplicationCommand;
    id: string;
}

interface CommandRegister {
    newCommands: POSTAPIApplicationCommand[];
    updatedCommands: updateCommand[];
    existingCommands: POSTAPIApplicationCommand[];
}

interface APIApplicationCommandWithID extends POSTAPIApplicationCommand {
    id: string;
}

async function shouldRegister(
    commands: POSTAPIApplicationCommand[],
    rest: REST,
    clientID: string
): Promise<CommandRegister> {
    let foundCommands = (await rest.get(
        Routes.applicationCommands(clientID)
    )) as APIApplicationCommandWithID[];

    const newCommands: POSTAPIApplicationCommand[] = [];
    const updatedCommands: updateCommand[] = [];
    const existingCommands: POSTAPIApplicationCommand[] = [];

    for (const cmd of commands) {
        const foundCmd = foundCommands.find(
            (fCmd) => cmd.name === fCmd.name && cmd.guild_id === fCmd.guild_id
        );

        if (!foundCmd) {
            // not found
            newCommands.push(cmd);
            continue;
        }

        const compare = compareValues(cmd, foundCmd, ['dm_permission']);
        if (!compare) {
            // different contents
            updatedCommands.push({ cmd, id: foundCmd.id });
        } else {
            // same contents
            existingCommands.push(cmd);
        }
    }

    return { newCommands, updatedCommands, existingCommands };
}
