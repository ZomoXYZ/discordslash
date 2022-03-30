# discordslash

Discord Application Commands made easy

## usage

run `npm run buildexample <token>` to compile example(s)

`examples/main.ts`

```ts
import { Client, CommandInteraction, Intents } from 'discord.js';
import { addCommand, CommandGenerator, CommandOptionGenerator, initClient } from '../';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

initClient(client);

addCommand([
    new CommandGenerator()
        .setName('ping')
        .setDescription('ping me')
        .setRun((interaction: CommandInteraction) =>
            interaction.reply('pong')),
            
    new CommandGenerator()
        .setName('8ball')
        .setDescription('ask the magic 8ball a question')
        .addOption([

            new CommandOptionGenerator()
                .setName('question')
                .setType('string')
                .setDescription('question to ask the 8ball')
                .setRequired()

        ])
        .setRun(EightBall)
]);

client.login(TOKEN);
```

## TODO

- quick option functions
- non global commmands
