const Combinatorics = require('js-combinatorics');
const PokerHand = require('poker-hand-evaluator');

const Deck = require('./deck');
const Dealer = require('./dealer');
const { allPlayersFromFirstToAct } = require('./iterables');

class Table {
    constructor(players, startingChips) {
        this.players = players;
        this.players.forEach(player => { player.chipCount = startingChips; });
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

        Dealer.dealNewCardsToEachPlayer(players, this.deck, dealerPosition);

        this.setFirstPlayerToAct(players, dealerPosition);
    }

    static getNextPlayerIndex(players, currentIndex) {
        return currentIndex === players.length - 1 ? 0 : currentIndex + 1;
    }

    static getNextActivePlayerIndex(players, currentIndex) {
        let index = Table.getNextPlayerIndex(players, currentIndex);
    
        while (index !== currentIndex) {
            if (players[index].chipCount > 0) {
                return index;
            }
            index = Table.getNextPlayerIndex(players, currentIndex)
        }
    
        return -1;
    }

    setFirstPlayerToAct(players, dealerPosition) {
        this.activePlayer = allPlayersFromFirstToAct(players, dealerPosition)[Symbol.iterator]().next().value;
        this.activePlayerIndex = players.indexOf(this.activePlayer);
        this.bettingPlayerIndex = this.bigBlindPosition;
    }

    endTurn() {
        this.activePlayerIndex = Table.getNextActivePlayerIndex(this.players, this.activePlayerIndex);
        this.activePlayer = this.players[this.activePlayerIndex];

        if (this.activePlayerIndex === this.bettingPlayerIndex) { // Pot is good
            if (this.board.length === 5) { // End of Hand
                const handRanks = this.players.map(player => {
                    const playerCards = player.cards.map(card => card.shortSuitValue);
                    const boardCards = this.board.map(card => card.shortSuitValue);
                    const possibleHands = Combinatorics.combination([...playerCards, ...boardCards], 5).toArray();
                    const handString = possibleHands[0].join(' ');
                    if (handString.length != 14) {
                        console.log(handString);
                    }
                    const possibleHandScores = possibleHands.map(possibleHand => new PokerHand(possibleHand.join(' ')).getScore());
                    const bestHandScore = Math.min(...possibleHandScores);
                    return bestHandScore;
                });
                const winningPlayerIndex = handRanks.indexOf(Math.min(...handRanks)); // TODO: Handle split pot
                const winningPlayer = this.players[winningPlayerIndex];
                winningPlayer.chipCount += this.potValue;
                this.dealerPosition = Table.getNextPlayerIndex(this.players, this.dealerPosition);
                this.startNextHand(this.dealerPosition, this.players);
            } else {
                Dealer.dealStreet(this.board, this.deck);
                this.setFirstPlayerToAct(this.players, this.dealerPosition);
            }
        }
    }
    
    validTurn(type, amount) {
        return true;
    }

    call() {
        // TODO: Validate call
        const valueOwed = this.activeBetValue - this.activeBets[this.activePlayerIndex];
        this.activePlayer.chipCount -= valueOwed; // Pay what is owed
        this.activeBets[this.activePlayerIndex] = this.activeBetValue;
        this.potValue += valueOwed; // TODO: Should this be done here or after the pot is good? Risk of this being off? Probably.
        this.endTurn();
    }

    bet(amount) {
        // TODO: Validate bet
        this.activeBetValue = amount;
        this.activeBets[this.activePlayerIndex] += amount;
        this.potValue += amount; // TODO: Should this be done here or after the pot is good? Risk of this being off? Probably.
        this.activePlayer.chipCount -= amount;
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
