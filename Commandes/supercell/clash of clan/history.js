const Discord = require("discord.js")

module.exports = {

    name: "history",
    description: "Permet de regarder les informations clash of clan enregistrer dans la base de donnée",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: `.Supercell`,

    async run(bot, message, args, db) {
        db.query(`SELECT * FROM server WHERE guildId = '${message.guildId}' AND discord != 'false'`, async (err, req) => {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête :", err);
                return;
            }

            if (req.length === 0) {
                message.reply("Personne n'est enregistré. Veuillez utiliser la commande `/info` pour vous enregistrer.");
                return;
            }


            let embed_description = "";
            let Embed = new Discord.EmbedBuilder()
                .setColor("#FF0000")
                .setTitle(`***Information***`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
                .setFooter({ text: `${message.user.tag}`, iconURL: `${message.user.avatarURL()}` });

            for (let i = 0; i < req.length; i++) {
                embed_description += `
                    > **Discord :** \`${req[i].discord}\`
                    > **clash of clan :** \`${req[i].coc} \`
                    > **tag :** \`${req[i].tag}\`
                `;
            }
            Embed.setDescription(embed_description);
            message.reply({ embeds: [Embed] });
        });
    }
};