const improvedHandDescriptions = {
    ONE_PAIR: 'Pair',
    TWO_PAIRS: 'Two Pair',
    THREE_OF_A_KIND: 'Three of a Kind',
    STRAIGHT: 'Straight',
    FLUSH: 'Flush',
    FULL_HOUSE: 'Full House',
    STRAIGHT_FLUSH: 'Straight Flush',
    ROYAL_FLUSH: 'Royal Flush'
};

function getImprovedHandDescription(pokerHand) {
    if (!pokerHand || !pokerHand.getRank) {
        return '';
    }
    return improvedHandDescriptions[pokerHand.getRank()];
}

module.exports = getImprovedHandDescription;
