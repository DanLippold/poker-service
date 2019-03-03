function getActivePlayers(players) {
    return players.filter(player => player.chips > 0);
}

function getNextPlayerIndex(players, currentIndex) {
    return currentIndex === players.length - 1 ? 0 : currentIndex + 1;
}

function getNextActivePlayerIndex(players, currentIndex) {
    let index = getNextPlayerIndex(players, currentIndex);

    while (index !== currentIndex) {
        if (players[index].chipCount > 0) {
            return index;
        }
        index = getNextPlayerIndex(players, currentIndex)
    }

    return -1;
}

function playersFromDealer(players, dealerIndex, nextPlayerIndexGetter) {
    return {
        *[Symbol.iterator]() {
            let i = nextPlayerIndexGetter(players, dealerIndex);
            while (i !== dealerIndex) {
                yield players[i];
                i = nextPlayerIndexGetter(players, i);
            }
            yield players[dealerIndex];
        }
    }
}

function playersFromFirstToAct(players, dealerIndex, nextPlayerIndexGetter, activePlayersGetter) {
    return {
        *[Symbol.iterator]() {
            let startingIndex = dealerIndex;
            if (activePlayersGetter(players).length > 2) {
                startingIndex = nextPlayerIndexGetter(players, startingIndex); // small blind
                startingIndex = nextPlayerIndexGetter(players, startingIndex); // big blind
                startingIndex = nextPlayerIndexGetter(players, startingIndex); // first to act
            }
            yield players[startingIndex];
            let i = nextPlayerIndexGetter(players, startingIndex);
            while (i !== startingIndex) {
                yield players[i];
                i = nextPlayerIndexGetter(players, i);
            }
        }
    }
}

function allPlayersFromDealer(players, dealerIndex) {
    return playersFromDealer(players, dealerIndex, getNextPlayerIndex);
}

function activePlayersFromDealer(players, dealerIndex) {
    return playersFromDealer(players, dealerIndex, getNextActivePlayerIndex);
}

function activePlayersFromFirstToAct(players, dealerIndex) {
    return playersFromFirstToAct(players, dealerIndex, getNextActivePlayerIndex, getActivePlayers);
}

function allPlayersFromFirstToAct(players, dealerIndex) {
    return playersFromFirstToAct(players, dealerIndex, getNextPlayerIndex, () => players);
}

module.exports = {
    activePlayersFromDealer,
    activePlayersFromFirstToAct,
    allPlayersFromDealer,
    allPlayersFromFirstToAct
}
