const suitMap = {
    0: {
        value: 'Spade',
        shortValue: 'S',
        pluralValue: 'Spades',
        symbol: '♠'
    },
    1: {
        value: 'Heart',
        shortValue: 'H',
        pluralValue: 'Hearts',
        symbol: '♥'
    },
    2: {
        value: 'Diamond',
        shortValue: 'D',
        pluralValue: 'Diamonds',
        symbol: '♠'
    },
    3: {
        value: 'Club',
        shortValue: 'C',
        pluralValue: 'Clubs',
        symbol: '♣'
    }
}

class Suit {
    constructor(rawValue) {
        this.rawValue = rawValue;
        this.value = suitMap[rawValue].value;
        this.shortValue = suitMap[rawValue].shortValue;
        this.pluralValue = suitMap[rawValue].pluralValue;
        this.symbol = suitMap[rawValue].symbol;
    }
}

module.exports = Suit;
