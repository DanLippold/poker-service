
const Table = require('./table');
const TurnRequest = require('./turnRequest');

const DEFAULT_CHIPS_PER_PLAYER = 10000;

class PokerService {
    constructor(options) {
        options = Object.assign({
            players: [],
            chips: DEFAULT_CHIPS_PER_PLAYER
        }, options);

        this.playerCount = options.players.length;
        this.players = options.players;

        this.table = new Table(this.players, options.chips);

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
    }

    act(turn) {
        if (!this.table.validTurn(turn.type, turn.amount)) {
            return this.activeTurnRequest; // Probably should return an error
        }

        if (turn.type === 'FOLD') {
            this.table.fold();
        } else if (turn.type === 'CALL') {
            this.table.call();
        } else if (turn.type === 'BET') { // BET
            this.table.bet(turn.amount);
        } else if (turn.type === 'RAISE') { // BET
            this.table.raise(turn.amount);
        } else { // CHECK
            this.table.bet(0);
        }

        this.setTurnRequest();

        return this.activeTurnRequest;
    }
}

module.exports = PokerService;
