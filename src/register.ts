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
    const rest = new REST({ version: '10' }).setToken(token),
        toRegister =
            forceRegister || (await shouldRegister(commands, rest, clientID));

    if (toRegister) {
        console.log('Registering application commands...');
        await rest.put(Routes.applicationCommands(clientID), {
            body: commands,
        });
        console.log('Successfully registered application commands.');
    }
}

async function shouldRegister(
    commands: POSTAPIApplicationCommand[],
    rest: REST,
    clientID: string
): Promise<boolean> {
    let foundCommands = (await rest.get(
        Routes.applicationCommands(clientID)
    )) as POSTAPIApplicationCommand[];

    return commands.some((cmd) => {
        const foundCmd = foundCommands.find(
            (fCmd) => cmd.name === fCmd.name && cmd.guild_id === fCmd.guild_id
        );
        const compare = compareValues(cmd, foundCmd, ['dm_permission']);
        return !compare;
    });
}
