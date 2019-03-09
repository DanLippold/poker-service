function isActive(player) {
    return player.chipValue > 0 && player.activeBetValue !== -2;
}

function getActivePlayers(players) {
    return players.filter(isActive);
}

function getActivePlayerCount(players) {
    return getActivePlayers(players).length;
}

module.exports = {
    isActive,
    getActivePlayers,
    getActivePlayerCount
}