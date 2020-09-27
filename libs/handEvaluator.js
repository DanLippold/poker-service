const Combinatorics = require('js-combinatorics');
const PokerHand = require('poker-hand-evaluator');
const handDescriptor = require('./handDescriptor');

function getBestPokerHand(playerCards, board) {
    if (!playerCards || playerCards.length < 2 || !board || board.length < 3) {
        return null;
    }

    const playerCardValues = playerCards.map(card => card.shortSuitValue);
    const boardCardValues = board.map(card => card.shortSuitValue);
    const possibleHands = Combinatorics.combination([...playerCardValues, ...boardCardValues], 5).toArray();
    const possiblePokerHands = possibleHands.map(possibleHand => new PokerHand(possibleHand.join(' ')));

    return possiblePokerHands.reduce((bestPokerHand, currentHand) => {
        return (currentHand.getScore() < bestPokerHand.getScore()) ? currentHand : bestPokerHand;
    });
}

function getHandScore(playerCards, board) {
    const bestPokerHand = getBestPokerHand(playerCards, board);
    return bestPokerHand ? bestPokerHand.getScore() : null;
}

function getHandDescription(playerCards, board) {
    const pokerHand = getBestPokerHand(playerCards, board);
    return pokerHand ? handDescriptor(pokerHand) : '';
}

function getWinningPlayers(players, board) {
    if (!players || !players.length) {
        return [];
    }

    const playerHandRanks = players.map(player => ({ player, score: getHandScore(player.cards, board) }));

    // TODO: Players should not be eligible to win if they folded or did not participate in the hand 
    return playerHandRanks.reduce((winningPlayerHandRanks, playerHandRank) => {
        if (playerHandRank.score != null) {
            if (!winningPlayerHandRanks.length || playerHandRank.score < winningPlayerHandRanks[0].score) {
                return [playerHandRank];
            } else if (playerHandRank.score === winningPlayerHandRanks[0].score) {
                return [...winningPlayerHandRanks, playerHandRank];
            }
        }
        return winningPlayerHandRanks;
    }, []).map(playerHandRanks => playerHandRanks.player);
}

module.exports = {
    getWinningPlayers,
    getHandDescription
}
