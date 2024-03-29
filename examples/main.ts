import { Client, CommandInteraction } from 'discord.js';
import {
    addCommand,
    CommandGenerator,
    CommandOptionGenerator,
    initClient,
} from '..';

const EightBallAnswers = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes - definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    "Don't count on it",
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful',
    'Reply hazy, try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
];

const client = new Client({ intents: ['Guilds'] });

initClient(client);

// any argument that accepts a generator can accept the following: raw json, generator, or a function that returns a generator, or an array that contans any of these
//  this includes: addCommand, addOption, and addChoice

addCommand([
    //raw json
    {
        type: 1,
        name: 'hi',
        description: 'Say hi to the bot',
        run: (interaction) => interaction.reply('hi!'),
    },

    //with generator
    new CommandGenerator()
        .setName('ping')
        .setDescription('ping me!')
        .setRun((interaction: CommandInteraction) => interaction.reply('pong')),

    //with generator from function
    (cmd) =>
        cmd
            .setName('fun')
            .setDescription('fun commands')
            .addOption((opt) =>
                opt
                    .setName('8ball')
                    .setDescription('ask the magic 8ball a question')
                    .setType('Subcommand')
                    .addOption(
                        'question',
                        'String',
                        'question to ask the 8ball',
                        true
                    )
                    /* this is the same as the method above
                    .addOption(
                        new CommandOptionGenerator()
                            .setName('question')
                            .setType('String')
                            .setDescription('question to ask the 8ball')
                            .setRequired()
                    )
                    */
                    .setRun(EightBall)
            )
            // because there is a subcommand, this will never be run
            .setRun((interaction: CommandInteraction) =>
                interaction.reply('you ran the fun command!')
            ),
]);

function EightBall(interaction: CommandInteraction) {
    let question = interaction.options.get('question', true).value,
        answer =
            EightBallAnswers[
                Math.floor(Math.random() * EightBallAnswers.length)
            ];

    if (typeof question === 'string') {
        if (!question.endsWith('?')) question += '?';

        interaction
            .reply(`\`${question}\` ${answer}`)
            .catch((e) => console.error(e));
    }
}

client.on('ready', (client) => console.log(`Ready ${client.user.tag}`));

client.login(TOKEN);
