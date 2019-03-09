const { getActivePlayerCount, isActive } = require('./player');

function getNextPlayerIndex(players, currentIndex) {
    return currentIndex === players.length - 1 ? 0 : currentIndex + 1;
}

function getNextActivePlayerIndex(players, currentIndex) {
    for (let player of allPlayersFromIndex(players, currentIndex)) {
        if (isActive(player)) {
            return players.indexOf(player);
        }
    }

    return -1;
}

function playersFromIndex(players, index, nextPlayerIndexGetter) {
    return {
        *[Symbol.iterator]() {
            let i = nextPlayerIndexGetter(players, index);
            while (i !== index) {
                yield players[i];
                i = nextPlayerIndexGetter(players, i);
            }
            yield players[index];
        }
    }
}

function allPlayersFromIndex(players, index) {
    return playersFromIndex(players, index, getNextPlayerIndex);
}

function activePlayersFromIndex(players, index) {
    return playersFromIndex(players, index, getNextActivePlayerIndex);
}

module.exports = {
    activePlayersFromDealer: activePlayersFromIndex,
    activePlayersFromIndex,
    allPlayersFromDealer: allPlayersFromIndex
}
