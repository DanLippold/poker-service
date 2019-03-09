const PokerService = require('../../libs/pokerService');

/*
    John (D):  J♥ 2♠ (straight)
    Dave (B):  T♥ 7♥ (pair of 10s)
    Board:     K♣ 7♠ A♠ T♣ Q♥

    ~Pre Flop~
    John calls
    Dave checks (omitting this due to known bug where B does not get a pre flop option with only 2 players TODO: FIX)

    ~Flop~
    Dave checks
    John checks

    ~Turn~
    Dave checks
    John checks

    ~River~
    Dave checks
    John checks
*/

describe('heads up', () => {
    let pokerService;

    beforeAll(() => {
        const players = [{ name: 'John', }, { name: 'Dave' }];
        const chips = 100;
        const seed = 'deuces';

        pokerService = new PokerService({ players, chips, seed });
    });

    test('plays a single hand of heads up where both players check it down', () => {
        // Pre Flop
        pokerService.act({ type: 'CALL' });

        // Flop
        pokerService.act({ type: 'CHECK' });
        pokerService.act({ type: 'CHECK' });

        // Turn
        pokerService.act({ type: 'CHECK' });
        pokerService.act({ type: 'CHECK' });

        // River
        pokerService.act({ type: 'CHECK' });
        const turnRequest = pokerService.act({ type: 'CHECK' });

        expect(turnRequest.players[0].chipValue).toBe(100);
        expect(turnRequest.players[1].chipValue).toBe(85);
        expect(turnRequest.boardCards).toHaveLength(0);
    });
});
