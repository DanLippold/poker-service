const handEvaluator = require('../../../libs/handEvaluator');

function cards(...args) {
    return args.map((value) => ({ shortSuitValue: value }));
}

describe('getWinningPlayerss()', () => {
    describe('empty players', () => {
        test('returns null', () => {
            const board = cards('3C', '8D', 'AH', 'TH', '4S');
            const winningPlayers = handEvaluator.getWinningPlayers([], board);
            expect(winningPlayers).toEqual([]);
        });
    });

    describe('empty board', () => {
        test('returns null', () => {
            const players = [{ name: 'Jane', cards: cards('KS', 'JS') }];
            const winningPlayers = handEvaluator.getWinningPlayers(players, []);
            expect(winningPlayers).toEqual([]);
        });
    });

    describe('single player', () => {
        let players;

        beforeEach(() => {
            players = [{ name: 'Jane', cards: cards('KS', 'JS') }];
        });
    
        describe('3 card board', () => {
            test('returns player', () => {
                const board = cards('3C', '8D', 'AH');
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[0]);
            });
        });
    
        describe('5 card board', () => {
            test('returns player', () => {
                const board = cards('3C', '8D', 'AH', 'TH', '4S');
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[0]);
            });
        });
    });

    describe('multiple players', () => {
        let players;

        beforeEach(() => {
            players = [
                { name: 'Jane', cards: cards('KS', 'TS') },
                { name: 'Bob', cards: cards('3S', '9C') }
            ];
        });
    
        describe('3 card board', () => {
            test('returns winning player', () => {
                const board = cards('3C', '8D', 'AH');
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[1]); // Bob wins with pair of 3s
            });
        });
    
        describe('5 card board', () => {
            test('returns winning player', () => {
                const board = cards('3C', '8D', 'AH', 'TH', '4S');
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[0]); // Jane wins with pair of 10s
            });
        });
    });

    describe('flush', () => {
        describe('flush over 2 pair', () => {
            test('returns winning player', () => {
                const players = [
                    { name: 'Jane', cards: cards('AS', 'TS') },
                    { name: 'Bob', cards: cards('3C', '9C') }
                ];
                const board = cards('KC', 'TC', 'AH', '2H', '8C');
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[1]); // Bob wins with flush
            });
        });

        describe('flush over straight', () => {
            test('returns winning player', () => {
                const players = [
                    { name: 'Jane', cards: cards('JS', 'QS') },
                    { name: 'Bob', cards: cards('3C', '9C') }
                ];
                const board = cards('KC', 'TC', 'AH', '2H', '8C');
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[1]); // Bob wins with flush
            });
        });
    });
});

// I reallize this is a bit of an integration test.
// Wanted a little more confidence around the poker-hand-evaluator
// library
describe('getHandDescription()', () => {
    test('identifies pair', () => {
        const playerCards = cards('3S', '8H');
        const board = cards('2C', '8D', 'AC', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Pair');
    });

    test('identifies two pair', () => {
        const playerCards = cards('2S', '8H');
        const board = cards('2C', '8D', 'AC', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Two Pair');
    });

    test('identifies three of a kind', () => {
        const playerCards = cards('8C', '8H');
        const board = cards('2C', '8D', 'AC', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Three of a Kind');
    });

    test('identifies straight', () => {
        const playerCards = cards('3H', '4H');
        const board = cards('2C', '5D', 'AC', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Straight');
    });

    test('identifies flush', () => {
        const playerCards = cards('3C', '8C');
        const board = cards('2C', '8D', 'AC', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Flush');
    });

    test('identifies full house', () => {
        const playerCards = cards('8C', '8H');
        const board = cards('4C', '8D', 'AC', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Full House');
    });

    test('identifies straight flush', () => {
        const playerCards = cards('3H', '4H');
        const board = cards('2H', '5H', 'AH', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Straight Flush');
    });

    test('identifies royal flush', () => {
        const playerCards = cards('TH', 'JH');
        const board = cards('QH', 'KH', 'AH', 'TC', '4S');
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Royal Flush');
    });
});
