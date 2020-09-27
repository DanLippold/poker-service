const Table = require("./table");
const TurnRequest = require("./turnRequest");
const Logger = require("./logger");

const DEFAULT_CHIPS_PER_PLAYER = 10000;

class PokerService {
  constructor(options) {
    if (!options.players || options.players.length < 2) {
      // TODO: players should probably be a mandatory first param
      throw new Error("2 or more players need to be defined in options");
    }

    options = Object.assign(
      {
        chips: DEFAULT_CHIPS_PER_PLAYER,
      },
      options
    );

    this.playerCount = options.players.length;
    this.players = options.players;
    this.logging = options.logging;

    if (this.logging) {
      this.logger = new Logger();
      this.logger.setOptions(options);
    }

    this.table = new Table(this.players, options.chips, options.seed);
    this.tableActions = {
      FOLD: "fold",
      CALL: "call",
      BET: "bet",
      RAISE: "raise",
      CHECK: "check",
    };
    this.setTurnRequest();
  }

  setTurnRequest() {
    this.activeTurnRequest = new TurnRequest();

    this.activeTurnRequest.playerName = this.table.activePlayer.name;
    this.activeTurnRequest.playerCards = this.table.activePlayer.cards;
    this.activeTurnRequest.playerChipValue = this.table.activePlayer.chipValue;
    this.activeTurnRequest.players = this.players;
    this.activeTurnRequest.boardCards = this.table.board;
    this.activeTurnRequest.playerPosition = this.table.activePlayerIndex;
    this.activeTurnRequest.activeBetValue = this.table.activeBetValue;
    this.activeTurnRequest.potValue = this.table.potValue;
    this.activeTurnRequest.handNumber = this.table.handNumber;
  }

  act(turn) {
    if (!this.table.validTurn(turn.type, turn.amount)) {
      return this.activeTurnRequest; // Probably should return an error
    }
    this.table[this.tableActions[turn.type]](turn.amount);
    if (this.logging) {
      this.logger.logTurnRequest(this.activeTurnRequest);
      this.logger.logAction(turn);
    }
    this.setTurnRequest();

    return this.activeTurnRequest;
  }
}

module.exports = PokerService;
