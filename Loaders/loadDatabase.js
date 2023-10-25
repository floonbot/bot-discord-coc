const mysql = require("mysql");
const { yellow, blue, bgGreenBright, bgRedBright } = require('colorette');

module.exports = async () => {
  let db;

  const dbConfig = JSON.parse(process.env.DB_CONFIG);

  async function connectToDatabase() {
    db = mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.MDP,
      database: dbConfig.DATABASE
    });

    return new Promise((resolve, reject) => {
      db.connect(err => {
        if (err) {
          console.error(bgRedBright("Erreur lors de la connexion à la base de données:", err.message));
          setTimeout(() => {
            console.log("Tentative de reconnexion à la base de données...");
            connectToDatabase().then(resolve).catch(reject);
          }, 5000);
        } else {
          resolve();
        }
      });
    });
  }

  async function getTablesWithColumns(indent = 0) {
    return new Promise((resolve, reject) => {
      db.query("SHOW TABLES", async (err, result) => {
        if (err) {
          reject(err);
        } else {
          for (const table of result) {
            const tableName = table[`Tables_in_${dbConfig.DATABASE}`];
            console.log();
            console.log(yellow(`${"".repeat(indent)}[T] ${tableName}/`));
            tablesLoaded.push(tableName);

            const columns = await getColumns(tableName, indent + 2);
            for (const column of columns) {
              console.log(blue(`${" ".repeat(indent + 2)}[C] ${column.Field}`));
            }
          }
          resolve(tablesLoaded);
        }
      });
    });
  }

  async function getColumns(tableName, indent = 0) {
    return new Promise((resolve, reject) => {
      db.query(`SHOW COLUMNS FROM ${tableName}`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const columns = result.map(col => col);
          resolve(columns);
        }
      });
    });
  }

  const tablesLoaded = [];

  try {
    await connectToDatabase();
    await getTablesWithColumns();
    console.log();
    console.log(bgGreenBright(`Tables chargées avec succès:`));
  } catch (error) {
    console.error(bgRedBright("Erreur lors de la connexion à la base de données:", error.message));
  }

  return db;
};
