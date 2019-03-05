const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const columnify = require('columnify')

const log = console.log;

function primary(value) {
    return chalk.yellow(value);
}

function secondary(value) {
    return chalk.cyanBright(value);
}

function text(value) {
    log(primary(value));
}

function newLine() {
    log();
}

function highlightedText(value) {
    log(secondary(value));
}

function banner(value) {
    text(figlet.textSync(value));
}

function table(data, columns, highlightValue) {
    const table = columnify(data, {
        showHeaders: false,
        minWidth: 3,
        columns,
        dataTransform: function(cellData) {
            return cellData === highlightValue ? secondary(cellData) : primary(cellData);
        }
    });
    log(table);
}

module.exports = {
    banner,
    text,
    newLine,
    highlightedText,
    clear,
    table
};