import { Client, CommandInteraction, Intents } from 'discord.js';
import { addCommand, CommandGenerator, CommandOptionGenerator, initClient } from '../lib/main';

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
  'Don\'t count on it',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful',
  'Reply hazy, try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again'
];

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
        //.addOption('question', 'string', 'question to ask the 8ball') //will add something like this later
        .addOption([

            new CommandOptionGenerator()
                .setName('question')
                .setType('string')
                .setDescription('question to ask the 8ball')
                .setRequired()

        ])
        .setRun(EightBall)
]);

function EightBall(interaction: CommandInteraction) {

    let question = interaction.options.get('question', true).value,
        answer = EightBallAnswers[Math.floor(Math.random() * EightBallAnswers.length)];

    if (typeof question === 'string') {

        if (!question.endsWith('?'))
            question += '?';

        interaction.reply(`\`${question}\` ${answer}`);

    }

}

client.on('ready', client => console.log(`Ready ${client.user.tag}`));

client.login(TOKEN);
