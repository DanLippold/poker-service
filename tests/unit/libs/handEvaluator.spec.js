const handEvaluator = require('../../../libs/handEvaluator');

describe('getWinningPlayerss()', () => {
    describe('empty players', () => {
        test('returns null', () => {
            const board = [
                { shortSuitValue: '3C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AH' },
                { shortSuitValue: 'TH' }, { shortSuitValue: '4S' }
            ];
            const winningPlayers = handEvaluator.getWinningPlayers([], board);
            expect(winningPlayers).toEqual([]);
        });
    });

    describe('empty board', () => {
        test('returns null', () => {
            const players = [{
                name: 'Jane',
                cards: [{ shortSuitValue: 'KS' }, { shortSuitValue: 'JS' }]
            }];
            const winningPlayers = handEvaluator.getWinningPlayers(players, []);
            expect(winningPlayers).toEqual([]);
        });
    });

    describe('single player', () => {
        let players;

        beforeEach(() => {
            players = [{
                name: 'Jane',
                cards: [{ shortSuitValue: 'KS' }, { shortSuitValue: 'JS' }]
            }];
        });
    
        describe('3 card board', () => {
            test('returns player', () => {
                const board = [
                    { shortSuitValue: '3C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AH' }
                ];
    
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[0]);
            });
        });
    
        describe('5 card board', () => {
            test('returns player', () => {
                const board = [
                    { shortSuitValue: '3C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AH' },
                    { shortSuitValue: 'TH' }, { shortSuitValue: '4S' }
                ];
    
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[0]);
            });
        });
    });

    describe('multiple players', () => {
        let players;

        beforeEach(() => {
            players = [
                {
                    name: 'Jane',
                    cards: [{ shortSuitValue: 'KS' }, { shortSuitValue: 'TS' }]
                },
                {
                    name: 'Bob',
                    cards: [{ shortSuitValue: '3S' }, { shortSuitValue: '9C' }]
                }
            ];
        });
    
        describe('3 card board', () => {
            test('returns winning player', () => {
                const board = [
                    { shortSuitValue: '3C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AH' }
                ];
    
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[1]); // Bob wins with pair of 3s
            });
        });
    
        describe('5 card board', () => {
            test('returns winning player', () => {
                const board = [
                    { shortSuitValue: '3C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AH' },
                    { shortSuitValue: 'TH' }, { shortSuitValue: '4S' }
                ];
    
                const winningPlayers = handEvaluator.getWinningPlayers(players, board);
                expect(winningPlayers[0]).toEqual(players[0]); // Jane wins with pair of 10s
            });
        });
    });

    describe('flush', () => {
        let players;

        beforeEach(() => {
            players = [
                {
                    name: 'Jane',
                    cards: [{ shortSuitValue: 'KS' }, { shortSuitValue: 'TS' }]
                },
                {
                    name: 'Bob',
                    cards: [{ shortSuitValue: '3C' }, { shortSuitValue: '9C' }]
                }
            ];
        });
    
        describe('flush over 2 pair', () => {
            test('returns winning player', () => {
                const board = [
                    { shortSuitValue: 'KC' }, { shortSuitValue: 'TC' }, { shortSuitValue: 'AH' },
                    { shortSuitValue: '2H' }, { shortSuitValue: '8C' }
                ];
    
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
        const playerCards = [{ shortSuitValue: '3S' }, { shortSuitValue: '8H' }];
        const board = [
            { shortSuitValue: '2C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AC' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Pair');
    });

    test('identifies two pair', () => {
        const playerCards = [{ shortSuitValue: '2S' }, { shortSuitValue: '8H' }];
        const board = [
            { shortSuitValue: '2C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AC' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Two Pair');
    });

    test('identifies three of a kind', () => {
        const playerCards = [{ shortSuitValue: '8C' }, { shortSuitValue: '8H' }];
        const board = [
            { shortSuitValue: '2C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AC' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Three of a Kind');
    });

    test('identifies straight', () => {
        const playerCards = [{ shortSuitValue: '3H' }, { shortSuitValue: '4H' }];
        const board = [
            { shortSuitValue: '2C' }, { shortSuitValue: '5D' }, { shortSuitValue: 'AC' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Straight');
    });

    test('identifies flush', () => {
        const playerCards = [{ shortSuitValue: '3C' }, { shortSuitValue: '8C' }];
        const board = [
            { shortSuitValue: '2C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AC' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Flush');
    });

    test('identifies full house', () => {
        const playerCards = [{ shortSuitValue: '8C' }, { shortSuitValue: '8H' }];
        const board = [
            { shortSuitValue: '4C' }, { shortSuitValue: '8D' }, { shortSuitValue: 'AC' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Full House');
    });

    test('identifies straight flush', () => {
        const playerCards = [{ shortSuitValue: '3H' }, { shortSuitValue: '4H' }];
        const board = [
            { shortSuitValue: '2H' }, { shortSuitValue: '5H' }, { shortSuitValue: 'AH' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Straight Flush');
    });

    test('identifies royal flush', () => {
        const playerCards = [{ shortSuitValue: 'TH' }, { shortSuitValue: 'JH' }];
        const board = [
            { shortSuitValue: 'QH' }, { shortSuitValue: 'KH' }, { shortSuitValue: 'AH' },
            { shortSuitValue: 'TC' }, { shortSuitValue: '4S' }
        ];
        const description = handEvaluator.getHandDescription(playerCards, board);
        expect(description).toBe('Royal Flush');
    });
});
