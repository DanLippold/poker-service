const Dealer = require("./dealer");
const { getWinningPlayers } = require("./handEvaluator");
const { getNextActivePlayerFromIndex } = require("./players");
const handEvaluator = require("./handEvaluator");

class Table {
  constructor(players, startingChips, seed) {
    this.players = players;
    this.handNumber = 0;
    this.dealer = new Dealer(seed);
    this.dealer.distributeChips(this.players, startingChips);
    this.dealer.setRandomDealer(this, this.players);
    this._startNextHand(this.dealerPosition, this.players);
  }

  _startNextHand(dealerPosition, players) {
    this.dealer.clearBoard(this);
    this.dealer.clearPot(this);
    this.dealer.clearActiveBets(this, true);
    this.dealer.setBlindPositions(this);
    this.dealer.collectBlinds(this, players);
    this.dealer.dealNewCardsToEachPlayer(this, players, dealerPosition);
    this.dealer.setFirstPlayerToAct(
      this,
      players,
      dealerPosition,
      this.bigBlindPosition,
      this.board
    ); // TODO: This feels dumb
    this.handNumber++;
  }

  // All players have matched each other's bets, folded, or are out of chips
  _potIsGood() {
    return this.players
      .map((player) => {
        return (
          player.activeBetValue === -2 ||
          player.chipValue === 0 ||
          player.activeBetValue === this.activeBetValue
        );
      })
      .every(Boolean);

    // return true;
    // const everyoneChecked = this.bettingPlayerIndex === -1;
    // const dealerJustActed = previousActivePlayerIndex === this.dealerPosition;
    // const everyoneCalledOrFolded = this.activePlayerIndex === this.bettingPlayerIndex;

    // return (everyoneChecked && dealerJustActed) || everyoneCalledOrFolded;
  }

  _endTurn() {
    const previousActivePlayerIndex = this.activePlayerIndex;
    this.activePlayer = getNextActivePlayerFromIndex(
      this.players,
      this.activePlayerIndex
    );
    this.activePlayerIndex = this.players.indexOf(this.activePlayer);

    if (this._potIsGood(previousActivePlayerIndex)) {
      if (this.board.length === 5) {
        // End of Hand
        const winningPlayers = getWinningPlayers(this.players, this.board);
        winningPlayers[0].chipValue += this.potValue; // TODO: Handle split pot
        const newDealerPlayer = getNextActivePlayerFromIndex(
          this.players,
          this.dealerPosition
        );
        this.dealerPosition = this.players.indexOf(newDealerPlayer);
        this._startNextHand(this.dealerPosition, this.players);
      } else {
        this.dealer.clearActiveBets(this, false);
        this.dealer.dealStreet(this.board, this.deck);
        this.dealer.setFirstPlayerToAct(
          this,
          this.players,
          this.dealerPosition,
          this.bigBlindPosition,
          this.board
        );
      }
    }

    this.players.forEach((player) => {
      player.pokerHand = handEvaluator.getHandDescription(
        player.cards,
        this.board
      );
    });
  }

  raise(amount) {
    // TODO: Validate raise
    this.dealer.handleRaise(amount, this);
    this._endTurn();
  }

  bet(amount) {
    // TODO: Validate bet
    this.raise(amount); // A bet is really just a raise on a $0 active bet
  }

  call() {
    // TODO: Validate call
    this.raise(0); // A call is really just a raise of $0
  }

  check() {
    // TODO: Validate check
    this.raise(0); // A check is really just a raise of $0 on a $0 active bet
  }

  fold() {
    this.activePlayer.activeBetValue = -2;
    this.activePlayer.cards = [];
    this._endTurn();
  }

  validTurn() {
    return true;
  }
}

module.exports = Table;
