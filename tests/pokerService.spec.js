const PokerService = require('../libs/pokerService');

describe('init', () => {
    describe('players', () => {
        test('returns initialized player count', () => {
            const pokerService = new PokerService(
                {
                    players: [
                        { name: 'Player 1' },
                        { name: 'Player 2' }
                    ]
                });

            expect(pokerService.playerCount).toBe(2);
        });
    });

    describe('startingChips', () => {
        test('returns initialized starting chip stacks', () => {
            const pokerService = new PokerService();

            expect(pokerService.startingChips).toHaveLength(4);
            pokerService.startingChips.forEach(type => {
                expect(typeof type.denomination).toBe('number');
                expect(typeof type.count).toBe('number');
            });
        });
    });
});
