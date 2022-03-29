import { Plugin } from 'esbuild';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

//plugin data
export const discordSlashPlugin: Plugin = {
    name: 'discordslash',
    setup(build) {

        //replace all imports 
        build.onResolve({ filter: /^esbuild\-discordslash\-plugin$/ }, args => ({
            path: args.path,
            external: true,
            namespace: 'discordslash'
        }))
        build.onLoad({ filter: /.*/, namespace: 'discordslash' }, () => ({
            contents: JSON.stringify({}),
            loader: 'json',
        }))
    }
}

export async function registerSlash() {
    //manage commands
    const commands: CommandRaw[] = [];

    for (const command of Commands) {
        const commandRaw: CommandRaw & { run?: any } = command;
        delete commandRaw.run;
        commands.push(commandRaw);
    }

    //register commands
    const token = fs.readFileSync('./token.txt', 'utf8'),
        rest = new REST({ version: '10' }).setToken(token);

    const { id } = await rest.get(Routes.user()) as { id: string };

    await rest.put(
        Routes.applicationCommands(id),
        { body: commands }
    );
}