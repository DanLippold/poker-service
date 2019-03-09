var seedrandom = require('seedrandom');
const Deck = require('./deck');
const { allPlayersFromDealer } = require('./iterables');
const { getActivePlayerCount, getNextActivePlayerFromIndex } = require('./players');

const CARDS_PER_PLAYER = 2;

class Dealer {
    constructor(seed) {
        this.seed = seed;
        this.randomNumberGenerator = seedrandom(this.seed);
        this.deckSeed = undefined;
    }

    clearActiveBets(table, startOfHand) {
        table.players.forEach(player => {
            if (startOfHand || player.activeBetValue !== -2) {
                player.activeBetValue = -1;
            }
        });
        table.activeBetValue = 0;
    }
    
    clearBoard(table) {
        table.board = [];
    }
    
    clearPot(table) {
        table.potValue = 0;
    }
    
    collectBlinds(table, players) {
        table.activePlayerIndex = table.smallBlindPosition;
        table.activePlayer = players[table.activePlayerIndex];
        this.handleRaise(5, table);
        table.activePlayerIndex = table.bigBlindPosition;
        table.activePlayer = players[table.activePlayerIndex];
        this.handleRaise(5, table);
    }
    
    dealCardToEachPlayer(players, deck, dealerPosition) {
        for (let player of allPlayersFromDealer(players, dealerPosition)) {
            player.cards.push(deck.drawCard());
        }
    }
    
    dealNewCardsToEachPlayer(table, players, dealerPosition) {
        // TODO: Used seed direcctly to write initial tests.
        // However this caused the same seed to be used for every round
        // in the game. To fix this, we use seed to generate new seeds each
        // time we create a new deck before a deal. For the first hand, use
        // seed directly, so I don't need to re-write my tests.
        table.deck = new Deck(this.deckSeed || this.seed);
        this.deckSeed = this.randomNumberGenerator();

        table.deck.shuffle();
        players.forEach(player => { player.cards = []; });
        for (let i = 0; i < CARDS_PER_PLAYER; i++) {
            this.dealCardToEachPlayer(players, table.deck, dealerPosition);
        }
    }
    
    dealStreet(board, deck) {
        deck.drawCard(); // Burn
        if (!board.length) { // Flop
            board.push(deck.drawCard());
            board.push(deck.drawCard());
        }
        board.push(deck.drawCard()); // Turn & River
    }
    
    distributeChips(players, chips) {
        players.forEach(player => {
            player.chipValue = chips;
        });
    }
    
    handleRaise(raiseAmount, table) {
        if (table.activePlayer.activeBetValue === -1) {
            table.activePlayer.activeBetValue = 0; // Player has taken action
        }
        table.activeBetValue += raiseAmount;
        const valueOwed = table.activeBetValue - table.activePlayer.activeBetValue;
        table.activePlayer.chipValue -= valueOwed; // Pay what is owed
        table.activePlayer.activeBetValue = table.activeBetValue;
        table.potValue += valueOwed; // TODO: Should this be done here or after the pot is good? Risk of this being off? Probably.
        table.bettingPlayerIndex = raiseAmount ? table.activePlayerIndex : table.bettingPlayerIndex;
    }
    
    setBlindPositions(table) {
        if (getActivePlayerCount(table.players) === 2) {
            table.smallBlindPosition = table.dealerPosition;
            table.bigBlindPosition = table.dealerPosition === 0 ? 1 : 0
        } else {
            table.smallBlindPosition = table.dealerPosition + 1 === table.players.length ? 0 : table.dealerPosition + 1;
            table.bigBlindPosition = table.smallBlindPosition + 1 === table.players.length ? 0 : table.smallBlindPosition + 1;
        }
    }
    
    setFirstPlayerToAct(table, players, dealerPosition, bigBlindPosition, board) {
        const startingIndex = board.length ? dealerPosition : bigBlindPosition;
        const nextPlayer = getNextActivePlayerFromIndex(players, startingIndex);
        table.activePlayer = nextPlayer;
        table.activePlayerIndex = players.indexOf(nextPlayer);
        table.bettingPlayerIndex = board.length ? -1 : bigBlindPosition; // Big blind starts the bet
    }
    
    setRandomDealer(table, players) {
        table.dealerPosition = Math.floor(this.randomNumberGenerator() * Math.floor(players.length));
    }
}

module.exports = Dealer;
