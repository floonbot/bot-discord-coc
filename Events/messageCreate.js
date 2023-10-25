const Discord = require("discord.js");
const { request } = require('undici');
const Canvas = require('@napi-rs/canvas');

module.exports = async (bot, message) => {
  const db = bot.db;

  if (message.author.bot || message.channel.type === Discord.ChannelType.DM) {
    return;
  }

  db.query(`SELECT * FROM dataXp 
  WHERE guildId = '${message.guildId}' AND userId = '${message.author.id}'`, async (err, req) => {

    if (req.length < 1) {

      db.query(`INSERT INTO dataXp (guildId, userId,  xp, level)
      VALUES ('${message.guildId}' ,'${message.author.id}', '0', '0')`)

    } else {

      let level = parseInt(req[0].level)
      let xp = parseInt(req[0].xp)

      if ((level + 1) * 1000 <= xp) {

        const newXP = xp - ((level + 1) * 1000);
        const newLevel = level + 1;

        db.query(`UPDATE dataXp
        SET xp = '${newXP}', level = '${newLevel}'
        WHERE guildId = '${message.guildId}' AND userId = '${message.author.id}'`);

        level = newLevel;

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const image = await Canvas.loadImage('./coc.jpg');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#F1C40F';
        ctx.font = '60px Arial';
        const username = message.author.username.toUpperCase();
        const usernameWidth = ctx.measureText(username).width;
        const usernameX = (canvas.width - usernameWidth) / 3.3;
        ctx.fillText(username, usernameX, canvas.height / 2.8);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(username, usernameX, canvas.height / 2.8);

        const text = `Viens de passer level ${level}`;
        const textWidth = ctx.measureText(text).width;
        const textX = (canvas.width - textWidth) / 3.0;
        ctx.fillText(text, textX, canvas.height / 1.3);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(text, textX, canvas.height / 1.3);

        const { body } = await request(message.author.displayAvatarURL({ extension: 'jpg' }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());
        ctx.drawImage(avatar, 25, 25, 100, 100);

        const buffer = canvas.toBuffer('image/png');
        const attachment = new Discord.AttachmentBuilder(buffer, { name: 'profile-image.png' });

        message.channel.send({ files: [attachment] })
      } else {

        let xptogive = Math.floor(Math.random() * 500) + 1;
        db.query(`UPDATE dataXp
        SET xp = '${xp + xptogive}' WHERE guildId = '${message.guildId}' AND userId = '${message.author.id}'`)
      }
    }
  })

  db.query(`SELECT * FROM server WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`, async (err, req) => {

    if (req.length < 1) {

      db.query(`INSERT INTO server (guildId, userId , discord, coc, tag) VALUES (${message.guild.id}, '${message.author.id}' ,'false','false','false')`)
    }
  })

}

