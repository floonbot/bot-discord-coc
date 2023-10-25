const colorette = require('colorette');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');

module.exports = () => {
  process.on('uncaughtException', (error, origin) => {
    console.log(colorette.red('----- Uncaught exception -----'));
    console.log(pe.render(error));
    console.log(colorette.red('----- Exception origin -----'));
    console.log(pe.render(origin));
    logErrorToFile(error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.log(colorette.red('----- Unhandled Rejection at -----'));
    console.log(pe.render(promise));
    console.log(colorette.red('----- Reason -----'));
    console.log(pe.render(reason));
    logErrorToFile(reason);
  });

  process.on('warning', (warning) => {
    console.log(colorette.yellow('----- Warning -----'));
    console.log(pe.render({
      name: warning.name,
      message: warning.message,
      stack: warning.stack
    }));
    logErrorToFile(warning);
  });
};

function logErrorToFile(error) {
  const date = new Date().toISOString();
  const errorMessage = inspect(error, { depth: null });
  const logMessage = `Date: ${date}\nError:\n${errorMessage}\n\n`;

  const filePath = path.join(__dirname, 'error_log.txt');
  fs.appendFile(filePath, logMessage, { flag: 'a+' }, (err) => {
    if (err) {
      console.error('Error while writing to error_log.txt:', err);
    }
  });
}
