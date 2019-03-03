const { allPlayersFromDealer } = require('./iterables');

const CARDS_PER_PLAYER = 2;

class Dealer {
    static dealCardToEachPlayer(players, deck, dealerPosition) {
        for (let player of allPlayersFromDealer(players, dealerPosition)) {
            player.cards.push(deck.drawCard());
        }
    }
    
    static dealNewCardsToEachPlayer(players, deck, dealerPosition) {
        players.forEach(player => { player.cards = []; });
        for (let i = 0; i < CARDS_PER_PLAYER; i++) {
            this.dealCardToEachPlayer(players, deck, dealerPosition);
        }
    }

    static dealStreet(board, deck) {
        deck.drawCard(); // Burn
        if (!board.length) { // Flop
            board.push(deck.drawCard());
            board.push(deck.drawCard());
        }
        board.push(deck.drawCard()); // Turn & River
    }
}

module.exports = Dealer;
