const { readdir, lstat } = require("fs").promises;
const { join } = require("path");
const { blue, green, yellow, bgGreenBright, bgRedBright, red } = require("colorette");

module.exports = async (bot) => {
  const allCommands = [];
  let commandsLoaded = true;
  
  async function scanDir(path, indent = 0) {
    try {
      const files = await readdir(path);

      for (const thing of files) {
        const fullPath = join(path, thing);
        const stats = await lstat(fullPath);

        if (stats.isDirectory()) {
          if (indent === 0) {
            console.log(yellow(" ".repeat(indent) + `[D] ${thing}/`));
          } else {
            console.log(green(" ".repeat(indent) + `[D] ${thing}/`));
          }
          await scanDir(fullPath, indent + 2);
        } else {
          try {
            const command = require(fullPath);
            bot.commands.set(command.name, command);
            allCommands.push(command.name);
            console.log(blue(" ".repeat(indent) + `[F] ${thing}`));
          } catch (error) {
            console.log(red(" ".repeat(indent) + `[F] ${thing}`));
            commandsLoaded = false;
          }
        }
      }
    } catch (error) {
      console.error(red("Erreur lors de la lecture du répertoire:", error.message));
      commandsLoaded = false;
    }
  }

  await scanDir(join(process.cwd(), 'Commandes'));

  console.log();
  if (allCommands.length > 0) {
    if (commandsLoaded) {
      console.log(bgGreenBright("Toutes les commandes ont été chargées avec succès!"));
      console.log();
    } else {
      console.log(bgRedBright("Certaines commandes n'ont pas été chargées correctement!"));
    }
  } else {
    console.log(bgRedBright("Aucune commande n'a été chargée!"));
  }
};
