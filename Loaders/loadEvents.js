const fs = require("fs").promises;
const { blue, green, yellow, bgGreenBright } = require("colorette");

module.exports = async (bot) => {
  try {
    const files = await fs.readdir("./Events");
    const eventFiles = files.filter(file => file.endsWith(".js"));

    console.log();
    console.log(yellow("[E] Events/"));

    const bindEvents = eventFiles.map(async file => {
      const event = require(`../Events/${file}`);
      bot.on(file.split(".js").join(""), event.bind(null, bot));
      console.log(blue(`${" ".repeat(2)}[F] ${file}`));
    });

    await Promise.all(bindEvents);
    console.log();
    console.log(bgGreenBright("Tous les événements ont été chargés!"));
    console.log();
  } catch (error) {
    console.error("Une erreur s'est produite lors du chargement des événements:", error);
  }
};
