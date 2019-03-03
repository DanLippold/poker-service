class TurnRequest {
    constructor() {
        this.playerName = '';
        this.playerPosition = 0;
        this.playerChipCount = 0;
        this.playerCards = [];
        this.boardCards = [];
        this.players = [];
    }
}

module.exports = TurnRequest;
