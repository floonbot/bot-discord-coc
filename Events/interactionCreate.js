const Discord = require("discord.js");

module.exports = async (bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command && command.run) {
            command.run(bot, interaction, interaction.options, bot.db);
        }
    }
}
