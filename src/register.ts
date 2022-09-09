import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { POSTAPIApplicationCommand } from './types/commands';
import { compareObjects } from './util/general';

export async function registerCommands(
    commands: POSTAPIApplicationCommand[],
    token: string,
    clientID: string,
    forceRegister = false
) {
    const rest = new REST({ version: '10' }).setToken(token),
        toRegister =
            forceRegister || (await checkCommands(commands, rest, clientID));

    if (toRegister) {
        await rest.put(Routes.applicationCommands(clientID), {
            body: commands,
        });
    }
}

async function checkCommands(
    commands: POSTAPIApplicationCommand[],
    rest: REST,
    clientID: string
): Promise<boolean> {
    let foundCommands = (await rest.get(
        Routes.applicationCommands(clientID)
    )) as POSTAPIApplicationCommand[];

    return commands.every((cmd) => {
        const foundCmd = foundCommands.find(
            (fCmd) => cmd.name === fCmd.name && cmd.guild_id === fCmd.guild_id
        );
        if (cmd && compareObjects(cmd, foundCmd, [['dm_permission', true]])) {
            return true;
        }
        return false;
    });
}
