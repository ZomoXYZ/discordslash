import { Client, Intents } from "discord.js";
import { addCommand, CommandGenerator, initClient } from "./commands/main";

const CLIENT = new Client({ intents: [Intents.FLAGS.GUILDS] }),
    TOKEN = '';
initClient(CLIENT, TOKEN);
addCommand([
    new CommandGenerator()
        .setName('ping')
])
CLIENT.login(TOKEN);