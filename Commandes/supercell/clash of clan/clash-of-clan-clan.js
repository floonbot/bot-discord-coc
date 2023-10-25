const Discord = require("discord.js");
const { Client } = require("clashofclans.js");
const client = new Client({ keys: [process.env.api] });

module.exports = {

	name: "clash-of-clan-clan",
	description: "Vous permet de voir les informations d'un clan",
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

	async run(bot, message, args, db) {

		try {

			const tag = args.getString("tag");
			const tagRegex = /^(#[A-Z0-9]{8,9})$/;
			if (!tagRegex.test(tag)) {
				return message.reply(
					"Le tag du joueur est invalide. Veuillez fournir un tag de joueur valide commençant par '#' et contenant 8 ou 9 caractères alphanumériques."
				);
			}

			const row = new Discord.ActionRowBuilder()
				.addComponents(
					new Discord.ButtonBuilder()
						.setLabel("Membre")
						.setStyle(Discord.ButtonStyle.Primary)
						.setCustomId("membreCOC")
				)
				.addComponents(
					new Discord.ButtonBuilder()
						.setLabel("Clan")
						.setStyle(Discord.ButtonStyle.Primary)
						.setCustomId("clan")
				)

			const data = await client.getClan(tag)
			const {
				name,
				memberCount,
				members,
				type,
				location,
				requiredTrophies,
				warWins,
			} = data

			const membersList = members
				.map((ClanMember, index) => `\n> **[${index + 1}] Nom :** \`${ClanMember.name}\``)
				.join("\n")
			const malEmbed = new Discord.EmbedBuilder()
				.setTitle("***Clash of Clans***")
				.setColor("#00A705")
				.setDescription(`

			  **Informations sur le clan :**

                    > **Nom :** \`${name}\`
                    > **Nombre de membres :** \`${memberCount}\`
                    > **Ouvert ou fermé :** \`${type}\`
                    > **Langue :** \`${location.name}\`
                    > **Trophées requis :** \`${requiredTrophies}\`
                    > **Nombre de victoires en guerre :** \`${warWins}\``)
				.setThumbnail(bot.user.displayAvatarURL({ dynamic: true, size: 64 }))
				.setFooter({ text: `${message.user.tag}`, iconURL: `${message.user.avatarURL()}` })

			const sentMessage = message.reply({ embeds: [malEmbed], components: [row] })

			const filter = async () => true;
			const collector = (message.user ? (await message.fetchReply()) : sentMessage).createMessageComponentCollector({ filter, time: false })

			collector.on('collect', async sentMessage => {
				if (sentMessage.customId === 'clan') {
					await sentMessage.deferUpdate();
					await sentMessage.editReply({ embeds: [malEmbed], components: [row] });
				}
				if (sentMessage.customId === 'membreCOC') {
					await sentMessage.deferUpdate();
					const malEmbed = new Discord.EmbedBuilder()
						.setTitle("***Clash of Clans***")
						.setColor("#00A705")
						.setDescription(`

					**Membres du clan :**
					${membersList}`)
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
