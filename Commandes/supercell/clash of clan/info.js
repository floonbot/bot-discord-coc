const { Client } = require("clashofclans.js");
const client = new Client({ keys: [process.env.api] });

module.exports = {

    name: "info",
    description: "Permet de consulter les informations de votre profil",
    permission: "Aucune",
    dm: false,
    category: ".Supercell",
    options: [
        {
            type: "string",
            name: "discord",
            description: "Quel est votre Discord ?",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "coc",
            description: "Quel est votre nom d'utilisateur CoC ?",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "tag",
            description: "Quel est le tag du joueur ?",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let discord = args.getString("discord");
        let coc = args.getString("coc");
        let tag1 = args.getString("tag");
        tag1 = tag1.toUpperCase();

        const tagRegex = /^(#[A-Z0-9]{8,9})$/;
        if (!tagRegex.test(tag1)) {
            return message.reply(
                "Le tag du joueur est invalide. Veuillez fournir un tag de joueur valide commençant par '#' et contenant 8 ou 9 caractères alphanumériques."
            );
        }

        const data = await client.getPlayer(tag1);

        if (data.name !== coc) return message.reply("Le tag ou le pseudo Clash of Clans n'est pas correct.");

        db.query(`SELECT * FROM server WHERE guildId = '${message.guildId}' AND userId = '${message.user.id}'`, (err, req) => {

            try {
                db.query(`UPDATE server SET discord = '${discord}', coc = '${coc}', tag = '${tag1}' WHERE userId = '${message.user.id}' AND guildId = '${message.guildId}'`, async (err) => {
                    message.reply("Les informations ont bien été ajoutées.");
                });
            } catch (err) {

                message.reply("Écrivez un message dans le chat pour être dans la base de données !");
                return console.log(err);
            }
        });
    }
};
