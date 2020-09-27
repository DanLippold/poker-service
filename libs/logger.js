const fs = require('fs');

class Logger {
    constructor() {
        this._initializeGameLog()
        fs.mkdirSync(`/logs/${new Date().toISOString}`, { recursive: true });
    }

    _initializeGameLog() {
        this.gameLog = {
            options: {},
            turns: []
        };
    }

    _logGameLogToFile() {
        const handNumber = this.gameLog.turns.length++;
        fs.writeFileSync(`hand${this.handNumber}.json`, JSON.stringify(this.gameLog, null, 4));
    }

    setOptions(options) {
        this.gameLog.options.chips = options.chips;
        this.gameLog.options.seed = options.seed;
        this.gameLog.options.players = [];
        options.players.forEach((player) => {
            // TODO: Use lodash deep clone
            this.gameLog.options.players.push(Object.assign({}, player));
        });
        this._logGameLogToFile();
    }

    logTurn(turnRequest, turnAction) {
        // TODO: How do we know if it's the start of the next hand?
        if (turnRequest.boardCards.length === 0) {
            this._initializeGameLog();
            this.handNumber++;
        }

        this.gameLog.turns.push({
            // TODO: Use lodash deep clone
            request: Object.assign({}, turnRequest),
            action: Object.assign({}, turnAction)
        });
        this._logGameLogToFile();
    }
}

module.exports = Logger;
