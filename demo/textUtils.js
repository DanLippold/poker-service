const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const log = console.log;

function text(value) {
    log(chalk.yellow(value));
}

function banner(value) {
    text(figlet.textSync(value));
}

module.exports = {
    banner,
    text,
    clear
};