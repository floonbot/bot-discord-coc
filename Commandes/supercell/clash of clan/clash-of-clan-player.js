const Discord = require("discord.js");
const { Client } = require("clashofclans.js");
const client = new Client({ keys: [process.env.api] });

module.exports = {

    name: "clash-of-clan-player",
    description: "Vous permet de voir les informations d'un joueur",
    permission: "Aucune",
    dm: false,
    category: `.Supercell`,
    options: [
        {
            type: "string",
            name: "tag",
            description: "Quel est le tag ?",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {


        try {

            await message.deferReply();

            const tag = args.getString("tag");
            const tagRegex = /^(#[A-Z0-9]{8,9})$/;
            if (!tagRegex.test(tag)) {
                return message.followUp(
                    "Le tag du joueur est invalide. Veuillez fournir un tag de joueur valide commençant par '#' et contenant 8 ou 9 caractères alphanumériques."
                );
            }

            const data = await client.getPlayer(tag)
            const {
                name,
                townHallLevel,
                expLevel,
                trophies,
                bestTrophies,
                heroes,
                troops,
                clan,
                role,
                donations,
                league,
                achievements,
                received
            } = data;

            const heroList = heroes
                .map((hero) => `${hero.name}: \`${hero.level}\``)
                .join("\n");

            const troopInfo = troops
                .map((troop) => `${troop.name}: \`${troop.level}\``)
                .join("\n");

            const achivementsList = achievements
                .map((achi) => `\n > Nom : \`${achi.name}\`\n > Info: \`${achi.completionInfo}\` \n > Étoile : \`${achi.stars}\``)
                .join("\n");

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Troupes")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setCustomId("troops")
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Clan")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setCustomId("clan")
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Joueurs")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setCustomId("players")
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Succès")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setCustomId("achievements")
                )

            const malEmbed = new Discord.EmbedBuilder()
                .setTitle("***Clash of Clans***")
                .setColor("#00A705")
                .setDescription(`
                
                     **Informations du joueur :**
                
                      > **Nom :** \`${name}\`
                      > **HDV :** \`${townHallLevel}\`
                      > **Niveau :** \`${expLevel}\`
                      > **Trophées :** \`${trophies}\`
                      > **Meilleurs Trophées :** \`${bestTrophies}\`
                    
                        ***Ligue du joueur :***
                
                      > **Ligue :** \`${league.name}\``)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true, size: 64 }))
                .setFooter({ text: `${message.user.tag}`, iconURL: `${message.user.avatarURL()}` })

            const sentMessage = message.followUp({ embeds: [malEmbed], components: [row] })

            const filter = async () => true;
            const collector = (message.user ? (await message.fetchReply()) : sentMessage).createMessageComponentCollector({ filter, time: false })

            collector.on('collect', async sentMessage => {
                if (sentMessage.customId === 'players') {
                    await sentMessage.deferUpdate();
                    await sentMessage.editReply({ embeds: [malEmbed], components: [row] });
                }
                if (sentMessage.customId === 'achievements') {
                    await sentMessage.deferUpdate();
                    const malEmbed = new Discord.EmbedBuilder()
                        .setTitle("***Clash of Clans***")
                        .setColor("#00A705")
                        .setDescription(`
                          ***Succès du joueur :***   
                        ${achivementsList}
                        `)
                        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setFooter({ text: `${message.user.tag}`, iconURL: `${message.user.avatarURL()}` })
                    await sentMessage.editReply({ embeds: [malEmbed], components: [row] });
                }

                if (sentMessage.customId === 'troops') {
                    await sentMessage.deferUpdate();
                    const malEmbed = new Discord.EmbedBuilder()
                        .setTitle("***Clash of Clans***")
                        .setColor("#00A705")
                        .setDescription(`
                              ***Informations du joueur :***
                    
                            > **Héros :** 
                            ${heroList}
                            ------------------------------------
                            > **Troupes :**
                            ${troopInfo}`)
                        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setFooter({ text: `${message.user.tag}`, iconURL: `${message.user.avatarURL()}` });
                    await sentMessage.editReply({ embeds: [malEmbed], components: [row] });
                }

                if (sentMessage.customId === 'clan') {
                    await sentMessage.deferUpdate();
                    const malEmbed = new Discord.EmbedBuilder()
                        .setTitle("***Clash of Clans***")
                        .setColor("#00A705")
                        .setDescription(`

                              ***Informations du clan :***
                            > **Nom :** \`${clan.name}\`
                            > **Niveau du clan :** \`${clan.level}\`
                            > **Rôle du membre dans le clan :** \`${role}\`
                            > **Troupes données :** \`${donations}\`
                            > **Troupes reçues :** \`${received}\``)
                        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setFooter({ text: `${message.user.tag}`, iconURL: `${message.user.avatarURL()}` })
                    await sentMessage.editReply({ embeds: [malEmbed], components: [row] });
                }
            });

            collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        } catch (err) {
            message.followUp("Le tag n'existe pas")
        }
    }
}
