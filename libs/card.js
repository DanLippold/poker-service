const Suit = require('./suit');

const valueMap = {
    0: {
        shortValue: 'A',
        longValue: 'Ace'
    },
    9: {
        shortValue: 'T',
        longValue: '10'
    },
    10: {
        shortValue: 'J',
        longValue: 'Jack'
    },
    11: {
        shortValue: 'Q',
        longValue: 'Queen'
    },
    12: {
        shortValue: 'K',
        longValue: 'King'
    }
};

const cardSymbols = ['🂡','🂢','🂣','🂤','🂥','🂦','🂧','🂨','🂩','🂪','🂫','🂭','🂮',
                     '🂱','🂲','🂳','🂴','🂵','🂶','🂷','🂸','🂹','🂺','🂻','🂽','🂾',
                     '🃁','🃂','🃃','🃄','🃅','🃆','🃇','🃈','🃉','🃊','🃋','🃍','🃎',
                     '🃑','🃒','🃓','🃔','🃕','🃖','🃗','🃘','🃙','🃚','🃛','🃝','🃞'];

function getStringValue(value) {
    return valueMap[value] || { shortValue: (value + 1).toString(), longValue: (value + 1).toString() }
}

class Card {
    constructor(rawValue) {
        this.rawValue = rawValue;
        this.suit = new Suit(Math.floor(rawValue / 13)); // Spades
        this.value = rawValue % 13; // 12
        const { shortValue, longValue } = getStringValue(this.value);
        this.shortStringValue = shortValue; // K
        this.longStringValue = longValue; // 'King'
        this.shortSuitValue = this.shortStringValue + this.suit.shortValue; // 'KS'
        this.shortSuitSymbolValue = this.shortStringValue + this.suit.symbol; // 'K♠'
        this.symbol = cardSymbols[rawValue]; // 🂮
    }
}

module.exports = Card;
