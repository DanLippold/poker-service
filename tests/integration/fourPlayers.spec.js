const PokerService = require('../../libs/pokerService');

/*
    John (B):  A♣ T♣ (straight)
    Dave    :  7♠ 5♥ (two pair 7s and 5s)
    Mary (D):  4♥ 7♠ (two pair 7s and 4s)
    Bill (S):  J♠ 9♥ (J high)
    Board:     5♠ 2♠ 3♠ 4♣ 7♥

    ~Pre Flop~
    Dave calls
    Mary raises
    Bill calls
    John calls
    Dave folds

    ~Flop~
    Bill checks
    John bets
    Mary calls
    Bill folds

    ~Turn~
    John bets
    Mary calls

    ~River~
    John bets
    Mary calls
*/

describe('four players', () => {
    let pokerService;

    beforeAll(() => {
        const players = [{ name: 'John', }, { name: 'Dave' }, { name: 'Mary' }, { name: 'Steve' }];
        const chips = 100;
        const seed = 'quads';

        pokerService = new PokerService({ players, chips, seed });
    });

    test('plays a single hand with some bets and calls', () => {
        // Pre Flop
        pokerService.act({ type: 'CALL' });
        pokerService.act({ type: 'RAISE', amount: 10 });
        pokerService.act({ type: 'CALL' });
        pokerService.act({ type: 'CALL' });
        pokerService.act({ type: 'FOLD' });

        // Flop
        pokerService.act({ type: 'CHECK' });
        pokerService.act({ type: 'BET', amount: 10 });
        pokerService.act({ type: 'CALL' });
        pokerService.act({ type: 'FOLD' });

        // Turn
        pokerService.act({ type: 'BET', amount: 10 });
        pokerService.act({ type: 'CALL' });

        // River
        pokerService.act({ type: 'BET', amount: 10 });
        const turnRequest = pokerService.act({ type: 'CALL' });

        expect(turnRequest.players[0].chipValue).toBe(180);
        expect(turnRequest.players[1].chipValue).toBe(85);
        expect(turnRequest.players[2].chipValue).toBe(40);
        expect(turnRequest.players[3].chipValue).toBe(80);
        expect(turnRequest.boardCards).toHaveLength(0);
    });
});
