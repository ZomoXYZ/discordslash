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
    const {
        newCommands,
        updatedCommands,
        existingCommands,
        otherFoundCommands,
    } = await shouldRegister(commands, rest, clientID);

    for (const update of updatedCommands) {
        console.log(
            `Updating application command: ${update.cmd.name} (${update.id})`
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
        console.log(`Registering application command: ${cmd.name}`);
        await rest.post(Routes.applicationCommands(clientID), {
            body: cmd,
        });
        console.log('Successfully registered application commands.');
    }

    for (const cmd of otherFoundCommands) {
        console.log(`Found application command: ${cmd.name} (${cmd.id})`);
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
    otherFoundCommands: APIApplicationCommandWithID[];
}

interface APIApplicationCommandWithID extends POSTAPIApplicationCommand {
    id: string;
}

async function shouldRegister(
    commands: POSTAPIApplicationCommand[],
    rest: REST,
    clientID: string
): Promise<CommandRegister> {
    const foundCommands = (await rest.get(
        Routes.applicationCommands(clientID)
    )) as APIApplicationCommandWithID[];

    const newCommands: POSTAPIApplicationCommand[] = [];
    const updatedCommands: updateCommand[] = [];
    const existingCommands: POSTAPIApplicationCommand[] = [];

    const otherFoundCommands: APIApplicationCommandWithID[] = [];

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

    for (const fcmd of foundCommands) {
        if (!commands.find((cmd) => cmd.name === fcmd.name)) {
            otherFoundCommands.push(fcmd);
        }
    }

    return {
        newCommands,
        updatedCommands,
        existingCommands,
        otherFoundCommands,
    };
}
