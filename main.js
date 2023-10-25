const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
require(`./Fonctions/anti-crash.js`)();
require('dotenv').config();


bot.commands = new Discord.Collection();

bot.login(process.env.TOKEN);
loadCommands(bot);
loadEvents(bot);
