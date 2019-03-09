const { activePlayersFromIndex } = require('./iterables');
const { getFirstItemFromIterable } = require('./iterableHelpers');
const { getActivePlayers, getActivePlayerCount } = require('./player');

function getNextActivePlayerFromIndex(players, index) {
    return getFirstItemFromIterable(activePlayersFromIndex(players, index));
}

module.exports = {
    getActivePlayers,
    getActivePlayerCount,
    getNextActivePlayerFromIndex
}
