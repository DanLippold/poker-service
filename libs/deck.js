const shuffle = require('knuth-shuffle-seeded');
const Card = require('./card');

class Deck {
    constructor(seed) {
        this.cards = Array(52).fill().map((_, rawValue) => {
            return new Card(rawValue);
        });
        this.seed = seed;
    }

    drawCard() {
        return this.cards.shift();
    }

    shuffle() {
        shuffle(this.cards, this.seed);
    }
}

module.exports = Deck;
