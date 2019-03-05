class TurnRequest {
    constructor() {
        this.playerName = '';
        this.playerPosition = 0;
        this.playerChipValue = 0;
        this.playerCards = [];
        this.boardCards = [];
        this.players = [];
        this.activeBetValue = 0;
    }
}

module.exports = TurnRequest;
