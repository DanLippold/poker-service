const Combinatorics = require('js-combinatorics');
const PokerHand = require('poker-hand-evaluator');

const Deck = require('./deck');
const Dealer = require('./dealer');
const { activePlayersFromFirstToAct, activePlayersFromDealer } = require('./iterables');

class Table {
    constructor(players, startingChips) {
        this.players = players;
        this.players.forEach(player => {
            player.chipValue = startingChips;
            player.activeBetValue = -1;
        });
        this.activeBets = Array(this.players.length);
        this.activeBetValue = 0;
        this.potValue = 0;
        this.dealerPosition = Math.floor(Math.random() * Math.floor(this.players.length));
        this.startNextHand(this.dealerPosition, this.players);
    }

    startNextHand(dealerPosition, players) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.board = [];
        this.potValue = 0;

        if (players.length === 2) { // TODO: check to see how many active players are left
            this.smallBlindPosition = dealerPosition;
            this.bigBlindPosition = dealerPosition === 0 ? 1 : 0
        } else {
            this.smallBlindPosition = dealerPosition + 1 === players.length ? 0 : dealerPosition + 1;
            this.bigBlindPosition = this.smallBlindPosition + 1 === players.length ? 0 : this.smallBlindPosition + 1;
        }

        // Collect blinds
        this.activePlayerIndex = this.smallBlindPosition;
        this.activePlayer = players[this.activePlayerIndex];
        this.bet(5);
        this.activePlayerIndex = this.bigBlindPosition;
        this.activePlayer = players[this.activePlayerIndex];
        this.raise(5);

        Dealer.dealNewCardsToEachPlayer(players, this.deck, dealerPosition);

        this.setFirstPlayerToAct(players, dealerPosition, this.board);
    }

    static getNextPlayerIndex(players, currentIndex) {
        return currentIndex === players.length - 1 ? 0 : currentIndex + 1;
    }

    static getNextActivePlayerIndex(players, currentIndex) {
        let index = Table.getNextPlayerIndex(players, currentIndex);
    
        while (index !== currentIndex) {
            if (players[index].chipValue > 0) {
                return index;
            }
            index = Table.getNextPlayerIndex(players, currentIndex)
        }
    
        return -1;
    }

    setFirstPlayerToAct(players, dealerPosition, board) {
        const iterable = board.length ? activePlayersFromDealer : activePlayersFromFirstToAct;

        this.activePlayer = iterable(players, dealerPosition)[Symbol.iterator]().next().value;
        this.activePlayerIndex = players.indexOf(this.activePlayer);
        this.bettingPlayerIndex = board.length ? -1 : this.bigBlindPosition; // Big blind starts the bet
    }

    endTurn() {
        const previousActivePlayerIndex = this.activePlayerIndex;
        this.activePlayerIndex = Table.getNextActivePlayerIndex(this.players, this.activePlayerIndex);
        this.activePlayer = this.players[this.activePlayerIndex];

        if (this.activePlayerIndex === this.bettingPlayerIndex ||
            this.bettingPlayerIndex === -1 && previousActivePlayerIndex === this.dealerPosition) { // Pot is good
            if (this.board.length === 5) { // End of Hand
                const handRanks = this.players.map(player => {
                    const playerCards = player.cards.map(card => card.shortSuitValue);
                    const boardCards = this.board.map(card => card.shortSuitValue);
                    const possibleHands = Combinatorics.combination([...playerCards, ...boardCards], 5).toArray();
                    const possibleHandScores = possibleHands.map(possibleHand => new PokerHand(possibleHand.join(' ')).getScore());
                    return Math.min(...possibleHandScores);
                });
                const winningPlayerIndex = handRanks.indexOf(Math.min(...handRanks)); // TODO: Handle split pot
                const winningPlayer = this.players[winningPlayerIndex];
                winningPlayer.chipValue += this.potValue;
                this.players.forEach(player => { player.activeBetValue = -1; });
                this.activeBetValue = 0;
                this.dealerPosition = Table.getNextPlayerIndex(this.players, this.dealerPosition);
                this.startNextHand(this.dealerPosition, this.players);
            } else {
                this.players.forEach(player => { player.activeBetValue = -1; });
                this.activeBetValue = 0;
                Dealer.dealStreet(this.board, this.deck);
                this.setFirstPlayerToAct(this.players, this.dealerPosition, this.board);
            }
        }
    }
    
    validTurn(type, amount) {
        return true;
    }

    call() {
        // TODO: Validate call
        if (this.activePlayer.activeBetValue === -1) {
            this.activePlayer.activeBetValue = 0; // Player has taken action
        }
        const valueOwed = this.activeBetValue - this.activePlayer.activeBetValue;
        this.activePlayer.chipValue -= valueOwed; // Pay what is owed
        this.activeBets[this.activePlayerIndex] = this.activeBetValue;
        this.activePlayer.activeBetValue = this.activeBetValue;
        this.potValue += valueOwed; // TODO: Should this be done here or after the pot is good? Risk of this being off? Probably.
        this.endTurn();
    }

    bet(amount) {
        // TODO: Validate bet
        if (this.activePlayer.activeBetValue === -1) {
            this.activePlayer.activeBetValue = 0; // Player has taken action
        }
        this.activeBetValue += amount;
        this.activeBets[this.activePlayerIndex] += amount;
        this.potValue += this.activeBetValue; // TODO: Should this be done here or after the pot is good? Risk of this being off? Probably.
        this.activePlayer.chipValue -= this.activeBetValue;
        this.activePlayer.activeBetValue += this.activeBetValue;
        this.bettingPlayerIndex = amount ? this.activePlayerIndex : this.bettingPlayerIndex;
        this.endTurn();
    }

    raise(amount) {
        // TODO: Validate raise
        this.bet(amount);
    }

    fold() {
        this.potValue += this.activeBets[this.activePlayerIndex];
        this.activeBets[this.activePlayerIndex] = 0;
        this.activePlayer.cards = [];
        this.endTurn();
    }
}

module.exports = Table;
