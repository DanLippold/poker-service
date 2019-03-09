const PokerService = require('../../libs/pokerService');

/*
    John (D):  8♠ 6♥ (two pair Ks and 6s)
    Dave (S):  3♠ 9♥ (two pair Ks and 3s)
    Mary (B):  8♥ T♣ (two pair Ks and 10s)
    Bill    :  9♣ A♠ (pair of Ks)
    Board:     K♥ 6♠ T♠ 3♠ K♣

    ~Pre Flop~
    Bill raises
    John folds
    Dave calls
    Mary raises
    Bill calls
    Dave calls

    ~Flop~
    Dave checks
    Mary bets
    Bill raises
    Dave folds
    Mary calls

    ~Turn~
    Mary bets
    Bill calls

    ~River~
    John checks
    Mary checks
*/

describe('raises and folds', () => {
    let pokerService;

    beforeAll(() => {
        const players = [{ name: 'John', }, { name: 'Dave' }, { name: 'Mary' }, { name: 'Bill' }];
        const chips = 100;
        const seed = 'energy';

        pokerService = new PokerService({ players, chips, seed });
    });

    test('plays a single hand with some bets, raises, and folds', () => {
        // Pre Flop
        pokerService.act({ type: 'RAISE', amount: 10 });
        pokerService.act({ type: 'FOLD' });
        pokerService.act({ type: 'CALL' });
        pokerService.act({ type: 'RAISE', amount: 10 });
        pokerService.act({ type: 'CALL' });
        pokerService.act({ type: 'CALL' });

        // Flop
        pokerService.act({ type: 'CHECK' });
        pokerService.act({ type: 'BET', amount: 10 });
        pokerService.act({ type: 'RAISE', amount: 10 });
        pokerService.act({ type: 'FOLD' });
        pokerService.act({ type: 'CALL' });

        // Turn
        pokerService.act({ type: 'BET', amount: 10 });
        pokerService.act({ type: 'CALL' });

        // River
        pokerService.act({ type: 'CHECK' });
        const turnRequest = pokerService.act({ type: 'CHECK' });

        expect(turnRequest.boardCards).toHaveLength(0);
        expect(turnRequest.players[2].chipValue).toBeGreaterThan(100);
    });
});
