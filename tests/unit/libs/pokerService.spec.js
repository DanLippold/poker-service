const PokerService = require('../../../libs/pokerService');
const Table = require('../../../libs/table');

jest.mock('../../../libs/table');

describe('init', () => {
    beforeAll(() => {
        Table.mockImplementation(() => {
            return {
                activePlayer: { 
                    name: 'Player 1',
                    cards: [],
                    chipValue: 100
                },
                board: [],
                activePlayerIndex: 1,
                activeBetValue: 10,
                potValue: 10,
                validTurn: jest.fn()
            };
        })
    });

    describe('players', () => {
        test('throws an error when no players are supplied', () => {
            expect(() => new PokerService({})).toThrow(Error);
        });
    });

    describe('chips', () => {
        test('sets default chips', () => {
            const players = { players: [{ name: 'John', }, { name: 'Dave' }] };
            new PokerService({ players });

            expect(Table).toHaveBeenCalledTimes(1);
            expect(Table).toHaveBeenCalledWith(players, 10000, undefined);
        });
    });
});
